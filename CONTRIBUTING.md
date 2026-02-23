# Contributing to Blockchain Lab

> **University of Mumbai · Information Technology · Semester VIII · AY 2025-26**
> Web3 Stack: Hardhat | Truffle | Ganache | Foundry | Remix IDE

Thank you for your interest in contributing to the **Blockchain Lab** repository. This guide
outlines the conventions, workflows, and standards expected from all contributors — whether you
are a classmate, lab partner, or someone forking this for your own coursework.

---

## Table of Contents

1. [Code of Conduct](#1-code-of-conduct)
2. [Branch Strategy & Protection](#2-branch-strategy--protection)
3. [Commit Message Nomenclature](#3-commit-message-nomenclature)
4. [Pull Request Guidelines](#4-pull-request-guidelines)
5. [Experiment File Conventions](#5-experiment-file-conventions)
6. [Smart Contract & Solidity Standards](#6-smart-contract--solidity-standards)
7. [Security Guidelines](#7-security-guidelines)
8. [Getting Help](#8-getting-help)

---

## 1. Code of Conduct

This is an academic repository maintained for educational purposes under the University of Mumbai
B.E. (IT) SEM VIII curriculum. All contributors are expected to:

- Be respectful and constructive in all discussions.
- Keep contributions relevant to Blockchain Lab experiments and documentation.
- Never commit real private keys, mnemonics, or secrets of any kind.
- Cite sources if adapting external code for an experiment.

---

## 2. Branch Strategy & Protection

### Protected Branch — `main`

The `main` branch is **protected**:

- Direct pushes to `main` are **disabled**.
- All changes must go through a **Pull Request** with at least one review approval.
- PR checks must pass before merging.

> ⚠️ Never force-push to `main`. All history on `main` is considered stable and final.

### Feature Branch Naming Convention

All contributors **must** create their own feature branch following this pattern:

```
b-<yourname>
```

**Examples:**

| Contributor | Branch Name |
|-------------|-------------|
| Pratham Diwadkar (maintainer) | `b-pratham` |
| Jane Doe | `b-jane` |
| John Smith | `b-johnsmith` |

Use lowercase letters only. Avoid spaces, underscores, or special characters other than hyphens.

### Creating Your Branch

```bash
# Start from the latest main
git checkout main
git pull origin main

# Create your feature branch
git checkout -b b-yourname
```

### Branch Scope

Each `b-<name>` branch may contain multiple experiments or documentation updates authored by that
contributor. For larger, isolated features (e.g., adding a new experiment set), you may create
sub-branches off your personal branch:

```bash
git checkout -b b-yourname-exp05-token
```

Merge sub-branches back into `b-yourname` before opening a PR to `main`.

---

## 3. Commit Message Nomenclature

All commit messages **must** follow this structure:

```
<type>(<scope>): <short summary>
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | Adding a new experiment, feature, or significant content |
| `fix` | Fixing a bug, incorrect code, or broken configuration |
| `docs` | Documentation-only changes (README, manual, syllabus, guides) |
| `chore` | Maintenance tasks — `.gitignore`, dependency updates, repo config |
| `refactor` | Code restructuring with no functional change |
| `test` | Adding or updating test files for smart contracts |
| `style` | Formatting, whitespace, comment edits — no logic changes |
| `exp` | Experiment-specific commit (new `.sol` file, migration, test run) |
| `config` | Config file changes — `hardhat.config.js`, `truffle-config.js`, etc. |

### Scopes

Use the scope to identify the area of the codebase being changed:

| Scope | Refers to |
|-------|-----------|
| `exp-01` … `exp-10` | Individual lab experiment folders |
| `docs` | Files inside `docs/` |
| `root` | Root-level files (README, LICENSE, .gitignore) |
| `hardhat` | Hardhat-specific config or scripts |
| `truffle` | Truffle-specific config or migrations |
| `foundry` | Foundry-specific config or scripts |
| `remix` | Remix IDE-related files |
| `contracts` | Solidity smart contract files |
| `scripts` | Deployment or utility scripts |
| `tests` | Test files |

### Summary Rules

- Use the **imperative mood**: `add`, `fix`, `update`, `remove` — not `added`, `fixes`, `updated`.
- Keep it under **72 characters**.
- Do **not** end with a period.
- Use **lowercase** after the colon — do not capitalize the summary.

### Examples

```
feat(exp-01): add SimpleStorage contract with Hardhat setup
fix(contracts): correct uint overflow in Token.sol transfer function
docs(docs): update BLOCKCHAIN_LAB_MANUAL.md with experiment 3 steps
chore(root): update .gitignore to exclude forge broadcast outputs
exp(exp-04): deploy ERC-20 token to Ganache local network
test(exp-02): add Mocha test suite for Voting contract
config(hardhat): set solidity version to 0.8.21 in hardhat.config.js
refactor(contracts): extract reusable modifier to BaseContract.sol
style(docs): fix markdown table alignment in DEPENDENCY.md
```

### Multi-line Commit Body (optional)

For complex commits, add a blank line after the summary and then a body explaining **why** the
change was made:

```
fix(contracts): prevent re-entrancy in Auction.sol withdraw

The original withdraw() function was vulnerable to re-entrancy attacks.
Applied the Checks-Effects-Interactions pattern and added a nonReentrant
modifier from OpenZeppelin ReentrancyGuard.
```

---

## 4. Pull Request Guidelines

### Before Opening a PR

- [ ] Your branch is up-to-date with `main` — run `git pull origin main` and resolve any conflicts.
- [ ] All Solidity contracts compile without errors (`npx hardhat compile` or `forge build`).
- [ ] Tests pass locally (`npx hardhat test` or `forge test`).
- [ ] No `.env` files, private keys, mnemonics, or secrets are included.
- [ ] Commit history is clean — squash or fixup any WIP/debug commits before opening the PR.

### PR Title Format

Follow the same `<type>(<scope>): <summary>` format used for commit messages:

```
feat(exp-03): add Voting smart contract with Hardhat tests
docs(docs): update BLOCKCHAIN_LAB_MANUAL.md for experiments 1–5
fix(contracts): resolve off-by-one error in Token.sol allowance logic
```

### PR Description Template

When opening a PR, use the following structure in the description:

```markdown
## Summary
<!-- What does this PR add, change, or fix? -->

## Experiment / Scope
<!-- Which experiment(s) or docs are affected? -->

## Changes Made
- 
- 

## Testing
<!-- How was this tested? (Hardhat test, Foundry forge test, Remix deployment, etc.) -->

## Checklist
- [ ] Contracts compile without errors
- [ ] Tests pass locally
- [ ] No secrets or private keys committed
- [ ] Documentation updated if applicable
```

### Review Process

1. Assign **@prathamdxkar** (maintainer) as reviewer.
2. Address all review comments before re-requesting a review.
3. Once approved, the PR will be merged using **Squash and Merge** to keep `main` history clean.
4. Delete your feature branch after a successful merge only if it is a one-off branch. Personal
   branches like `b-yourname` can be kept for ongoing work.

### What PRs Are Accepted

This is primarily a personal academic repository. PRs are accepted for:

- ✅ Corrections to experiment code (bug fixes, security improvements)
- ✅ Documentation improvements (typos, clarity, additional notes)
- ✅ New experiment implementations from the official syllabus
- ✅ Tooling improvements (`.gitignore`, config, scripts)
- ❌ Unrelated features or experiments outside the Mumbai University syllabus
- ❌ Bulk-formatting PRs with no substantive change
- ❌ PRs that include compiled artifacts, `node_modules`, or build outputs

---

## 5. Experiment File Conventions

Organise each lab experiment in its own numbered folder at the root of the repository:

```
blockchain-lab/
├── exp-01-simple-storage/      # Experiment 1 — SimpleStorage with Hardhat
│   ├── contracts/
│   ├── test/
│   ├── hardhat.config.js
│   └── README.md               # Brief experiment overview + run instructions
├── exp-02-voting/              # Experiment 2 — Voting contract
│   └── ...
└── docs/
```

Each experiment folder **must** include a `README.md` with:
- **Aim** — one-line objective of the experiment
- **Tools Used** — e.g., Hardhat, Ganache, Remix
- **Steps to Run** — commands to compile, deploy, and test
- **Expected Output** — description or screenshot of the expected result

---

## 6. Smart Contract & Solidity Standards

- Target **Solidity `^0.8.x`** for all contracts.
- Always specify the exact compiler version in `hardhat.config.js` or `truffle-config.js`.
- Use **SPDX license identifiers** at the top of every `.sol` file:
  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.21;
  ```
- Follow **Checks-Effects-Interactions** pattern to prevent re-entrancy.
- Use **OpenZeppelin** contracts where applicable (ERC-20, ERC-721, ReentrancyGuard, Ownable).
- Write at minimum one Hardhat/Foundry test per contract function that changes state.
- Do **not** leave `console.log` imports (`hardhat/console.sol`) in production-path code.

---

## 7. Security Guidelines

> ⚠️ **Secrets committed to Git history are permanently exposed, even after deletion.**

- Never commit `.env` files — use `.env.example` with placeholder values instead.
- Never commit private keys, wallet mnemonics, or API keys (Alchemy, Infura, Etherscan).
- Never deploy lab contracts to Ethereum mainnet.
- Always use test accounts generated by Hardhat, Ganache, or Anvil for local experiments.
- The `.gitignore` already excludes `.env`, `*.pem`, `*.key`, and `secrets.json` — do not override
  these rules.

---

## 8. Getting Help

If you have questions about setting up the development environment, refer to:

- **[docs/DEPENDENCY.md](docs/DEPENDENCY.md)** — Full tool installation guide (Windows + WSL/Linux)
- **[docs/EXTENSION.md](docs/EXTENSION.md)** — VS Code extensions for Web3 development
- **[docs/BLOCKCHAIN_LAB_MANUAL.md](docs/BLOCKCHAIN_LAB_MANUAL.md)** — Lab manual with experiment procedures

For repository-specific questions or to report an issue, open a
[GitHub Issue](https://github.com/prathamdxkar/blockchain-lab/issues).

---

*Maintained by [Pratham Diwadkar](https://github.com/prathamdxkar) — INFT, Atharva College of Engineering*
