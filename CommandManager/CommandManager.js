const program = require('commander');
const { prompt } = require('inquirer');
const chalk = require('chalk');
const cmd = require('node-cmd');
const addGroupUI = require('./../InteractiveUI/AddGroupUI');
const addCommandUI = require('./../InteractiveUI/AddCommandUI');
const listUI = require('./../InteractiveUI/ListUI');

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
  constructor(_databaseManager) {
    this.databaseManager = _databaseManager;
  }

  init() {
    program
      .version('1.0.0')
      .description('My Command Manager');
    this.addGroupCommand();
    this.addCommand();
    this.showList();
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
}

module.exports = CommandManager;
