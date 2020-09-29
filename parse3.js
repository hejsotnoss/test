// hejsotnoss
// 3/23/2020

const fs = require("fs");
const out = require("./out.json");
var hexCharacters = "0123456789ABCDEF";
// output string
var output = "switch(nibble[0]) {\n";
var indent = ["\t", "\t\t", "\t\t\t", "\t\t\t\t", "\t\t\t\t\t", "\t\t\t\t\t\t", "\t\t\t\t\t\t\t"];

function convertToHex(str) {
	return "0x" + hexCharacters[parseInt(str, 2)];
}

for(var i in out) {
	var thing1 = out[i];
	var type1 = typeof(thing1);

	if(type1 == "string") { // single & (msb = 1 | msb = 0)
		var length = thing1.length;

		output += indent[0] + "case " + convertToHex(i) + ": /* " + thing1.substring(length - 16, length) + " /*\n"; // case + comment
		// --
		output += indent[1] + "break;\n";
	} else {
		if(i[0] == "1") {
			output += indent[0] + "case " + convertToHex(i) + ":\n";
			output += indent[1] + "switch(nibble[1]) {\n";

			for(var o in thing1) { // double & msb = 1
				var thing2 = thing1[o];
				var length = thing2.length;

				output += indent[2] + "case " + convertToHex(o) + ": /* " + thing2.substring(length - 16, length) + " /*\n";
				// --
				output += indent[3] + "break;\n";
			}

			output += indent[1] + "}\n";
			output += indent[1] + "break;\n";
		} else {
			output += indent[0] + "case " + convertToHex(i) + ":\n";
			output += indent[1] + "switch(nibble[3]) {\n";

			for(var o in thing1) {
				var thing2 = thing1[o];
				var type2 = typeof(thing2);

				if(type2 == "string") { // double & msb = 0
					var length = thing2.length;

					output += indent[2] + "case " + convertToHex(o) + ": /* " + thing2.substring(length - 16, length) + " /*\n";
					// --
					output += indent[3] + "break;\n";
				} else {
					var morn = null;
					var container = [];

					output += indent[2] + "case " + convertToHex(o) + ":\n";

					for(var p in thing2) {
						var thing3 = thing2[p];
						p.charCodeAt(1) >> 4 == 6 ? morn = [p, thing3] : container.push([p, thing3]);
					}

					if(morn) { // found "1xxx"
						var length = morn[1].length;
						// triple & msb = 0 & nibble[2] = "1xxx"
						output += indent[3] + "if(nibble[2] & 0x8) { /* " + morn[1].substring(length - 16, length) + " */\n";
						// --
						output += indent[3] + "} else {\n";
						output += indent[4] + "switch(nibble[2]) {\n";

						for(var p in container) { // triple & msb = 0
							var thing3 = container[p];
							length = thing3[1].length;

							output += indent[5] + "case " + convertToHex(thing3[0]) + ": /* " + thing3[1].substring(length - 16, length) + " /*\n";
							// --
							output += indent[6] + "break;\n";
						}

						output += indent[4] + "}\n";
					} else {
						output += indent[3] + "switch(nibble[2]) {\n";

						for(var p in container) { // triple & msb = 0
							var thing3 = container[p];
							var length = thing3[1].length;

							output += indent[4] + "case " + convertToHex(thing3[0]) + ": /* " + thing3[1].substring(length - 16, length) + " /*\n";
							// --
							output += indent[5] + "break;\n";
						}
					}

					output += indent[3] + "}\n";
					output += indent[3] + "break;\n";
				}
			}

			output += indent[1] + "}\n";
			output += indent[1] + "break;\n";
		}
	}
}

output += "}";

fs.writeFile("switches.txt", output, () => {});