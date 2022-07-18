var fs = require("fs");
var xz = require("xz");
const compressing = require('compressing'); 
const compressModule = require('./compress');
var { compress, compressFs } = compressModule;

var xzCompression = new xz.Compressor();

compressFs(xzCompression, "./files/test_bundle", "lzma2");
compress(compressing.gzip.compressFile, "./files/test_bundle", "gzip");
compress(compressing.tgz.compressFile, "./files/test_bundle", "tgz");
compress(compressing.zip.compressFile, "./files/test_bundle", "zip");