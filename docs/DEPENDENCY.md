# Dependency Setup Guide — Blockchain Lab

> **University of Mumbai · IT Engineering SEM VIII · AY 2025-26**
> Web3 Stack: Hardhat | Truffle | Ganache | Foundry | Remix IDE

This guide walks through installing and configuring all tools required for the Blockchain Lab.
Instructions are provided for both **Windows (native)** and **WSL / Linux** users.

---

## Table of Contents

1. [Platform Notes](#1-platform-notes)
2. [Git](#2-git)
3. [Windows Subsystem for Linux (WSL2)](#3-windows-subsystem-for-linux-wsl2-windows-only)
4. [Node.js LTS via nvm](#4-nodejs-lts-via-nvm)
5. [Python 3](#5-python-3-optional-tooling)
6. [Hardhat](#6-hardhat)
7. [Truffle Suite](#7-truffle-suite)
8. [Ganache](#8-ganache)
9. [Remix IDE + Remixd](#9-remix-ide--remixd)
10. [Foundry](#10-foundry)
11. [MetaMask](#11-metamask)
12. [Verification Checklist](#12-verification-checklist)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Platform Notes

| Symbol | Meaning |
|--------|---------|
| 🪟 | Windows (PowerShell / CMD) |
| 🐧 | WSL2 / Linux / macOS (Bash / Zsh) |
| 🌐 | Browser-based (no terminal install) |
| ⚠️ | Important warning or known issue |

**Recommended setup for Windows users:**
> Install WSL2 first (Section 3), then follow the 🐧 instructions inside WSL for Node.js, Foundry,
> and Truffle. Use 🪟 instructions only where explicitly stated.
> Foundry does **not** have stable native Windows support — WSL2 is mandatory for Foundry.

---

## 2. Git

Git is required for cloning repositories, managing experiment branches, and integrating with GitHub.

### 🪟 Windows

1. Download the latest Git for Windows installer:
   **https://git-scm.com/download/win**

2. During setup, select:
   - ✅ **Git Bash** (recommended terminal for Git on Windows)
   - ✅ **Use Git from the Windows Command line and also from 3rd-party software**
   - ✅ **Checkout Windows-style, commit Unix-style line endings**

3. After installation, open **PowerShell** or **Git Bash** and verify:

   ```powershell
   git --version
   # Expected output: git version 2.x.x.windows.x
   ```

4. Configure your identity (required for commits):

   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your@email.com"
   ```

### 🐧 WSL / Linux

Git is typically pre-installed on Ubuntu/Debian-based distros. Update and verify:

```bash
sudo apt update && sudo apt install -y git
git --version
# Expected output: git version 2.x.x
```

Configure identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

## 3. Windows Subsystem for Linux (WSL2) — Windows Only

WSL2 is required on Windows for running **Foundry** and is the recommended environment for the full
Web3 toolchain. Skip this section if you are on Linux or macOS.

### Prerequisites

- Windows 10 version 2004+ (Build 19041+) or Windows 11
- Virtualization enabled in BIOS (Intel VT-x / AMD-V)

### Installation

1. Open **PowerShell as Administrator** and run:

   ```powershell
   wsl --install
   ```

   This installs WSL2 and the default Ubuntu distribution in one step.
   Restart your PC when prompted.

2. After restart, launch **Ubuntu** from the Start Menu. It will complete setup and ask you to
   create a Linux username and password.

3. Verify WSL2 is active:

   ```powershell
   wsl --list --verbose
   # NAME      STATE           VERSION
   # Ubuntu    Running         2
   ```

   The version column must say `2`. If it says `1`, upgrade with:

   ```powershell
   wsl --set-version Ubuntu 2
   ```

4. Update the Ubuntu package list inside WSL:

   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y build-essential curl wget git unzip
   ```

> ⚠️ **VS Code + WSL Integration:** Install the `ms-vscode-remote.remote-wsl` extension in VS Code
> so you can open your WSL filesystem directly in the editor. See `docs/EXTENSION.md` for details.

---

## 4. Node.js LTS via nvm

All Hardhat, Truffle, and Ganache tooling runs on Node.js. Installing via **nvm** (Node Version
Manager) lets you switch Node versions per project, which is critical for Web3 tooling compatibility.

> ⚠️ Do **NOT** install Node.js directly from https://nodejs.org unless you have a specific reason.
> Use nvm to keep version management clean.

### 🪟 Windows — nvm-windows

1. Download the `nvm-setup.exe` installer from the latest release:
   **https://github.com/coreybutler/nvm-windows/releases**
   Look for `nvm-setup.exe` under **Assets**.

2. Run the installer and follow the wizard. Accept the default paths.

3. Open a **new** PowerShell window (restart is NOT required) and verify:

   ```powershell
   nvm version
   # Expected: 1.x.x
   ```

4. Install Node.js LTS (v22.x as of 2025-26):

   ```powershell
   nvm install lts
   nvm use lts
   ```

5. Verify:

   ```powershell
   node --version   # v22.x.x
   npm --version    # 10.x.x
   ```

6. Set a default so it auto-activates in new shells:

   ```powershell
   nvm alias default lts
   ```

### 🐧 WSL / Linux — nvm

1. Install nvm via the official script:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```

2. Reload your shell profile:

   ```bash
   source ~/.bashrc
   # or for Zsh:
   source ~/.zshrc
   ```

3. Verify nvm is available:

   ```bash
   nvm --version
   # Expected: 0.40.x
   ```

4. Install Node.js LTS and set it as default:

   ```bash
   nvm install --lts
   nvm use --lts
   nvm alias default node
   ```

5. Verify:

   ```bash
   node --version   # v22.x.x
   npm --version    # 10.x.x
   ```

> **Tip:** Node.js 22.x (LTS "Jod") is recommended for all experiments. Hardhat currently supports
> Node 18.x, 20.x, and 22.x. Truffle supports Node 18.x and 20.x.
> If you encounter compatibility errors, switch to Node LTS 20.x:
> ```bash
> nvm install 20
> nvm use 20
> ```

---

## 5. Python 3 — Optional Tooling

Some Web3 scripts, legacy Truffle plugins, and automation utilities require Python 3.
Most lab experiments do **not** need Python, but it is good to have available.

### 🪟 Windows

1. Download from: **https://www.python.org/downloads/windows/**
   Install the latest Python 3.x release.

2. During installation:
   - ✅ **Add Python to PATH** (checkbox on the first installer screen)
   - ✅ **pip** (enabled by default)

3. Verify:

   ```powershell
   python --version   # Python 3.x.x
   pip --version
   ```

### 🐧 WSL / Linux

Python 3 is usually pre-installed. Check and install if missing:

```bash
python3 --version
# If missing:
sudo apt install -y python3 python3-pip
```

---

---

## 6. Hardhat

Hardhat is the **primary smart contract development framework** for this lab. It provides a local
Ethereum network, Solidity compiler integration, deployment scripts, and a rich testing environment.

> **Official website:** https://hardhat.org

### Project Setup (per experiment)

Hardhat is installed **per project** (not globally). Each lab experiment will have its own
`package.json`. Run these commands inside the experiment folder:

```bash
mkdir experiment-01 && cd experiment-01
npm init -y
npm install --save-dev hardhat
```

### Initialize a Hardhat Project

```bash
npx hardhat init
```

You will be prompted to choose a project type:

```
? What do you want to do?
❯ Create a JavaScript project
  Create a TypeScript project
  Create a TypeScript project (with Viem)
  Create an empty hardhat.config.js
  Quit
```

Select **Create a JavaScript project** for most lab experiments.

Accept all defaults when prompted. This installs `@nomicfoundation/hardhat-toolbox` which includes:
- `ethers.js` — Ethereum JavaScript library
- `hardhat-ethers` — Ethers.js integration for Hardhat
- `hardhat-chai-matchers` — Smart contract test matchers
- `mocha` + `chai` — Testing framework
- `hardhat-gas-reporter` — Gas usage reports
- `solidity-coverage` — Code coverage for Solidity

### Project Structure (post-init)

```
experiment-01/
├── contracts/          # Solidity smart contracts (.sol)
├── ignition/modules/   # Deployment scripts
├── test/               # Test files (.js or .ts)
├── hardhat.config.js   # Hardhat configuration
└── package.json
```

### Useful Hardhat Commands

```bash
# Compile contracts
npx hardhat compile

# Run all tests
npx hardhat test

# Start local Hardhat network (persists in terminal)
npx hardhat node

# Deploy to local network (in a separate terminal)
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network localhost

# Open Hardhat console (REPL connected to network)
npx hardhat console --network localhost
```

### Verify Hardhat Install

```bash
npx hardhat --version
# Expected output: 2.x.x
```

---

## 7. Truffle Suite

Truffle is a legacy but widely taught smart contract framework. The University of Mumbai syllabus 
includes Truffle-based experiments, so it needs to be installed globally.

> ⚠️ **Important:** Truffle Suite was officially sunset by Consensys in 2024. The packages are
> archived at https://archive.trufflesuite.com/ but remain functional for coursework.
> For new personal projects, prefer Hardhat or Foundry.

> **Archive site:** https://archive.trufflesuite.com

### 🪟 Windows & 🐧 WSL / Linux

Install Truffle globally via npm:

```bash
npm install -g truffle
```

Verify:

```bash
truffle version
# Expected output:
# Truffle v5.x.x (core: 5.x.x)
# Ganache v7.x.x
# Solidity - 0.x.x (solc-js)
# Node: 22.x.x
# Web3.js: 1.x.x
```

### Initialize a Truffle Project

```bash
mkdir experiment-truffle && cd experiment-truffle
truffle init
```

Truffle project structure:

```
experiment-truffle/
├── contracts/          # Solidity contracts
├── migrations/         # Deployment migration scripts
├── test/               # Test files
└── truffle-config.js   # Truffle configuration
```

### Useful Truffle Commands

```bash
# Compile contracts
truffle compile

# Run migrations (deploy)
truffle migrate

# Run tests
truffle test

# Open Truffle console
truffle console
```

### Connecting to Ganache (local network)

In `truffle-config.js`, configure the `development` network:

```javascript
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,          // Ganache GUI default port
      // port: 8545        // Ganache CLI default port
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.21",
    },
  },
};
```

---

## 8. Ganache

Ganache provides a **personal local Ethereum blockchain** for testing. It comes in two forms:

| Form | Description | Port |
|------|-------------|------|
| **Ganache CLI** (`ganache`) | Command-line, scriptable, CI-friendly | `8545` |
| **Ganache Desktop** (GUI) | Visual interface, accounts/transactions view | `7545` |

### 8.1 Ganache CLI

#### 🪟 Windows & 🐧 WSL / Linux

Install globally:

```bash
npm install -g ganache
```

Start a local blockchain:

```bash
ganache
# Starts on http://127.0.0.1:8545 with 10 pre-funded accounts
```

Common options:

```bash
# Specify port, block time, and number of accounts
ganache --port 8545 --accounts 10 --blockTime 1

# Set a deterministic mnemonic (useful for consistent test accounts)
ganache --mnemonic "test test test test test test test test test test test junk"

# Increase account balance
ganache --accounts 10 --defaultBalanceEther 1000
```

Verify:

```bash
ganache --version
# Expected: ganache v7.x.x
```

### 8.2 Ganache Desktop (GUI)

> ⚠️ Ganache Desktop is archived and no longer actively maintained, but remains useful for
> visual learning in lab environments.

1. Download from: **https://archive.trufflesuite.com/ganache/**
   Select the Windows `.exe` installer or Linux `.AppImage`.

2. On first launch, create a **New Workspace**:
   - Set **RPC SERVER** to `127.0.0.1:7545`
   - Link your `truffle-config.js` or `hardhat.config.js` project file for automatic contract display.

3. The dashboard shows:
   - Pre-funded test accounts with private keys
   - Block explorer
   - Transaction logs
   - Contract deployments

> **Tip:** Always use port `7545` for Ganache Desktop and `8545` for Ganache CLI to avoid port
> conflicts when running both simultaneously.

---

## 9. Remix IDE + Remixd

Remix IDE is a **browser-based Solidity development environment** by the Ethereum Foundation.
No installation required for the web version — ideal for quick experimentation.

> **Remix IDE:** https://remix.ethereum.org

### 9.1 Remix IDE (Browser — No Install)

1. Open **https://remix.ethereum.org** in Chrome or Firefox.
2. The IDE auto-loads with example contracts in the **File Explorer**.
3. Key panels:
   - **File Explorer** — create, open, save `.sol` files
   - **Solidity Compiler** — choose compiler version, compile contracts
   - **Deploy & Run Transactions** — deploy to JS VM (in-browser), Injected Provider (MetaMask), or
     Remote RPC (Ganache / Hardhat node)
   - **Solidity Debugger** — step through transactions

### 9.2 Remixd — Connect Remix to Local Files

Remixd bridges the Remix browser IDE with your local filesystem so you can edit files in VS Code
and compile/deploy from the Remix browser simultaneously.

#### Install Remixd

```bash
npm install -g @remix-project/remixd
```

#### Start Remixd

```bash
# Share a local folder with Remix IDE
remixd -s ./contracts --remix-ide https://remix.ethereum.org
```

This makes your local `./contracts` folder accessible in the Remix IDE browser under
**"Connect to Localhost"** in the File Explorer.

#### 🪟 Windows — Remixd Note

If `remixd` is not found in PowerShell after global install, add npm global bin to PATH:

```powershell
# Find global npm bin path
npm config get prefix
# Add <that path>\bin to your system PATH via:
# System Properties → Environment Variables → Path → New
```

Verify:

```bash
remixd --version
```

---

## 10. Foundry

Foundry is a **Rust-based, blazing-fast** smart contract development framework. It is used for
advanced contract testing, fuzzing, and scripting with native Solidity tests (no JavaScript).

> **Official site:** https://getfoundry.sh
> **GitHub:** https://github.com/foundry-rs/foundry

Foundry consists of four tools:

| Tool | Purpose |
|------|---------|
| `forge` | Build, test, fuzz, and deploy smart contracts |
| `cast` | CLI tool for interacting with EVM chains (call, send, decode) |
| `anvil` | Local Ethereum node (similar to Ganache) |
| `chisel` | Fast Solidity REPL |

> ⚠️ **Windows:** Foundry does **not** have stable native Windows support. WSL2 is **mandatory**
> for Foundry on Windows. Follow the 🐧 WSL2 instructions below.

### 🐧 WSL2 / Linux / macOS — Install Foundry

1. (WSL2 users) Open your Ubuntu terminal or the **Remote-WSL** session in VS Code.

2. Install Foundry using the official install script:

   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   ```

3. Reload your shell:

   ```bash
   source ~/.bashrc
   # or
   source ~/.zshrc
   ```

4. Run `foundryup` to download and install the latest Foundry binaries:

   ```bash
   foundryup
   ```

5. Verify all four tools are installed:

   ```bash
   forge --version   # forge 0.x.x
   cast --version    # cast 0.x.x
   anvil --version   # anvil 0.x.x
   chisel --version  # chisel 0.x.x
   ```

### Initialize a Foundry Project

```bash
forge init experiment-foundry
cd experiment-foundry
```

Foundry project structure:

```
experiment-foundry/
├── foundry.toml        # Configuration
├── lib/                # Dependencies (git submodules)
│   └── forge-std/      # Foundry standard library (auto-installed)
├── script/             # Deployment scripts (Solidity)
├── src/                # Smart contract source files
│   └── Counter.sol     # Example contract
└── test/               # Test files (Solidity)
    └── Counter.t.sol   # Example test
```

### Useful Foundry Commands

```bash
# Build contracts
forge build

# Run all tests
forge test

# Run tests with verbose output
forge test -vvvv

# Start local Anvil node
anvil

# Deploy with a script
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

# Install a dependency (e.g., OpenZeppelin)
forge install OpenZeppelin/openzeppelin-contracts

# Update all dependencies
forge update
```

### Install OpenZeppelin Contracts (Foundry)

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

Add the remapping to `foundry.toml`:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = ["@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/"]
```

### 🪟 Windows — Accessing Foundry from VS Code

After installing Foundry in WSL2, open VS Code with the Remote-WSL extension:

1. In VS Code, press `Ctrl + Shift + P` → type `Remote-WSL: Open Folder in WSL`
2. Navigate to your Foundry project directory inside WSL
3. Open an integrated terminal — it will automatically use the WSL bash shell where `forge` is available

---

## 11. MetaMask

MetaMask is a **browser extension wallet** used to interact with deployed DApps and manage test
accounts via injected Web3 provider in Remix IDE.

> **Official site:** https://metamask.io

### Installation

1. Open Chrome or Firefox.
2. Go to: **https://metamask.io/download/**
3. Click **Install MetaMask for Chrome** (or Firefox).
4. Follow the extension setup:
   - Create a **New Wallet** (for lab use — not for real funds)
   - Save the 12-word **Secret Recovery Phrase** securely (do NOT share it or commit it to git)

### Configure MetaMask for Local Networks

After installing, connect MetaMask to a local blockchain:

#### Connect to Hardhat Node (port 8545)

1. In MetaMask → **Settings** → **Networks** → **Add a network** → **Add a network manually**
2. Fill in:

   | Field | Value |
   |-------|-------|
   | Network Name | Hardhat Local |
   | New RPC URL | `http://127.0.0.1:8545` |
   | Chain ID | `31337` |
   | Currency Symbol | ETH |

#### Connect to Ganache (port 7545 / 8545)

| Field | Value |
|-------|-------|
| Network Name | Ganache Local |
| New RPC URL | `http://127.0.0.1:7545` |
| Chain ID | `1337` |
| Currency Symbol | ETH |

#### Import a Test Account

1. Copy a private key from Ganache or Hardhat node output.
2. In MetaMask → click the account icon → **Import account** → paste the private key.

> ⚠️ **Never use a lab private key on mainnet or with real ETH.** These are test keys with no real
> value and are widely published in documentation.

---

## 12. Verification Checklist

Run all commands below to confirm your environment is fully ready.
Every command should return a version number without errors.

### 🪟 Windows (PowerShell)

```powershell
git --version           # git version 2.x.x
node --version          # v22.x.x  (or v20.x.x)
npm --version           # 10.x.x
nvm version             # 1.x.x (nvm-windows)
truffle version         # Truffle v5.x.x
ganache --version       # ganache v7.x.x
remixd --version        # @remix-project/remixd: x.x.x
```

### 🐧 WSL / Linux

```bash
git --version           # git version 2.x.x
node --version          # v22.x.x  (or v20.x.x)
npm --version           # 10.x.x
nvm --version           # 0.40.x
truffle version         # Truffle v5.x.x
ganache --version       # ganache v7.x.x
remixd --version        # @remix-project/remixd: x.x.x
forge --version         # forge 0.x.x
cast --version          # cast 0.x.x
anvil --version         # anvil 0.x.x
```

### Hardhat (per-project)

Inside any experiment folder with Hardhat installed:

```bash
npx hardhat --version   # 2.x.x
```

---

## 13. Troubleshooting

### `nvm` command not found after install (WSL / Linux)

The install script adds nvm to `~/.bashrc` but won't take effect in the current session. Fix:

```bash
source ~/.bashrc
# Verify:
nvm --version
```

If still missing, manually add to `~/.bashrc`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/nvm.completion.bash" ] && \. "$NVM_DIR/nvm.completion.bash"
```

### `truffle` or `ganache` not found (Windows PowerShell)

After `npm install -g truffle`, the global bin may not be in PATH. Fix:

```powershell
# Find npm global path
npm config get prefix
# Add <prefix> to System PATH via Environment Variables
```

Or use npx as a fallback:

```powershell
npx truffle version
```

### `forge: command not found` (WSL)

If Foundry binaries are not found after `foundryup`, add `~/.foundry/bin` to PATH:

```bash
echo 'export PATH="$PATH:$HOME/.foundry/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Port already in use (8545 / 7545)

If a previous Ganache / Hardhat process is still running:

```bash
# Find and kill the process on port 8545 (Linux/WSL)
lsof -ti:8545 | xargs kill -9

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8545).OwningProcess | Stop-Process -Force
```

### Hardhat compilation errors — wrong Solidity version

Check the `solidity` version in `hardhat.config.js` matches the pragma in your `.sol` files:

```javascript
// hardhat.config.js
module.exports = {
  solidity: "0.8.21",  // Must match pragma solidity ^0.8.x in contracts
};
```

### WSL2 virtualization not enabled

If `wsl --install` fails with a virtualization error:

1. Restart PC → enter BIOS (usually `Del` or `F2` during POST)
2. Enable **Intel VT-x** (Intel) or **AMD-V / SVM** (AMD) under CPU settings
3. Save and reboot
4. Re-run `wsl --install` in PowerShell as Administrator

---

*Last updated: February 2026 | For issues, open a GitHub Issue at https://github.com/prathamdxkar/blockchain-lab*
