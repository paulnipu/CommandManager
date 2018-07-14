module.exports = [
  {
    type: 'input',
    name: 'groupName',
    message: 'Please enter group name.',
    validate: (val) => {
      if (val) {
        return true;
      }
      return false;
    },
  },
];
