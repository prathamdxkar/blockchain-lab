// SPDX comment not applicable — JS module
// File: ignition/modules/Deploy.js
// Hardhat Ignition deployment module for EXP-3 — MessageBoard contract.
//
// Usage:
//   Local (ephemeral Hardhat):
//     npx hardhat ignition deploy ./ignition/modules/Deploy.js --network hardhat
//
//   Local persistent (Ganache):
//     npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache
//
//   Sepolia testnet:
//     npx hardhat ignition deploy ./ignition/modules/Deploy.js --network sepolia
//
//   Re-deploy (reset previous state):
//     npx hardhat ignition deploy ./ignition/modules/Deploy.js --network sepolia --reset
//
// After deploy, the contract address is printed as:
//   MessageBoardModule#MessageBoard - 0x<ADDRESS>
// Save this address for Phase 7 (Etherscan verify) and Phase 8 (Web3.js interact).

"use strict";

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

/**
 * @module MessageBoardModule
 * @description Deploys the MessageBoard contract with no constructor arguments.
 *
 * The module name "MessageBoardModule" is recorded in ignition/deployments/.
 * Do NOT rename it without deleting ignition/deployments/chain-<ID>/ first
 * (see CDM-3 in EXP-3_PLAN.md for details).
 */
module.exports = buildModule("MessageBoardModule", (m) => {
  // Deploy MessageBoard — no constructor arguments required.
  const messageboard = m.contract("MessageBoard");

  // Return the contract reference so Hardhat Ignition logs the address.
  return { messageboard };
});
