var dirExistsSync = require('@justinc/dir-exists').dirExistsSync;
var emptyDir = require('empty-dir');
var del = require('del');
var inquirer = require('inquirer');
var path = require('path');

function confirmFileDeletion(delPatterns, confirmationMsg) {
  // var prompt = inquirer.createPromptModule();
  // return prompt([
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'okDelete',
      message: confirmationMsg,
      'default': false
    }
  ]);
}

function answersHandlerFactory(onOkDelete, onNotOkDelete) {
  return function answersHandler(answers) {
    answers.okDelete ? onOkDelete() : onNotOkDelete();
  };
}

/**
 * All options accepted by exported function
 * @typedef {Object} Args
 * @property {string} pathToDel - Manadatory argument for the path whose contents to delete based on pattern
 * @property {[string]} patterns - Optional array of patterns to base deletion on (default: is "everything inside pathToDel except pathToDel itself: [path.join(pathToDel, '**'), '!' + pathToDel]")
 * @property {string} promptMsg - Optional argument for the string to use to prompt the user with before deletion
 * @property {doPromptCb} doPromptCb - Optional callback responsible for getting approval from the user to perform deletion (default uses inquirer via stdin)
 */

/**
 * Optional callback responsible for getting approval from the user to perform deletion (default uses inquirer via stdin)
 *
 * @callback doPromptCb
 * @param {onOkDeleteCb} onOkDeleteCb
 * @param {onNotOkDeleteCb} onNotOkDeleteCb
 */

/**
 * callback responsible for getting approval from the user to perform deletion (default uses inquirer via stdin)
 *
 * @callback handlePromptResultCb
 * @param {handlePromptResultCb} handlePromptResultCb
 */

/**
 * Result passed to handleResultCallback
 * @typedef {Object} Result
 * @property {boolean} pathToDelIsEmpty - Is `true` if given args.pathToDel is empty (undefined otherwise)
 * @property {[string]} deletedPaths - Array of paths deleted
 * @property {boolean} userSaysNo - Is `true` if after being prompoted, user decided not to delete (undefined otherwise)
 * @property {boolean} pathToDelDoesNotExist - Is `true` if given args.pathToDel does not exist (undefined otherwise)
 */

/**
 * Optional user supplied callback to handle result (default behaviour is to just throw the err if first arg is truthy)
 *
 * @callback handleResultCallback
 * @param {Error} err
 * @param {Result} result
 */

/**
 *
 * @param  {Args} args
 * @param  {function} args
 * @param  {handleResultCallback} cb
 * @return {void}
 */
module.exports = function _promptDelDir(args, cb) {
  cb = cb || (err => {
    if (err) throw err;
  });
  if (!args || !args.pathToDel) {
    cb(new Error('the path to delete is mandatory'));
  }
  const PATH_TO_DEL = args.pathToDel;
  const DEL_PATTERNS = args.patterns || [path.join(PATH_TO_DEL, '**'), '!' + PATH_TO_DEL];
  const PROMPT_MSG = args.promptMsg || `About to delete based on the following patterns:\n${DEL_PATTERNS}`;
  const DO_PROMPT = args.doPrompt || (() => {
    confirmFileDeletion(DEL_PATTERNS, PROMPT_MSG)
      .then(answersHandlerFactory(
        function onOk() {
          del(DEL_PATTERNS, {
            force: true
          }).then(paths => cb(null, { deletedPaths: paths }));
        },
        function onNotOk() {
          cb(null, { userSaysNo: true });
        }
      ));
  });

  if (dirExistsSync(PATH_TO_DEL)) {
    emptyDir(PATH_TO_DEL, (err, pathToDelIsEmpty) => {
      if (err) cb(err);
      if (pathToDelIsEmpty) {
        return cb(null, { pathToDelIsEmpty: true });
      } else {
        return args.doPrompt()

        // confirmFileDeletion(DEL_PATTERNS, PROMPT_MSG)
        //   .then(answersHandlerFactory(
        //     function onOk() {
        //       del(DEL_PATTERNS, {
        //         force: true
        //       }).then(paths => cb(null, { deletedPaths: paths }));
        //     },
        //     function onNotOk() {
        //       cb(null, { userSaysNo: true });
        //     }
        //   ));
      }
    });
  } else {
    return cb(null, { pathToDelDoesNotExist: true });
  }
};
