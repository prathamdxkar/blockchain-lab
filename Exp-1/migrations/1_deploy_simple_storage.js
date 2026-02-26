/**
 * Truffle Migration — 1_deploy_simple_storage.js
 *
 * Deploys the SimpleStorage contract to the `development` network (Ganache CLI
 * on port 7545).
 *
 * Usage:
 *   truffle migrate --network development
 *   truffle migrate --reset --network development   ← use --reset to redeploy
 *
 * Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 */

const SimpleStorage = artifacts.require('SimpleStorage');

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};
