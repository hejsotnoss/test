// hejsotnoss
// 3/23/2020

const fs = require("fs");
const out = require("./out.json");
var hexCharacters = "0123456789ABCDEF";
// output string
var output = "switch(nibble[0]) {\n";
var indent = ["\t", "\t\t", "\t\t\t", "\t\t\t\t", "\t\t\t\t\t", "\t\t\t\t\t\t", "\t\t\t\t\t\t\t"];
var abcdefg = ["*(itolh(nibble[3], 1, hexBuffer8))", "itolh(nibble[2] << 4 | nibble[3], 2, hexBuffer8)", "itolh(nibble[1] << 8 | nibble[2] << 4 | nibble[3], 3, hexBuffer12)"];
var hijklmn = ["%c", "%s", "%s"];

function convertToHex(str) {
	return "0x" + hexCharacters[parseInt(str, 2)];
}

function splitSourceDestination(sourceDestination) {
	var outSD = sourceDestination.split(",");
	var length = outSD.length;
	if(length == 3) {
		if(sourceDestination[0] == "@" && sourceDestination[1] == "(") {
			return ([outSD[0] + "," + outSD[1], outSD[2]]);
		} else {
			return ([outSD[0], outSD[1] + "," + outSD[2]]);
		}
	} else {
		return (outSD);
	}
}

function findPosition(code, chr) {
	var position = null;
	for(var i = 0; i < code.length; i++) {
		if(code[i] == chr) {
			position = i;
			break;
		}
	}
	return position / 4;
}

function findLength(code, chr) {
	var length = 0;
	for(var i = 0; i < code.length; i++) {
		if(code[i] == chr) {
			length++;
		}
	}
	return length / 4;
}

function parse(instruction, sourceDestination, code, indented) {
	if(sourceDestination) {
		var parsed = indent[indented] + "sprintf(buffer, \"\\033[0;94m" + instruction + "\\033[0m ";
		var stackOne = [], stackTwo = [];
		sourceDestination = splitSourceDestination(sourceDestination);
		length = sourceDestination.length;
		for(var i in sourceDestination) {
			var thing = sourceDestination[i];
			var length = thing.length;
			switch(thing[0]) {
				case "@":
					if(thing[1] == "(") {
						if(thing[2] == "d") {
							switch(thing[7]) {
								case "R": // @(disp,Rx)
									stackOne.push("@(\\033[0;92m0x" + hijklmn[0] + "\\033[0m,\\033[0;91mR%i\\033[0m)");
									stackTwo.push(abcdefg[0]);
									stackTwo.push("nibble[" + findPosition(code, thing[8]) + "]");
									break;
								case "P": // @(disp,PC)
									stackOne.push("@(\\033[0;92m0x" + hijklmn[1] + "\\033[0m,PC)");
									stackTwo.push(abcdefg[1]);
									break;
								case "G": // @(disp,GBR)
									stackOne.push("@(\\033[0;92m0x" + hijklmn[1] + "\\033[0m,GBR)");
									stackTwo.push(abcdefg[1]);
									break;
							}
						} else {
							if(thing[5] == "R") { // @(R0,Rx)
								stackOne.push("@(\\033[0;91mR0\\033[0m,\\033[0;91mR%i\\033[0m)");
								stackTwo.push("nibble[" + findPosition(code, thing[6]) + "]");
							} else { // @(R0,GBR)
								stackOne.push("@(\\033[0;91mR0\\033[0m,GBR)");
							}
						}
					} else if(thing[1] == "-") { // @-Rx
						stackOne.push("\\033[0;91m@-R%i\\033[0m");
						stackTwo.push("nibble[" + findPosition(code, thing[3]) + "]");
					} else if(thing[3] == "+") { // @Rx+
						stackOne.push("\\033[0;91m@R%i+\\033[0m");
						stackTwo.push("nibble[" + findPosition(code, thing[2]) + "]");
					} else { // @Rx
						stackOne.push("\\033[0;91m@R%i\\033[0m");
						stackTwo.push("nibble[" + findPosition(code, thing[2]) + "]");
					}
					break;
				case "R":
					if(length == 2) { // Rx
						if(thing[1] == "0") {
							stackOne.push("\\033[0;91m" + thing + "\\033[0m");
						} else {
							stackOne.push("\\033[0;91mR%i\\033[0m");
							stackTwo.push("nibble[" + findPosition(code, thing[1]) + "]");
						}
					} else { // Rx_BANK
						stackOne.push("\\033[0;31mR%i_BANK\\033[0m");
						stackTwo.push("nibble[2] | 0x7");
					}
					break;
				case "#": // #imm
					stackOne.push("\\033[0;92m#0x" + hijklmn[1] + "\\033[0m");
					stackTwo.push(abcdefg[1]);
					break;
				case "l": // label
					var zyx = findLength(code, "d") - 1;
					stackOne.push("\\033[0;92m0x" + hijklmn[zyx] + "\\033[0m");
					stackTwo.push(abcdefg[zyx]);
					break;
				default:
					stackOne.push(thing);
			}
		}
		return parsed + stackOne.join() + "\", " + stackTwo.join(", ") + ");\n";
	} else {
		return indent[indented] + "strcpy(buffer, \"\\033[0;94m" + instruction + "\\033[0m\");\n";
	}
}

