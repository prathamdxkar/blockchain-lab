# Experiment 4 — Design and Develop Blockchain Program using MetaMask

## Aim

To design and develop a custom cryptocurrency (ERC-20 token) smart contract using Solidity and
OpenZeppelin, deploy it to the Ethereum Sepolia testnet via MetaMask and Remix IDE, and interact
with the token from a MetaMask wallet.

## Lab Outcome Mapping

**LO4** — Design and develop Cryptocurrency. *(L4)*

## Tools Used

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v22.x.x | JavaScript runtime |
| Hardhat | v2.28.x | Compile, test, deploy |
| Solidity | ^0.8.21 | ERC-20 smart contract language |
| OpenZeppelin | ^5.x.x | Battle-tested ERC-20 base contract |
| MetaMask | — | Wallet provider for Remix (Injected Provider) |
| Remix IDE | — | Browser-based contract deployment |
| Etherscan (Sepolia) | — | Token contract verification |

## Project Structure

```
Exp-4/
├── contracts/
│   └── MyToken.sol         # ERC-20 token contract (to be created)
├── ignition/
│   └── modules/
│       └── Deploy.js       # Hardhat Ignition deployment module
├── migrations/             # Truffle migrations (local testing)
├── test/
│   └── MyToken.test.js     # Test suite for the ERC-20 token
├── .env                    # Secrets (NOT committed)
├── .env.example            # Template for .env
├── .nvmrc                  # Node version (22)
├── .prettierrc             # Code formatter config
├── hardhat.config.js       # Hardhat config (includes Sepolia)
├── truffle-config.js       # Truffle config (local dev)
└── package.json            # npm manifest
```

## Steps to Run

### Prerequisites

1. `.env` file with `PRIVATE_KEY`, `ALCHEMY_API_KEY`, `ETHERSCAN_API_KEY`
2. MetaMask wallet with Sepolia test ETH (from a faucet)
3. Remix IDE open: https://remix.ethereum.org

### 1. Create the ERC-20 Token Contract

Create `contracts/MyToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("MyToken", "MTK")
        Ownable(initialOwner)
    {
        // Mint 1,000,000 tokens to the deployer (1e6 * 10^decimals)
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

### 2. Compile and Test Locally

```bash
cd Exp-4
nvm use 22
npx hardhat compile
npx hardhat test
```

### 3. Deploy to Local Hardhat Network

```bash
npx hardhat node        # Start local node in a new terminal
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network localhost
```

### 4. Deploy to Sepolia Testnet

```bash
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network sepolia
```

### 5. Verify on Etherscan

```bash
npx hardhat verify --network sepolia <TOKEN_CONTRACT_ADDRESS> <INITIAL_OWNER_ADDRESS>
```

### 6. Add Token to MetaMask

1. In MetaMask → Import tokens → Paste the contract address
2. Token symbol and decimals auto-populate from the contract
3. Your token balance should appear

### 7. Alternatively — Deploy via Remix + MetaMask

1. ```bash
   remixd -s ./contracts --remix-ide https://remix.ethereum.org
   ```
2. Open Remix → Connect to Localhost → open `MyToken.sol`
3. Compile → Deploy with **Injected Provider - MetaMask** (switch to Sepolia)
4. Confirm transaction in MetaMask

## Expected Output

After deployment:

```
Deployed Addresses
==================
MyTokenModule#MyToken - 0x<TOKEN_ADDRESS>
```

After adding to MetaMask:
- Token **MTK** appears in your MetaMask wallet
- Balance shows **1,000,000 MTK**
- Verified contract visible at: https://sepolia.etherscan.io/address/0x<TOKEN_ADDRESS>

## Notes

- `decimals()` returns 18 by default in OpenZeppelin ERC-20.
- Use `ethers.parseUnits("100", 18)` in tests to represent 100 tokens.
- Never deploy a token with real monetary value as a lab exercise.

---

*Blockchain Lab · IT Engineering SEM VIII · University of Mumbai · AY 2025-26*
