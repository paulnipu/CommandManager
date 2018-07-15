const regExpUtil = require('./../Utils/RegExUtil');
const databaseManager = require('./../DataBaseUtil/DatabaseManager');

module.exports = [
  {
    type: 'input',
    name: 'groupName',
    message: 'Please enter group name.',
    validate: val => new Promise((resolve, reject) => {
      const pass = databaseManager.loadGroupList().filter(group => group._name == val).length > 0;
      if (pass) {
        resolve(pass);
      }
      reject(new Error('Enter Valid Group Name. See Group List by "list" command'));
    }),
  },
  {
    type: 'input',
    name: 'commandName',
    message: 'Please enter Command name.',
    validate: function chectValidation(input) {
      console.log(regExpUtil.nameRegExp);
      const pass = input.match(regExpUtil.nameRegExp);
      if (pass) {
        return true;
      }
      return 'Please enter a valid name';
    },
  },
  {
    type: 'input',
    name: 'command',
    message: 'Please enter Command.',
    validate: function chectValidation(input) {
      const regEx = regExpUtil.quotedTextRegexp; // '/^"(?:[A-Za-z0-9])+"$/';
      const pass = input.match(regEx);
      if (pass) {
        return true;
      }
      return 'Please double quote the Command';
    },
  },
];
