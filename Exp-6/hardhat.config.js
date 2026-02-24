require("dotenv").config();

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    // Local Hardhat ephemeral network
    hardhat: {
      chainId: 31337,
    },

    // Anvil — Foundry's local node (mirrors Hardhat node)
    anvil: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },

    // Ethereum Sepolia Testnet
    sepolia: {
      url:
        process.env.ALCHEMY_API_URL_SEPOLIA ||
        (process.env.ALCHEMY_API_KEY
          ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
          : `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`),
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },

  // Etherscan / Sourcify verification
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },

  sourcify: {
    enabled: true,
  },

  // Named paths (mirrors Foundry src/test layout)
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache_hh",
    artifacts: "./artifacts",
  },
};
