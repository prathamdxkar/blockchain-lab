/**
 * Truffle Configuration — Exp-1
 * University of Mumbai · IT Engineering SEM VIII · AY 2025-26
 *
 * Connect to Ganache CLI on port 7545 (launch with: ganache --port 7545 --chain.chainId 1337).
 * For an alternate Ganache CLI instance, use the ganacheCli network on port 8545.
 */

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545, // Ganache CLI primary port (--port 7545)
      network_id: '*',
    },
    ganacheCli: {
      host: '127.0.0.1',
      port: 8545, // Ganache CLI alternate port
      network_id: '*',
    },
  },

  mocha: {
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: '0.8.21',
      settings: {
        optimizer: {
          enabled: false,
        },
      },
    },
  },
};
