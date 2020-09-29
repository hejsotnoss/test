const fs = require("fs");

var i = fs.readFileSync("sh_insns.html", {encoding: "utf8"});
var ls = 0, le = 0, lw = false;
var aas = 0, ae = 0, aw = false;
var bb = [];
var th = 0;
var matches = 0;
var len = i.length;
var latest = 0;
while(th < len) {
  if(i[th] == "<" && i[th+1] == "d" && i[th+2] == "i" && i[th+21] == "2") {
    ls = th + 24;
    lw = true;
  }
  if(lw && i[th] == "<" && i[th+1] == "/" && i[th+2] == "d") {
    le = th;
    lw = false;
  }
  if(i[th] == "<" && i[th+1] == "d" && i[th+2] == "i" && i[th+21] == "3") {
    aas = th + 24;
    aw = true;
  }
  if(aw && i[th] == "<" && i[th+1] == "/" && i[th+2] == "d") {
    ae = th;
    aw = false;
  }
  if(i[th] == "<" && i[th+1] == "d" && i[th+2] == "i" && i[th+21] == "1") {
    latest = th;
  }
  if(i[th] == "<" && i[th+1] == "d" && i[th+2] == "i" && i[th+21] == "4") {
    var sja = i.substring(latest + 24, latest + 77);
    var sas = i.substring(th+24, th+40);
    if(sja.includes("SH3")) {
      bb.push([sas, "BOTH", i.substring(ls, le), i.substring(aas, ae)]);
      matches++;
    } else if(sja.includes("SH4A")) {
      bb.push([sas, "SH4A", i.substring(ls, le), i.substring(aas, ae)]);
      matches++;
    }
    console.log(sas);
    console.log(i.substring(latest + 24, latest + 77));
    console.log(th);
  }
  th++;
}
var bb2 = JSON.stringify(bb);
fs.writeFile('output.json', bb2, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
console.log(matches);