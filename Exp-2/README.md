# Experiment 2 — Develop and Establish Smart Contract and Chain Code

## Aim

To develop and deploy Solidity smart contracts on a local Truffle/Ganache blockchain, and explore
chain code concepts using JavaScript/Go for understanding permissioned blockchain fundamentals.

## Lab Outcome Mapping

**LO2** — Develop and test smart contract on Ethereum test networks. *(L3, L4)*

## Tools Used

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v24.13.1 | JavaScript runtime |
| Solidity | ^0.8.21 | Smart contract language |
| Truffle | v5.11.5 | Compile, migrate, test smart contracts |
| Ganache CLI | v7.9.1 | Local Ethereum blockchain (port 7545) |
| Hardhat | v2.28.6 | Alternative dev environment + testing |
| Web3.js | v1.10.0 | Ethereum JavaScript API |

## Project Structure

```
Exp-2/
├── contracts/              # Solidity smart contracts — Voting.sol
├── chaincode/
│   └── javascript/         # Hyperledger Fabric chaincode skeleton (Node.js)
├── ignition/
│   └── modules/            # Hardhat Ignition deployment module — Deploy.js
├── migrations/             # Truffle migration scripts — 1_deploy_voting.js
├── scripts/                # truffle exec interaction scripts
├── screenshots/            # Lab evidence screenshots (fig-2.Y-name.png)
├── test/                   # Mocha + Chai test suite — Voting.test.js
├── hardhat.config.js       # Hardhat configuration (solc 0.8.21, ganache networks)
├── truffle-config.js       # Truffle configuration (development @ port 7545)
└── package.json            # npm manifest with devDependencies
```

## Steps to Run

### Prerequisites

```bash
truffle version   # Truffle v5.11.5 / Solidity 0.8.21
ganache --version # ganache v7.9.1
node --version    # v24.x.x
```

### 1. Start Ganache CLI

```bash
ganache --port 7545 --chain.chainId 1337 --accounts 10 --defaultBalanceEther 1000
```

### 2. Compile Smart Contract (Truffle)

```bash
cd Exp-2
nvm use 24
truffle compile
```

### 3. Deploy (Migrate) Smart Contract

```bash
truffle migrate --network development
```

### 4. Interact with Contract in Console

```bash
truffle console --network development
```

Inside the console:

```javascript
// Get deployed Voting contract instance
const voting = await Voting.deployed()

// Read all candidates (initial state)
await voting.getCandidates()
// Returns: [ { name: 'Alice', voteCount: 0n }, { name: 'Bob', voteCount: 0n }, ... ]

// Cast a vote for Alice (index 0) from the first account
await voting.castVote(0)

// Verify vote count
const candidates = await voting.getCandidates()
candidates[0].voteCount.toString()   // '1'

// Get the current winner
const winner = await voting.getWinner()
winner.name   // 'Alice'
```

Or run the fully-automated interaction script:

```bash
NODE_OPTIONS=--no-warnings truffle exec scripts/console-interaction.js --network development
```

### 5. Run Tests

```bash
# Preferred — Hardhat in-process EVM (16 test cases, no Ganache required)
npx hardhat test

# Alternative — Truffle test runner (requires Ganache to be running)
npx truffle test --network development
```

### 6. Alternatively — Using Hardhat

```bash
npx hardhat compile
npx hardhat test
npx hardhat node                          # In a separate terminal
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network localhost
```

## Solidity Contract Conventions

All contracts in this experiment must follow:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Voting {
    // State variables  (Candidate[] public candidates, mapping hasVoted, address owner)
    // Events           (CandidateAdded, VoteCast)
    // Modifiers        (onlyOwner)
    // Constructor      (string[] memory candidateNames)
    // External / Public functions  (castVote, addCandidate, getCandidates, getWinner)
}
```

## Expected Output

After `truffle migrate --reset --network development`:

```
Compiling your contracts...
===========================
> Compiling ./contracts/Voting.sol
> Artifacts written to ./build/contracts
> Compiled successfully using:
   - solc: 0.8.21+commit.d9974bed.Emscripten.clang

Starting migrations...
======================
> Network name:    'development'

1_deploy_voting.js
==================
   Deploying 'Voting'
   ------------------
   > transaction hash:    0xe8951b9dee5a856d4d89aa99135af3b616667c0a2e5c5da73c2f2cb3af0f08b7
   > contract address:    0x061F7EA4ca91203b6c79076B6b21B1914D6b28D7
   > block number:        5
   > gas used:            1258877

Summary
=======
> Total deployments:   1
> Final cost:          0.003806493114635341 ETH
```

After `npx hardhat test`:

```
  Voting
    ✔ TC-1:  getCandidates() returns 3 candidates with voteCount 0
    ✔ TC-2:  castVote(0) increments Alice voteCount from 0 to 1
    ✔ TC-3:  double vote reverts with 'Already voted'
    ...
  16 passing (933ms)
```

## Notes

- Chain ID `1337` is the standard for Ganache CLI.
- Use `truffle networks --clean` to reset deployed addresses if you restart Ganache.
- Smart contract ABI is stored in `build/contracts/` after compilation.

---

*Blockchain Lab · IT Engineering SEM VIII · University of Mumbai · AY 2025-26*
