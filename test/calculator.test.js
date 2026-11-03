// Zero-Breaking-Logic verification for the resurrected calculator.
//
// These are the EXACT 20 formulas from the original Firefox OS calculator's
// built-in self-test (Calculator.test in the 2012 source). If the modernized
// engine produces the same results, the business logic was preserved.
//
// Run: node --test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Calculator } from '../src/js/calculator.js';

// The math engine (infix2postfix / evaluatePostfix) never touches the DOM,
// so a null display is enough to exercise it.
const calc = new Calculator(null);

function evaluate(formula) {
  const postfix = calc.infix2postfix(formula);
  return calc.evaluatePostfix(postfix);
}

// [formula, expected] — copied verbatim from the original self-test.
const cases = [
  ['1+1', 2],
  ['3+4*2/(1-5)', 1],
  ['39+4*2/(1-5)', 37],
  ['(39+4)*2/(1-5)', -21.5],
  ['4+-5', -1],
  ['-5*6', -30],
  ['-5.5*6', -33],
  ['-5.5*-6.4', 35.2],
  ['-6-6-6', -18],
  ['6-6-6', -6],
  ['.001 /2', 0.0005],
  ['(0-.001)/2', -0.0005],
  ['-.001/(0-2)', 0.0005],
  ['1000000000000000000000000+1', 1e24],
  ['1000000000000000000000000-1', 1e24],
  ['1e+30+10', 1e30],
  ['1e+30*10', 1e31],
  ['1e+30/100', 1e28],
  ['10/1000000000000000000000000', 1e-23],
  ['10/-1000000000000000000000000', -1e-23],
];

for (const [formula, expected] of cases) {
  test(`evaluates ${formula} === ${expected}`, () => {
    assert.equal(evaluate(formula), expected);
  });
}
