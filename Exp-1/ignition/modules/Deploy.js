/**
 * Hardhat Ignition Module — Deploy.js
 *
 * Deploys the SimpleStorage contract via Hardhat Ignition.
 *
 * Usage:
 *   npm run deploy:ganache
 *   # resolves to: npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache
 *
 *   To force re-deployment if module is already deployed:
 *   npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache --reset
 *
 * Blockchain Lab · ITL801 · University of Mumbai · BE IT SEM VIII · AY 2025-26
 */

const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('SimpleStorageModule', (m) => {
  const simpleStorage = m.contract('SimpleStorage');

  return { simpleStorage };
});
