function getItemListUI(listItems, msg = 'Select group.') {
  return [
    {
      type: 'list',
      name: 'selectedItem',
      message: msg,
      choices: () => listItems,
    },
  ];
}
module.exports = getItemListUI;
