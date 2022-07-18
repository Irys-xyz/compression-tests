var fs = require("fs");
var xz = require("xz");
const compressing = require('compressing'); 
const compressModule = require('./compress');
var { compress, compressFs } = compressModule;

var xzCompression = new xz.Compressor();

fs.readdir('./files/random', (err, files) => {
  files.forEach(file => {
    if(file.split('.')[1] !== "compressed") {
      console.log('compressing ', file);
      compressFs(xzCompression, `./files/random/${file}`, "lzma2");
      compress(compressing.gzip.compressFile, `./files/random/${file}`, "gzip");
      compress(compressing.tgz.compressFile, `./files/random/${file}`, "tgz");
      compress(compressing.zip.compressFile, `./files/random/${file}`, "zip");
    }
  });
});

