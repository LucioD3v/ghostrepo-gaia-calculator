// Calculator — core logic for the resurrected Firefox OS calculator.
//
// Resurrected from the Firefox OS (Gaia) calculator by GhostRepo.
// Original: mozilla-b2g/gaia @ 7378e497d0, apps/calculator/js/calculator.js (MPL-2.0).
//
// Exorcist (security / dead APIs banished):
//   - this.display.innerHTML = value   -> this.display.textContent = value   (XSS-safe)
//   - style.MozTransform (dead vendor) -> style.transform (standard)
//   - mousedown / mouseup              -> pointerdown / pointerup (modern input)
//
// Alchemist (legacy paradigms transmuted):
//   - global `var Calculator = {...}`  -> ES6 class + ES module export
//   - var                             -> const / let
//   - loose equality (== / !=)        -> strict (=== / !==)
//   - throw object literal            -> throw real Error
//   - setTimeout(fn, ms, self)        -> arrow functions with lexical `this`
//
// Business logic preserved verbatim: same shunting-yard evaluation, same results.

import { Parser } from './parser.js';

const BACKSPACE_TIMEOUT = 750;
const OPERATORS = ['÷', '×', '-', '+', '*', '/'];
const INFINITY_PATTERN = new RegExp(`${1 / 0}`, 'g');

export class Calculator {
  constructor(display) {
    this.display = display;
    this.backSpaceTimeout = null;
    this.errorTimeout = null;
    this.toClear = false;

    // Holds the current symbols for calculation.
    this.stack = [];

    this.evaluate = {
      '*': (a, b) => a * b,
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '/': (a, b) => a / b,
    };
  }

  updateDisplay() {
    if (this.stack.length === 0) {
      this.display.textContent = '0';
    } else {
      const outval = this.stack.join('').replace(INFINITY_PATTERN, '∞');
      this.display.textContent = outval;
    }

    const valWidth = this.display.offsetWidth;
    const screenWidth = this.display.parentNode.offsetWidth;
    const scaleFactor = Math.min(1, (screenWidth - 16) / valWidth);
    this.display.style.transform = `scale(${scaleFactor})`;
  }

  isNumeric(value) {
    return value - 0 === Number(value) && String(value).length > 0;
  }

  isOperator(value) {
    return OPERATORS.indexOf(value) !== -1;
  }

  appendValue(value) {
    if (this.toClear) {
      this.stack = [];
      this.toClear = false;
    }
    this.stack.push(value);
    this.updateDisplay();
  }

  appendDigit(value) {
    this.toClear = false;

    const currentNumber = this.stack.pop();

    // Check if the current thing is a number.
    if (this.isNumeric(currentNumber)) {
      let next = currentNumber;
      if (value === '.') {
        // Only add '.' to the current number if it does not already exist.
        if (currentNumber.indexOf('.') === -1) {
          next += value;
        }
      } else {
        next += value;
      }
      this.appendValue(next);
    } else {
      if (currentNumber !== undefined) {
        this.stack.push(currentNumber);
      }
      let next = value;
      if (value === '.') {
        next = '0.';
      }
      this.appendValue(next);
    }
  }

  appendOperator(value) {
    this.toClear = false;

    // Subtraction can also be used as a negative value.
    if (value === '-' && this.stack[this.stack.length - 1] !== '-') {
      this.appendValue(value);
      return;
    }

    // New operators overwrite any current operators. Because subtraction
    // is allowed after other operators, there may be more than one.
    while (this.isOperator(this.stack[this.stack.length - 1])) {
      this.stack.pop();
    }

    if (this.stack.length === 0) {
      this.updateDisplay();
      return;
    }

    this.stack.push(value);
    this.updateDisplay();
  }

  // If backspace / clear is held for BACKSPACE_TIMEOUT, clear the full formula.
  backSpace() {
    this.clearBackspaceTimeout();
    this.startBackspaceTimeout();
    this.stack.splice(this.stack.length - 1, 1);
    this.updateDisplay();
  }

