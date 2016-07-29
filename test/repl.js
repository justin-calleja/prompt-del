var repl = require('repl');
var del = require('del');
var path = require('path');

var replServer = repl.start({
  prompt: '> '
});

var patterns = [path.join(__dirname, 'fixtures', '**'), '!' + path.join(__dirname, 'fixtures'), path.join(__dirname, 'does_not_exist', '**')];
  // const DEL_PATTERNS = args.patterns || [path.join(PATH_TO_DEL, '**'), '!' + PATH_TO_DEL];

replServer.context.doDel = () => {
  del(patterns, {
    force: true
  }).then(paths => {
    console.log('paths deleted:', paths);
  });
};
