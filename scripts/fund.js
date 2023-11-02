const { deployments, ethers, network, getNamedAccounts } = require("hardhat");


async function main() {
    
    const deployer = (await getNamedAccounts()).deployer
    const fundMeAddress = (await deployments.get("FundMe")).address
    const fundMe = await ethers.getContractAt("FundMe", fundMeAddress)

    console.log("Current Network", network.name)
    console.log("FundMe Contract Address", fundMeAddress)
    console.log("Funder Address", deployer)

    console.log("FundMe balance before funding", await ethers.provider.getBalance(fundMeAddress))
    console.log("Funder balance before funding", await ethers.provider.getBalance(deployer))

    const tx = await fundMe.fund({ value: ethers.parseEther("0.35") })
    const txReceipt = await tx.wait(1)
    console.log('Gas Cost', txReceipt.gasUsed * txReceipt.gasPrice)

    console.log("FundMe balance after funding", await ethers.provider.getBalance(fundMeAddress))
    console.log("Funder balance after funding", await ethers.provider.getBalance(deployer))
}

main()
    .then(() => process.exit(0))
    .catch(er => {
        console.log(er)
        process.exit(1)
    });