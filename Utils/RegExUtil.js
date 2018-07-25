const Regularity = require('regularity');

class RegExUtil {
  constructor() {
    this.quoteExp = new RegExp('^"(?:.)+"$');
  }

  quotedTextRegexp() {
    return this.quoteExp;
  }

  nameRegExp() {
    this.regularity = new Regularity();
    return this.regularity
      .oneOrMore('alphanumeric')
      .zeroOrMore('_')
      .done();
  }
}
const regexpUtil = new RegExUtil();
module.exports = regexpUtil;
