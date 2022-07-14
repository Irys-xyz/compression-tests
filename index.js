var fs = require("fs");
var xz = require("xz");
const compressing = require('compressing'); 

var xzCompression = new xz.Compressor();

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

function compressFs(compression, path, method) {
    var newPath = path + ".compressed." + method;
    fs.closeSync(fs.openSync(newPath, 'w'));
    var inFile = fs.createReadStream(path);
    var outFile = fs.createWriteStream(newPath);
    
    var stream = inFile.pipe(compression).pipe(outFile);
    stream.on('finish', () =>{
        var newSize = getFilesizeInBytes(newPath);
        console.log(method, ": ", newSize + " kb");
    });
}

function compress(compressFile, path, method) {
    var compressDone = () => {
        var newSize = getFilesizeInBytes(newPath);
        console.log(method, ": ", newSize + " kb");
    };
    var handleError = (err) => console.error("Error compressing: ", err);
    var newPath = path + ".compressed." + method;
    fs.closeSync(fs.openSync(newPath, 'w'));
    compressFile(path, newPath)
        .then(compressDone)
        .catch(handleError);
}

console.log("test_bundle size: ", getFilesizeInBytes("./files/test_bundle") + " kb");
compressFs(xzCompression, "./files/test_bundle", "lzma2");
compress(compressing.tar.compressFile, "./files/test_bundle", "tar");
compress(compressing.gzip.compressFile, "./files/test_bundle", "gzip");
compress(compressing.tgz.compressFile, "./files/test_bundle", "tgz");
compress(compressing.zip.compressFile, "./files/test_bundle", "zip");