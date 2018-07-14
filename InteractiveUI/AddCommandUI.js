module.exports = [
  {
    type: 'input',
    name: 'groupName',
    message: 'Please enter group name.',
    validate: (val) => {
      if (val && val.length > 0) {
        return true;
      }
      return false;
    },
  },
  {
    type: 'input',
    name: 'commandName',
    message: 'Please enter Command name.',
    validate: (val) => {
      if (val) {
        return true;
      }
      return false;
    },
  },
  {
    type: 'input',
    name: 'command',
    message: 'Please enter Command.',
    validate: (val) => {
      if (val) {
        return true;
      }
      return false;
    },
  },
];
