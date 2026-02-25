# Experiment 1 — Develop and Establish Local Blockchain using Truffle

## Aim

To develop and establish a local Ethereum blockchain using Truffle Suite and Ganache, and deploy a
simple smart contract to verify end-to-end local blockchain functionality.

## Lab Outcome Mapping

**LO1** — Develop and test smart contract on local Blockchain. *(L3, L4)*

## Tools Used

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v22.x.x (nvm: `legacy` or `modern`) | JavaScript runtime |
| Truffle | v5.11.5 | Smart contract compile / migrate / test framework |
| Ganache CLI | v7.9.x | Local Ethereum network (CLI mode) |
| Hardhat | v2.28.x | Alternative local Ethereum dev environment |
| Solidity | ^0.8.21 | Smart contract language |

## Project Structure

```
Exp-1/
├── contracts/              # Solidity smart contracts (.sol)
├── ignition/
│   └── modules/            # Hardhat Ignition deployment scripts
├── migrations/             # Truffle migration scripts
├── test/                   # Test files (.js)
├── .env.example            # Environment variable template
├── .nvmrc                  # Node version (22)
├── .prettierrc             # Solidity + JS code formatter config
├── hardhat.config.js       # Hardhat configuration
├── truffle-config.js       # Truffle configuration
└── package.json            # npm manifest with devDependencies
```

## Steps to Run

### Prerequisites

Ensure the following global tools are installed (see `docs/DEPENDENCY.md`):

```bash
truffle version   # Truffle v5.x.x
ganache --version # ganache v7.x.x
node --version    # v22.x.x
```

### 1. Start Ganache CLI (local blockchain)

Open a new terminal and run:

```bash
ganache --port 7545 --chainId 1337 --accounts 10 --defaultBalanceEther 1000
```

Leave this terminal running throughout the experiment.

### 2. Compile Contracts (Truffle)

```bash
cd Exp-1
nvm use 22
truffle compile
```

### 3. Deploy Contracts (Truffle Migrate)

```bash
truffle migrate --network development
```

### 4. Test Contracts (Truffle)

```bash
truffle test
```

### 5. Open Truffle Console

```bash
truffle console --network development
```

### 6. Alternatively — Using Hardhat

```bash
# Compile
npx hardhat compile

# Run local Hardhat node (separate terminal)
npx hardhat node

# Deploy (in another terminal)
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network localhost

# Test
npx hardhat test
```

## Expected Output

After successful migration, you should see output similar to:

```
Compiling your contracts...
===========================
> Compiling ./contracts/SimpleStorage.sol

Migrations dry-run (simulation)
================================
> Network name:    'development'
> Network id:      1337
> Block gas limit: 6721975 (0x6691b7)

1_initial_migration.js
======================
   Replacing 'Migrations'
   ----------------------
   > transaction hash:    0x...
   > block number:        1
   > contract address:    0x...

Summary
=======
> Total deployments:   1
> Final cost:          0.00000 ETH
```

## Notes

- The Ganache CLI starts fresh every time (no persistent state by default).
  Use `--db ./ganache-db` to persist blockchain state between restarts.
- Chain ID must match what is configured in MetaMask and `truffle-config.js`.
- Truffle port is `7545` (Ganache Desktop / CLI with `--port 7545`).
  Hardhat node uses `8545` by default.

---

*Blockchain Lab · IT Engineering SEM VIII · University of Mumbai · AY 2025-26*
