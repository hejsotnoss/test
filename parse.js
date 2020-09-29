// hejsotnoss
// 3/22/2020
const fs = require("fs");

const b4 = require("./3.4.json");
const b5 = require("./3.5.json");
const b6 = require("./3.6.json");
const b7 = require("./3.7.json");
const b8 = require("./3.8.json");
const b9 = require("./3.9.json");

var output = [].concat(b4, b5, b6, b7, b8, b9);

var abcd = "";

var temp = [];

for(var i = 0; i < 16; i++) {
	var daf = false;
	var used = false;
	var tt = [];
	var d = 0;
	for(var c in output) {
		var a = output[c];
		if(parseInt(a[1].substring(0,4), 2) == i) {
			if(!used) {
				abcd += a[1].substring(0,4);
				used = true;
			}
			d++;
			tt.push(a);
		}
	}
	if(i < 8) {
		for(var o = 0; o < 16; o++) {
			var de = "";
			var df = "";
			var dt;
			var da = 0;
			var fa = false;
			for(var p in tt) {
				var tty = tt[p];
				if(parseInt(tty[1].substring(12,16), 2) == o) {
					if(da === 0) {
						de = "\t" + tty[1].substring(12,16);
						dt = tty[0] + " / " + tty[1];
					}
					df += "\t\t" + tty[1].substring(8,12) + "; " + tty[0] + " / " + tty[1] + "\n";
					console.log(d, tty[1], tty[0]);
					temp.push(tty);
					da++;
				} else if(tty[1].substring(12, 16) == "dddd" || tty[1].substring(12, 16) == "iiii") {
					dt = tty[0] + " / " + tty[1];
					console.log(d, tty[1], tty[0]);
					temp.push(tty);
					fa = true;
					da++;
					break;
				}
			}
			if(da == 0) {
				continue;
			}
			if(fa) {
				abcd += "; " + dt + "\n";
				break;
			}
			if(!daf) {
				abcd += ":\n";
				daf = true;
			}
			abcd += de;
			if(da === 1) {
				abcd += "; " + dt + "\n";
			} else {
				abcd += ":\n" + df;
			}
			console.log(da);
		}
	} else {
		for(var o = 0; o < 16; o++) {
			var de = "";
			var df = "";
			var dt;
			var da = 0;
			var fa = false;
			for(var p in tt) {
				var tty = tt[p];
				if(parseInt(tty[1].substring(4,8), 2) == o) {
					if(da === 0) {
						de = "\t" + tty[1].substring(4,8);
						dt = tty[0] + " / " + tty[1];
					}
					df += "\t\t" + tty[1].substring(8,12) + "; " + tty[0] + " / " + tty[1] + "\n";
					console.log(d, tty[1], tty[0]);
					temp.push(tty);
					da++;
				} else if(tty[1].substring(4, 8) == "nnnn" || tty[1].substring(4, 8) == "dddd") {
					de = "\t" + tty[1].substring(4,8);
					dt = tty[0] + " / " + tty[1];
					console.log(d, tty[1], tty[0]);
					temp.push(tty);
					fa = true;
					da++;
					break;
				}
			}
			if(da === 0) {
				continue;
			}
			if(fa) {
				abcd += "; " + dt + "\n";
				break;
			}
			if(!daf) {
				abcd += ":\n";
				daf = true;
			}
			abcd += de;
			if(da === 1) {
				abcd += "; " + dt + "\n";
			} else {
				abcd += ":\n" + df;
			}
			console.log(da);
		}
	}
}
console.log(abcd);
temp = JSON.stringify(temp);
fs.writeFile("autput.json", temp, function(){});
fs.writeFile("abcd.txt", abcd, function(){});