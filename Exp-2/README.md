# Experiment 2 — Develop and Establish Smart Contract and Chain Code

## Aim

To develop and deploy Solidity smart contracts on a local Truffle/Ganache blockchain, and explore
chain code concepts using JavaScript/Go for understanding permissioned blockchain fundamentals.

## Lab Outcome Mapping

**LO2** — Develop and test smart contract on Ethereum test networks. *(L3, L4)*

## Tools Used

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v22.x.x | JavaScript runtime |
| Solidity | ^0.8.21 | Smart contract language |
| Truffle | v5.11.5 | Compile, migrate, test smart contracts |
| Ganache CLI | v7.9.x | Local Ethereum blockchain |
| Hardhat | v2.28.x | Alternative dev environment + testing |
| Web3.js | v1.10.x | Ethereum JavaScript API |

## Project Structure

```
Exp-2/
├── contracts/              # Solidity smart contracts (.sol)
├── ignition/
│   └── modules/            # Hardhat Ignition deployment scripts
├── migrations/             # Truffle migration scripts
├── test/                   # Test files (.js)
├── .env.example            # Environment variable template
├── .nvmrc                  # Node version (22)
├── .prettierrc             # Code formatter config
├── hardhat.config.js       # Hardhat configuration
├── truffle-config.js       # Truffle configuration
└── package.json            # npm manifest with devDependencies
```

## Steps to Run

### Prerequisites

```bash
truffle version   # Truffle v5.x.x
ganache --version # ganache v7.x.x
node --version    # v22.x.x
```

### 1. Start Ganache CLI

```bash
ganache --port 7545 --chainId 1337 --accounts 10 --defaultBalanceEther 1000
```

### 2. Compile Smart Contract (Truffle)

```bash
cd Exp-2
nvm use 22
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
// Get deployed contract instance
const instance = await MyContract.deployed()

// Call a view function
await instance.get()

// Send a transaction
await instance.set(42)

// Verify the updated state
await instance.get()
```

### 5. Run Tests

```bash
truffle test
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

contract MyContract {
    // State variables
    // Events
    // Modifiers
    // Constructor
    // External / Public functions
    // Internal / Private functions
}
```

## Expected Output

After `truffle migrate`:

```
Compiling your contracts...
===========================
> Compiling ./contracts/MyContract.sol
> Artifacts written to ./build/contracts
> Compiled successfully using solc 0.8.21

Starting migrations...
======================
> Network name:    'development'

1_deploy.js
===========
   Deploying 'MyContract'
   ----------------------
   > transaction hash:    0x...
   > contract address:    0x...
   > block number:        1
   > gas used:            xxxxxx

Summary
=======
> Total deployments:   1
```

## Notes

- Chain ID `1337` is the standard for Ganache CLI.
- Use `truffle networks --clean` to reset deployed addresses if you restart Ganache.
- Smart contract ABI is stored in `build/contracts/` after compilation.

---

*Blockchain Lab · IT Engineering SEM VIII · University of Mumbai · AY 2025-26*
