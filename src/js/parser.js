// Parser — expression tokenizer for the calculator.
//
// Resurrected from the Firefox OS (Gaia) calculator by GhostRepo.
// Original: mozilla-b2g/gaia @ 7378e497d0, apps/calculator/js/parser.js (MPL-2.0).
//
// Modernization (Alchemist):
//   - ES5 prototype constructor  -> ES6 class + ES module export
//   - var                        -> const / let
//   - loose equality (== / !=)   -> strict (=== / !==)
//   - throw object literal       -> throw real Error
//
// Business logic preserved verbatim: same tokenization rules, same output shape.

export class Parser {
  constructor(input) {
    // No spaces.
    const cleaned = input.replace(/[ \t\v\n]/g, '');

    // String to array of characters.
    this._chars = [...cleaned];
    this._tokens = [];
  }

  // Returns an array of objects with these properties:
  //   - number: true/false
  //   - value:  the token value
  parse() {
    // The input must be a 'block' without any digit left.
    if (!this._tokenizeBlock() || this._chars.length) {
      throw new Error('Wrong input');
    }
    return this._tokens;
  }

  _tokenizeBlock() {
    if (!this._chars.length) {
      return false;
    }

    // '(' + something + ')'
    if (this._chars[0] === '(') {
      this._tokens.push({ number: false, value: this._chars[0] });
      this._chars.shift();

      if (!this._tokenizeBlock()) {
        return false;
      }

      if (!this._chars.length || this._chars[0] !== ')') {
        return false;
      }

      this._chars.shift();
      this._tokens.push({ number: false, value: ')' });
    } else {
      // number + ...
      if (!this._tokenizeNumber()) {
        return false;
      }
    }

    if (!this._chars.length || this._chars[0] === ')') {
      return true;
    }

    while (this._chars.length && this._chars[0] !== ')') {
      if (!this._tokenizeOther()) {
        return false;
      }
      if (!this._tokenizeBlock()) {
        return false;
      }
    }

    return true;
  }

  // A simple float parser.
  _tokenizeNumber() {
    if (!this._chars.length) {
      return false;
    }

    // {+,-}something
    const number = [];
    if (/[+-]/.test(this._chars[0])) {
      number.push(this._chars.shift());
    }

    const tokenizeNumberInternal = () => {
      if (!this._chars.length || !/^[0-9.]/.test(this._chars[0])) {
        return false;
      }
      while (this._chars.length && /[0-9.]/.test(this._chars[0])) {
        number.push(this._chars.shift());
      }
      return true;
    };

    if (!tokenizeNumberInternal()) {
      return false;
    }

    // 123{e...}
    if (!this._chars.length || this._chars[0] !== 'e') {
      this._tokens.push({ number: true, value: number.join('') });
      return true;
    }

    number.push(this._chars.shift());

    // 123e{+,-}
    if (/[+-]/.test(this._chars[0])) {
      number.push(this._chars.shift());
    }

    if (!this._chars.length) {
      return false;
    }

    // the number
    if (!tokenizeNumberInternal()) {
      return false;
    }

    this._tokens.push({ number: true, value: number.join('') });
    return true;
  }

  _tokenizeOther() {
    if (!this._chars.length) {
      return false;
    }

    if (['*', '/', '+', '-'].indexOf(this._chars[0]) !== -1) {
      this._tokens.push({ number: false, value: this._chars.shift() });
      return true;
    }

    return false;
  }
}
