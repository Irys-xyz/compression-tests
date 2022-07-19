var fs = require("fs");
const { resolve } = require("path");

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

function formatSize(bytes) {
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

var compressDone = (method, path, startTime, oldSize) => {
  var newSize = getFilesizeInBytes(newPath);
  var endTime = performance.now();
  var fmtOldSize = formatSize(oldSize);
  var fmtNewSize = formatSize(newSize);
  console.log(`${method}:\t| file ${path} \t| executed ${endTime - startTime} ms \t\t| ${oldSize} (${fmtOldSize}) => ${newSize} (${fmtNewSize})`);
};

var handleError = (err) => console.error("Error compressing: ", err);

function compressXz(compression, path, method) {
  var startTime = performance.now();
  var oldSize = getFilesizeInBytes(path);
  var newPath = path + ".compressed." + method;
  fs.closeSync(fs.openSync(newPath, 'w'));
  var inFile = fs.createReadStream(path);
  var outFile = fs.createWriteStream(newPath);
  
  var stream = inFile.pipe(compression).pipe(outFile);
  stream.on('finish', () =>{
      var newSize = getFilesizeInBytes(newPath);
      var endTime = performance.now();
      var fmtOldSize = formatSize(oldSize);
      var fmtNewSize = formatSize(newSize);
      console.log(`${method}:\t| file ${path} \t| executed ${endTime - startTime} ms \t\t| ${oldSize} (${fmtOldSize}) => ${newSize} (${fmtNewSize})`);

  });
}

function compressCompressing(compressFile, path, method) {
  var startTime = performance.now()
  var oldSize = getFilesizeInBytes(path);
  
  var newPath = path + ".compressed." + method;
  fs.closeSync(fs.openSync(newPath, 'w'));
  compressFile(path, newPath)
    .then(() => compressDone(method, path, startTime, oldSize))
    .catch(handleError);
}

function compressCompressJs(algorithm, path, method) {
  var startTime = performance.now()
  var oldSize = getFilesizeInBytes(path);
  var data = fs.readFileSync(path);
  let compressFile = new Promise((resolve, reject) => {
    var newPath = path + ".compressed." + method;
    var compressedData  = algorithm.compressFile(data);
    fs.writeFile(newPath, compressedData, (err) => {
      console.log(err);
    })
  
    resolve();
  });

  compressFile()
    .then(() => compressDone(method, path, startTime, oldSize))
    .catch(handleError)
}

function compress(compress, path, method) {
  console.log('compressing ', path, ' with ', method);
  if(method === 'lzma2') {
    compressXz(compress, path, method);
  } else if (['tgz', 'zip', 'gzip'].indexOf(method) > -1) {
    var alg = compress[method].compressFile;
    compressCompressing(alg, path, method);
  } else {
    var alg = compress[method];
    compressCompressJs(alg, path, method);
  }
}


module.exports = { compress }