var chokidar = require('chokidar');
var fs = require('fs');
 
var watcher = chokidar.watch([
  'snippets',
  'config',
  'assets',
  'sections',
  'theme.liquid'
], {
  ignored: [
    /(^|[\/\\])\../,
    'node_modules',
    'watch.js'
  ],
  persistent: true
});
 
var log = console.log.bind(console);

async function copyFileToDist (path) {
  const [folder, file] = path.split('/')

  const fileString = fs.readFileSync(path)
  fs.writeFileSync(`dist/${path}`, fileString)

}
 
watcher
  .on('add', function(path) { 
    log('File', path, 'has been added'); 
    copyFileToDist(path)
  })
  .on('addDir', function(path) { log('Directory', path, 'has been added'); })
  .on('change', function(path) { 
    log('File', path, 'has been changed'); 
    copyFileToDist(path)
  })
  .on('unlink', function(path) { log('File', path, 'has been removed'); })
  .on('unlinkDir', function(path) { log('Directory', path, 'has been removed'); })
  .on('error', function(error) { log('Error happened', error); })
  .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
  .on('raw', function(event, path, details) { log('Raw event info:', event, path, details); })