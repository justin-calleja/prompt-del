var assert = require('chai').assert;
var path = require('path');
var promptDel = require('..');
var fs = require('fs');
var dirExistsSync = require('@justinc/dir-exists').dirExistsSync;

const fixturesPath = path.join(__dirname, 'fixtures');
const dir1 = path.join(fixturesPath, 'dir1');
const dir2 = path.join(fixturesPath, 'dir2');

function mkdirIfNotExists(dirPath) {
  if (!dirExistsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}

function rmdirIfExists(dirPath) {
  if (dirExistsSync(dirPath)) {
    fs.rmdirSync(dirPath);
  }
}

describe('promptDel', function() {

  beforeEach(function() {
    mkdirIfNotExists(dir1);
    mkdirIfNotExists(dir2);
    var contents = fs.readdirSync(fixturesPath);
    assert.isTrue(contents.indexOf('dir1') > -1, 'dir1 is expected to exist before running tests');
    assert.isTrue(contents.indexOf('dir2') > -1, 'dir2 is expected to exist before running tests');
  });

  afterEach(function() {
    rmdirIfExists(dir1);
    rmdirIfExists(dir2);
    var contents = fs.readdirSync(fixturesPath);
    assert.isTrue(contents.indexOf('dir1') === -1, 'dir1 is expected to NOT exist after running tests');
    assert.isTrue(contents.indexOf('dir2') === -1, 'dir2 is expected to NOT exist after running tests');
  });

  it('should delete directories when onOkCb() is used', function(cb) {
    promptDel({
      patterns: [ path.join(fixturesPath, '**'), '!' + fixturesPath],
      doPromptCb: (onOkCb, _onNotOkCb) => onOkCb()
    }, (err, result) => {
      var contents = fs.readdirSync(fixturesPath);
      assert.isTrue(contents.indexOf('dir1') === -1, 'dir1 is expected to NOT exist');
      assert.isTrue(contents.indexOf('dir2') === -1, 'dir2 is expected to NOT exist');
      assert.isTrue(result.deletedPaths.length === 2);
      assert.isUndefined(result.userSaysNo);
      cb();
    });
  });

  it('should NOT delete directories when onNotOkCb() is used', function(cb) {
    promptDel({
      patterns: [ path.join(fixturesPath, '**'), '!' + fixturesPath],
      doPromptCb: (_onOkCb, onNotOkCb) => onNotOkCb()
    }, (err, result) => {
      var contents = fs.readdirSync(fixturesPath);
      assert.isTrue(contents.indexOf('dir1') > -1, 'dir1 is expected to exist');
      assert.isTrue(contents.indexOf('dir2') > -1, 'dir2 is expected to exist');
      assert.isUndefined(result.deletedPaths);
      assert.isTrue(result.userSaysNo);
      cb();
    });
  });

});
