const { network } = require("hardhat")
const { networkConfig, devChains, decimals, initAnswer } = require("../helpers/hardhat-config")

// deploy/00_deploy_my_contract.js
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

    if(devChains.includes(network.name)) {
        log("Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [decimals, initAnswer],
        })
        log("....Mocks deployed....")
    }
}

module.exports.tags = ["all", "mocks"];