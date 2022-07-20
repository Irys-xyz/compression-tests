var fs = require("fs");
var xz = require("xz");

const compressJs = require('compressjs');
const compressing = require('compressing'); 
const compressModule = require('./compress');
var { compress } = compressModule;
var xzCompression = new xz.Compressor();

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'algorithm', title: 'Algorithm'},
    {id: 'file', title: 'File'},
    {id: 'oldSize', title: 'Previous Size'},
    {id: 'newSize', title: 'New Size'},
    {id: 'ratio', title: 'Ratio %'},
    {id: 'time', title: 'Time'},
    {id: 'format', title: 'Compression'},
  ]
});


fs.readdir('./files/random', (err, files) => {
  var csvData = [];
  files.forEach(file => {
    if(file.split('.')[1] !== "compressed") {
      csvData.push(compress(xzCompression, `./files/random/${file}`, "lzma2"));
      csvData.push(compress(compressing, `./files/random/${file}`, "gzip"));
      csvData.push(compress(compressing, `./files/random/${file}`, "tgz"));
      csvData.push(compress(compressing, `./files/random/${file}`, "zip")); 
      /*
      compress(compressJs, `./files/random/${file}`, "Bzip2");
      compress(compressJs, `./files/random/${file}`, "BWTC");
      compress(compressJs, `./files/random/${file}`, "PPM");
      compress(compressJs, `./files/random/${file}`, "Lzp3");
      compress(compressJs, `./files/random/${file}`, "Dmc");
      compress(compressJs, `./files/random/${file}`, "Lzjb");
      */
    }
  });
  console.log(csvData);
  Promise.all(csvData).then((data) => {
    csvWriter
      .writeRecords(data)
      .then(()=> console.log('The CSV file was written successfully'));
  })

});

