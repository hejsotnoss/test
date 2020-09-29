const fs = require("fs");

const out = require("./out.json");

var c = "0123456789ABCDEF";

function ctH(a) {
	return "0x" + c[parseInt(a, 2)];
}

var dcba = "";
var ti = "";
dcba += ti + "switch(nibble[0]) {\n";
for(var i in out) {
	var o1 = out[i];
	var t1 = typeof(o1);
	if(t1 == "string") {
		var l1 = o1.length;
		dcba += ti + "\tcase " + ctH(i) + ": /* " + o1.substring(l1 - 16, l1) + " */\n" + ti + "\t\tprintf(\"" + o1.substring(0, l1 - 19) + "\");\n" + ti + "\t\tbreak;\n";
	} else {
		if(i[0] == "1") {
			dcba += ti + "\tcase " + ctH(i) + ":\n" + ti + "\t\tswitch(nibble[1]) {\n";
			for(var o in o1) {
				var o2 = o1[o];
				var li = o2.length;
				dcba += ti + "\t\t\tcase " + ctH(o) + ": /* " + o2.substring(li - 16, li) + " */\n" + ti + "\t\t\t\tprintf(\"" + o2.substring(0, li - 19) + "\");\n" + ti + "\t\t\t\tbreak;\n";
			}
			dcba += ti + "\t\t}\n" + ti + "\t\tbreak;\n";
		} else {
			dcba += ti + "\tcase " + ctH(i) + ":\n" + ti + "\t\tswitch(nibble[3]) {\n";
			for(var o in o1) {
				var o2 = o1[o];
				var t2 = typeof(o2);
				if(t2 == "string") {
					var li = o2.length;
					dcba += ti + "\t\t\tcase " + ctH(o) + ": /* " + o2.substring(li - 16, li) + " */\n" + ti + "\t\t\t\tprintf(\"" + o2.substring(0, li - 19) + "\");\n" + ti + "\t\t\t\tbreak;\n";
				} else {
					dcba += ti + "\t\t\tcase " + ctH(o) + ":\n";
					var dif = null;
					var det = [];
					for(var p in o2) {
						var o3 = o2[p];
						var li = o3.length;
						p.charCodeAt(1) >> 4 == 6 ? (dif = [p, o3]) : (det.push([p, o3]));
					}
					if(dif) {
						var li = dif[1].length;
						dcba += ti + "\t\t\t\tif(nibble[2] & 0x8) { /* " + dif[1].substring(li - 16, li) + " */\n";
						dcba += ti + "\t\t\t\t\tprintf(\"" + dif[1].substring(0, li - 19) + "\");\n"
						dcba += ti + "\t\t\t\t} else {\n";
						dcba += ti + "\t\t\t\t\tswitch(nibble[2]) {\n";
						for(var p in det) {
							var o3 = det[p];
							var li = o3[1].length;
							dcba += ti + "\t\t\t\t\t\tcase " + ctH(o3[0]) + ": /* " + o3[1].substring(li - 16, li) + " */\n";
							dcba += ti + "\t\t\t\t\t\t\tprintf(\"" + o3[1].substring(0, li - 19) + "\");\n";
							dcba += ti + "\t\t\t\t\t\t\tbreak;\n";
						}
						dcba += ti + "\t\t\t\t\t}\n";
					} else {
						dcba += ti + "\t\t\t\tswitch(nibble[2]) {\n";
						for(var p in det) {
							var o3 = det[p];
							var li = o3[1].length;
							dcba += ti + "\t\t\t\t\tcase " + ctH(o3[0]) + ": /* " + o3[1].substring(li - 16, li) + " */\n" + ti + "\t\t\t\t\t\tprintf(\"" + o3[1].substring(0, li - 19) + "\");\n" + ti + "\t\t\t\t\t\tbreak;\n";
						}
					}
					dcba += ti + "\t\t\t\t}\n" + ti + "\t\t\t\tbreak;\n";
				}
			}
			dcba += ti + "\t\t}\n" + ti + "\t\tbreak;\n";
		}
	}
}
dcba += ti + "}";
fs.writeFile("switches.txt", dcba, function(){});