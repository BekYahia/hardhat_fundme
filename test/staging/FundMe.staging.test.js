
const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { devChains } = require("../../helpers/hardhat-config")

devChains.includes(network.name)
? describe.skip
: describe("FundMe" , () => {
    let fund_me
    let deployer
    const sendValue = ethers.parseEther("0.03")

    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        const FundMeAddress = (await deployments.get("FundMe")).address
        fund_me = await ethers.getContractAt("FundMe", FundMeAddress)
    })

    it("Allow people to fund and withdraw", async () => {
        await fund_me.fund({ value: sendValue })
        await fund_me.withdraw()

        const endingFundMeBalance = await ethers.provider.getBalance(await fund_me.getAddress())
        expect(endingFundMeBalance).to.be.equal(0);
    });
})