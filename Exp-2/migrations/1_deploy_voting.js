/**
 * Truffle Migration — Deploy Voting Contract
 *
 * Deploys the Voting smart contract to the configured network (development =
 * Ganache CLI on port 7545) with an initial list of three candidate names.
 *
 * Usage:
 *   truffle migrate --network development
 *   truffle migrate --reset --network development   ← force re-deploy
 *
 * Prerequisites (MET-1):
 *   Ganache CLI must be running on port 7545 before executing this migration:
 *     ganache --port 7545 --chain.chainId 1337 --accounts 10 --defaultBalanceEther 1000
 *
 * Constructor arguments:
 *   The Voting constructor accepts string[] memory candidateNames.
 *   The deployer account (accounts[0]) becomes the contract owner.
 *
 * Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 */

const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  // Deploy Voting with initial candidate list — matches the constructor signature:
  //   constructor(string[] memory candidateNames)
  deployer.deploy(Voting, ["Alice", "Bob", "Charlie"]);
};
