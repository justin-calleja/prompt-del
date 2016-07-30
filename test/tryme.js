// Just a quick way to try out inquirer's prompt

var fs = require('fs');
var path = require('path');
var promptDel = require('..');
var dirExistsSync = require('@justinc/dir-exists').dirExistsSync;

const fixturesPath = path.join(__dirname, 'fixtures');
const dir1 = path.join(fixturesPath, 'dir1');
const dir2 = path.join(fixturesPath, 'dir2');

function mkdirIfNotExists(dirPath) {
  if (!dirExistsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}
mkdirIfNotExists(dir1);
mkdirIfNotExists(dir2);

promptDel({
  patterns: [path.join(__dirname, 'fixtures', '**'), '!' + path.join(__dirname, 'fixtures'), path.join(__dirname, 'does_not_exist', '**')]
}, (err, result) => {
  console.log('result:', result);
});
