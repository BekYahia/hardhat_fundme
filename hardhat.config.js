require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-ethers")
require("hardhat-deploy")
require("solidity-coverage")
// require("hardhat-deploy-ethers")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {version: "0.8.7"}, {version: "0.6.6"},
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: process.env.HRE_SEPOLIA_RPC_URL,
      accounts: [process.env.HRE_PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  mocha: {
    timeout: 500_000,
  },
  etherscan: {
    apiKey: process.env.HRE_ETHERSCAN_KEY
  },
};
