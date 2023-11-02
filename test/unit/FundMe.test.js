const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { devChains } = require("../../helpers/hardhat-config")

!devChains.includes(network.name)
? describe.skip
: describe("FundMe.sol", () => {

    let mockV3Aggregator
    let fund_me
    let deployer
    const sendValue = ethers.parseEther("1")
    let accounts_list
    beforeEach(async () => {
        accounts_list = await ethers.getSigners()

        deployer = (await getNamedAccounts()).deployer
        const deploymentsFixture = await deployments.fixture(["all"])

        fund_me = await ethers.getContractAt("FundMe", deploymentsFixture["FundMe"].address)
        // fund_me = await ethers.getContractAt("FundMe", { signer: deployer })
        mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", deploymentsFixture["MockV3Aggregator"].address)
        // mockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator", { signer: deployer })
    })

    describe("constructor", () => {
        it("Should set the MockV3Aggregator correctly", async () => {
            expect(await fund_me.getPriceFeed()).to.be.equal(await mockV3Aggregator.getAddress())
        })
    })

    describe("fund", () => {
        it("Should fail if you did not send enough eth", async () => {
            // await expect(fund_me.fund()).to.be.revertedWith("FundMe__InsufficientBalance")
            const tx = fund_me.fund();
            await expect(tx).to.be.reverted
            await expect(tx).to.be.revertedWithCustomError(fund_me, "FundMe__InsufficientBalance")
        })

        it("Should send eth successfully with deployer account", async () => {

            await fund_me.fund({value: sendValue})
            const res = await fund_me.getAddressToAmountFunded(deployer)
            expect(res.toString()).to.be.equal(sendValue.toString())
        })
    })

    describe('withdraw', () => {
        beforeEach(async() => {
            await fund_me.fund({ value: sendValue })
        });

        it("withdraw ETH from a single funder", async () => {
            const startingFundMeBalance = await ethers.provider.getBalance(await fund_me.getAddress())
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)

            const tx = await fund_me.withdraw()
            const txReceipt = await tx.wait(1)
            const gasCost = txReceipt.gasUsed * txReceipt.gasPrice
            const endingFundMeBalance = await ethers.provider.getBalance(await fund_me.getAddress())
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)

            expect(endingFundMeBalance).to.be.equal(0)
            expect(startingFundMeBalance + startingDeployerBalance).to.be.equal(endingDeployerBalance + gasCost)
        });

        it("CheaperWithdraw ETH from a single funder", async () => {
            const startingFundMeBalance = await ethers.provider.getBalance(await fund_me.getAddress())
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)

            const tx = await fund_me.cheaperWithdraw()
            const txReceipt = await tx.wait(1)
            const gasCost = txReceipt.gasUsed * txReceipt.gasPrice
            const endingFundMeBalance = await ethers.provider.getBalance(await fund_me.getAddress())
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)

            expect(endingFundMeBalance).to.be.equal(0)
            expect(startingFundMeBalance + startingDeployerBalance).to.be.equal(endingDeployerBalance + gasCost)
        });

        it("withdraw ETH from multiple funders", async () => {

            for (let index = 1; index <= 3; index++) {
                const fundMeWithConnectedOtherAddress = await fund_me.connect(accounts_list[index])
                await fundMeWithConnectedOtherAddress.fund({ value: sendValue })
            }


            const startingFundMeBalance = await ethers.provider.getBalance(await fund_me.getAddress())
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)

            const tx = await fund_me.withdraw()
            const txReceipt = await tx.wait(1)
            const gasCost = txReceipt.gasUsed * txReceipt.gasPrice
            const endingFundMeBalance = await ethers.provider.getBalance(await fund_me.getAddress())
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)

            expect(endingFundMeBalance).to.be.equal(0)
            expect(startingFundMeBalance + startingDeployerBalance).to.be.equal(endingDeployerBalance + gasCost)

            await expect(fund_me.getFunders(0)).to.be.reverted;

            for(let index = 1; index <= 3; index++) {
                expect(await fund_me.getAddressToAmountFunded(accounts_list[index])).to.be.equal(0)
            }    
        });

        it("CheaperWithdraw ETH from multiple funders", async () => {

            for (let index = 1; index <= 3; index++) {
                const fundMeWithConnectedOtherAddress = await fund_me.connect(accounts_list[index])
                await fundMeWithConnectedOtherAddress.fund({ value: sendValue })
            }


            const startingFundMeBalance = await ethers.provider.getBalance(await fund_me.getAddress())
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)

            const tx = await fund_me.cheaperWithdraw()
            const txReceipt = await tx.wait(1)
            const gasCost = txReceipt.gasUsed * txReceipt.gasPrice
            const endingFundMeBalance = await ethers.provider.getBalance(await fund_me.getAddress())
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)

            expect(endingFundMeBalance).to.be.equal(0)
            expect(startingFundMeBalance + startingDeployerBalance).to.be.equal(endingDeployerBalance + gasCost)

            await expect(fund_me.getFunders(0)).to.be.reverted;

            for(let index = 1; index <= 3; index++) {
                expect(await fund_me.getAddressToAmountFunded(accounts_list[index])).to.be.equal(0)
            }    
        });

        it("Revert when not an owner try to withdraw", async () => {
            const attackerContract = await fund_me.connect(accounts_list[1]) 
            await expect(attackerContract.withdraw()).to.be.revertedWithCustomError(attackerContract, "FundMe__NotOwner")
        });

    })

});