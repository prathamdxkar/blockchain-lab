/**
 * Hardhat Ignition Module — Deploy Voting Contract
 *
 * Deploys the Voting smart contract via Hardhat Ignition with an initial list
 * of three candidate names passed as constructor arguments.
 *
 * Usage:
 *   npm run deploy:ganache
 *   → resolves to: npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache
 *
 *   Or directly:
 *   npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache
 *   npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache --reset
 *
 * Prerequisites (MET-1):
 *   Ganache CLI must be running on port 7545 before executing this deployment:
 *     ganache --port 7545 --chain.chainId 1337 --accounts 10 --defaultBalanceEther 1000
 *
 * Constructor arguments (CDM-5 compliance):
 *   The Voting constructor signature: constructor(string[] memory candidateNames)
 *   In Hardhat Ignition, constructor args are the second parameter of m.contract()
 *   as a nested array where the outer array is the argument list and the inner
 *   array is the string[] argument.
 *
 *   ✅ Correct:   m.contract("Voting", [["Alice", "Bob", "Charlie"]])
 *   ❌ Incorrect: m.contract("Voting", ["Alice", "Bob", "Charlie"])  ← type mismatch
 *
 * Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 */

const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('VotingModule', (m) => {
  // Deploy the Voting contract with an initial candidates array.
  // The outer array wraps all constructor arguments; the inner array is the
  // string[] candidateNames parameter (see CDM-5 in EXP-2_PLAN.md).
  const voting = m.contract('Voting', [['Alice', 'Bob', 'Charlie']]);

  return { voting };
});