for(var i in out) {
	var thing1 = out[i];
	var type1 = typeof(thing1);

	if(type1 == "string") { // single & (msb = 1 | msb = 0)
		var length = thing1.length;
		var instruction = thing1.substring(0, length - 19).split(" ");
		var code = thing1.substring(length - 16, length);

		output += indent[0] + "case " + convertToHex(i) + ": /* " + code + " */\n";
		output += parse(instruction[0], instruction[1], code, 1); // --
		output += indent[1] + "break;\n";
	} else {
		if(i[0] == "1") {
			output += indent[0] + "case " + convertToHex(i) + ":\n";
			output += indent[1] + "switch(nibble[1]) {\n";

			for(var o in thing1) { // double & msb = 1
				var thing2 = thing1[o];
				var length = thing2.length;
				var instruction = thing2.substring(0, length - 19).split(" ");
				var code = thing2.substring(length - 16, length);

				output += indent[2] + "case " + convertToHex(o) + ": /* " + code + " */\n";
				output += parse(instruction[0], instruction[1], code, 3); // --
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
					var instruction = thing2.substring(0, length - 19).split(" ");
					var code = thing2.substring(length - 16, length);

					output += indent[2] + "case " + convertToHex(o) + ": /* " + thing2.substring(length - 16, length) + " */\n";
					output += parse(instruction[0], instruction[1], code, 3); // --
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
						var instruction = morn[1].substring(0, length - 19).split(" ");
						var code = morn[1].substring(length - 16, length);
						// triple & msb = 0 & nibble[2] = "1xxx"
						output += indent[3] + "if(nibble[2] & 0x8) { /* " + code + " */\n";
						output += parse(instruction[0], instruction[1], code, 4); // --
						output += indent[3] + "} else {\n";
						output += indent[4] + "switch(nibble[2]) {\n";

						for(var p in container) { // triple & msb = 0
							var thing3 = container[p];
							length = thing3[1].length;
							instruction = thing3[1].substring(0, length - 19).split(" ");
							code = thing3[1].substring(length - 16, length);

							output += indent[5] + "case " + convertToHex(thing3[0]) + ": /* " + code + " */\n";
							output += parse(instruction[0], instruction[1], code, 6); // --
							output += indent[6] + "break;\n";
						}

						output += indent[4] + "}\n";
					} else {
						output += indent[3] + "switch(nibble[2]) {\n";

						for(var p in container) { // triple & msb = 0
							var thing3 = container[p];
							var length = thing3[1].length;
							var instruction = thing3[1].substring(0, length - 19).split(" ");
							var code = thing3[1].substring(length - 16, length);

							output += indent[4] + "case " + convertToHex(thing3[0]) + ": /* " + code + " */\n";
							output += parse(instruction[0], instruction[1], code, 5); // --
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