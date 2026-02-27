FILE_LENGTH_TAG=soft

# EXP-1_PLAN — Develop and Establish Local Blockchain using Truffle

> **Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26**
> Single source of truth for implementing Experiment 1. Read completely before writing any code.

---

## Table of Contents

- [EXP-1\_PLAN — Develop and Establish Local Blockchain using Truffle](#exp-1_plan--develop-and-establish-local-blockchain-using-truffle)
  - [Table of Contents](#table-of-contents)
  - [0. Experiment Snapshot](#0-experiment-snapshot)
    - [Network Awareness](#network-awareness)
  - [1. Pre-Flight Checklist](#1-pre-flight-checklist)
    - [1.1 Node \& nvm](#11-node--nvm)
    - [1.2 Global CLI Tools (under Node 22 context)](#12-global-cli-tools-under-node-22-context)
    - [1.3 Ports](#13-ports)
    - [1.4 Environment Files](#14-environment-files)
    - [1.5 Dependencies](#15-dependencies)
  - [2. Repository File Map](#2-repository-file-map)
  - [3. Sequential Development Phases](#3-sequential-development-phases)
    - [Phase 1 — Environment \& Config Verification](#phase-1--environment--config-verification)
    - [Phase 2 — SimpleStorage Contract Development](#phase-2--simplestorage-contract-development)
    - [Phase 3 — Migration \& Deployment Scripts](#phase-3--migration--deployment-scripts)
    - [Phase 4 — Test Suite](#phase-4--test-suite)
    - [Phase 5 — Verification, Screenshots \& Cleanup](#phase-5--verification-screenshots--cleanup)
  - [4. Crucial Development Moments (CDM)](#4-crucial-development-moments-cdm)
      - [CDM-1 — Ganache CLI Port Mismatch _(Phase 1 / Phase 3)_](#cdm-1--ganache-cli-port-mismatch-phase-1--phase-3)
      - [CDM-2 — Node 22 ExperimentalWarning with Truffle _(Phase 1 / Phase 3)_](#cdm-2--node-22-experimentalwarning-with-truffle-phase-1--phase-3)
      - [CDM-3 — Truffle Re-Migration Without `--reset` _(Phase 3)_](#cdm-3--truffle-re-migration-without---reset-phase-3)
      - [CDM-4 — ABI / Artifact Staleness _(Phase 2 → Phase 3, Phase 2 → Phase 4)_](#cdm-4--abi--artifact-staleness-phase-2--phase-3-phase-2--phase-4)
  - [5. Manual Execution Tasks](#5-manual-execution-tasks)
    - [MET-1 — Starting Ganache CLI _(before Phase 3)_](#met-1--starting-ganache-cli-before-phase-3)
  - [6. Verification Checklist](#6-verification-checklist)
    - [6.1 Compilation \& Build](#61-compilation--build)
    - [6.2 Deployment](#62-deployment)
    - [6.3 Tests](#63-tests)
    - [6.4 Screenshot Capture](#64-screenshot-capture)
    - [6.5 Security \& Hygiene](#65-security--hygiene)
    - [6.6 Documentation](#66-documentation)
  - [7. Known Issues \& Fixes](#7-known-issues--fixes)
    - [Issue-1 — `truffle: command not found`](#issue-1--truffle-command-not-found)
    - [Issue-2 — `ganache-cli: command not found`](#issue-2--ganache-cli-command-not-found)
    - [Issue-3 — Node 22 ExperimentalWarning Flood](#issue-3--node-22-experimentalwarning-flood)
    - [Issue-4 — Hardhat Ignition "Module already deployed"](#issue-4--hardhat-ignition-module-already-deployed)
  - [8. Security Reminders](#8-security-reminders)
  - [9. Git Commit Checkpoints](#9-git-commit-checkpoints)

---

## 0. Experiment Snapshot

| Field | Value |
|-------|-------|
| Experiment | Exp-1 — To Develop and Establish local Blockchain using Truffle |
| Lab Outcome | LO1 — Develop and test smart contract on local Blockchain |
| Bloom's Taxonomy Level | L3, L4 |
| Primary Tool(s) | Truffle v5.11.5, Ganache CLI v7.9.2 |
| Supporting Tool(s) | Hardhat v2.28.6, Hardhat Ignition |
| Solidity Version | 0.8.21 |
| Node Version | v22.22.0 (nvm alias: modern) — set via `.nvmrc = 22` |
| Local Network(s) | Ganache CLI (port 7545 / Chain ID 1337), Hardhat in-process (31337) |
| Testnet | N/A |
| Prerequisite Experiments | None |
| Estimated Phases | 5 |
| FILE_LENGTH_TAG | soft |

### Network Awareness

| Network | Type | Chain ID | Port | Tool | Used In |
|---------|------|----------|------|------|---------|
| `hardhat` (in-process) | Local, ephemeral | 31337 | — | Hardhat | `npx hardhat test`, rapid iteration |
| `ganache` | Local, persistent | 1337 | **7545** | Ganache CLI | Truffle `migrate`, primary dev workflow |
| `ganacheCli` | Local, persistent | 1337 | 8545 | Ganache CLI | Alt port — Hardhat Ignition deploy |
| Sepolia | Testnet | 11155111 | 443 (HTTPS) | — | **Not used in Exp-1** |
| Ropsten / Rinkeby / Goerli | Deprecated | — | — | — | ❌ Shut down — do not reference |

> 📌 **Note** — `truffle-config.js` `development` network is wired to port `7545`. Always launch
> Ganache CLI with `--port 7545` for all Truffle commands. The `ganache` network in
> `hardhat.config.js` also points to `7545`.

---

## 1. Pre-Flight Checklist

Run these checks **before starting Phase 1**. Do not proceed if any item fails.

### 1.1 Node & nvm

- [ ] `nvm --version` confirms nvm ≥ 0.40.x is installed
- [ ] `nvm use 22` succeeds — outputs `Now using node v22.22.0 (npm v10.9.4)`
- [ ] `node --version` inside `Exp-1/` outputs `v22.22.0` (`.nvmrc = 22` respected)

### 1.2 Global CLI Tools (under Node 22 context)

- [ ] `truffle version` → `Truffle v5.11.5 (core: 5.11.5)`, Node `v22.22.0`
- [ ] `ganache --version` → `ganache v7.9.2`
- [ ] `npx hardhat --version` → `2.28.6`

### 1.3 Ports

- [ ] Port `7545` is free — `lsof -i :7545` returns empty *(Ganache CLI — Truffle primary port)*
- [ ] Port `8545` is free — `lsof -i :8545` returns empty *(Ganache CLI alt port)*
- [ ] Port `31337` is free — `lsof -i :31337` returns empty *(Hardhat in-process node)*

### 1.4 Environment Files

- [ ] `Exp-1/.env` does **NOT** appear in `git status` (not staged, not tracked)
- [ ] `Exp-1/.env.example` is present and contains `PRIVATE_KEY`, `GANACHE_URL`, `GANACHE_CLI_URL`,
  `HARDHAT_URL` placeholder keys

### 1.5 Dependencies

- [ ] `Exp-1/node_modules/` exists — if absent, run `cd Exp-1 && npm install`
- [ ] `npx hardhat compile` from `Exp-1/` exits 0 (confirms Hardhat toolchain — no contracts
  required at this stage; will return "Nothing to compile" — that is expected)
- [ ] `truffle compile` from `Exp-1/` exits 0 with no errors

---

## 2. Repository File Map

> **Legend**: `CREATE` — new file | `VERIFY` — read-only reference, no modifications

| # | File Path (relative to `Exp-1/`) | Action | Phase | Purpose |
|---|----------------------------------|--------|-------|---------|
| 1 | `contracts/SimpleStorage.sol` | CREATE | 2 | Primary Solidity smart contract — state variable, setter, getter, event |
| 2 | `migrations/1_deploy_simple_storage.js` | CREATE | 3 | Truffle migration script — deploys `SimpleStorage` to `development` network |
| 3 | `ignition/modules/Deploy.js` | CREATE | 3 | Hardhat Ignition deployment module for `ganache` network |
| 4 | `test/SimpleStorage.test.js` | CREATE | 4 | Hardhat + Mocha test suite for `SimpleStorage` |
| 5 | `hardhat.config.js` | VERIFY | 1 | Confirm `solidity.version = "0.8.21"` and `ganache` network → port `7545` |
| 6 | `truffle-config.js` | VERIFY | 1 | Confirm `development` network: `host 127.0.0.1`, `port 7545`, `network_id "*"` |
| 7 | `package.json` | VERIFY | 1 | Confirm `truffle:migrate`, `deploy:ganache`, `test` npm scripts are present |
| 8 | `.nvmrc` | VERIFY | 1 | Confirm it contains `22` (not `20` or `18`) |
| 9 | `.env.example` | VERIFY | 1 | Confirm no real keys — all values are placeholder strings |
| 10 | `screenshots/fig-1.1-ganache-cli-accounts.png` | CREATE | 5 | Ganache CLI terminal showing 10 test accounts with balance |
| 11 | `screenshots/fig-1.2-truffle-migrate-output.png` | CREATE | 5 | `truffle migrate` deployment output with contract address |
| 12 | `screenshots/fig-1.3-hardhat-test-passing.png` | CREATE | 5 | `npx hardhat test` — all tests passing (X passing, 0 failing) |
| 13 | `EXP-1_PLAN.md` | VERIFY | — | Confirm `FILE_LENGTH_TAG` matches actual line count after writing |

> ⚠️ **Never list or reference**: `node_modules/`, `artifacts/`, `cache/`, `build/`, or any path
> in `.gitignore`. The `screenshots/.gitkeep` placeholder is replaced by real screenshots — do
> not commit `.gitkeep` alongside real screenshot files.

---

## 3. Sequential Development Phases

---

### Phase 1 — Environment & Config Verification

**Goal**: Confirm all tools, versions, and config files are correctly set up before creating any
files.

**Files Touched**: `hardhat.config.js` (VERIFY), `truffle-config.js` (VERIFY), `package.json`
(VERIFY), `.nvmrc` (VERIFY), `.env.example` (VERIFY)

<!-- TOOL: SHELL -->
**Logical Flow**:
1. From `Exp-1/`, run `nvm use 22` — confirm Node `v22.22.0`.
2. Run `truffle version` — confirm `Truffle v5.11.5`, Node `v22.22.0`.
3. Run `ganache --version` — confirm `ganache v7.9.2`.
4. Open `hardhat.config.js` — verify `solidity.version = "0.8.21"` and the `ganache` network
   block: `url: "http://127.0.0.1:7545"` and `chainId: 1337`.
5. Open `truffle-config.js` — verify `development` block: `host: "127.0.0.1"`, `port: 7545`,
   `network_id: "*"`.
6. Open `.nvmrc` — confirm it contains exactly `22`.
7. Run `lsof -i :7545` — confirm port is free before starting Ganache CLI.
8. Run `npm install` from `Exp-1/` if `node_modules/` is absent.

> ⚠️ See **CDM-1** before starting any Ganache CLI process — port `7545` must be passed
> explicitly with `--port 7545` or Truffle migrate will fail with a connection error.

**Exit Criteria**: `truffle version` and `npx hardhat --version` both exit 0 with expected
versions printed. `lsof -i :7545` returns empty.

---

### Phase 2 — SimpleStorage Contract Development

**Goal**: Write the `SimpleStorage.sol` Solidity smart contract that will be deployed to the
local blockchain.

**Files Touched**: `contracts/SimpleStorage.sol` (CREATE)

<!-- TOOL: SOLIDITY -->
**Logical Flow**:
1. Create `contracts/SimpleStorage.sol` with SPDX license identifier and
   `pragma solidity ^0.8.21`.
2. Define one `uint256` private state variable to store the experiment's data value.
3. Define one `event DataStored` that fires on every state mutation — include an `indexed`
   value parameter and an `indexed` sender address parameter.
4. Implement `set(uint256 value)` — `external` — validates that `value > 0`, updates state
   variable, emits `DataStored` event.
5. Implement `get()` — `external view` — returns the current value of the state variable.
6. Compile after writing: `truffle compile` followed by `npx hardhat compile`.

**Logical Hint** (skeleton only — no full implementation):

```solidity
// File: contracts/SimpleStorage.sol  (skeleton — intent only)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract SimpleStorage {
    uint256 private storedData;
    event DataStored(uint256 indexed value, address indexed sender);

    function set(uint256 value) external { /* validate → store → emit */ }
    function get() external view returns (uint256) { /* return storedData */ }
}
```

> ⚠️ See **CDM-4** — Always recompile after any change to `SimpleStorage.sol` before running
> migrate or deploy. Stale `artifacts/` will cause silent failures.

**Exit Criteria**: `truffle compile` outputs `> Compiling ./contracts/SimpleStorage.sol` with
0 errors. `npx hardhat compile` outputs `Compiled 1 Solidity file successfully`.

---

### Phase 3 — Migration & Deployment Scripts

**Goal**: Create the Truffle migration script and the Hardhat Ignition module, then deploy
`SimpleStorage` to the running Ganache CLI blockchain.

**Files Touched**: `migrations/1_deploy_simple_storage.js` (CREATE),
`ignition/modules/Deploy.js` (CREATE)

> 📌 **MET-1 must be completed before this phase** — Ganache CLI must be running on port `7545`
> before any migration or deploy command is executed.

<!-- TOOL: TRUFFLE -->
**Truffle path — Logical Flow**:
1. Create `migrations/1_deploy_simple_storage.js` using the standard Truffle deployer pattern.
2. The file must: `require` the `SimpleStorage` artifact and call `deployer.deploy(SimpleStorage)`.
3. Run: `truffle migrate --network development`.
4. Confirm: transaction hash, block number, contract address, and total cost are printed to
   console.
5. Note the **deployed contract address** — it will be used in manual Truffle Console
   interaction (`truffle console --network development`).

**Logical Hint** (migration skeleton — intent only):

```javascript
// File: migrations/1_deploy_simple_storage.js  (skeleton — intent only)
const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};
```

> ⚠️ See **CDM-3** — If re-running after a prior migration, use
> `truffle migrate --reset --network development` to force re-deployment. Omitting `--reset`
> silently skips already-migrated contracts.

<!-- TOOL: HARDHAT -->
**Hardhat Ignition path — Logical Flow** (secondary, supporting tool):
1. Create `ignition/modules/Deploy.js` using the `buildModule` API from
   `@nomicfoundation/hardhat-ignition/modules`.
2. The module declares `m.contract("SimpleStorage")` and returns the deployed instance.
3. Run: `npm run deploy:ganache` (resolves to
   `npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache`).
4. Confirm: `SimpleStorage#SimpleStorage` address is printed in the deployment summary.

**Logical Hint** (Ignition module skeleton — intent only):

```javascript
// File: ignition/modules/Deploy.js  (skeleton — intent only)
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SimpleStorageModule", (m) => {
  const simpleStorage = m.contract("SimpleStorage");
  return { simpleStorage };
});
```

> ⚠️ See **CDM-4** — If `SimpleStorage.sol` was modified after the last compile, run
> `npx hardhat compile` before `npm run deploy:ganache` to refresh stale artifacts.
> See **Issue-4** — Use `--reset` flag if Ignition reports "Module already deployed".

**Exit Criteria**:
- Truffle path: `truffle migrate --network development` exits 0 — contract address printed.
- Hardhat path: `npm run deploy:ganache` exits 0 — `SimpleStorage#SimpleStorage` address printed.

---

### Phase 4 — Test Suite

**Goal**: Write a Hardhat + Mocha/Chai test suite that verifies `SimpleStorage` contract
functions behave correctly across both state-changing and view paths.

**Files Touched**: `test/SimpleStorage.test.js` (CREATE)

<!-- TOOL: HARDHAT -->
**Hardhat test path — Logical Flow**:
1. Create `test/SimpleStorage.test.js`.
2. Import `ethers` from `"hardhat"` and `expect` from `"chai"` (both bundled in
   `@nomicfoundation/hardhat-toolbox`).
3. In `beforeEach`: deploy a fresh `SimpleStorage` instance via
   `ethers.getContractFactory("SimpleStorage")` → `.deploy()` → `.waitForDeployment()`.
4. Write at minimum **one test per contract function**:
   - `get()` on a fresh deploy returns `0` (default `uint256`).
   - `set(42)` followed by `get()` returns `42`.
   - `set(0)` reverts with the expected require message.
   - `DataStored` event is emitted with the correct `value` and `sender` arguments on `set()`.
5. Run: `npm run test` (resolves to `npx hardhat test`).

**Logical Hint** (test skeleton — intent only):

```javascript
// File: test/SimpleStorage.test.js  (skeleton — intent only)
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("SimpleStorage", function () {
  let simpleStorage;
  beforeEach(async function () { /* deploy fresh instance */ });

  it("get() returns 0 on fresh deploy");
  it("set(42) → get() returns 42");
  it("set(0) reverts");
  it("DataStored event emitted on set()");
});
```

<!-- TOOL: TRUFFLE -->
**Truffle test path — Logical Flow** (secondary, optional):
1. Truffle tests use the same `test/` directory but access contracts via `artifacts.require` and
   the `contract()` wrapper (instead of `describe()`).
2. Run: `npm run truffle:test` (resolves to `truffle test`).
3. Truffle test output format differs visually but both verify the same contract behaviour.

> 📌 **Note** — The primary screenshot capture (Phase 5) uses `npx hardhat test` output because
> it produces clean terminal output. Truffle test is a secondary verification step.

**Exit Criteria**: `npx hardhat test` outputs `X passing (Xms)` with **0 failing** tests.
At minimum 4 test cases must pass.

---

### Phase 5 — Verification, Screenshots & Cleanup

**Goal**: Run the full experiment end-to-end, capture all required screenshots, verify the
repository is clean, and prepare for committing.

**Files Touched**: `screenshots/fig-1.1-ganache-cli-accounts.png` (CREATE),
`screenshots/fig-1.2-truffle-migrate-output.png` (CREATE),
`screenshots/fig-1.3-hardhat-test-passing.png` (CREATE)

<!-- TOOL: SHELL -->
**Logical Flow**:
1. Open a dedicated terminal and start Ganache CLI on port `7545` (follow **MET-1** steps).
2. Take **Screenshot fig-1.1** — capture the Ganache CLI terminal showing 10 test accounts with
   their addresses and balances.
3. From `Exp-1/`, run `truffle compile` then `truffle migrate --network development`.
4. Take **Screenshot fig-1.2** — capture the full `truffle migrate` output (compilation summary
   + deployment block with transaction hash, block number, contract address, ETH cost).
5. Run `npm run test` (`npx hardhat test`).
6. Take **Screenshot fig-1.3** — capture the Hardhat test output showing `X passing`.
7. Save all screenshots to `Exp-1/screenshots/` using the exact naming convention:
   - `fig-1.1-ganache-cli-accounts.png`
   - `fig-1.2-truffle-migrate-output.png`
   - `fig-1.3-hardhat-test-passing.png`
8. Delete `screenshots/.gitkeep` once real screenshots are saved (the directory stays tracked
   via the screenshot files themselves).
9. Run `npm run format` to apply Prettier formatting to all `.sol`, `.js`, `.json` files.
10. Run `git status` — confirm only intentionally created files appear (no `artifacts/`,
    `cache/`, `build/`, `node_modules/`).
11. Confirm `Exp-1/.env` is **not** present in `git status`.

> ⚠️ Screenshot naming **must** follow `fig-X.Y-kebab-case-description.png` exactly — these
> filenames are referenced directly in `EXP-1_DOC.md` OUTPUT section.

**Exit Criteria**: `git status` shows only the intentional new files: `SimpleStorage.sol`,
migration script, Ignition module, test file, and the three screenshots. No unintended files
staged or unstaged.

---

## 4. Crucial Development Moments (CDM)

> ⚠️ Read every CDM before starting the corresponding phase. These are the most common failure
> points in Experiment 1.

---

#### CDM-1 — Ganache CLI Port Mismatch _(Phase 1 / Phase 3)_

**Risk**: Ganache CLI starts on the wrong port, causing `truffle migrate` to fail with
`Could not connect to your Ethereum client`.

**Why it matters**: `truffle-config.js` `development` network is hardcoded to port `7545`.
Ganache CLI defaults to port `8545` if launched without `--port`. The mismatch produces a silent
"connection refused" error that does not indicate a port number — it looks like Ganache is not
running, even when it is.

**What to do**:
- Always launch Ganache CLI with the explicit port flag:
  ```bash
  ganache --port 7545 --chain.chainId 1337 --accounts 10 --defaultBalanceEther 1000
  ```
- Verify Ganache is on the correct port: `lsof -i :7545` should show the `ganache` process.
- Verify `truffle-config.js` `development.port` is `7545` before migrating.

**Common Mistake**: Running `ganache` without any flags (starts on `8545`) and then running
`truffle migrate` — the migration exits with a connection error and no useful port hint.

---

#### CDM-2 — Node 22 ExperimentalWarning with Truffle _(Phase 1 / Phase 3)_

**Risk**: Running Truffle under Node v22 floods the terminal with
`ExperimentalWarning: VM Modules is an experimental feature` messages, which may be mistaken for
compilation or migration errors.

**Why it matters**: These warnings are **not errors** — Truffle v5.11.5 is compatible with Node
v22.22.0. However, if ignored, they can obscure real error messages in the same terminal session.

**What to do**:
- Recognise the warning pattern: `ExperimentalWarning: VM Modules is an experimental feature
  and might change at any time`.
- If the output is unreadable, suppress warnings with:
  ```bash
  NODE_OPTIONS=--no-warnings truffle migrate --network development
  ```
- Verify the actual exit code: `echo $?` — `0` means success regardless of warning noise.

**Common Mistake**: Stopping the migration because of red/yellow warning text, assuming the
experiment has failed, when Truffle actually completed successfully.

---

#### CDM-3 — Truffle Re-Migration Without `--reset` _(Phase 3)_

**Risk**: Re-running `truffle migrate --network development` after a prior migration silently
skips already-deployed contracts, resulting in the old contract address remaining active.

**Why it matters**: After modifying `SimpleStorage.sol`, a developer expects a fresh deployment
with a new address. Without `--reset`, Truffle sees the contract as already migrated and skips
it. The old `artifacts/` remains, and the developer unknowingly tests against the old bytecode.

**What to do**:
- Any time you modify `SimpleStorage.sol` and need to redeploy: use `--reset`:
  ```bash
  truffle migrate --reset --network development
  ```
- After `--reset`, the console output shows `Replacing 'SimpleStorage'` — confirming a fresh
  deploy.
- Verification: the printed contract address should differ from the previous deploy.

**Common Mistake**: Running `truffle migrate` without `--reset` after a contract change, then
wondering why the new logic is not reflected in test results.

---

#### CDM-4 — ABI / Artifact Staleness _(Phase 2 → Phase 3, Phase 2 → Phase 4)_

**Risk**: Modifying `SimpleStorage.sol` after compilation but before running migrate or tests
causes the `artifacts/` (Hardhat) and `build/contracts/` (Truffle) directories to contain stale
ABIs, leading to silent failures or `TypeError: contract.set is not a function` errors.

**Why it matters**: Both Truffle and Hardhat scripts rely on the ABI in their respective
artifacts directories. A stale ABI does not match the compiled bytecode on-chain. Errors from
ABI mismatches are not always obvious — they may appear as unexpected reverts or missing function
errors.

**What to do**:
- Rule: **Always compile before migrate or test**:
  ```bash
  truffle compile && truffle migrate --reset --network development
  # or
  npx hardhat compile && npm run deploy:ganache
  ```
- Truffle stores artifacts in `build/contracts/` (NOT tracked in git — in `.gitignore`).
- Hardhat stores artifacts in `artifacts/` (NOT tracked in git — in `.gitignore`).
- If artifacts are deleted or corrupted, simply re-run compile then migrate.

**Common Mistake**: Editing `SimpleStorage.sol`, forgetting to compile, then running tests and
seeing `TypeError` or unexpected revert errors that point to the test file rather than the
missing recompile step.

---

## 5. Manual Execution Tasks

These steps must be performed **by hand** by the developer. They cannot be automated by scripts.

---

### MET-1 — Starting Ganache CLI _(before Phase 3)_

1. Open a **dedicated terminal window** — keep this terminal open throughout Phases 3–5.
2. Navigate to any directory (Ganache CLI is a global tool, not project-specific).
3. Run:
   ```bash
   ganache --port 7545 --chain.chainId 1337 --accounts 10 --defaultBalanceEther 1000
   ```
4. Confirm the output shows `listening on 127.0.0.1:7545` and lists 10 accounts, each with
   `(1000 ETH)` balance and a corresponding private key.
5. Note the **first account address** (Account `(0)`) — this is the default deployer account
   used by Truffle migrations and Hardhat scripts unless overridden.
6. Note the **mnemonic phrase** printed at startup — this is used if you need to import accounts
   into MetaMask in later experiments.
7. Keep this terminal running — **do not close it** until Phase 5 is complete and all screenshots
   have been captured.

> 📌 **Note** — Each Ganache CLI restart creates a fresh blockchain (new accounts, new state).
> Use `--db ./ganache-db` flag to persist blockchain state across restarts if needed for extended
> sessions. For Exp-1, a fresh chain per session is fine.

---

## 6. Verification Checklist

Complete every item before committing the final state of this experiment.

### 6.1 Compilation & Build

- [ ] `truffle compile` → `> Compiled successfully using: solc: 0.8.21` — 0 errors
- [ ] `npx hardhat compile` → `Compiled 1 Solidity file successfully` — 0 errors, 0 unexpected
  warnings

### 6.2 Deployment

- [ ] `truffle migrate --network development` exits 0 — contract address printed in summary
- [ ] `npm run deploy:ganache` exits 0 — `SimpleStorage#SimpleStorage` address printed
- [ ] Deployed contract address is noted (for Truffle Console interaction if needed)

### 6.3 Tests

- [ ] `npm run test` (`npx hardhat test`) → `X passing (Xms)` with **0 failing**
- [ ] At least 4 test cases covering: fresh deploy `get()`, `set()` round-trip, `set(0)` revert,
  `DataStored` event emission

### 6.4 Screenshot Capture

- [ ] `screenshots/fig-1.1-ganache-cli-accounts.png` — Ganache CLI showing 10 accounts + ETH
  balance
- [ ] `screenshots/fig-1.2-truffle-migrate-output.png` — `truffle migrate` deployment summary
  with contract address
- [ ] `screenshots/fig-1.3-hardhat-test-passing.png` — `npx hardhat test` showing `X passing`
- [ ] All screenshots named as `fig-1.Y-kebab-case.png` (kebab-case, no spaces, correct index)
- [ ] `screenshots/.gitkeep` deleted after real screenshots are saved

### 6.5 Security & Hygiene

- [ ] `Exp-1/.env` is **absent** — `git status` shows no `.env` file
- [ ] No private keys or mnemonics appear in any committed `.js` or `.sol` file
- [ ] `node_modules/`, `artifacts/`, `cache/`, `build/` are absent from `git status`
- [ ] `git diff --cached` shows no `.env`, `*.pem`, or `*.key` files staged

### 6.6 Documentation

- [ ] `EXP-1_PLAN.md` `FILE_LENGTH_TAG` matches actual line count (`soft` < 1,000 lines)
- [ ] `Exp-1/README.md` steps accurately match the commands used during implementation

---

## 7. Known Issues & Fixes

---

### Issue-1 — `truffle: command not found`

**Symptom**: Running `truffle version` outputs `bash: truffle: command not found`.

**Root Cause**: Truffle was installed under a different Node.js version context in nvm, or was
not installed globally.

**Fix**:
```bash
nvm use 22
npm install -g truffle
truffle version
```

**Reference**: Truffle requires a global install per Node version context in nvm.

---

### Issue-2 — `ganache-cli: command not found`

**Symptom**: Running `ganache-cli` outputs `bash: ganache-cli: command not found`.

**Root Cause**: In Ganache v7+, the CLI binary was renamed from `ganache-cli` to `ganache`. The
old `ganache-cli` package is deprecated and no longer maintained.

**Fix**:
```bash
npm install -g ganache
ganache --version  # should output ganache v7.9.x
```

**Reference**: [Ganache v7 Migration Guide](https://github.com/trufflesuite/ganache/blob/develop/CHANGELOG.md) — `ganache-cli` → `ganache`.

---

### Issue-3 — Node 22 ExperimentalWarning Flood

**Symptom**: Truffle commands flood the terminal with
`(node:XXXXX) ExperimentalWarning: VM Modules is an experimental feature and might change at any
time`.

**Root Cause**: Truffle v5.11.5 uses `--experimental-vm-modules` under Node 22. This is expected
behaviour and does **not** indicate a failure.

**Fix** (if warnings obscure output):
```bash
NODE_OPTIONS=--no-warnings truffle migrate --network development
NODE_OPTIONS=--no-warnings truffle test
```

**Reference**: See [CDM-2](#cdm-2--node-22-experimentalwarning-with-truffle) for full context.

---

### Issue-4 — Hardhat Ignition "Module already deployed"

**Symptom**: `npm run deploy:ganache` (Ignition) reports `SimpleStorageModule is already
deployed` and does not redeploy.

**Root Cause**: Hardhat Ignition stores deployment state in `ignition/deployments/`. On
subsequent runs, it detects the module as already deployed and skips it.

**Fix**:
```bash
# Option A — use --reset flag
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache --reset

# Option B — delete the cached deployment state manually
rm -rf ignition/deployments/
npm run deploy:ganache
```

> 📌 `ignition/deployments/` only contains Hardhat Ignition cached deployment state — deleting
> it is safe and does not affect source code. Make sure your `.gitignore` ignores experiment
> subdirectory caches as well (for example, by adding `**/ignition/deployments/`) so
> `Exp-1/ignition/deployments/` is not committed.

---

## 8. Security Reminders

> ⚠️ These rules are non-negotiable. A PR will be rejected if any of these are violated.

- **Never** commit `.env` to Git. Use `.env.example` with placeholder values only.
- **Never** use a wallet with real ETH for any experiment — use dedicated test accounts from
  Ganache CLI output only.
- **Never** deploy to Ethereum Mainnet — Exp-1 targets local blockchain only.
- **Always** use test private keys generated by Ganache CLI (`ganache --port 7545 ...`) for any
  local signing operations.
- **Always** verify that `git diff --cached` shows no `.env`, `*.pem`, or `*.key` files before
  committing.
- Ganache CLI private keys are **ephemeral** — they are regenerated on every CLI restart unless
  `--db` is used. Never treat them as persistent credentials.

---

## 9. Git Commit Checkpoints

Commit at each checkpoint. Use the exact format: `<type>(<scope>): <summary>`

| Checkpoint | After Completing | Suggested Commit Message |
|-----------|-----------------|--------------------------|
| CP-1 | Phase 1 — Config verified | `config(exp-1): verify hardhat and truffle config for exp-1` |
| CP-2 | Phase 2 — Contract written | `feat(exp-1): add SimpleStorage.sol with set, get, and DataStored event` |
| CP-3 | Phase 3 — Migration + Ignition scripts | `exp(exp-1): add truffle migration and hardhat ignition deploy scripts` |
| CP-4 | Phase 4 — Tests written | `test(exp-1): add hardhat mocha test suite for SimpleStorage` |
| CP-5 | Phase 5 — Screenshots captured | `exp(exp-1): verify SimpleStorage deploys and tests pass on local network` |
| CP-6 | All phases — Final cleanup | `chore(exp-1): add screenshots, remove .gitkeep, format code, finalize exp-1` |

> 📌 Commit messages are **suggestions** — adapt the summary to reflect actual work done.
> Never commit a checkpoint with failing tests or compile errors. The `<scope>` must be `exp-1`.

---

*Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26*
*Governed by [docs/PLAN_RULE.md](../docs/PLAN_RULE.md)*

