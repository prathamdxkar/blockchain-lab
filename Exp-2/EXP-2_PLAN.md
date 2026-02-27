FILE_LENGTH_TAG=soft

# EXP-2_PLAN — Develop and Establish Smart Contract and Chain Code

> **Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26**
> Single source of truth for implementing Experiment 2. Read completely before writing any code.

---

## Table of Contents

- [EXP-2\_PLAN — Develop and Establish Smart Contract and Chain Code](#exp-2_plan--develop-and-establish-smart-contract-and-chain-code)
  - [Table of Contents](#table-of-contents)
  - [0. Experiment Snapshot](#0-experiment-snapshot)
    - [Network Awareness](#network-awareness)
  - [1. Pre-Flight Checklist](#1-pre-flight-checklist)
    - [1.1 Node \& nvm](#11-node--nvm)
    - [1.2 Global CLI Tools (under Node 24 context)](#12-global-cli-tools-under-node-24-context)
    - [1.3 Ports](#13-ports)
    - [1.4 Environment Files](#14-environment-files)
    - [1.5 Dependencies](#15-dependencies)
  - [2. Repository File Map](#2-repository-file-map)
  - [3. Sequential Development Phases](#3-sequential-development-phases)
    - [Phase 1 — Environment \& Config Verification](#phase-1--environment--config-verification)
    - [Phase 2 — Voting Contract Development](#phase-2--voting-contract-development)
    - [Phase 3 — JS Chaincode Skeleton](#phase-3--js-chaincode-skeleton)
    - [Phase 4 — Migration \& Deployment Scripts](#phase-4--migration--deployment-scripts)
    - [Phase 5 — Test Suite](#phase-5--test-suite)
    - [Phase 6 — Truffle Console Interaction](#phase-6--truffle-console-interaction)
    - [Phase 7 — Verification, Screenshots \& Cleanup](#phase-7--verification-screenshots--cleanup)
  - [4. Crucial Development Moments (CDM)](#4-crucial-development-moments-cdm)
      - [CDM-1 — Ganache CLI Port Mismatch _(Phase 1 / Phase 4)_](#cdm-1--ganache-cli-port-mismatch-phase-1--phase-4)
      - [CDM-2 — Double-Vote Guard in castVote _(Phase 2)_](#cdm-2--double-vote-guard-in-castvote-phase-2)
      - [CDM-3 — Node ExperimentalWarning with Truffle _(Phase 4 / Phase 6)_](#cdm-3--node-experimentalwarning-with-truffle-phase-4--phase-6)
      - [CDM-4 — ABI / Artifact Staleness _(Phase 2 → Phase 4, Phase 2 → Phase 5)_](#cdm-4--abi--artifact-staleness-phase-2--phase-4-phase-2--phase-5)
      - [CDM-5 — Constructor Args in Hardhat Ignition _(Phase 4)_](#cdm-5--constructor-args-in-hardhat-ignition-phase-4)
  - [5. Manual Execution Tasks](#5-manual-execution-tasks)
    - [MET-1 — Starting Ganache CLI _(before Phase 4)_](#met-1--starting-ganache-cli-before-phase-4)
    - [MET-2 — Truffle Console Interaction _(Phase 6)_](#met-2--truffle-console-interaction-phase-6)
  - [6. Verification Checklist](#6-verification-checklist)
    - [6.1 Compilation \& Build](#61-compilation--build)
    - [6.2 Chaincode Skeleton](#62-chaincode-skeleton)
    - [6.3 Deployment](#63-deployment)
    - [6.4 Tests](#64-tests)
    - [6.5 Screenshot Capture](#65-screenshot-capture)
    - [6.6 Security \& Hygiene](#66-security--hygiene)
    - [6.7 Documentation](#67-documentation)
  - [7. Known Issues \& Fixes](#7-known-issues--fixes)
    - [Issue-1 — `truffle: command not found`](#issue-1--truffle-command-not-found)
    - [Issue-2 — `ganache-cli: command not found`](#issue-2--ganache-cli-command-not-found)
    - [Issue-3 — Node ExperimentalWarning Flood](#issue-3--node-experimentalwarning-flood)
    - [Issue-4 — Hardhat Ignition "Module already deployed"](#issue-4--hardhat-ignition-module-already-deployed)
  - [8. Security Reminders](#8-security-reminders)
  - [9. Git Commit Checkpoints](#9-git-commit-checkpoints)

---

## 0. Experiment Snapshot

| Field | Value |
|-------|-------|
| Experiment | Exp-2 — To Develop and Establish smart contract and chain code |
| Lab Outcome | LO2 — Develop and test smart contract on Ethereum test networks |
| Bloom's Taxonomy Level | L3, L4 |
| Primary Tool(s) | Truffle v5.11.5, Ganache CLI v7.9.1 |
| Supporting Tool(s) | Hardhat v2.28.6, Hardhat Ignition, Web3.js (via Truffle console) |
| Solidity Version | 0.8.21 |
| Node Version | v24.x.x — set via `.nvmrc = 24` |
| Local Network(s) | Ganache CLI (port 7545 / Chain ID 1337), Hardhat in-process (31337) |
| Testnet | N/A |
| Prerequisite Experiments | Exp-1 (Truffle + Ganache toolchain established) |
| Estimated Phases | 7 phases |
| FILE_LENGTH_TAG | soft |

> 📌 **Note** — Exp-2 inherits the complete Truffle + Ganache + Hardhat toolchain from Exp-1.
> All config files (`hardhat.config.js`, `truffle-config.js`, `package.json`, `.nvmrc`) are
> already correctly set up in `Exp-2/`. Phase 1 is a verification pass — not a setup pass.

---

### Network Awareness

| Network | Type | Chain ID | Port | Tool | Used In |
|---------|------|----------|------|------|---------|
| `hardhat` (in-process) | Local, ephemeral | 31337 | — | Hardhat | `npx hardhat test`, rapid iteration |
| `ganache` | Local, persistent | 1337 | **7545** | Ganache CLI | Truffle `migrate`, Truffle console, primary workflow |
| `ganacheCli` | Local, persistent | 1337 | 8545 | Ganache CLI | Alt port — Hardhat Ignition deploy |
| Sepolia | Testnet | 11155111 | 443 (HTTPS) | — | **Not used in Exp-2** |
| Ropsten / Rinkeby / Goerli | Deprecated | — | — | — | ❌ Shut down — do not reference |

> 📌 **Note** — `truffle-config.js` `development` network is wired to port `7545`. Always launch
> Ganache CLI with `--port 7545` for all Truffle commands. The `ganache` network in
> `hardhat.config.js` also points to `7545`.

---

## 1. Pre-Flight Checklist

Run these checks **before starting Phase 1**. Do not proceed if any item fails.

### 1.1 Node & nvm

- [ ] `nvm --version` confirms nvm ≥ 0.40.x is installed
- [ ] `nvm use 24` succeeds — outputs `Now using node v24.x.x (npm v10.x.x)`
- [ ] `node --version` inside `Exp-2/` outputs `v24.x.x` (`.nvmrc = 24` respected)

### 1.2 Global CLI Tools (under Node 24 context)

- [ ] `truffle version` → `Truffle v5.11.5 (core: 5.11.5)`, Node `v24.x.x`
- [ ] `ganache --version` → `ganache v7.9.1`
- [ ] `npx hardhat --version` → `2.28.x`

### 1.3 Ports

- [ ] Port `7545` is free — `lsof -i :7545` returns empty *(Ganache CLI — Truffle primary port)*
- [ ] Port `8545` is free — `lsof -i :8545` returns empty *(Ganache CLI alt port)*
- [ ] Port `31337` is free — `lsof -i :31337` returns empty *(Hardhat in-process node)*

### 1.4 Environment Files

- [ ] `Exp-2/.env` does **NOT** appear in `git status` (not staged, not tracked)
- [ ] `Exp-2/.env.example` is present and contains `PRIVATE_KEY`, `GANACHE_URL`,
  `GANACHE_CLI_URL`, `HARDHAT_URL` placeholder keys

### 1.5 Dependencies

- [ ] `Exp-2/node_modules/` exists — if absent, run `cd Exp-2 && npm install`
- [ ] `npx hardhat compile` from `Exp-2/` exits 0 (no contracts yet — "Nothing to compile" is
  expected and acceptable at this stage)
- [ ] `truffle compile` from `Exp-2/` exits 0 (no contracts yet — "0 contracts compiled" is
  expected and acceptable at this stage)

---

## 2. Repository File Map

> **Legend**: `CREATE` — new file | `UPDATE` — modify existing | `VERIFY` — read-only reference

| # | File Path (relative to `Exp-2/`) | Action | Phase | Purpose |
|---|----------------------------------|--------|-------|---------|
| 1 | `contracts/Voting.sol` | CREATE | 2 | Primary Solidity smart contract — candidate struct, vote mapping, events, owner pattern |
| 2 | `chaincode/javascript/index.js` | CREATE | 3 | HLF chaincode entry point — requires `./lib/Voting` and exports chaincode class |
| 3 | `chaincode/javascript/package.json` | CREATE | 3 | Chaincode package manifest — declares `fabric-contract-api` dependency stub |
| 4 | `chaincode/javascript/lib/Voting.js` | CREATE | 3 | HLF chaincode contract class — `castVote` and `getResults` stub methods |
| 5 | `migrations/1_deploy_voting.js` | CREATE | 4 | Truffle migration script — deploys `Voting` to `development` network |
| 6 | `ignition/modules/Deploy.js` | CREATE | 4 | Hardhat Ignition module — deploys `Voting` with constructor candidate names array |
| 7 | `test/Voting.test.js` | CREATE | 5 | Hardhat + Mocha/Chai test suite — 6 test cases covering all contract paths |
| 8 | `hardhat.config.js` | VERIFY | 1 | Confirm `solidity.version = "0.8.21"` and `ganache` network → port `7545` |
| 9 | `truffle-config.js` | VERIFY | 1 | Confirm `development` network: `host 127.0.0.1`, `port 7545`, `network_id "*"` |
| 10 | `package.json` | VERIFY | 1 | Confirm `truffle:migrate`, `deploy:ganache`, `test` npm scripts are present |
| 11 | `.nvmrc` | VERIFY | 1 | Confirm it contains `22` |
| 12 | `.env.example` | VERIFY | 1 | Confirm no real keys — all values are placeholder strings |
| 13 | `screenshots/fig-2.1-truffle-migrate-output.png` | CREATE | 7 | `truffle migrate` deployment summary with contract address |
| 14 | `screenshots/fig-2.2-hardhat-test-passing.png` | CREATE | 7 | `npx hardhat test` — all tests passing (X passing, 0 failing) |
| 15 | `screenshots/fig-2.3-truffle-console-interaction.png` | CREATE | 7 | Truffle console session — `castVote`, `getCandidates`, `getWinner` calls |
| 16 | `EXP-2_PLAN.md` | VERIFY | — | Confirm `FILE_LENGTH_TAG` matches actual line count after writing |

> ⚠️ **Never list or reference**: `node_modules/`, `artifacts/`, `cache/`, `build/`, or any path
> in `.gitignore`. The `screenshots/.gitkeep` placeholder is replaced by real screenshots — do
> not commit `.gitkeep` alongside real screenshot files.
>
> 📌 **Chaincode note** — The `chaincode/javascript/` files are a **conceptual skeleton only**.
> They demonstrate the HLF chaincode structure and how it parallels a Solidity smart contract.
> Full deployment on Hyperledger Fabric is covered in **Exp-5**.

---

## 3. Sequential Development Phases

---

### Phase 1 — Environment & Config Verification

**Goal**: Confirm all tools, versions, and config files are correctly set up before creating any
new files. This is a verification pass — no config changes are expected.

**Files Touched**: `hardhat.config.js` (VERIFY), `truffle-config.js` (VERIFY), `package.json`
(VERIFY), `.nvmrc` (VERIFY), `.env.example` (VERIFY)

<!-- TOOL: SHELL -->
**Logical Flow**:
1. From `Exp-2/`, run `nvm use 24` — confirm Node `v24.x.x`.
2. Run `truffle version` — confirm `Truffle v5.11.5`, Node `v24.x.x`.
3. Run `ganache --version` — confirm `ganache v7.9.1`.
4. Run `npx hardhat --version` — confirm `2.28.x`.
5. Open `hardhat.config.js` — verify `solidity.version = "0.8.21"` and the `ganache` network
   block: `url: "http://127.0.0.1:7545"` and `chainId: 1337`.
6. Open `truffle-config.js` — verify `development` block: `host: "127.0.0.1"`, `port: 7545`,
   `network_id: "*"`.
7. Open `.nvmrc` — confirm it contains exactly `24`.
8. Run `lsof -i :7545` — confirm port is free before starting Ganache CLI in Phase 4.
9. Run `npm install` from `Exp-2/` if `node_modules/` is absent.

> ⚠️ See **CDM-1** — port `7545` must be passed explicitly when starting Ganache CLI or Truffle
> migrate will fail with a connection refused error.

**Exit Criteria**: `truffle version` and `npx hardhat --version` both exit 0 with expected
versions printed. `lsof -i :7545` returns empty.

---

### Phase 2 — Voting Contract Development

**Goal**: Write the `Voting.sol` Solidity smart contract that implements candidate registration,
vote casting with double-vote protection, and winner determination.

**Files Touched**: `contracts/Voting.sol` (CREATE)

<!-- TOOL: SOLIDITY -->
**Logical Flow**:
1. Create `contracts/Voting.sol` with SPDX license identifier and `pragma solidity ^0.8.21`.
2. Define a `struct Candidate` with two fields: `string name` and `uint256 voteCount`.
3. Declare a `Candidate[]` dynamic public array named `candidates` to hold all registered
   candidates.
4. Declare a `mapping(address => bool)` named `hasVoted` to prevent the same address from
   voting more than once.
5. Declare `address public owner` — set in the constructor to `msg.sender`.
6. Define a `modifier onlyOwner()` that reverts if `msg.sender != owner`.
7. Implement the constructor — accepts `string[] memory candidateNames` and pushes each name
   as a new `Candidate` with `voteCount = 0` into the `candidates` array.
8. Implement `addCandidate(string memory name)` — `external onlyOwner` — pushes a new
   `Candidate` to the array and emits `CandidateAdded`.
9. Implement `castVote(uint256 candidateIndex)` — `external` — reverts if `hasVoted[msg.sender]`
   is `true`, reverts if `candidateIndex >= candidates.length`, increments
   `candidates[candidateIndex].voteCount`, sets `hasVoted[msg.sender] = true`, emits `VoteCast`.
10. Implement `getCandidates()` — `external view` — returns the full `candidates` array.
11. Implement `getWinner()` — `external view` — iterates `candidates`, tracks the highest
    `voteCount` index, returns the winning `Candidate` struct.
12. Define events: `CandidateAdded(string indexed name)` and
    `VoteCast(uint256 indexed candidateIndex, address indexed voter)`.
13. Compile after each major addition: `truffle compile` and `npx hardhat compile`.

**Logical Hint** (skeleton only — no full implementation):

```solidity
// File: contracts/Voting.sol  (skeleton — intent only)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Voting {
    struct Candidate { string name; uint256 voteCount; }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    address public owner;

    event CandidateAdded(string indexed name);
    event VoteCast(uint256 indexed candidateIndex, address indexed voter);

    modifier onlyOwner() { /* require msg.sender == owner */ _;  }

    constructor(string[] memory candidateNames) { /* push each name as Candidate */ }
    function addCandidate(string memory name) external onlyOwner { /* push → emit */ }
    function castVote(uint256 candidateIndex) external { /* guard → tally → emit */ }
    function getCandidates() external view returns (Candidate[] memory) { /* return array */ }
    function getWinner() external view returns (Candidate memory) { /* iterate → find max */ }
}
```

> ⚠️ See **CDM-2** — The `hasVoted` guard inside `castVote` is the single most critical
> correctness requirement. Any missing or incorrectly ordered check allows unlimited votes per
> address, making the contract semantically broken.
>
> ⚠️ See **CDM-4** — Always recompile after any change to `Voting.sol` before running migrate
> or tests. Stale `artifacts/` will cause silent failures.

**Exit Criteria**: `truffle compile` outputs `> Compiled successfully` with 0 errors.
`npx hardhat compile` outputs `Compiled 1 Solidity file successfully`.

---

### Phase 3 — JS Chaincode Skeleton

**Goal**: Create a conceptual Hyperledger Fabric chaincode skeleton in JavaScript that mirrors
the `Voting.sol` contract's interface. This demonstrates the parallel relationship between
Solidity smart contracts (Ethereum) and chaincode (Hyperledger Fabric). **No HLF deployment
occurs in Exp-2** — that is the domain of Exp-5.

**Files Touched**: `chaincode/javascript/index.js` (CREATE),
`chaincode/javascript/package.json` (CREATE),
`chaincode/javascript/lib/Voting.js` (CREATE)

<!-- TOOL: FABRIC -->
**Logical Flow**:
1. Create the directory tree: `chaincode/javascript/` and `chaincode/javascript/lib/`.
2. Create `chaincode/javascript/index.js` — this is the chaincode entry point. It requires
   `./lib/Voting` and exports the chaincode class for the Fabric peer to discover.
3. Create `chaincode/javascript/lib/Voting.js` — the main chaincode contract class. It must:
   - Import `Contract` from `fabric-contract-api`.
   - Define a class `VotingChaincode` that `extends Contract`.
   - Implement a stub `async castVote(ctx, candidateId)` method — reads world state via
     `ctx.stub.getState(candidateId)`, updates vote count, writes back via
     `ctx.stub.putState(candidateId, updatedValue)`.
   - Implement a stub `async getResults(ctx)` method — reads all candidate records and
     returns a JSON stringified results array.
4. Create `chaincode/javascript/package.json` — declare `name: "voting-chaincode"`,
   `version: "1.0.0"`, `main: "index.js"`, and list `fabric-contract-api: "^2.4.0"` as a
   dependency stub (not installed in Exp-2 — listed for Exp-5 reference).
5. Verify directory structure matches:
   ```
   chaincode/
   └── javascript/
       ├── index.js
       ├── package.json
       └── lib/
           └── Voting.js
   ```

**Logical Hint** — `chaincode/javascript/lib/Voting.js` (skeleton only):

```javascript
// File: chaincode/javascript/lib/Voting.js  (skeleton — intent only)
"use strict";
const { Contract } = require("fabric-contract-api");

class VotingChaincode extends Contract {
  async castVote(ctx, candidateId) {
    // read world state → parse → increment voteCount → putState
  }

  async getResults(ctx) {
    // getAllResults iterator → collect → return JSON string
  }
}

module.exports = VotingChaincode;
```

**Logical Hint** — `chaincode/javascript/index.js` (skeleton only):

```javascript
// File: chaincode/javascript/index.js  (skeleton — intent only)
"use strict";
const VotingChaincode = require("./lib/Voting");
module.exports.contracts = [VotingChaincode];
```

> 📌 **Note** — `fabric-contract-api` is intentionally **not** installed in `Exp-2/node_modules`.
> The chaincode files are structural reference only. Running `require("fabric-contract-api")` in
> this context will fail — this is expected and acceptable in Exp-2. Full HLF execution is
> covered in **Exp-5**.
>
> 📌 **Note** — This chaincode skeleton mirrors the structure seen in
> `Exp-5/chaincode/javascript/` for cross-experiment continuity. Authors working on Exp-5 can
> evolve this skeleton into a deployable chaincode.

**Exit Criteria**: All three chaincode files exist at the expected paths. `package.json` is
valid JSON — verify with `node -e "require('./chaincode/javascript/package.json')"` from
`Exp-2/`.

---

### Phase 4 — Migration & Deployment Scripts

**Goal**: Create the Truffle migration script and the Hardhat Ignition module, then deploy
`Voting` to the running Ganache CLI blockchain.

**Files Touched**: `migrations/1_deploy_voting.js` (CREATE),
`ignition/modules/Deploy.js` (CREATE)

> 📌 **MET-1 must be completed before this phase** — Ganache CLI must be running on port `7545`
> before any `truffle migrate` or `npm run deploy:ganache` command is executed.

<!-- TOOL: TRUFFLE -->
**Truffle path — Logical Flow**:
1. Create `migrations/1_deploy_voting.js` using the standard Truffle deployer pattern.
2. The file must: `require` the `Voting` artifact and call `deployer.deploy(Voting, [...names])`
   — passing an initial array of candidate name strings (e.g., `["Alice", "Bob", "Charlie"]`)
   as the constructor argument.
3. Run: `truffle migrate --network development`.
4. Confirm: transaction hash, block number, contract address, and total cost are printed.
5. Note the **deployed contract address** — it will be used in the Truffle console (Phase 6).

**Logical Hint** (migration skeleton — intent only):

```javascript
// File: migrations/1_deploy_voting.js  (skeleton — intent only)
const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  deployer.deploy(Voting, ["Alice", "Bob", "Charlie"]);
};
```

> ⚠️ See **CDM-3** — If re-running after a prior migration, use
> `truffle migrate --reset --network development` to force re-deployment. Omitting `--reset`
> silently skips already-migrated contracts.

<!-- TOOL: HARDHAT -->
**Hardhat Ignition path — Logical Flow** (secondary, supporting tool):
1. Create `ignition/modules/Deploy.js` using the `buildModule` API from
   `@nomicfoundation/hardhat-ignition/modules`.
2. The module declares `m.contract("Voting", [["Alice", "Bob", "Charlie"]])` — the second
   argument is the constructor args array. The inner array is the `string[] memory candidateNames`
   parameter.
3. Return the deployed `voting` instance from the module.
4. Run: `npm run deploy:ganache` (resolves to
   `npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache`).
5. Confirm: `VotingModule#Voting` address is printed in the deployment summary.

**Logical Hint** (Ignition module skeleton — intent only):

```javascript
// File: ignition/modules/Deploy.js  (skeleton — intent only)
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VotingModule", (m) => {
  const voting = m.contract("Voting", [["Alice", "Bob", "Charlie"]]);
  return { voting };
});
```

> ⚠️ See **CDM-5** — The `Voting` constructor requires a `string[] memory candidateNames`
> argument. In Hardhat Ignition, constructor args are passed as the second argument to
> `m.contract()`. Omitting the array, or passing a flat list of strings instead of a nested
> array, causes a type mismatch revert or a silent empty `candidates` array on-chain.
>
> ⚠️ See **CDM-4** — If `Voting.sol` was modified after the last compile, run
> `npx hardhat compile` before `npm run deploy:ganache` to refresh stale artifacts.

**Exit Criteria**:
- Truffle path: `truffle migrate --network development` exits 0 — contract address printed.
- Hardhat path: `npm run deploy:ganache` exits 0 — `VotingModule#Voting` address printed.

---

### Phase 5 — Test Suite

**Goal**: Write a Hardhat + Mocha/Chai test suite that verifies all `Voting` contract functions
behave correctly — including success paths, revert paths, and event emission.

**Files Touched**: `test/Voting.test.js` (CREATE)

<!-- TOOL: HARDHAT -->
**Logical Flow**:
1. Create `test/Voting.test.js`.
2. Import `ethers` from `"hardhat"` and `expect` from `"chai"` (both bundled in
   `@nomicfoundation/hardhat-toolbox`).
3. In `beforeEach`: deploy a fresh `Voting` instance via
   `ethers.getContractFactory("Voting")` → `.deploy(["Alice", "Bob", "Charlie"])` →
   `.waitForDeployment()`. Capture `owner`, `addr1`, `addr2` from `ethers.getSigners()`.
4. Write at minimum **one test per contract function**, covering:
   - **Initial state**: `getCandidates()` returns 3 entries with `voteCount = 0n` for each.
   - **Successful vote**: `castVote(0)` from `addr1`, then `getCandidates()[0].voteCount`
     equals `1n`.
   - **Double-vote revert**: `castVote(0)` from `addr1` twice — second call reverts with the
     expected revert reason.
   - **Invalid index revert**: `castVote(99)` reverts with the expected revert reason.
   - **VoteCast event**: `castVote(0)` emits `VoteCast` event with `candidateIndex = 0` and
     the voter address equal to `addr1.address`.
   - **getWinner()**: after `castVote(0)` twice from different addresses, `getWinner()` returns
     the candidate at index 0.
5. Run: `npm run test` (resolves to `npx hardhat test`).

**Logical Hint** (test skeleton — intent only):

```javascript
// File: test/Voting.test.js  (skeleton — intent only)
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Voting", function () {
  let voting, owner, addr1, addr2;
  beforeEach(async function () { /* deploy fresh Voting(["Alice","Bob","Charlie"]) */ });

  it("getCandidates() returns 3 candidates with voteCount 0");
  it("castVote(0) increments Alice voteCount to 1");
  it("double castVote reverts");
  it("castVote with invalid index reverts");
  it("VoteCast event emitted with correct args");
  it("getWinner() returns candidate with highest votes");
});
```

<!-- TOOL: TRUFFLE -->
**Truffle test path — Logical Flow** (secondary, optional):
1. Truffle tests share the same `test/` directory but use `artifacts.require("Voting")` and the
   `contract()` wrapper instead of `describe()`.
2. Run: `npm run truffle:test` (resolves to `truffle test`).
3. Truffle test output differs visually but verifies the same contract behaviour.

> 📌 **Note** — The primary screenshot (Phase 7) uses `npx hardhat test` output for clean
> terminal rendering. Truffle test is a secondary verification step.

**Exit Criteria**: `npx hardhat test` outputs `X passing (Xms)` with **0 failing**. At minimum
6 test cases must pass.

---

### Phase 6 — Truffle Console Interaction

**Goal**: Interact with the deployed `Voting` contract in an interactive REPL session via the
Truffle console to demonstrate Web3.js-backed contract interaction against the live Ganache
network.

**Files Touched**: none (interaction only — no new files)

> 📌 **MET-2 covers every step of this phase** in detail. This phase summary provides context;
> the actionable steps are in **MET-2**.

<!-- TOOL: TRUFFLE -->
**Logical Flow**:
1. Ensure Ganache CLI is running on port `7545` (from MET-1).
2. Ensure `Voting` has been deployed to `development` via Phase 4 Truffle path.
3. Open the Truffle console: `truffle console --network development`.
4. Retrieve the deployed contract instance using `Voting.deployed()`.
5. Call `getCandidates()` — verify 3 entries are returned with `voteCount = 0`.
6. Cast a vote with `castVote(0)` — confirm the transaction hash is returned.
7. Call `getCandidates()` again — verify index 0 `voteCount` has incremented to `1`.
8. Call `getWinner()` — confirm it returns the correct leading candidate.
9. Take **Screenshot fig-2.3** — capture the full console session showing at least one `castVote`
   call and one `getCandidates` or `getWinner` response.
10. Exit the console: `.exit`.

> ⚠️ See **CDM-3** (ExperimentalWarning) — the console session may show warning output
> on startup. This does not affect contract interaction.

**Exit Criteria**: Console session exits cleanly. `castVote(0)` produces a transaction object.
`getCandidates()` returns an array of candidate objects with string `name` and BigNumber
`voteCount` fields.

---

### Phase 7 — Verification, Screenshots & Cleanup

**Goal**: Run the full experiment end-to-end, capture all required screenshots, verify the
repository is clean, and prepare for committing.

**Files Touched**: `screenshots/fig-2.1-truffle-migrate-output.png` (CREATE),
`screenshots/fig-2.2-hardhat-test-passing.png` (CREATE),
`screenshots/fig-2.3-truffle-console-interaction.png` (CREATE)

<!-- TOOL: SHELL -->
**Logical Flow**:
1. Ensure Ganache CLI is running on port `7545` (from MET-1).
2. From `Exp-2/`, run `truffle compile` then `truffle migrate --reset --network development`.
3. Take **Screenshot fig-2.1** — capture the full `truffle migrate` output: compilation summary
   + deployment block with transaction hash, block number, contract address, and ETH cost.
4. Run `npm run test` (`npx hardhat test`).
5. Take **Screenshot fig-2.2** — capture the Hardhat test output showing `X passing, 0 failing`.
6. Open Truffle console (follow MET-2) — perform `castVote` and `getCandidates` calls.
7. Take **Screenshot fig-2.3** — capture the console session showing interaction output.
8. Save all screenshots to `Exp-2/screenshots/` using the exact naming convention:
   - `fig-2.1-truffle-migrate-output.png`
   - `fig-2.2-hardhat-test-passing.png`
   - `fig-2.3-truffle-console-interaction.png`
9. Delete `screenshots/.gitkeep` once real screenshots are saved.
10. Run `npm run format` to apply Prettier formatting to all `.sol`, `.js`, `.json` files.
11. Run `git status` — confirm only intentionally created files appear. No `artifacts/`,
    `cache/`, `build/`, or `node_modules/` should be staged.
12. Confirm `Exp-2/.env` is **not** present in `git status`.

> ⚠️ Screenshot naming **must** follow `fig-X.Y-kebab-case-description.png` exactly — these
> filenames are referenced directly in `EXP-2_DOC.md` OUTPUT section.

**Exit Criteria**: `git status` shows only the intentional new files: `Voting.sol`, chaincode
skeleton files, migration script, Ignition module, test file, and the three screenshots. No
unintended files staged or unstaged.

---

## 4. Crucial Development Moments (CDM)

> ⚠️ Read every CDM before starting the corresponding phase. These are the most common failure
> points in Experiment 2.

---

#### CDM-1 — Ganache CLI Port Mismatch _(Phase 1 / Phase 4)_

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

#### CDM-2 — Double-Vote Guard in castVote _(Phase 2)_

**Risk**: Missing or incorrectly ordered `hasVoted` check in `castVote` allows a single address
to call `castVote` unlimited times, inflating vote counts and making `getWinner()` return
incorrect results.

**Why it matters**: The double-vote guard is the primary security invariant of the `Voting`
contract. If omitted, the contract is semantically broken — all state changes succeed but the
business logic is invalid. This error does not produce a compile error or a revert; it silently
produces wrong data.

**What to do**:
- Implement the `hasVoted` check as the **first** statement inside `castVote`:
  ```solidity
  require(!hasVoted[msg.sender], "Already voted");
  ```
- Set `hasVoted[msg.sender] = true` **after** the `candidates[candidateIndex].voteCount++`
  increment — following the Checks-Effects-Interactions pattern.
- Verification: the test case "double castVote reverts" in `test/Voting.test.js` must pass.

**Common Mistake**: Writing `hasVoted[msg.sender] = true` at the top of the function before the
increment, or forgetting the check entirely because the contract compiles fine without it.

---

#### CDM-3 — Node ExperimentalWarning with Truffle _(Phase 4 / Phase 6)_

**Risk**: Running Truffle under Node v22+ (including v24.x.x) floods the terminal with
`ExperimentalWarning: VM Modules is an experimental feature` messages, which may be mistaken for
compilation or migration errors.

**Why it matters**: These warnings are **not errors** — Truffle v5.11.5 is compatible with
Node v24.x.x. However, if ignored, they can obscure real error messages in the same terminal.

**What to do**:
- Recognise the warning pattern:
  `ExperimentalWarning: VM Modules is an experimental feature and might change at any time`.
- If the output is unreadable, suppress warnings with:
  ```bash
  NODE_OPTIONS=--no-warnings truffle migrate --network development
  NODE_OPTIONS=--no-warnings truffle console --network development
  ```
- Verify the actual exit code: `echo $?` — `0` means success regardless of warning noise.

**Common Mistake**: Stopping the migration because of red/yellow warning text, assuming the
experiment has failed, when Truffle actually completed successfully.

---

#### CDM-4 — ABI / Artifact Staleness _(Phase 2 → Phase 4, Phase 2 → Phase 5)_

**Risk**: Modifying `Voting.sol` after compilation but before running migrate or tests causes
`artifacts/` (Hardhat) and `build/contracts/` (Truffle) to contain stale ABIs, leading to
silent failures or `TypeError: contract.castVote is not a function` errors.

**Why it matters**: Both Truffle and Hardhat scripts rely on the ABI in their respective artifact
directories. A stale ABI does not match the compiled bytecode on-chain. Errors from ABI
mismatches are not always obvious — they may appear as unexpected reverts or missing function
errors.

**What to do**:
- Rule: **Always compile before migrate or test**:
  ```bash
  truffle compile && truffle migrate --reset --network development
  # or
  npx hardhat compile && npm run deploy:ganache
  ```
- Truffle stores artifacts in `build/contracts/` (not tracked in git — gitignored).
- Hardhat stores artifacts in `artifacts/` (not tracked in git — gitignored).
- If artifacts are deleted or corrupted, simply re-run compile then migrate.

**Common Mistake**: Editing `Voting.sol`, forgetting to compile, then running tests and seeing
`TypeError` or unexpected revert errors that point to the test file rather than a missing
recompile step.

---

#### CDM-5 — Constructor Args in Hardhat Ignition _(Phase 4)_

**Risk**: Passing constructor arguments incorrectly to `m.contract()` in the Ignition module
causes a revert on deployment or an on-chain contract with an empty `candidates` array.

**Why it matters**: The `Voting` constructor takes `string[] memory candidateNames`. In
Hardhat Ignition, constructor arguments are passed as the **second parameter** to `m.contract()`,
as a nested array: `m.contract("Voting", [["Alice", "Bob", "Charlie"]])`. The outer array is
the argument list; the inner array is the first argument (the `string[]`). Passing
`m.contract("Voting", ["Alice", "Bob", "Charlie"])` (flat, not nested) triggers a type
mismatch — each string is treated as a separate argument, causing a deployment revert.

**What to do**:
- Use the correct nested array syntax:
  ```javascript
  const voting = m.contract("Voting", [["Alice", "Bob", "Charlie"]]);
  ```
- After deployment, verify on-chain state via `getCandidates()` in Truffle console — the array
  must return 3 entries, not 0.
- If the array is empty after deploy, the constructor args were incorrect — redeploy with
  `--reset`.

**Common Mistake**: Writing `m.contract("Voting", ["Alice", "Bob", "Charlie"])` — three flat
string arguments instead of one `string[]` argument — causing a revert.

---

## 5. Manual Execution Tasks

These steps must be performed **by hand** by the developer. They cannot be automated by scripts.

---

### MET-1 — Starting Ganache CLI _(before Phase 4)_

1. Open a **dedicated terminal window** — keep this terminal open throughout Phases 4–7.
2. Navigate to any directory (Ganache CLI is a global tool, not project-specific).
3. Run:
   ```bash
   ganache --port 7545 --chain.chainId 1337 --accounts 10 --defaultBalanceEther 1000
   ```
4. Confirm the output shows `listening on 127.0.0.1:7545` and lists 10 accounts, each with
   `(1000 ETH)` balance and a corresponding private key.
5. Note the **first account address** (Account `(0)`) — this is the deployer account used by
   Truffle migrations as `msg.sender`, which becomes `owner` in the `Voting` constructor.
6. Note the second and third account addresses (`(1)` and `(2)`) — these will be used as voter
   accounts in Phase 6 (Truffle console interaction) so votes are cast from different addresses.
7. Keep this terminal running — **do not close it** until Phase 7 is complete and all screenshots
   have been captured.

> 📌 **Note** — Each Ganache CLI restart creates a fresh blockchain (new accounts, new state,
> new contract addresses). After restart, re-run `truffle migrate --reset --network development`
> before interacting via Truffle console. For extended sessions, use `--db ./ganache-db` to
> persist state across restarts.

> ⚠️ See **CDM-1** — always launch with `--port 7545` explicitly. Ganache CLI defaults to `8545`
> if no `--port` flag is given, causing `truffle migrate` to fail silently with a connection error.

---

### MET-2 — Truffle Console Interaction _(Phase 6)_

> **Prerequisite**: MET-1 must be running (Ganache CLI on port `7545`) and
> `truffle migrate --network development` must have completed successfully (Phase 4).

1. From `Exp-2/`, launch the Truffle interactive console:
   ```bash
   truffle console --network development
   ```
2. Confirm the prompt changes to `truffle(development)>`.
3. Retrieve the deployed `Voting` contract instance:
   ```javascript
   const voting = await Voting.deployed()
   ```
4. Confirm the deployment by checking the contract address:
   ```javascript
   voting.address
   // Expected: a valid 0x... address (non-zero)
   ```
5. Retrieve all initial candidates to verify the constructor populated the array correctly:
   ```javascript
   const candidates = await voting.getCandidates()
   candidates
   // Expected: array of 3 objects with name ("Alice", "Bob", "Charlie") and voteCount (0)
   ```
6. Cast a vote for candidate index `0` (Alice) from the default deployer account (`accounts[0]`):
   ```javascript
   const accounts = await web3.eth.getAccounts()
   await voting.castVote(0, { from: accounts[0] })
   ```
7. Verify the vote was registered — check `voteCount` for candidate `0`:
   ```javascript
   const updated = await voting.getCandidates()
   updated
   // Expected: Alice's voteCount is now 1; Bob and Charlie remain 0
   ```
8. Cast a vote for candidate index `1` (Bob) from a different account (`accounts[1]`):
   ```javascript
   await voting.castVote(1, { from: accounts[1] })
   ```
9. Retrieve the current winner:
   ```javascript
   const winner = await voting.getWinner()
   winner
   // Expected: { name: "Alice", voteCount: BN(1) } — Alice leads with 1 vote
   ```
10. Attempt a double vote (same address voting again) — expect a revert:
    ```javascript
    await voting.castVote(0, { from: accounts[0] })
    // Expected: Error: revert "Already voted" (or the exact require message from Voting.sol)
    ```
11. Take **Screenshot fig-2.3** — capture the Truffle console terminal showing steps 5–9
    with outputs visible (getCandidates result, castVote transaction, getWinner result).
12. Exit the console:
    ```javascript
    .exit
    ```

> ⚠️ See **CDM-3** — Truffle may flood the console session with `ExperimentalWarning` messages.
> Suppress with `NODE_OPTIONS=--no-warnings truffle console --network development` if needed.

---

## 6. Verification Checklist

Complete every item before committing the final state of this experiment.

### 6.1 Compilation & Build

- [ ] `truffle compile` → `> Compiled successfully using: solc: 0.8.21` — 0 errors
- [ ] `npx hardhat compile` → `Compiled 1 Solidity file successfully` — 0 errors, 0 unexpected
  warnings

### 6.2 Chaincode Skeleton

- [ ] `chaincode/javascript/index.js` exists and `require`s `./lib/Voting`
- [ ] `chaincode/javascript/lib/Voting.js` exists and contains the `VotingContract` class stub
  with `castVote` and `getResults` method stubs
- [ ] `chaincode/javascript/package.json` is valid JSON — `node -e "require('./chaincode/javascript/package.json')"` exits 0

### 6.3 Deployment

- [ ] `truffle migrate --network development` exits 0 — `Voting` contract address printed
- [ ] `npm run deploy:ganache` exits 0 — `VotingModule#Voting` address printed in summary
- [ ] Deployed contract address noted for Truffle console interaction

### 6.4 Tests

- [ ] `npm run test` (`npx hardhat test`) → `X passing (Xms)` with **0 failing**
- [ ] At minimum 6 test cases covering: initial state, `castVote` success, double-vote revert,
  invalid index revert, `VoteCast` event emission, `getWinner()` correctness

### 6.5 Screenshot Capture

- [ ] `screenshots/fig-2.1-truffle-migrate-output.png` — `truffle migrate` deployment summary
  with contract address
- [ ] `screenshots/fig-2.2-hardhat-test-passing.png` — `npx hardhat test` showing `X passing`
- [ ] `screenshots/fig-2.3-truffle-console-interaction.png` — Truffle console session showing
  `getCandidates()`, `castVote()`, and `getWinner()` outputs
- [ ] All screenshots named as `fig-2.Y-kebab-case-description.png` (no spaces, correct index)
- [ ] `screenshots/.gitkeep` deleted once real screenshots are saved

### 6.6 Security & Hygiene

- [ ] `Exp-2/.env` is **absent** — `git status` shows no `.env` file
- [ ] No private keys or mnemonics appear in any committed `.js` or `.sol` file
- [ ] `node_modules/`, `artifacts/`, `cache/`, `build/` are absent from `git status`
- [ ] `git diff --cached` shows no `.env`, `*.pem`, or `*.key` files staged

### 6.7 Documentation

- [ ] `EXP-2_PLAN.md` `FILE_LENGTH_TAG` matches actual line count (`soft` < 1,000 lines)
- [ ] `Exp-2/README.md` steps accurately match the commands used during implementation

---

## 7. Known Issues & Fixes

---

### Issue-1 — `truffle: command not found`

**Symptom**: Running `truffle version` outputs `bash: truffle: command not found`.

**Root Cause**: Truffle was installed under a different Node.js version context in nvm, or was
not installed globally under the active Node version.

**Fix**:
```bash
nvm use 24
npm install -g truffle
truffle version
```

**Reference**: Truffle requires a global install per Node version context in nvm. Always run
`nvm use 24` before installing or running Truffle CLI commands.

---

### Issue-2 — `ganache-cli: command not found`

**Symptom**: Running `ganache-cli` outputs `bash: ganache-cli: command not found`.

**Root Cause**: In Ganache v7+, the CLI binary was renamed from `ganache-cli` to `ganache`. The
`ganache-cli` package is deprecated and no longer maintained.

**Fix**:
```bash
npm install -g ganache
ganache --version  # should output ganache v7.9.x
```

**Reference**: [Ganache v7 Migration](https://github.com/trufflesuite/ganache/blob/develop/CHANGELOG.md)
— `ganache-cli` was replaced by `ganache` in v7. All `ganache-cli` references in older tutorials
should be replaced with `ganache`.

---

### Issue-3 — Node ExperimentalWarning Flood

**Symptom**: Truffle commands flood the terminal with:
```
(node:XXXXX) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
```

**Root Cause**: Truffle v5.11.5 uses `--experimental-vm-modules` internally under Node v22+
(including v24.x.x). This is expected behaviour — it does **not** indicate a failure.

**Fix** (if warnings obscure output):
```bash
NODE_OPTIONS=--no-warnings truffle migrate --network development
NODE_OPTIONS=--no-warnings truffle console --network development
NODE_OPTIONS=--no-warnings truffle test
```

**Reference**: See [CDM-3](#cdm-3--node-experimentalwarning-with-truffle-phase-4--phase-6)
for full context. Exit code `0` confirms success regardless of warning noise.

---

### Issue-4 — Hardhat Ignition "Module already deployed"

**Symptom**: `npm run deploy:ganache` reports `VotingModule is already deployed` and skips
redeployment.

**Root Cause**: Hardhat Ignition stores deployment state in `ignition/deployments/`. On
subsequent runs, it detects the module as already deployed and skips it, even if the contract
was modified.

**Fix**:
```bash
# Option A — use --reset flag
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache --reset

# Option B — delete cached deployment state manually
rm -rf ignition/deployments/
npm run deploy:ganache
```

> 📌 `ignition/deployments/` is listed in `.gitignore` — deleting it is safe and does not affect
> source code. Always re-run after deleting to confirm a fresh deployment.

---
## 8. Security Reminders

> ⚠️ These rules are non-negotiable. A PR will be rejected if any of these are violated.

- **Never** commit `.env` to Git. Use `.env.example` with placeholder values only.
- **Never** use a wallet with real ETH for any experiment — use dedicated test accounts from
  Ganache CLI output only.
- **Never** deploy to Ethereum Mainnet — Exp-2 targets local blockchain only.
- **Always** use test private keys generated by Ganache CLI (`ganache --port 7545 ...`) for any
  local signing operations.
- **Always** verify that `git diff --cached` shows no `.env`, `*.pem`, or `*.key` files before
  committing.
- Ganache CLI private keys are **ephemeral** — they are regenerated on every CLI restart unless
  `--db ./ganache-db` is used. Never treat them as persistent credentials.
- The `chaincode/javascript/` skeleton is a **conceptual scaffold only** — it contains no real
  Hyperledger Fabric credentials, connection profiles, or org certificates. Do not add any.

---

## 9. Git Commit Checkpoints

Commit at each checkpoint. Use the exact format: `<type>(<scope>): <summary>`

| Checkpoint | After Completing | Suggested Commit Message |
|-----------|-----------------|--------------------------|
| CP-1 | Phase 1 — Config verified | `config(exp-2): verify hardhat and truffle config for exp-2` |
| CP-2 | Phase 2 — Voting contract written | `feat(exp-2): add Voting.sol with castVote, getCandidates, getWinner, and events` |
| CP-3 | Phase 3 — Chaincode skeleton created | `feat(exp-2): add JS chaincode skeleton for Voting contract concept` |
| CP-4 | Phase 4 — Migration + Ignition scripts | `exp(exp-2): add truffle migration and hardhat ignition deploy scripts for Voting` |
| CP-5 | Phase 5 — Test suite written | `test(exp-2): add hardhat mocha test suite for Voting contract` |
| CP-6 | Phase 6 — Console interaction verified | `exp(exp-2): verify Voting deploys and console interaction passes on local network` |
| CP-7 | Phase 7 — Screenshots captured + cleanup | `chore(exp-2): add screenshots, remove .gitkeep, format code, finalize exp-2` |

> 📌 Commit messages are **suggestions** — adapt the summary to reflect actual work done.
> Never commit a checkpoint with failing tests or compile errors. The `<scope>` must be `exp-2`.

---

*Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26*
*Governed by [docs/PLAN_RULE.md](../docs/PLAN_RULE.md)*
