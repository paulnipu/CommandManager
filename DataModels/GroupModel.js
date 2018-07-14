class GroupModel {
  constructor(name) {
    this._name = name;
    this._commands = [];
  }

  set name(val) {
    this._name = val;
  }

  get name() {
    return this._name;
  }

  get commands() {
    return this._commands;
  }
}

module.exports = GroupModel;
