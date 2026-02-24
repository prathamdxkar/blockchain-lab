# Exp-6 — Mini Project

**Lab Outcome (LO6)**: Develop and test a Full-fledged DApp using Ethereum / Hyperledger.

**Course**: ITL801 — Blockchain Lab | BE IT, SEM VIII | University of Mumbai

---

## 1. Abstract

This Mini Project demonstrates an end-to-end Decentralised Application (DApp) built on the Ethereum blockchain, combining **Foundry** (Rust-based EVM test framework) with **Hardhat 3** (JavaScript orchestration) for professional-grade smart contract development, testing, and deployment.

---

## 2. Tools / Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Solidity | 0.8.26 | Smart contract language |
| Foundry | forge, anvil, cast, chisel | Compile, test, local node |
| Hardhat | v3.x (Node 22) | Deploy scripts, task runner |
| OpenZeppelin | lib/openzeppelin-contracts | Audited contract libraries |
| Node.js | v22 (nvm) | JavaScript runtime |
| Anvil / Ganache | Local node port 8545 | Test blockchain |
| MetaMask | Browser extension | Wallet / Transaction signing |
| Sepolia | Ethereum testnet | Live test deployment |

---

## 3. Project Structure

```
Exp-6/
├── src/               # Solidity source contracts (Foundry-style)
│   └── Counter.sol    # Starter contract (replace with your DApp)
├── test/              # Foundry tests (*.t.sol)
│   └── Counter.t.sol
├── script/            # Foundry deployment scripts (*.s.sol)
│   └── Counter.s.sol
├── scripts/           # Hardhat deployment scripts (*.js)
│   └── deploy.js
├── lib/               # Foundry dependencies (git submodules)
│   ├── forge-std/
│   └── openzeppelin-contracts/
├── artifacts/         # Hardhat compiled ABIs (git-ignored)
├── out/               # Foundry compiled output (git-ignored)
├── foundry.toml       # Foundry configuration
├── hardhat.config.js  # Hardhat configuration
├── .nvmrc             # Node version pin (22)
├── .env               # Secret keys (git-ignored — copy from .env.example)
└── .env.example
```

---

## 4. Setup

### Prerequisites

```bash
# Node.js via nvm (v22)
nvm use 22                     # or: nvm install 22

# Foundry (all binaries must be in PATH)
forge --version                # forge 1.x
anvil --version
cast --version

# MetaMask extension installed in browser
```

### Install dependencies

```bash
cd Exp-6/

# Install npm packages (Hardhat 3 + helpers)
npm install

# Foundry libraries are git submodules (already in lib/)
# If re-cloning the repo, run:
# forge install OpenZeppelin/openzeppelin-contracts --no-git
```

### Environment

```bash
cp .env.example .env
# Edit .env — fill in PRIVATE_KEY and API keys
```

---

## 5. Compile

```bash
# Foundry
forge build

# Hardhat
npm run compile:hh
```

---

## 6. Test

```bash
# Foundry (verbose)
forge test -vvv

# Foundry (watch mode)
npm run test:forge:watch

# Coverage report
forge coverage

# Hardhat
npm run test:hh
```

---

## 7. Local Deployment

### Option A — Anvil (Foundry's local node)

```bash
# Terminal 1 — Start Anvil
anvil

# Terminal 2 — Deploy with Forge script
forge script script/Counter.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

### Option B — Hardhat + Anvil

```bash
# Deploy via Hardhat scripts
npm run deploy:anvil
```

### MetaMask — Add Anvil Network

| Field | Value |
|-------|-------|
| Network Name | Anvil Local |
| RPC URL | http://127.0.0.1:8545 |
| Chain ID | 31337 |
| Currency Symbol | ETH |

Import one of Anvil's test accounts using its private key (printed when `anvil` starts).

---

## 8. Testnet Deployment (Sepolia)

```bash
# Using Forge script
forge script script/Counter.s.sol \
  --rpc-url sepolia \
  --broadcast \
  --verify

# Using Hardhat
npm run deploy:sepolia
```

Get Sepolia ETH from: https://sepoliafaucet.com or https://faucet.chainstack.com/sepolia-testnet-faucet

---

## 9. Contract Verification

```bash
# Via Hardhat (Etherscan)
npm run verify:sepolia -- <deployed_contract_address>

# Via Foundry (Etherscan + Sourcify)
forge verify-contract <address> src/Counter.sol:Counter \
  --chain sepolia \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

---

## 10. Mini Project Report Outline (LO6)

| Chapter | Content |
|---------|---------|
| Abstract | Problem, proposed solution, technology summary |
| Chapter 1 | Introduction, Literature survey, Problem definition, Objectives, Proposed solution, Tech/platform |
| Chapter 2 | System design, Block diagram, Flowchart, Software requirements, Cost estimation |
| Chapter 3 | Implementation snapshots with explanation, source code listing, future directions |
| Chapter 4 | Conclusion |
| References | IEEE/ACM citations |

---

## Foundry Reference

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
