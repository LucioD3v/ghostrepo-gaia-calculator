# Provenance & Attribution

This repository contains a **resurrected and modernized** version of the Calculator
app that originally shipped with Mozilla's Firefox OS (Gaia).

## Original source

| | |
|---|---|
| **Upstream project** | [`mozilla-b2g/gaia`](https://github.com/mozilla-b2g/gaia) (Gaia — the HTML5 UI of Firefox OS / Boot 2 Gecko) |
| **License (at recovered commit)** | Apache License 2.0 (Copyright 2012, Mozilla Foundation) |
| **Original path** | `apps/calculator/` |
| **Recovered from commit** | [`7378e497d0`](https://github.com/mozilla-b2g/gaia/commit/7378e497d0) (2012-12-26) — the last commit where the calculator still existed |
| **Deleted by** | commit `53dd83d7` (2012-12-27), *"Bug 822565 - Remove the calculator app"* |
| **Upstream status** | Repository **archived (read-only)** by Mozilla on 2021-11-03 |

The unmodified original files are preserved in [`legacy/`](legacy/) so the
before/after of the resurrection can be audited line by line.

## License

At the recovered commit (`7378e497d0`, 2012), the Gaia repository's license file
(`LICENCE`) declared the **Apache License 2.0** (Copyright 2012, Mozilla Foundation).
That exact license text is preserved here as [`LICENSE`](LICENSE), and this
resurrection is distributed under the same terms.

> This project is a derivative work. All credit for the original calculator
> logic belongs to **The Gaia Team / Mozilla**. GhostRepo modernized the code;
> it did not author the original business logic.

## What GhostRepo changed

The resurrection was performed by the GhostRepo pipeline. Changes are limited to
modernization and safety — **the business logic (how the calculator computes) was
preserved verbatim** and verified against the original's own 20 test formulas.

### Phase 2 — Exorcism (security / dead APIs)
- `display.innerHTML = value` → `display.textContent = value` (removes an XSS vector)
- `style.MozTransform` (dead vendor-prefixed API) → `style.transform` (standard)
- `mousedown` / `mouseup` → `pointerdown` / `pointerup` (modern input events)

### Phase 3 — Transmutation (legacy → modern)
- Global object `var Calculator = {...}` → `class Calculator` + ES module
- `function Parser() { ... }; Parser.prototype = {...}` → `class Parser` + ES module
- `var` → `const` / `let`
- Loose equality (`==` / `!=`) → strict equality (`===` / `!==`)
- `throw ({ ... })` (object literal) → `throw new Error(...)`
- `setTimeout(fn, ms, self)` → arrow functions with lexical `this`

### Verification
- The original built-in self-test (20 formulas) was converted into an automated
  test suite under [`test/`](test/) and run with Node's test runner.
- **Result: 20/20 pass** — same inputs, same outputs as the 2012 original.