  substitute(key) {
    if (key === '×') {
      return '*';
    }
    if (key === '÷') {
      return '/';
    }
    return key;
  }

  calculate() {
    if (this.stack.length === 0) {
      return;
    }

    try {
      const postfix = this.infix2postfix(
        this.stack.map((key) => this.substitute(key)).join('')
      );
      const result = this.evaluatePostfix(postfix);
      this.stack = [String(result)];
      this.updateDisplay();
      this.toClear = true;
    } catch (err) {
      this.display.parentNode.classList.add('error');
      if (this.errorTimeout === null) {
        this.errorTimeout = window.setTimeout(() => {
          this.display.parentNode.classList.remove('error');
          this.errorTimeout = null;
        }, 300);
      }
    }
  }

  clearBackspaceTimeout() {
    if (this.backSpaceTimeout !== null) {
      window.clearTimeout(this.backSpaceTimeout);
      this.backSpaceTimeout = null;
    }
  }

  startBackspaceTimeout() {
    this.backSpaceTimeout = window.setTimeout(() => {
      this.stack = [];
      this.toClear = false;
      this.updateDisplay();
      this.backSpaceTimeout = null;
    }, BACKSPACE_TIMEOUT);
  }

  precedence(val) {
    if (['-', '+'].indexOf(val) !== -1) {
      return 2;
    }
    if (['*', '/'].indexOf(val) !== -1) {
      return 3;
    }
    return null;
  }

  // Basic implementation of the shunting-yard algorithm:
  // http://en.wikipedia.org/wiki/Shunting-yard_algorithm
  // Functions are unimplemented; only left-associative operators are used.
  infix2postfix(infix) {
    const parser = new Parser(infix);
    const tokens = parser.parse();
    const output = [];
    const stack = [];

    tokens.forEach((token) => {
      if (token.number) {
        output.push(parseFloat(token.value, 10));
      }

      if (this.isOperator(token.value)) {
        while (
          stack.length &&
          this.isOperator(stack[stack.length - 1]) &&
          this.precedence(token.value) <= this.precedence(stack[stack.length - 1])
        ) {
          output.push(stack.pop());
        }
        stack.push(token.value);
      }

      if (token.value === '(') {
        stack.push(token.value);
      }

      if (token.value === ')') {
        while (stack.length && stack[stack.length - 1] !== '(') {
          output.push(stack.pop());
        }
        // Discard the '('.
        stack.pop();
      }
    });

    while (stack.length > 0) {
      output.push(stack.pop());
    }
    return output;
  }

  evaluatePostfix(postfix) {
    const stack = [];

    postfix.forEach((token) => {
      if (!this.isOperator(token)) {
        stack.push(token);
      } else {
        const op2 = stack.pop();
        const op1 = stack.pop();
        const result = this.evaluate[token](op1, op2);
        if (Number.isNaN(result)) {
          throw new Error(`Value is ${result}`);
        }
        stack.push(result);
      }
    });

    const finalResult = stack.pop();
    if (Number.isNaN(finalResult)) {
      throw new Error(`Value is ${finalResult}`);
    }
    return finalResult;
  }

  init() {
    document.addEventListener('pointerdown', this);
    document.addEventListener('pointerup', this);
    this.updateDisplay();
  }

  handleEvent(evt) {
    const target = evt.target;
    switch (evt.type) {
      case 'pointerdown': {
        const value = target.value;
        switch (target.dataset.type) {
          case 'value':
            this.appendDigit(value);
            break;
          case 'operator':
            this.appendOperator(value);
            break;
          case 'command':
            if (value === '=') {
              this.calculate();
            } else if (value === 'C') {
              this.backSpace();
            }
            break;
        }
        break;
      }

      case 'pointerup':
        this.clearBackspaceTimeout();
        break;
    }
  }
}
