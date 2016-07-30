var del = require('del');
var inquirer = require('inquirer');

/**
 * All options accepted by exported function
 * @typedef {Object} Args
 * @property {[string]} patterns      - Mandatory argument: array of patterns to base deletion on
 * @property {string} promptMsg       - Optional argument for the string to use to prompt the user with before deletion
 * @property {doPromptCb} doPromptCb  - Optional callback responsible for getting approval from the user to perform deletion (default uses inquirer via stdin).
 *                               		After getting yes/no, this function has the responsibility of calling one of its given callbacks (onOkCb, onNotOkCb).
 */

/**
 * Optional callback responsible for getting approval from the user to perform deletion (default uses inquirer via stdin)
 * After getting yes/no, this function has the responsibility of calling one of its given callbacks (onOkCb, onNotOkCb).
 *
 * @callback doPromptCb
 * @param {function} onOkCb
 * @param {function} onNotOkCb
 */

/**
 * Result object passed to handleResultCallback
 * @typedef {Object} Result
 * @property {[string]} deletedPaths - Array of paths deleted
 * @property {boolean} userSaysNo - Is `true` if after being prompoted, user decided not to delete (undefined otherwise)
 */

/**
 * Optional user supplied callback to handle result (default behaviour is to just throw the err if first arg is truthy)
 *
 * @callback handleResultCallback
 * @param {Error} err
 * @param {Result} result
 */

function confirmFileDeletion(promptMsg) {
  var prompt = inquirer.createPromptModule();
  return prompt([
    {
      type: 'confirm',
      name: 'okDelete',
      message: promptMsg,
      'default': false
    }
  ]);
}

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
  if (!args || !args.patterns) {
    cb(new Error('the patterns ([string]) to delete by are mandatory'));
  }
  const DEL_PATTERNS = args.patterns;
  const PROMPT_MSG = args.promptMsg || `About to delete based on the following patterns:\n${DEL_PATTERNS}`;
  const DO_PROMPT_CB = args.doPromptCb || ((onOkCb, onNotOkCb) => {
    confirmFileDeletion(PROMPT_MSG)
      .then((answers) => answers.okDelete ? onOkCb() : onNotOkCb());
  });

  DO_PROMPT_CB(
    () => del(DEL_PATTERNS, { force: true }).then(paths => cb(null, { deletedPaths: paths })),
    () => cb(null, { userSaysNo: true })
  );
};
