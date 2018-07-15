#!/usr/bin/env node
const databaseManager = require('./DataBaseUtil/DatabaseManager.js');
const CommandManger = require('./CommandManager/CommandManager');

function startProgram() {
  new CommandManger().init();
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
