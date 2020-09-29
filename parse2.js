// hejsotnoss
// 3/22/2020

const fs = require("fs");

var abcd = fs.readFileSync("abcd.txt", {encoding: "utf8"});
var stack = 0;
var stacks = [];

var out = {};

for(var i = 0; i < abcd.length; i++) {
	var char = abcd[i];
	if(char == "\t") {
		stack++;
	} else if(char == "\n") {
		stack = 0;
	}
	if(char == ":") {
		stacks[stack] = abcd.substring(i-4,i);
		if(stack == 0) {
			out[stacks[0]] = {};
		} else {
			out[stacks[0]][stacks[1]] = {};
		}
	}
	if(char == ";") {
		var idn = abcd.substring(i-4,i);
		var st = i + 2;
		while(abcd[i+1] != "\n") {
			i++;
		}
		var sr = abcd.substring(st,i+1);
		switch(stack) {
			case 0:
				out[idn] = sr;
				break;
			case 1:
				out[stacks[0]][idn] = sr;
				break;
			case 2:
				out[stacks[0]][stacks[1]][idn] = sr;
				break;
		}
	}
}
console.log(out);
out = JSON.stringify(out);

fs.writeFile("out.json", out, function(){});