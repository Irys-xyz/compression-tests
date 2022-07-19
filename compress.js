var fs = require("fs");

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

function compressFs(compression, path, method) {
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

function compress(compressFile, path, method) {
  var startTime = performance.now()
  var oldSize = getFilesizeInBytes(path);
  var compressDone = () => {
    var newSize = getFilesizeInBytes(newPath);
    var endTime = performance.now();
    var fmtOldSize = formatSize(oldSize);
    var fmtNewSize = formatSize(newSize);
    console.log(`${method}:\t| file ${path} \t| executed ${endTime - startTime} ms \t\t| ${oldSize} (${fmtOldSize}) => ${newSize} (${fmtNewSize})`);
  };
  var handleError = (err) => console.error("Error compressing: ", err);
  var newPath = path + ".compressed." + method;
  fs.closeSync(fs.openSync(newPath, 'w'));
  compressFile(path, newPath)
    .then(compressDone)
    .catch(handleError);
}

module.exports = { compress, compressFs }