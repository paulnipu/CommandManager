const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter = new FileAsync('db.json', { defaultValue: { title: 'Command Manager', version: '', groups: [] } });
const GroupModel = require('../DataModels/GroupModel');
const CommandModel = require('../DataModels/CommandModel');


class DatabaseManager {
  initializeDataBase() {
    return new Promise((resolve, reject) => {
      low(adapter)
        .then((_db) => {
          this.db = _db;
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  saveNewGroup(userInput) {
    const group = new GroupModel(userInput.groupName);
    return this.db.get('groups')
      .push(group)
      .write();
  }

  addCommand(userInput) {
    return new Promise((resolve, reject) => {
      const command = new CommandModel(userInput.commandName, userInput.command);
      this.db.get('groups')
        .find({ _name: userInput.groupName })
        .get('_commands')
        .push(command)
        .write()
        .then(() => {
          resolve(command);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  loadGroupList() {
    return this.db.get('groups')
      .map('_name')
      .value();
  }

  loadCommandList(groupName) {
    return this.db.get('groups')
      .find({ _name: groupName })
      .get('_commands')
      .value();
  }
}
module.exports = DatabaseManager;
