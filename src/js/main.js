// Entry point for the resurrected calculator.
//
// Replaces the original global `window.addEventListener('load', ...)` bootstrap
// with a clean ES module entry point.

import { Calculator } from './calculator.js';

window.addEventListener('load', () => {
  const display = document.querySelector('#display b');
  const calculator = new Calculator(display);
  calculator.init();
});
