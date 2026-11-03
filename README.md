# 👻 GhostRepo — Gaia Calculator Resurrection

> Resurrect abandoned codebases. GhostRepo scans dead repos, banishes legacy bugs with Kiro agents, and automates modern refactoring so your forgotten projects live again.

This repository is a **living demo** of GhostRepo, built for the **Kiroween Hackathon (Category: Resurrection)**. It takes a piece of code that is *doubly dead* and brings it back to life as a modern, maintainable web app.

---

## 🪦 The patient: Firefox OS Calculator

The code we resurrect here is the **Calculator app from Gaia**, the HTML5 UI of Mozilla's Firefox OS (Boot 2 Gecko).

It is dead twice over:

1. **The app was deleted** from the Gaia repository on **2012-12-27** by commit `53dd83d7` (*"Bug 822565 - Remove the calculator app"*).
2. **The whole project was abandoned** — Mozilla discontinued Firefox OS, and the [`mozilla-b2g/gaia`](https://github.com/mozilla-b2g/gaia) repository was **archived (read-only) on 2021-11-03**.

We recovered the original source from the last commit where it was still alive: [`7378e497d0`](https://github.com/mozilla-b2g/gaia/commit/7378e497d0) (2012-12-26).

> **Provenance & license:** the original calculator source is Mozilla code licensed under the **Apache License 2.0** (Copyright 2012, Mozilla Foundation). This repository preserves that attribution. The resurrection (modern refactor) is documented transparently so anyone can trace what changed and why. See `PROVENANCE.md` (added with the source).

---

## 🎯 What GhostRepo does

GhostRepo is a **Kiro multi-agent orchestrator** that turns legacy, abandoned, or "zombie" code into production-ready, modern code. It runs a 4-phase resurrection pipeline:

| Phase | Name | What happens |
|-------|------|--------------|
| **1. Necromancy** | Pulse Check & Entropy Scan | Scan the target, locate dead code, deprecated APIs, and technical debt — with real evidence, not guesses. |
| **2. Exorcism** | Bug & Vulnerability Banishment | The **Exorcist** agent removes security smells (e.g. unsafe `innerHTML`) and dead/deprecated APIs (e.g. `MozTransform`). |
| **3. Transmutation** | Modern Refactoring | The **Alchemist** agent rewrites legacy patterns into modern ones: ES6+ modules, `class`, `const`/`let`, strict equality, real `Error` handling, modern events. |
| **4. Resurrection** | Report & Pull Request | Generate a **Resurrection Report** (real metrics from the actual `git diff`) and open a clean, reviewable pull request. |

**Guardrail — Zero Breaking Logic:** every refactor must preserve the original business logic of the app. The calculator must still calculate exactly the same results.

---

## 🧟 Technical debt found in the calculator (Phase 1 results)

These are **real findings** from scanning the recovered source — each one is addressed in later phases:

- Unsafe `innerHTML` writes to the display (should be `textContent`).
- Dead, vendor-prefixed `style.MozTransform` API (Firefox OS era).
- One global monolithic object (`var Calculator = {...}`) — no modules.
- ES5 throughout: `var` everywhere, loose equality (`==` / `!=`).
- `mousedown` / `mouseup` instead of modern pointer events.
- Throwing object literals instead of real `Error` objects.
- No modern automated tests — only a manual `console.log` self-test.

---

## 🔁 Try it on your own dead code (v1 scope: JS / Web Legacy)

GhostRepo is **not hardcoded to the calculator**. The calculator is just the showcase example. The resurrection pipeline is parameterized so you can point it at **any legacy web repo**:

```bash
# Resurrect any JavaScript / web project
./resurrect <repo-url> [--path <subfolder>]

# The exact command that produced this repo:
./resurrect https://github.com/mozilla-b2g/gaia --path apps/calculator
```

**v1 supported scope — JavaScript / Web Legacy.** GhostRepo v1 focuses on front-end web code: callback hell → `async`/`await`, `var` → `const`/`let`, unsafe `innerHTML`, deprecated DOM/vendor APIs, and ES5 → ES6+ modernization. It is honest about its limits: it does **not** claim to modernize every language. Feeding it a web project keeps the resurrection reliable and reproducible.

---

## 📦 What lives in this repo

> ⚠️ **Work in progress.** Right now this repository contains **only this README**, so the team can review the plan before any code is pushed. The original source and the modernized version are added in the next steps.

Planned layout once the resurrection runs:

```
ghostrepo-gaia-calculator/
├── README.md              # you are here
├── PROVENANCE.md          # origin commit + Apache-2.0 attribution
├── src/                   # resurrected (modern) calculator
├── legacy/                # original 2012 source, preserved for the before/after diff
└── resurrection-report.json  # real metrics from the git diff
```

---

## 🔗 Resurrected by GhostRepo

This repository is the **output** of the resurrection pipeline. The tool that
scanned, exorcised, and modernized this code lives here:

➡️ **[LucioD3v/GhostRepo](https://github.com/LucioD3v/GhostRepo)** — the Kiro
Multi-Agent Orchestrator (Exorcist + Alchemist).

The exact command that produced this repo:

```bash
./resurrect https://github.com/mozilla-b2g/gaia --path apps/calculator
```

## 🏆 About

Built with [Kiro](https://kiro.dev) for the **Kiroween Hackathon** — Resurrection category.
Orchestrated by the GhostRepo Kiro Multi-Agent pipeline (Exorcist + Alchemist). 👻🚀
