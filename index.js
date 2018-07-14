#!/usr/bin/env node
const DatabaseManagerClass = require('./DataBaseUtil/DatabaseManager.js');
const CommandManger = require('./CommandManager/CommandManager');

const databaseManager = new DatabaseManagerClass();
function startProgram() {
  new CommandManger(databaseManager).init();
}

// Initialize Database before start the program
databaseManager.initializeDataBase()
  .then(() => {
    setTimeout(() => {
      startProgram();
    }, 1000);
  }).catch((err) => {
    console.log(err);
  });
