/**
 * Truffle Configuration — Exp-3
 * University of Mumbai · IT Engineering SEM VIII · AY 2025-26
 *
 * For testnet deployments, Truffle uses HDWalletProvider.
 * Install: npm install --save-dev @truffle/hdwallet-provider
 */

// Uncomment section below when ready for testnet deployment
// const HDWalletProvider = require('@truffle/hdwallet-provider');
// require('dotenv').config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,         // Ganache Desktop default
      // port: 8545,      // Uncomment for Ganache CLI
      network_id: "*",
    },
    ganacheCli: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    // Uncomment and configure when deploying to Sepolia testnet:
    // sepolia: {
    //   provider: () => new HDWalletProvider(
    //     process.env.PRIVATE_KEY,
    //     `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
    //   ),
    //   network_id: 11155111,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true,
    // },
  },

  mocha: {
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: "0.8.21",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
