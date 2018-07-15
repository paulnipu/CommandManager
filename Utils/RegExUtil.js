const Regularity = require('regularity');

class RegExUtil {
  constructor() {
    this.regularity = new Regularity();
    this.quotedTextRegexp = this.regularity
      .startWith('"')
      .oneOrMore('alphanumeric')
      .endWith('"')
      .done();
    this.regularity = new Regularity();
    this.nameRegExp = this.regularity
      .oneOrMore('alphanumeric')
      .zeroOrMore('_')
      .done();
  }
}
const regexpUtil = new RegExUtil();
module.exports = regexpUtil;
