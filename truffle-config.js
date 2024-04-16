const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          `https://sepolia.infura.io/v3/f9b90e16a2ea4479b25baea903473bc7`,
          {timeout: 120000},
        ),
      network_id: 11155111, 
    },
  },

  compilers: {
    solc: {
      version: "0.8.9",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
