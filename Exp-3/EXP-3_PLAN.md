FILE_LENGTH_TAG=soft

# EXP-3_PLAN — Deployment and Publishing Smart Contracts on Ethereum Test Network

> **Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26**
> Single source of truth for implementing Experiment 3. Read completely before writing any code.

---

## Table of Contents

- [EXP-3\_PLAN — Deployment and Publishing Smart Contracts on Ethereum Test Network](#exp-3_plan--deployment-and-publishing-smart-contracts-on-ethereum-test-network)
  - [Table of Contents](#table-of-contents)
  - [0. Experiment Snapshot](#0-experiment-snapshot)
    - [Network Awareness](#network-awareness)
  - [1. Pre-Flight Checklist](#1-pre-flight-checklist)
    - [1.1 Node \& nvm](#11-node--nvm)
    - [1.2 Global CLI Tools (under Node 22 context)](#12-global-cli-tools-under-node-22-context)
    - [1.3 Ports](#13-ports)
    - [1.4 Environment Files](#14-environment-files)
    - [1.5 MetaMask \& Testnet Wallet](#15-metamask--testnet-wallet)
    - [1.6 Dependencies](#16-dependencies)
  - [2. Repository File Map](#2-repository-file-map)
  - [3. Sequential Development Phases](#3-sequential-development-phases)
    - [Phase 1 — Environment \& Config Verification](#phase-1--environment--config-verification)
    - [Phase 2 — MessageBoard Contract Development](#phase-2--messageboard-contract-development)
    - [Phase 3 — Hardhat Ignition Deployment Module](#phase-3--hardhat-ignition-deployment-module)
    - [Phase 4 — Test Suite (Local Hardhat Network)](#phase-4--test-suite-local-hardhat-network)
    - [Phase 5 — Testnet Pre-Launch (API Keys + Faucet)](#phase-5--testnet-pre-launch-api-keys--faucet)
    - [Phase 6 — Sepolia Testnet Deploy via Hardhat Ignition](#phase-6--sepolia-testnet-deploy-via-hardhat-ignition)
    - [Phase 7 — Etherscan Contract Verification](#phase-7--etherscan-contract-verification)
    - [Phase 8 — Web3.js Post-Deploy Interaction Script](#phase-8--web3js-post-deploy-interaction-script)
    - [Phase 9 — Remix IDE + MetaMask Deployment](#phase-9--remix-ide--metamask-deployment)
    - [Phase 10 — Screenshots \& Final Cleanup](#phase-10--screenshots--final-cleanup)
  - [4. Crucial Development Moments (CDM)](#4-crucial-development-moments-cdm)
    - [CDM-1 — dotenv Load Order _(Phase 1)_](#cdm-1--dotenv-load-order-phase-1)
    - [CDM-2 — Insufficient Sepolia Test ETH _(Phase 5 / Phase 6)_](#cdm-2--insufficient-sepolia-test-eth-phase-5--phase-6)
    - [CDM-3 — Hardhat Ignition "Module Already Deployed" _(Phase 6)_](#cdm-3--hardhat-ignition-module-already-deployed-phase-6)
    - [CDM-4 — Etherscan API Key / Network Mismatch _(Phase 7)_](#cdm-4--etherscan-api-key--network-mismatch-phase-7)
    - [CDM-5 — MetaMask Nonce Stuck After Network Switch _(Phase 9)_](#cdm-5--metamask-nonce-stuck-after-network-switch-phase-9)
  - [5. Manual Execution Tasks](#5-manual-execution-tasks)
    - [MET-1 — MetaMask Sepolia Network Config + Test Account Import _(before Phase 5)_](#met-1--metamask-sepolia-network-config--test-account-import-before-phase-5)
    - [MET-2 — Sepolia Faucet ETH Request _(before Phase 6)_](#met-2--sepolia-faucet-eth-request-before-phase-6)
    - [MET-3 — Remix IDE + remixd + MetaMask Deploy _(Phase 9)_](#met-3--remix-ide--remixd--metamask-deploy-phase-9)
  - [6. Verification Checklist](#6-verification-checklist)
    - [6.1 Compilation \& Build](#61-compilation--build)
    - [6.2 Deployment](#62-deployment)
    - [6.3 Tests](#63-tests)
    - [6.4 Etherscan Verification](#64-etherscan-verification)
    - [6.5 Web3.js Interaction](#65-web3js-interaction)
    - [6.6 Remix IDE Deployment](#66-remix-ide-deployment)
    - [6.7 Screenshot Capture](#67-screenshot-capture)
    - [6.8 Security \& Hygiene](#68-security--hygiene)
    - [6.9 Documentation](#69-documentation)
  - [7. Known Issues \& Fixes](#7-known-issues--fixes)
    - [Issue-1 — Deprecated Testnets (Ropsten / Rinkeby / Goerli)](#issue-1--deprecated-testnets-ropsten--rinkeby--goerli)
    - [Issue-2 — Alchemy Free-Tier Rate Limit During Deploy](#issue-2--alchemy-free-tier-rate-limit-during-deploy)
    - [Issue-3 — MetaMask Pending Transaction Stuck](#issue-3--metamask-pending-transaction-stuck)
    - [Issue-4 — hardhat-toolbox vs hardhat-verify Plugin Conflict](#issue-4--hardhat-toolbox-vs-hardhat-verify-plugin-conflict)
    - [Issue-5 — remixd CORS / Connection Drop in Remix IDE](#issue-5--remixd-cors--connection-drop-in-remix-ide)
  - [8. Security Reminders](#8-security-reminders)
  - [9. Git Commit Checkpoints](#9-git-commit-checkpoints)

---

## 0. Experiment Snapshot

| Field | Value |
|-------|-------|
| Experiment | Exp-3 — To study Deployment and publish smart contracts on Ethereum test network |
| Lab Outcome | LO3 — Write and deploy smart contract using Remix IDE and MetaMask |
| Bloom's Taxonomy Level | L4 |
| Primary Tool(s) | Hardhat v2.28.6, Hardhat Ignition |
| Supporting Tool(s) | Alchemy / Infura RPC, MetaMask, Etherscan (Sepolia), Web3.js v4.x, Remix IDE, remixd |
| Solidity Version | 0.8.21 |
| Node Version | v22.22.0 (nvm alias: modern) — set via `.nvmrc = 22` |
| Local Network(s) | Hardhat in-process (31337), Ganache GUI (7545 / Chain ID 1337) |
| Testnet | Sepolia (Chain ID 11155111) — primary; Holesky (17000) — optional fallback |
| Prerequisite Experiments | Exp-1 (Hardhat + Ganache toolchain), Exp-2 (Solidity contract development patterns) |
| Estimated Phases | 10 phases |
| FILE_LENGTH_TAG | soft |

> 📌 **Note** — Exp-3 introduces the first **testnet deployment** in this lab series. All previous
> experiments targeted local networks only. This experiment adds: API key management via `.env`,
> Alchemy/Infura RPC providers, MetaMask Sepolia wallet, Etherscan verification, and Web3.js
> post-deploy interaction — none of which were required in Exp-1 or Exp-2.

---

### Network Awareness

| Network | Type | Chain ID | Port / URL | Tool | Used In |
|---------|------|----------|------------|------|---------|
| `hardhat` (in-process) | Local, ephemeral | 31337 | — | Hardhat | Phase 4 — unit tests |
| `ganache` (GUI) | Local, persistent | 1337 | 7545 | Ganache Desktop | Phase 1 verification (optional) |
| `sepolia` | Testnet, public | **11155111** | `https://eth-sepolia.g.alchemy.com/v2/<KEY>` | Hardhat + MetaMask | Phases 6, 7, 8, 9 |
| `holesky` | Testnet, public | 17000 | `https://eth-holesky.g.alchemy.com/v2/<KEY>` | Hardhat | Optional alternative to Sepolia |
| Ropsten / Rinkeby / Goerli | Deprecated | — | Shut down | — | ❌ Do **not** reference or use |

> ⚠️ **Warning** — Always confirm MetaMask is connected to **Sepolia (Chain ID 11155111)**
> before executing any testnet transaction. MetaMask silently stays on the last-used network.

---

## 1. Pre-Flight Checklist

Run these checks **before starting Phase 1**. Do not proceed if any item fails.

### 1.1 Node & nvm

- [ ] `nvm --version` confirms nvm ≥ 0.40.x is installed
- [ ] `nvm use 22` succeeds — outputs `Now using node v22.22.0 (npm v10.x.x)`
- [ ] `node --version` inside `Exp-3/` outputs `v22.x.x` (`.nvmrc = 22` respected)

### 1.2 Global CLI Tools (under Node 22 context)

- [ ] `npx hardhat --version` → `2.28.x`
- [ ] `remixd --version` → `0.6.x` _(required for Phase 9 — Remix IDE bridge)_

> 📌 Install remixd globally if absent: `npm install -g @remix-project/remixd`

### 1.3 Ports

- [ ] Port `31337` is free — `lsof -i :31337` returns empty _(Hardhat in-process — Phase 4)_
- [ ] Port `65520` is free — `lsof -i :65520` returns empty _(remixd WebSocket — Phase 9)_

### 1.4 Environment Files

- [ ] `Exp-3/.env` does **NOT** appear in `git status` (not staged, not tracked)
- [ ] `Exp-3/.env.example` is present and contains all required placeholder keys:
  `PRIVATE_KEY`, `ALCHEMY_API_KEY`, `INFURA_API_KEY`, `ETHERSCAN_API_KEY`
- [ ] A personal `Exp-3/.env` has been created from `.env.example` and all values filled in:

```bash
cd Exp-3/
cp .env.example .env
# Open .env and fill: PRIVATE_KEY, ALCHEMY_API_KEY, ETHERSCAN_API_KEY
```

### 1.5 MetaMask & Testnet Wallet

- [ ] MetaMask browser extension is installed and unlocked
- [ ] A **dedicated test-only** MetaMask account exists — never use a wallet holding real ETH
- [ ] MetaMask is connected to the **Sepolia** network (Settings → Networks — Chain ID 11155111)
- [ ] The test account private key matches the `PRIVATE_KEY` entry in `Exp-3/.env`
- [ ] Sepolia wallet balance ≥ 0.05 ETH (request from faucet — see MET-2 before Phase 6)

> ⚠️ **Never** import a wallet that holds real mainnet ETH into `.env`. Create a brand-new
> MetaMask account exclusively for testnet lab work. Rotate keys after the lab if necessary.

### 1.6 Dependencies

- [ ] `Exp-3/node_modules/` exists — run `npm install` inside `Exp-3/` if absent
- [ ] `npx hardhat compile` exits 0 — verifies toolchain is functional before contract is written

---

## 2. Repository File Map

> **Legend**: `CREATE` — new file | `UPDATE` — modify existing | `VERIFY` — read-only reference

| # | File Path (relative to `Exp-3/`) | Action | Phase | Purpose |
|---|----------------------------------|--------|-------|---------|
| 1 | `hardhat.config.js` | VERIFY | 1 | Confirm Sepolia/Holesky network blocks, ETHERSCAN_API_KEY wired, dotenv loaded |
| 2 | `truffle-config.js` | VERIFY | 1 | Local dev config only — not used for any testnet operation in Exp-3 |
| 3 | `.env.example` | VERIFY | 1 | Confirm all four placeholder keys are present before creating `.env` |
| 4 | `contracts/MessageBoard.sol` | CREATE | 2 | Primary Solidity contract — stores messages per address with timestamps and events |
| 5 | `ignition/modules/Deploy.js` | CREATE | 3 | Hardhat Ignition deployment module for `MessageBoard` |
| 6 | `test/MessageBoard.test.js` | CREATE | 4 | Hardhat + ethers.js test suite — covers constructor, postMessage, getMessages |
| 7 | `scripts/interact.js` | CREATE | 8 | Web3.js script — connects to Sepolia, calls postMessage and getMessages on deployed contract |
| 8 | `package.json` | UPDATE | 8 | Add `web3` npm dependency for the interaction script |
| 9 | `screenshots/` | UPDATE | 10 | Add output screenshots for EXP-3_DOC.md evidence |
| 10 | `EXP-3_PLAN.md` | VERIFY | — | Confirm `FILE_LENGTH_TAG` accuracy after all four chunks are written |

> 📌 `migrations/` and `.gitkeep` files remain untouched — Truffle migrations are not executed
> in Exp-3. The `migrations/` scaffold is inherited from the project template.

---

## 3. Sequential Development Phases

---

### Phase 1 — Environment & Config Verification

**Goal**: Confirm all tools, config files, and environment variables are correctly wired before
touching any source file.

**Files Touched**: `hardhat.config.js` (VERIFY), `truffle-config.js` (VERIFY), `.env.example` (VERIFY)

<!-- TOOL: HARDHAT -->
**Logical Flow**:
1. `cd Exp-3/ && nvm use 22` — switch to Node 22 as required by `.nvmrc`.
2. Inspect `hardhat.config.js`:
   - Confirm `require("dotenv").config()` is the **first** line after the requires block.
   - Confirm `solidity.version = "0.8.21"` and optimizer is enabled.
   - Confirm `sepolia` network block is present with `chainId: 11155111`.
   - Confirm `etherscan.apiKey` is wired to `process.env.ETHERSCAN_API_KEY`.
3. Inspect `.env.example` — all four keys must be present: `PRIVATE_KEY`, `ALCHEMY_API_KEY`,
   `INFURA_API_KEY`, `ETHERSCAN_API_KEY`.
4. Verify `.env` exists locally and is **not** in `git status`.
5. Run `npx hardhat compile` — exits 0 even with empty `contracts/` (confirms toolchain OK).

> ⚠️ See **CDM-1** before running any command that reads `.env` values.

**Exit Criteria**: `npx hardhat compile` exits 0 with zero errors.

---

### Phase 2 — MessageBoard Contract Development

**Goal**: Write `contracts/MessageBoard.sol` — the purpose-built smart contract for Exp-3.

**Files Touched**: `contracts/MessageBoard.sol` (CREATE)

<!-- TOOL: SOLIDITY -->
**Logical Flow**:
1. Create `contracts/MessageBoard.sol` with SPDX identifier and `pragma solidity ^0.8.21`.
2. Define state variables:
   - A `struct` to hold message content, sender address, and `block.timestamp`.
   - A mapping from `address` → dynamic array of that struct.
   - A public `uint256 messageCount` counter.
3. Implement constructor — initialize `messageCount` to 0.
4. Implement `postMessage(string calldata content)` — validate input is non-empty, push new
   struct to the sender's array, increment `messageCount`, emit `MessagePosted` event.
5. Implement `getMessages(address user)` — `view` function, returns the full struct array for
   a given address.
6. Implement `getTotalCount()` — `view` function, returns `messageCount`.
7. Declare `MessagePosted(address indexed sender, string content, uint256 timestamp)` event.
8. Compile after each major function addition: `npx hardhat compile`.

**Logical Hint** (skeleton only — no full implementation):

```solidity
// File: contracts/MessageBoard.sol — skeleton only
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract MessageBoard {
    struct Message { string content; address sender; uint256 timestamp; }
    mapping(address => Message[]) private _messages;
    uint256 public messageCount;

    event MessagePosted(address indexed sender, string content, uint256 timestamp);

    function postMessage(string calldata content) external { /* validate → push → count → emit */ }
    function getMessages(address user) external view returns (Message[] memory) { /* return array */ }
    function getTotalCount() external view returns (uint256) { /* return messageCount */ }
}
```

> ⚠️ See **CDM-1** — ensure `dotenv.config()` order is correct before running compile.

**Exit Criteria**: `npx hardhat compile` exits 0 — `contracts/MessageBoard.sol` compiled,
`artifacts/contracts/MessageBoard.sol/MessageBoard.json` generated.

---

### Phase 3 — Hardhat Ignition Deployment Module

**Goal**: Write the Hardhat Ignition module that deploys `MessageBoard` to any configured network.

**Files Touched**: `ignition/modules/Deploy.js` (CREATE)

<!-- TOOL: HARDHAT -->
**Logical Flow**:
1. Create `ignition/modules/Deploy.js`.
2. Import `buildModule` from `@nomicfoundation/hardhat-ignition/modules`.
3. Define a module named `"MessageBoardModule"`.
4. Inside the module callback, call `m.contract("MessageBoard")` — no constructor arguments
   since `MessageBoard` has none.
5. Return the deployed contract instance from the module.
6. Test the module locally first: `npx hardhat ignition deploy ./ignition/modules/Deploy.js
   --network hardhat` — confirm it exits 0 and prints a contract address.

**Logical Hint** (skeleton only):

```javascript
// File: ignition/modules/Deploy.js — skeleton only
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MessageBoardModule", (m) => {
  const messageboard = m.contract("MessageBoard");
  return { messageboard };
});
```

> 📌 The module name `"MessageBoardModule"` must match what `npx hardhat ignition deploy` uses
> and what is recorded in `ignition/deployments/`. If the name changes, delete the
> `ignition/deployments/` folder before re-deploying.

**Exit Criteria**: `npx hardhat ignition deploy ./ignition/modules/Deploy.js --network hardhat`
prints `MessageBoardModule#MessageBoard - 0x<ADDRESS>` and exits 0.

---

### Phase 4 — Test Suite (Local Hardhat Network)

**Goal**: Write a Hardhat test suite that covers all public functions of `MessageBoard` on the
local ephemeral Hardhat network before any testnet spend.

**Files Touched**: `test/MessageBoard.test.js` (CREATE)

<!-- TOOL: HARDHAT -->
**Logical Flow**:
1. Create `test/MessageBoard.test.js` using Mocha + Chai (bundled with `hardhat-toolbox`).
2. Use `ethers.getContractFactory("MessageBoard").deploy()` in a `beforeEach` hook to get a
   fresh contract instance per test.
3. Write test cases:
   - Deploy succeeds — `messageCount` initialises at 0.
   - `postMessage("hello")` emits `MessagePosted` event with correct sender and content.
   - `postMessage("")` reverts (empty string guard).
   - After one post, `getMessages(addr)` returns array of length 1 with correct content.
   - After two calls from same address, `getMessages(addr)` returns length 2.
   - `getTotalCount()` increments correctly after each post.
4. Run `npx hardhat test` — all tests must pass locally before moving to testnet.

**Logical Hint** (skeleton only — intent, not implementation):

```javascript
// File: test/MessageBoard.test.js — skeleton only
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MessageBoard", function () {
  let board, owner, addr1;
  beforeEach(async () => { /* deploy fresh instance */ });

  it("initialises messageCount at zero", async () => { /* expect(0) */ });
  it("postMessage emits MessagePosted event", async () => { /* await expect(tx).to.emit(...) */ });
  it("postMessage reverts on empty string", async () => { /* await expect(...).to.be.revertedWith(...) */ });
  it("getMessages returns correct messages for sender", async () => { /* expect array length */ });
  it("getTotalCount increments after each post", async () => { /* expect count == N */ });
});
```

**Exit Criteria**: `npx hardhat test` → `5 passing` (or more), `0 failing`.

---

### Phase 5 — Testnet Pre-Launch (API Keys + Faucet)

**Goal**: Verify that all external credentials are correctly loaded and the test wallet has
sufficient Sepolia ETH before spending real (test) gas.

**Files Touched**: `.env` (VERIFY personal copy), `hardhat.config.js` (VERIFY)

<!-- TOOL: HARDHAT -->
**Logical Flow**:
1. Confirm `.env` is populated: `PRIVATE_KEY` (64-hex no `0x` prefix or with — both work),
   `ALCHEMY_API_KEY`, `ETHERSCAN_API_KEY`.
2. Run a dry-run network connectivity check:
   ```bash
   npx hardhat run --network sepolia <(echo 'async function main(){ const [s] = await ethers.getSigners(); console.log(s.address); } main()')
   ```
   The deployer address should print — confirming RPC endpoint and private key are resolving.
3. Alternatively run `npx hardhat console --network sepolia` → `(await ethers.getSigners())[0].address`.
4. Confirm Sepolia balance via MetaMask or Etherscan: `https://sepolia.etherscan.io/address/<ADDR>`.
5. If balance < 0.05 ETH — complete **MET-2** (faucet) before proceeding to Phase 6.

> ⚠️ See **CDM-2** — do not start deployment if ETH balance is less than 0.05 ETH.

**Exit Criteria**: Deployer address prints without error; Sepolia balance ≥ 0.05 ETH confirmed.

---

### Phase 6 — Sepolia Testnet Deploy via Hardhat Ignition

**Goal**: Deploy `MessageBoard` to the Ethereum Sepolia testnet and capture the contract address.

**Files Touched**: `ignition/modules/Deploy.js` (VERIFY), `ignition/deployments/` (auto-generated)

<!-- TOOL: HARDHAT -->
**Logical Flow**:
1. `nvm use 22` — confirm correct Node version.
2. Run the Ignition deployment:
   ```bash
   npx hardhat ignition deploy ./ignition/modules/Deploy.js --network sepolia
   ```
3. Wait for the transaction to be included in a block (typically 12–30 seconds on Sepolia).
4. Copy the deployed contract address from the output line:
   `MessageBoardModule#MessageBoard - 0x<CONTRACT_ADDRESS>`
5. Save this address — it is required for Phase 7 (Etherscan verification) and Phase 8
   (Web3.js interaction).
6. Confirm the transaction on Etherscan Sepolia:
   `https://sepolia.etherscan.io/address/<CONTRACT_ADDRESS>`

> ⚠️ See **CDM-3** — if the module was previously deployed and you need to re-deploy, use
> the `--reset` flag or delete `ignition/deployments/chain-11155111/` first.

**Exit Criteria**: Deployment output includes `MessageBoardModule#MessageBoard - 0x<ADDRESS>`;
Sepolia Etherscan confirms the contract creation transaction.

---

### Phase 7 — Etherscan Contract Verification

**Goal**: Verify the deployed `MessageBoard` source code on Sepolia Etherscan so the ABI and
code are publicly readable.

**Files Touched**: No source files changed — `hardhat.config.js` `etherscan.apiKey` must be set.

<!-- TOOL: HARDHAT -->
**Logical Flow**:
1. Confirm `ETHERSCAN_API_KEY` in `.env` is a valid Etherscan API key
   (get free key at `https://etherscan.io/register`).
2. Run the verification command (no constructor args for `MessageBoard`):
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```
3. If verification is accepted, Etherscan responds with:
   `Successfully verified contract MessageBoard on the block explorer.`
4. Navigate to `https://sepolia.etherscan.io/address/<CONTRACT_ADDRESS>#code` — confirm the
   green ✅ "Contract Source Code Verified" badge is visible.
5. Take a screenshot of the Etherscan verified contract page (for EXP-3_DOC.md).

> ⚠️ See **CDM-4** — the `ETHERSCAN_API_KEY` must be a standard (mainnet) Etherscan API key.
> Etherscan uses the same key for all networks including Sepolia.

**Exit Criteria**: `npx hardhat verify --network sepolia <ADDRESS>` exits 0 with success message;
green verified badge visible on `sepolia.etherscan.io`.

---

### Phase 8 — Web3.js Post-Deploy Interaction Script

**Goal**: Write a Web3.js script that connects to Sepolia via RPC and calls `postMessage` and
`getMessages` on the already-deployed `MessageBoard` contract.

**Files Touched**: `scripts/interact.js` (CREATE), `package.json` (UPDATE — add `web3` dependency)

<!-- TOOL: WEB3JS -->
**Logical Flow**:
1. Install Web3.js:
   ```bash
   npm install web3
   ```
2. Confirm `package.json` `dependencies` now includes `"web3": "^4.x.x"`.
3. Create `scripts/interact.js`:
   - Import `Web3` from `"web3"`.
   - Load `ALCHEMY_API_KEY` and `PRIVATE_KEY` from `process.env` via `dotenv`.
   - Instantiate `new Web3("https://eth-sepolia.g.alchemy.com/v2/<KEY>")`.
   - Load the `MessageBoard` ABI from `artifacts/contracts/MessageBoard.sol/MessageBoard.json`.
   - Instantiate the contract at `<CONTRACT_ADDRESS>` (hardcoded constant in the script).
   - Call `postMessage("Hello from Web3.js!")` — sign and send from the deployer account.
   - Wait for receipt — log transaction hash.
   - Call `getMessages(<DEPLOYER_ADDR>)` — log the returned array.
4. Run: `node scripts/interact.js`.

**Logical Hint** (skeleton only):

```javascript
// File: scripts/interact.js — skeleton only
require("dotenv").config();
const { Web3 } = require("web3");
const abi = require("../artifacts/contracts/MessageBoard.sol/MessageBoard.json").abi;

async function main() {
  const web3 = new Web3(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
  const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);
  const board = new web3.eth.Contract(abi, "<CONTRACT_ADDRESS>");
  /* send postMessage → log txHash → call getMessages → log results */
}
main().catch(console.error);
```

**Exit Criteria**: `node scripts/interact.js` exits 0; transaction hash printed; message array
returned from `getMessages` contains the posted string.

---

### Phase 9 — Remix IDE + MetaMask Deployment

**Goal**: Deploy a second instance of `MessageBoard` via Remix IDE using the Injected Provider
(MetaMask) pointing to Sepolia — fulfilling the LO3 requirement for Remix + MetaMask flow.

**Files Touched**: No new files — contracts already compiled. Screenshots captured.

<!-- TOOL: REMIX -->
**Logical Flow**:
1. Start `remixd` to expose `Exp-3/contracts/` to Remix IDE:
   ```bash
   cd Exp-3/
   remixd -s ./contracts --remix-ide https://remix.ethereum.org
   ```
2. Navigate to `https://remix.ethereum.org` in Chrome (MetaMask extension active).
3. In the **File Explorer** sidebar → click the **localhost** icon → **Connect to Localhost** →
   accept the connection prompt.
4. Open `MessageBoard.sol` in the editor.
5. In **Solidity Compiler** tab → set compiler to `0.8.21` → click **Compile MessageBoard.sol**.
6. In **Deploy & Run Transactions** tab → set **Environment** to
   `Injected Provider - MetaMask`.
7. MetaMask popup appears — confirm it shows **Sepolia** network → **Connect**.
8. Click **Deploy** → MetaMask prompts for transaction confirmation → confirm.
9. Wait for transaction confirmation (12–30 seconds) — Remix output shows the new contract address.
10. Interact via Remix UI — call `postMessage` and `getMessages` directly from the Remix panel.
11. Take screenshots of: Remix deploy output, MetaMask confirmation, Remix interaction panel.

> ⚠️ See **CDM-5** — if MetaMask shows a pending transaction or incorrect nonce, perform a nonce
> reset before deploying.

**Exit Criteria**: Remix output shows a new `MessageBoard` contract address on Sepolia; MetaMask
confirms the deploy transaction; `postMessage` call succeeds from Remix panel.

---

### Phase 10 — Screenshots & Final Cleanup

**Goal**: Capture all required screenshots, verify repo hygiene, and confirm the experiment is
ready for documentation in `EXP-3_DOC.md`.

**Files Touched**: `screenshots/` (UPDATE), `package.json` (VERIFY)

<!-- TOOL: SHELL -->
**Logical Flow**:
1. Capture and save all required screenshots to `Exp-3/screenshots/` using the naming convention
   `fig-3.Y-description.png` (see §6.7 for the required list).
2. Verify `.env` is not staged: `git status` — must show `.env` as untracked or absent.
3. Confirm `artifacts/`, `cache/`, `node_modules/`, `ignition/deployments/` are gitignored:
   `cat .gitignore | grep -E "artifacts|cache|node_modules|deployments"`.
4. Run the full test suite one final time: `npx hardhat test` → all passing.
5. Update `EXP-3_PLAN.md` line 1 `FILE_LENGTH_TAG` if actual line count falls outside
   `medium` range (1,000–2,000 lines).

**Exit Criteria**: `git status` shows only intentional tracked files; `npx hardhat test` passes;
all required screenshots saved in `screenshots/`.

---

## 4. Crucial Development Moments (CDM)

> ⚠️ Read every CDM before starting the corresponding phase. These are the highest-risk steps.

---

### CDM-1 — dotenv Load Order _(Phase 1)_

**Risk**: `PRIVATE_KEY`, `ALCHEMY_API_KEY`, and `ETHERSCAN_API_KEY` all read as `undefined`
despite correct `.env` values, causing silent fallback to the zero-address private key or
empty RPC URL.

**Why it matters**: The `hardhat.config.js` conditionally builds the Sepolia RPC URL using
`ALCHEMY_API_KEY`. If `dotenv.config()` is called *after* the constants are assigned, all
three variables resolve to their `|| ""` fallback — deployment will silently use Infura with
an empty project ID and fail at the RPC call, not at config load.

**What to do**:
- Verify `require("dotenv").config()` is **at the top** of `hardhat.config.js`, before any
  `process.env.*` reads.
- Add a guard for critical Phase 5/6 runs:
  ```bash
  node -e "require('dotenv').config(); console.log(!!process.env.PRIVATE_KEY)"
  ```
  Must print `true`. If `false`, `.env` is missing or malformed.
- Double-check `.env` for leading/trailing whitespace in key values (common copy-paste error).

**Common Mistake**: Placing `require("dotenv").config()` after the `const PRIVATE_KEY =
process.env.PRIVATE_KEY || "..."` lines — the `||` fallback masks the missing variable silently.

---

### CDM-2 — Insufficient Sepolia Test ETH _(Phase 5 / Phase 6)_

**Risk**: Deployment transaction is sent but reverts or is never mined because the deployer
account has zero or sub-threshold Sepolia ETH balance.

**Why it matters**: Gas estimation succeeds locally (Hardhat estimates against the local fork)
but the actual Sepolia transaction is rejected at the mempool level. The error message is
often confusing: `insufficient funds for intrinsic transaction cost` or a long pending timeout.

**What to do**:
- Check balance **before** Phase 6: `https://sepolia.etherscan.io/address/<DEPLOYER_ADDR>`
- Minimum required: **0.05 ETH** for deploy + subsequent test calls.
- If below threshold — complete **MET-2** and wait 1–3 minutes for faucet confirmation.

**Common Mistake**: Checking balance in MetaMask while MetaMask is still on a local network
(Hardhat/Ganache) — always verify on Sepolia Etherscan, not MetaMask's local cached balance.

---

### CDM-3 — Hardhat Ignition "Module Already Deployed" _(Phase 6)_

**Risk**: Re-running `npx hardhat ignition deploy` on the same network after a successful
deployment throws:
`Error: Module "MessageBoardModule" has already been deployed to this network.`

**Why it matters**: Hardhat Ignition records deployment state in `ignition/deployments/`.
Without clearing this, every re-run after the first will fail, which is confusing during
iterative contract development.

**What to do**:
- To redeploy with the **same** module: add `--reset` flag:
  ```bash
  npx hardhat ignition deploy ./ignition/modules/Deploy.js --network sepolia --reset
  ```
- To redeploy locally (Hardhat network): delete `ignition/deployments/chain-31337/` first.
- **Do not** delete `ignition/deployments/chain-11155111/` unless intentionally redeploying
  on Sepolia — it contains the canonical contract address needed for Phase 7 and Phase 8.

**Common Mistake**: Deleting the entire `ignition/deployments/` folder and losing the Sepolia
contract address before running Phase 7 Etherscan verification.

---

### CDM-4 — Etherscan API Key / Network Mismatch _(Phase 7)_

**Risk**: `npx hardhat verify --network sepolia <ADDRESS>` fails with:
`Error: Missing or invalid ApiKey`  or `Invalid API Key`.

**Why it matters**: Developers sometimes create separate API keys on Etherscan's per-network
dashboard and use a testnet-scoped key, which does not work. Hardhat `verify` requires a
standard mainnet Etherscan API key — it uses the same key for all networks.

**What to do**:
- Log in to `https://etherscan.io` (mainnet dashboard, not `sepolia.etherscan.io`).
- Navigate to **API Keys** → create or copy your key.
- Paste this key into `ETHERSCAN_API_KEY` in `.env`.
- Re-run: `npx hardhat verify --network sepolia <ADDRESS>`.

**Verification**: A successful run ends with:
`Successfully verified contract MessageBoard on the block explorer.`

**Common Mistake**: Using the URL `https://sepolia.etherscan.io` to generate the API key —
that dashboard shows the same key, but if the account was created only on the Sepolia subdomain
some users see scoping issues. Always use `etherscan.io` (mainnet) to manage API keys.

---

### CDM-5 — MetaMask Nonce Stuck After Network Switch _(Phase 9)_

**Risk**: MetaMask shows a transaction as **Pending** indefinitely or reports
`Nonce too low` / `Nonce too high` during the Remix IDE deployment in Phase 9.

**Why it matters**: If MetaMask was previously used with a local Hardhat/Ganache node
(which resets transaction history on restart), its internally cached nonce for the account
diverges from the on-chain nonce on Sepolia, causing all subsequent transactions to fail.

**What to do**:
1. Open MetaMask → Account menu → **Settings** → **Advanced**.
2. Click **Clear activity and nonce data** (also called "Reset account").
3. Confirm the reset — this clears pending transactions without removing funds or keys.
4. Switch to Sepolia network and retry the Remix deployment.

**Common Mistake**: Clicking "Cancel" on the stuck pending transaction instead of performing
the nonce reset — cancellation does not clear the locally cached nonce state.

---

## 5. Manual Execution Tasks

These steps must be performed **by hand** by the developer. They cannot be automated.

---

### MET-1 — MetaMask Sepolia Network Config + Test Account Import _(before Phase 5)_

1. Open MetaMask browser extension → click the network selector (top-left).
2. If Sepolia is not listed: click **Add a network manually** and fill in:
   - **Network Name**: `Sepolia test network`
   - **New RPC URL**: `https://rpc.sepolia.org` (or leave default—MetaMask includes Sepolia natively)
   - **Chain ID**: `11155111`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: `https://sepolia.etherscan.io`
3. Click **Save** and **Switch to Sepolia**.
4. Import your dedicated test account:
   - MetaMask menu → **Account details** → import via **Private Key** tab.
   - Paste the same `PRIVATE_KEY` value that is in `Exp-3/.env`.
5. Confirm the imported account shows the correct address.
6. Confirm network shows **Sepolia** in the top-left selector of MetaMask.

> ⚠️ This account must be used exclusively for testnet experiments — never fund it with
> real ETH or use it on mainnet.

---

### MET-2 — Sepolia Faucet ETH Request _(before Phase 6)_

1. Open one of the following faucets in Chrome (with MetaMask Sepolia account active):
   - **Alchemy Faucet** (recommended): `https://sepoliafaucet.com` — requires Alchemy account
   - **Sepolia PoW Faucet**: `https://faucet.sepolia.dev` — no login required
   - **Chainlink Faucet**: `https://faucets.chain.link/sepolia` — requires GitHub login
2. Paste your deployer wallet address into the faucet input.
3. Complete any CAPTCHA or authentication required by the faucet.
4. Click **Send ETH** (or equivalent button).
5. Wait 1–3 minutes for the faucet transaction to confirm.
6. Verify balance on: `https://sepolia.etherscan.io/address/<YOUR_DEPLOYER_ADDRESS>`
7. Confirm balance ≥ 0.05 ETH before proceeding to Phase 6.

> 📌 Faucet limits reset every 24 hours. Request ETH the day before the lab session if
> possible to avoid waiting during the lab.

---

### MET-3 — Remix IDE + remixd + MetaMask Deploy _(Phase 9)_

1. In the `Exp-3/` terminal, start remixd:
   ```bash
   remixd -s ./contracts --remix-ide https://remix.ethereum.org
   ```
2. Open `https://remix.ethereum.org` in Chrome — do not use Firefox (MetaMask is Chrome-primary).
3. In the **Workspaces** (file explorer) sidebar → click the localhost plug icon →
   **Connect to Localhost** → click **Connect** in the popup.
   - If prompted about "allow localhost connection" in remixd terminal — type `yes`.
4. Expand the localhost workspace → open `MessageBoard.sol`.
5. In the **Solidity Compiler** plugin tab:
   - Set compiler version to **0.8.21**.
   - Enable **Auto compile** or click **Compile MessageBoard.sol** manually.
   - Confirm `0 errors` in the output.
6. In the **Deploy & Run Transactions** plugin tab:
   - Set **Environment** to **Injected Provider - MetaMask**.
   - MetaMask popup appears — confirm the network shows **Sepolia** — click **Connect**.
7. Confirm `Account` field shows your deployer address with a Sepolia ETH balance.
8. Click **Deploy** → MetaMask confirmation popup appears.
9. Review the gas estimate in MetaMask → click **Confirm**.
10. Wait 12–30 seconds for Sepolia block confirmation.
11. Remix **Terminal** output shows `[block:X] from:0x... to:MessageBoard.(fallback) ...` —
    copy the contract address from the Deployed Contracts panel.
12. Interact: expand the deployed contract → call `postMessage` with a test string → confirm
    MetaMask → wait → call `getMessages(yourAddress)` and verify return value.

---

## 6. Verification Checklist

Complete every item before committing the final state of Exp-3.

### 6.1 Compilation & Build

- [ ] `npx hardhat compile` → 0 errors, 0 unexpected warnings
- [ ] `artifacts/contracts/MessageBoard.sol/MessageBoard.json` exists and is non-empty

### 6.2 Deployment

- [ ] `npx hardhat ignition deploy ./ignition/modules/Deploy.js --network hardhat` exits 0 (local)
- [ ] `npx hardhat ignition deploy ./ignition/modules/Deploy.js --network sepolia` exits 0
- [ ] Deployed contract address on Sepolia noted and saved (needed for Phase 7 + Phase 8)

### 6.3 Tests

- [ ] `npx hardhat test` → 5 or more passing, 0 failing
- [ ] At least one test per state-changing function (`postMessage`) and one for revert case

### 6.4 Etherscan Verification

- [ ] `npx hardhat verify --network sepolia <CONTRACT_ADDRESS>` exits 0
- [ ] Green ✅ "Contract Source Code Verified" badge visible on `sepolia.etherscan.io`

### 6.5 Web3.js Interaction

- [ ] `node scripts/interact.js` exits 0
- [ ] Transaction hash printed to console (confirms `postMessage` sent on Sepolia)
- [ ] `getMessages` return value printed — contains the posted message string

### 6.6 Remix IDE Deployment

- [ ] `MessageBoard` successfully deployed via Remix IDE + MetaMask on Sepolia
- [ ] `postMessage` called and confirmed via MetaMask from Remix panel
- [ ] `getMessages` called and correct result visible in Remix output

### 6.7 Screenshot Capture

- [ ] `fig-3.1-sepolia-deploy-terminal.png` — Terminal output of Ignition deploy (contract address visible)
- [ ] `fig-3.2-sepolia-etherscan-tx.png` — Etherscan transaction confirmation page
- [ ] `fig-3.3-metamask-sepolia-network.png` — MetaMask showing Sepolia network + balance
- [ ] `fig-3.4-etherscan-verified-contract.png` — Etherscan verified contract page (green badge)
- [ ] `fig-3.5-remix-deploy-output.png` — Remix IDE deploy output + deployed contract panel
- [ ] All screenshots saved to `Exp-3/screenshots/` in `.png` format

### 6.8 Security & Hygiene

- [ ] `git status` confirms `.env` is **not** staged or tracked
- [ ] No private keys appear in any committed file
- [ ] `node_modules/`, `artifacts/`, `cache/`, `ignition/deployments/` are gitignored

### 6.9 Documentation

- [ ] `Exp-3/README.md` steps match the actual commands used
- [ ] `EXP-3_PLAN.md` `FILE_LENGTH_TAG` on line 1 matches actual line count
- [ ] `FILE_LENGTH_TAG` in §0 Snapshot table also updated to match

---

## 7. Known Issues & Fixes

---

### Issue-1 — Deprecated Testnets (Ropsten / Rinkeby / Goerli)

**Symptom**: Any command or documentation referencing `ropsten`, `rinkeby`, or `goerli` networks
fails: `Error: connect ECONNREFUSED` or `RPC endpoint unreachable`.

**Root Cause**: Ropsten was shut down September 2022, Rinkeby October 2022, Goerli officially
deprecated October 2023 and sunset. Their RPC endpoints no longer exist.

**Fix**: Use **Sepolia** (Chain ID 11155111) as the primary testnet. `hardhat.config.js` in
this experiment has Sepolia pre-configured. Never add or reference the deprecated networks.

**Reference**: [Ethereum.org — Deprecated Networks](https://ethereum.org/en/developers/docs/networks/)

---

### Issue-2 — Alchemy Free-Tier Rate Limit During Deploy

**Symptom**: Deploy hangs, then fails with `429 Too Many Requests` or
`Request limit exceeded for free tier`.

**Root Cause**: Alchemy free tier (25M compute units/month) can be exhausted by rapid
repeated deploy + verify calls during iterative development.

**Fix**:
```bash
# Option A — wait 60 seconds and retry
# Option B — switch to Infura: set INFURA_API_KEY in .env and update hardhat.config.js
# to use INFURA_API_KEY when ALCHEMY_API_KEY is empty (already conditionally handled)
```

**Reference**: [Alchemy Rate Limits](https://docs.alchemy.com/reference/rate-limits)

---

### Issue-3 — MetaMask Pending Transaction Stuck

**Symptom**: MetaMask shows a transaction as "Pending" and all new transactions queue behind it.

**Root Cause**: Nonce desync between MetaMask's local cache and Sepolia chain state, typically
caused by switching between local and testnet networks with the same account.

**Fix**:
1. MetaMask → Account menu → **Settings** → **Advanced** → **Clear activity and nonce data**.
2. Confirm reset. MetaMask will re-sync nonce from chain on next transaction.

> See also CDM-5 for the full context on this issue.

---

### Issue-4 — hardhat-toolbox vs hardhat-verify Plugin Conflict

**Symptom**: `npx hardhat verify` fails with:
`Error: Cannot find module '@nomicfoundation/hardhat-verify'` or duplicate plugin registration.

**Root Cause**: `@nomicfoundation/hardhat-toolbox` (v5+) bundles `hardhat-verify` internally.
If someone also adds `hardhat-verify` explicitly to `package.json`, the plugin registers twice
and throws.

**Fix**:
- Remove any standalone `@nomicfoundation/hardhat-verify` from `package.json` if present.
- `hardhat-toolbox` v5 already includes verify — no separate install needed.
- Confirm with: `npx hardhat --help | grep verify`

---

### Issue-5 — remixd CORS / Connection Drop in Remix IDE

**Symptom**: Remix IDE shows "Cannot connect to localhost" or the localhost workspace
disappears after a few minutes.

**Root Cause**: `remixd` v0.6.x requires the `--remix-ide` flag pointing to the exact origin.
Without it, CORS headers are not set correctly and the browser rejects the WebSocket.

**Fix**:
```bash
# Always start remixd with the exact origin flag:
remixd -s ./contracts --remix-ide https://remix.ethereum.org
```

If the connection drops silently: stop remixd (`Ctrl+C`), restart it, and click
**Connect to Localhost** again in Remix IDE.

**Reference**: [Remixd documentation](https://remix-ide.readthedocs.io/en/latest/remixd.html)

---

## 8. Security Reminders

> ⚠️ These rules are non-negotiable. A PR will be rejected if any of these are violated.

- **Never** commit `.env` to Git. Use `.env.example` with placeholder values only.
- **Never** use a wallet with real ETH for any experiment — use dedicated test accounts only.
- **Never** deploy to Ethereum Mainnet — all experiments target local nodes or Sepolia testnet.
- **Always** use a freshly created MetaMask account for testnet lab work.
- **Always** verify that `git diff --cached` shows no `.env`, `*.pem`, or `*.key` files.
- **Exp-3 specific**: The `.env` `PRIVATE_KEY` must be a **dedicated testnet-only** wallet —
  never your primary MetaMask account that holds real funds.
- **Exp-3 specific**: Do not share your Alchemy or Infura API key in any screenshot, PR
  description, or commit message. Rotate keys immediately if accidentally exposed.
- **Exp-3 specific**: `PRIVATE_KEY` value must have **no leading/trailing whitespace** in `.env`
  — a space after `PRIVATE_KEY=` causes silent authentication failures during deploy.
- **Exp-3 specific**: `ignition/deployments/chain-11155111/` stores your Sepolia contract
  address — do not delete this folder before completing Phases 7 and 8.

---

## 9. Git Commit Checkpoints

Commit at each checkpoint. Use the exact format: `<type>(<scope>): <summary>`

| Checkpoint | After Completing | Suggested Commit Message |
|-----------|-----------------|--------------------------|
| CP-1 | Phase 1 — config verified | `config(exp-3): verify hardhat config for sepolia testnet deploy` |
| CP-2 | Phase 2 — contract written | `feat(exp-3): add MessageBoard.sol with postMessage and getMessages` |
| CP-3 | Phase 3 — ignition module | `exp(exp-3): add Hardhat Ignition module for MessageBoard deploy` |
| CP-4 | Phase 4 — tests written | `test(exp-3): add Hardhat test suite for MessageBoard contract` |
| CP-5 | Phase 6 — Sepolia deployed | `exp(exp-3): deploy MessageBoard to Sepolia testnet via Ignition` |
| CP-6 | Phase 7 — Etherscan verified | `exp(exp-3): verify MessageBoard source on Sepolia Etherscan` |
| CP-7 | Phase 8 — Web3.js interact | `feat(exp-3): add Web3.js interaction script for MessageBoard on Sepolia` |
| CP-8 | Phase 10 — final cleanup | `chore(exp-3): add screenshots, clean up artifacts, finalise exp-3` |

> 📌 Phases 5 and 9 do not have dedicated commits — Phase 5 is preparatory and Phase 9
> (Remix) produces no committed file changes; screenshots are committed at CP-8.

---

*Maintained by [Pratham Diwadkar](https://github.com/prathamdxkar) — INFT, Atharva College of Engineering*
*This plan governs [`Exp-3/EXP-3_PLAN.md`](EXP-3_PLAN.md) in the Blockchain Lab repository.*

