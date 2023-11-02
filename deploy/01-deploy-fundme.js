const { network } = require("hardhat")
const { networkConfig, devChains } = require("../helpers/hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId
    
    //set price feed address
    let priceFeedAddress;
    if(devChains.includes(network.name)) {
      const mockV3AggregatorAddress = await deployments.get("MockV3Aggregator")
      priceFeedAddress = await mockV3AggregatorAddress.address
    } else {
      priceFeedAddress = networkConfig[chainId].ethUSDPriceFeed
    }

    const args = [priceFeedAddress];

    const fund_me = await deploy('FundMe', {
      from: deployer,
      args,
      log: true,
      waitConfirmations: network.config?.blockConfirmations || 1,
    });
    log("Finished deploying Fund me...")

    //verify
    if(!devChains.includes(network.name) && process.env.HRE_ETHERSCAN_KEY) {
      await verify(fund_me.address, args)
    }
}

module.exports.tags = ["all", "fund_me"];