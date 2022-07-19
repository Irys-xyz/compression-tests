var fs = require("fs");
var xz = require("xz");

const compressJs = require('compressjs');
const compressing = require('compressing'); 
const compressModule = require('./compress');
var { compress } = compressModule;

var xzCompression = new xz.Compressor();

fs.readdir('./files/random', (err, files) => {
  files.forEach(file => {
    if(file.split('.')[1] !== "compressed") {
      compress(xzCompression, `./files/random/${file}`, "lzma2");
      compress(compressing, `./files/random/${file}`, "gzip");
      compress(compressing, `./files/random/${file}`, "tgz");
      compress(compressing, `./files/random/${file}`, "zip");
      compress(compressJs, `./files/random/${file}`, "Bzip2");
      compress(compressJs, `./files/random/${file}`, "BWTC");
      compress(compressJs, `./files/random/${file}`, "PPM");
      compress(compressJs, `./files/random/${file}`, "Lzp3");
      compress(compressJs, `./files/random/${file}`, "Dmc");
      compress(compressJs, `./files/random/${file}`, "Lzjb");
    }
  });
});

