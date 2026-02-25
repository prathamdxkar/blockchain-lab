/**
 * Truffle Configuration — Exp-1
 * University of Mumbai · IT Engineering SEM VIII · AY 2025-26
 *
 * Connect to Ganache Desktop on port 7545 (default).
 * For Ganache CLI, change port to 8545.
 */

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
      port: 8545,         // Ganache CLI default
      network_id: "*",
    },
  },

  mocha: {
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: "0.8.21",
      settings: {
        optimizer: {
          enabled: false,
        },
      },
    },
  },
};
