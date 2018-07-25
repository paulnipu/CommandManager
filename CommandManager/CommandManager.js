const program = require('commander');
const { prompt } = require('inquirer');
const chalk = require('chalk');
const cmd = require('node-cmd');
const addGroupUI = require('./../InteractiveUI/AddGroupUI');
const addCommandUI = require('./../InteractiveUI/AddCommandUI');
const listUI = require('./../InteractiveUI/ListUI');
const databaseManager = require('./../DataBaseUtil/DatabaseManager');

function printError(msg) {
  console.log(chalk.default.red(msg));
}
function printResponse(msg) {
  console.log(chalk.default.cyan(msg));
}

function executeCommand(command) {
  console.log(command);
  return new Promise((resolve, reject) => {
    cmd.get(command, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
function showUI(uiElement) {
  return prompt(uiElement);
}

async function executeCommands(commnads, currentIndex = 0) {
  try {
    printResponse(await executeCommand(commnads[currentIndex]));
    const temp = currentIndex + 1;
    if (temp < commnads.length) {
      executeCommands(commnads, temp);
    }
  } catch (e) {
    printError(e);
  }
}
class CommandManager {
  constructor() {
    this.databaseManager = databaseManager;
  }

  init() {
    program
      .version('1.0.0')
      .description('My Command Manager');
    this.addGroupCommand();
    this.addCommand();
    this.showList();
    this.delete();
    program.parse(process.argv);
  }

  addGroupCommand() {
    program
      .command('add-group')
      .alias('g')
      .action(async () => {
        try {
          const answers = await showUI(addGroupUI);
          this.databaseManager.saveNewGroup(answers)
            .then(() => {
              printResponse(`Saved Group ${answers.groupName}`);
            })
            .catch((err) => {
              printError(err);
            });
        } catch (e) {
          printError(e);
        }
      });
  }

  addCommand() {
    program
      .command('add-command')
      .alias('g')
      .action(async () => {
        const answers = await showUI(addCommandUI);
        this.databaseManager.addCommand(answers)
          .then(() => {
            printResponse(`Saved Group ${answers.commandName} --> ${answers.command}`);
          })
          .catch((err) => {
            printError(err);
          });
      });
  }

  showList() {
    program
      .command('list')
      .action(async () => {
        // Load Command List
        const listOfGroups = this.databaseManager.loadGroupList();
        const answers = await showUI(listUI(listOfGroups));
        console.log(`------------------ Commands of ${answers.selectedItem}------------------\n`);
        const commandList = this.databaseManager.loadCommandList(answers.selectedItem);
        const formattedCommandList = commandList.map(element => ({
          name: element._name,
          value: element._command,
        }));
        formattedCommandList.splice(0, 0, {
          name: '*',
          value: '*',
        });
        const nestedAnswer = await showUI(listUI(formattedCommandList));
        printResponse(`Execeution Command ${nestedAnswer.selectedItem}`);
        if (nestedAnswer.selectedItem == '*') {
          formattedCommandList.shift();
          // const combinedCommand = formattedCommandList
          // .map(commandItem => JSON.parse(commandItem.value)).join('\n');
          executeCommands(formattedCommandList
            .map(commandItem => JSON.parse(commandItem.value)));
        } else {
          const result = await executeCommand(JSON.parse(nestedAnswer.selectedItem));
          printResponse(result);
        }
      });
  }

  delete() {
    program
      .command('delete')
      .option('-g, --group', 'Delete Group')
      .option('-i, --item', 'Delete Item')
      .action(async (opt) => {
        if (opt.group) {
          const answer = await showUI(listUI(this.databaseManager.loadGroupList(), 'Select group you want to delete.'));
          const response = await this.databaseManager.deleteGroup(answer.selectedItem);
          printResponse(response);
        } else if (opt.item) {
          const answer = await showUI(listUI(this.databaseManager.loadGroupList(), 'Select group.'));
          console.log(`------------------ Commands of ${answer.selectedItem}------------------\n`);
          const commandList = this.databaseManager.loadCommandList(answer.selectedItem);
          const formattedCommandList = commandList.map(element => ({
            name: element._name,
            value: element._name,
          }));
          formattedCommandList.splice(0, 0, {
            name: '*',
            value: '*',
          });
          const itemAnswer = await showUI(listUI(formattedCommandList));
          if (itemAnswer.selectedItem == '*') {
            const response = await this.databaseManager
              .deleteItem(answer.selectedItem, itemAnswer.selectedItem, true);
            printResponse(response);
          } else {
            const response = await this.databaseManager
              .deleteItem(answer.selectedItem, itemAnswer.selectedItem);
            printResponse(response);
          }
        } else {
          printError('[-g --group] or [-i --item required]');
        }
      });
  }
}

module.exports = CommandManager;
