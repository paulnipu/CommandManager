function getItemListUI(listItems) {
  return [
    {
      type: 'list',
      name: 'selectedItem',
      message: 'Select group.',
      choices: () => listItems,
    },
  ];
}
module.exports = getItemListUI;
