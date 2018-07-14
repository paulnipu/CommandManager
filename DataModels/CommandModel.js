class CommandModel {
  constructor(name, command) {
    this._name = name;
    this._command = command;
  }

  set name(newVal) {
    this._name = newVal;
  }

  get name() {
    return this._name;
  }

  set command(newVal) {
    this._command = newVal;
  }

  get command() {
    return this._command;
  }
}

module.exports = CommandModel;
