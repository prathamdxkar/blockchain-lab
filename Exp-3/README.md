# Experiment 3 — Deployment and Publishing Smart Contracts on Ethereum Test Network

## Aim

To deploy and publish Solidity smart contracts on the Ethereum Sepolia testnet using Hardhat with
Alchemy/Infura RPC providers, and verify the deployed contract on Etherscan.

## Lab Outcome Mapping

**LO3** — Write and deploy smart contract using Remix IDE and Metamask. *(L4)*

## Tools Used

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v22.x.x | JavaScript runtime |
| Hardhat | v2.28.x | Testnet deployment + Etherscan verification |
| Solidity | ^0.8.21 | Smart contract language |
| Alchemy / Infura | — | Ethereum node RPC provider |
| MetaMask | — | Test wallet for signing transactions |
| Etherscan Sepolia | — | Contract verification and explorer |
| Remix IDE | — | Browser-based contract deployment via injected MetaMask |

## Project Structure

```
Exp-3/
├── contracts/              # Solidity smart contracts (.sol)
├── ignition/
│   └── modules/            # Hardhat Ignition deployment scripts
├── migrations/             # Truffle migration scripts (for local testing)
├── test/                   # Test files (.js)
├── .env                    # Your secrets (NOT committed — copy from .env.example)
├── .env.example            # Environment variable template (safe to commit)
├── .nvmrc                  # Node version (22)
├── .prettierrc             # Code formatter config
├── hardhat.config.js       # Hardhat config (includes Sepolia + Holesky networks)
├── truffle-config.js       # Truffle config (local dev only)
└── package.json            # npm manifest
```

## Steps to Run

### Prerequisites

1. **MetaMask wallet** — created and connected to Sepolia in Chrome
2. **Sepolia test ETH** — get free test ETH from one of these faucets:
   - https://sepoliafaucet.com
   - https://faucet.sepolia.dev
   - https://faucets.chain.link (with GitHub login)
3. **API keys** — Alchemy or Infura project key + Etherscan API key
4. **Copy .env file**:

   ```bash
   cp .env.example .env
   # Fill in PRIVATE_KEY, ALCHEMY_API_KEY, ETHERSCAN_API_KEY
   ```

### 1. Compile Contracts

```bash
cd Exp-3
nvm use 22
npx hardhat compile
```

### 2. Run Tests Locally (Hardhat network)

```bash
npx hardhat test
```

### 3. Deploy to Sepolia Testnet

```bash
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network sepolia
```

### 4. Verify Contract on Etherscan Sepolia

After deployment, copy the contract address from the output and verify:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> [constructor-args...]
```

### 5. Alternatively — Deploy via Remix IDE + MetaMask

1. Start Remixd to share contracts locally:
   ```bash
   remixd -s ./contracts --remix-ide https://remix.ethereum.org
   ```
2. Open https://remix.ethereum.org → Connect to Localhost → open your contract
3. In **Solidity Compiler** → compile the contract
4. In **Deploy & Run Transactions** → change Environment to **Injected Provider - MetaMask**
5. MetaMask will prompt to connect and confirm — switch to Sepolia testnet
6. Click **Deploy** → confirm the transaction in MetaMask
7. Copy the deployed contract address from the Remix output

## Important Notes on Test Networks

> ⚠️ **Ropsten, Rinkeby, and Goerli test networks have been deprecated (shutdown in 2022-2023).**
> Always use **Sepolia** as the primary Ethereum testnet.

| Network | Chain ID | Status |
|---------|----------|--------|
| Sepolia | 11155111 | ✅ Active (recommended) |
| Holesky | 17000 | ✅ Active (staking-oriented) |
| Goerli | 5 | ❌ Deprecated |
| Ropsten | 3 | ❌ Deprecated |
| Rinkeby | 4 | ❌ Deprecated |

## Expected Output

After `npx hardhat ignition deploy ./ignition/modules/Deploy.js --network sepolia`:

```
Hardhat Ignition 🚀

Deploying [ MyContractModule ]

Batch #1
  Executing MyContractModule#MyContract...

Batch #1 complete
  MyContractModule#MyContract - 0x<CONTRACT_ADDRESS>

Deployed Addresses
==================
MyContractModule#MyContract - 0x<CONTRACT_ADDRESS>
```

After verification:
```
The contract 0x<CONTRACT_ADDRESS> has been verified on the block explorer.
https://sepolia.etherscan.io/address/0x<CONTRACT_ADDRESS>#code
```

---

*Blockchain Lab · IT Engineering SEM VIII · University of Mumbai · AY 2025-26*
