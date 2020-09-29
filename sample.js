const fs = require("fs");

const output = (require("./output.json"));
var temp = [];

for(var i = 0; i < 16; i++) {
  var tt = [];
  var d = 0;
  for(var c in output) {
    var a = output[c];
    if(parseInt(a[0].substring(0,4), 2) == i) {
      d++;
      //console.log(d, a[0], a[1], a[2]);
      tt.push(a);
    }
  }
  if(i < 8) {
    for(var o = 0; o < 16; o++) {
      var fa = false;
      for(var p in tt) {
        var tty = tt[p];
        if(parseInt(tty[0].substring(12,16), 2) == o) {
          console.log(d, tty[0], tty[1], tty[2]);
          temp.push(tty);
        } else if(tty[0].substring(12, 16) == "dddd" || tty[0].substring(12, 16) == "iiii") {
          console.log(d, tty[0], tty[1], tty[2]);
          temp.push(tty);
          fa = true;
          break;
        }
      }
      if(fa) {
        break;
      }
    }
  } else {
    for(var o = 0; o < 16; o++) {
      var fa = false;
      for(var p in tt) {
        var tty = tt[p];
        if(parseInt(tty[0].substring(4,8), 2) == o) {
          console.log(d, tty[0], tty[1], tty[2]);
          temp.push(tty);
        } else if(tty[0].substring(4, 8) == "nnnn" || tty[0].substring(4, 8) == "dddd") {
          console.log(d, tty[0], tty[1], tty[2]);
          temp.push(tty);
          fa = true;
          break;
        }
      }
      if(fa) {
        break;
      }
    }
  }
  if(d = 1) {
    console.log(i, "has 1");
  }
}
console.log(temp.length);
temp = JSON.stringify(temp);
fs.writeFile("autput.json", temp, function(){});