# Blockchain Lab — IT Engineering SEM VIII

> **University of Mumbai · Information Technology · Semester VIII · AY 2025-26**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Educational Use Only](https://img.shields.io/badge/Use-Educational%20Only-blue.svg)](#-educational-use-disclaimer)

---

## Overview

This repository contains all the **practical experiments** for the **Blockchain Technology Lab** course
prescribed by the **University of Mumbai** for the Bachelor of Engineering (Information Technology)
programme, Semester VIII.

The experiments cover core concepts in blockchain development, smart contract programming, and
decentralized application (DApp) architecture using industry-standard toolchains including
**Hardhat**, **Truffle**, **Ganache**, **Remix IDE**, and **Foundry**.

---

## Repository Structure

```
blockchain-lab/
├── Exp-1/                            # Experiment 1 — Local Blockchain with Truffle & Ganache
├── Exp-2/                            # Experiment 2 — Smart Contract & Chain Code Development
├── Exp-3/                            # Experiment 3 — Deployment on Ethereum Test Network
├── Exp-4/                            # Experiment 4 — Cryptocurrency with MetaMask (ERC-20)
├── Exp-5/                            # Experiment 5 — Chain Code in Hyperledger Fabric
├── Exp-6/                            # Experiment 6 — Mini Project (Full-fledged DApp)
├── docs/
│   ├── BLOCKCHAIN_LAB_MANUAL.md     # Full lab manual in Markdown
│   ├── BLOCKCHAIN_LAB_SYLLABUS.md   # Mumbai University syllabus in Markdown
│   ├── DEPENDENCY.md                # Dependency setup guide (Windows + WSL/Linux)
│   └── EXTENSION.md                 # VS Code extension list for Web3 Development
├── .gitignore                        # Web3-specific gitignore
├── CONTRIBUTING.md                   # Contribution guidelines, branch & commit conventions
├── LICENSE                           # MIT License
└── README.md                         # This file
```

> **Note:** PDF source files (`docs/*.pdf`) are excluded from version control via `.gitignore`.
> Each experiment folder contains its own `README.md` with aim, tools, steps to run, and expected output.

---

## Quick Start

Before working with any experiment, set up your development environment by following the
dependency installation guide:

**[docs/DEPENDENCY.md](docs/DEPENDENCY.md)** — Step-by-step setup for Windows and WSL/Linux covering:
- Node.js LTS (via `nvm`)
- Hardhat, Truffle, Ganache, Foundry
- Remix IDE + Remixd
- MetaMask browser wallet

After installing dependencies, configure your VS Code editor:

**[docs/EXTENSION.md](docs/EXTENSION.md)** — Required and recommended VS Code extensions for the `Web3` profile.

---

## Lab Experiments

| # | Folder | Aim | LO | Primary Tools |
|---|--------|-----|----|---------------|
| 1 | [Exp-1](Exp-1/) | Develop and establish a local Ethereum blockchain using Truffle Suite and Ganache | LO1 | Truffle, Ganache, Hardhat |
| 2 | [Exp-2](Exp-2/) | Develop and deploy Solidity smart contracts; explore chain code concepts | LO2 | Truffle, Ganache, Hardhat, Web3.js |
| 3 | [Exp-3](Exp-3/) | Deploy and publish smart contracts on Ethereum Sepolia testnet | LO3 | Hardhat, Alchemy/Infura, MetaMask |
| 4 | [Exp-4](Exp-4/) | Design and develop a custom ERC-20 cryptocurrency with MetaMask | LO4 | Hardhat, OpenZeppelin, Remix IDE, MetaMask |
| 5 | [Exp-5](Exp-5/) | Write, package, install, and deploy chain code in Hyperledger Fabric | LO5 | Docker, Hyperledger Fabric v2.5, Node.js v20 |
| 6 | [Exp-6](Exp-6/) | Mini Project — Full-fledged DApp on Ethereum | LO6 | Foundry, Hardhat 3, Solidity |

Refer to **[docs/BLOCKCHAIN_LAB_MANUAL.md](docs/BLOCKCHAIN_LAB_MANUAL.md)** for step-by-step
aim/objectives, procedure, and expected output for each practical.

Syllabus coverage is documented in **[docs/BLOCKCHAIN_LAB_SYLLABUS.md](docs/BLOCKCHAIN_LAB_SYLLABUS.md)**.

---

## Tech Stack

| Tool | Purpose | Platform |
|---|---|---|
| [Hardhat](https://hardhat.org/) | Smart contract compilation, testing, deployment | Windows / WSL / Linux |
| [Truffle Suite](https://archive.trufflesuite.com/) | Contract migration, testing framework | Windows / WSL / Linux |
| [Ganache](https://archive.trufflesuite.com/ganache/) | Local Ethereum blockchain | Windows / WSL / Linux |
| [Remix IDE](https://remix.ethereum.org/) | Browser-based Solidity IDE | Browser (no install) |
| [Foundry](https://getfoundry.sh/) | Fast contract testing & fuzzing (Rust-based) | WSL / Linux (recommended on Windows) |
| [MetaMask](https://metamask.io/) | Browser wallet for DApp interaction | Browser extension |

---

## Educational Use Disclaimer

> This repository is created and maintained **solely for educational purposes** as part of the
> University of Mumbai's B.E. (IT) SEM VIII curriculum. All code, configurations, and documentation
> are intended for **academic learning and laboratory experiments only**.
>
> - Do **NOT** deploy any experiment contract to a public mainnet without proper security auditing.
> - Do **NOT** use the private keys, mnemonics, or wallet credentials from lab exercises on real funds.
> - All smart contracts here are **intentionally simplified** for learning — they are **not**
>   production-ready.

---

## Contributing

Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** for branch naming conventions, commit message
nomenclature, and pull request guidelines before contributing.

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for the full text.

The MIT License allows you to use, copy, modify, and distribute this software freely, provided the
original copyright notice and license text are retained. This applies to all source code in this
repository. Course content, syllabi, and lab manuals are the intellectual property of the
**University of Mumbai** and are reproduced here for personal educational reference only.

---

*Maintained by [Pratham Diwadkar](https://github.com/prathamdxkar) — INFT, Atharva College of Engineering*
