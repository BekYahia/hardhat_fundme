const { deployments, ethers, network, getNamedAccounts } = require("hardhat");


async function main() {
    
    const deployer = (await getNamedAccounts()).deployer
    const fundMeAddress = (await deployments.get("FundMe")).address

    console.log("Current Network", network.name)
    console.log("FundMe Contract Address", fundMeAddress)
    console.log("Deployer Address", deployer)

    console.log("FundMe balance", await ethers.provider.getBalance(fundMeAddress))
    console.log("Deployer balance", await ethers.provider.getBalance(deployer))
}

main()
    .then(() => process.exit(0))
    .catch(er => {
        console.log(er)
        process.exit(1)
    });