import { FundMeABI, FundMeAddress } from "./constant.js"
import { ethers } from "./ethers-6.7.0.esm.min.js" 

const eth = window?.ethereum
const connectBtn = document.getElementById("connectBtn")
const fundBtn = document.getElementById("fundBtn")
const withdrawBtn = document.getElementById("withdrawBtn")
const balanceBtn = document.getElementById("balanceBtn")
const alert = document.getElementById("alert")
const input = document.getElementById("ethAmount")
// let provider, signer, FundMe

connectBtn.onclick = connect
fundBtn.onclick = fund
withdrawBtn.onclick = withdraw
balanceBtn.onclick = balance


async function connect() {
    if(!eth) return

    try {
        await eth.request({method: "eth_requestAccounts"})

        const provider = new ethers.BrowserProvider(eth)
        return new ethers.Contract(FundMeAddress, FundMeABI, await provider.getSigner())
    } catch (error) {
        console.log("Unable to connect...")
        console.log(error)        
    }
}

async function fund() {
    const ethAmount = input.value
    if(!ethAmount) return;

    try {
        console.log(`Funding...${ ethAmount} ETH`)
        const FundMe = await connect()
        balance()

        const tx = await FundMe.fund({ value: ethers.parseEther(ethAmount) })
        await listonForTXMining(tx)

        balance()
    } catch (error) {
        console.log(`Make sure you have:\n1.Enough balance in you account`)
        console.log(error)
    }

}

async function withdraw() {
    connect()

    try {
        const FundMe = await connect()
        balance()

        console.log("Withdrawing...")
        const tx = await FundMe.withdraw()
        await listonForTXMining(tx)

        balance()

    } catch (error) {
        console.log(`Make sure you have:\n1.Enough balance in you account`)
        console.log(error)
    }
}

async function balance(setup) {
    connect()

    try {
        const provider = new ethers.BrowserProvider(eth)
        const signer = await provider.getSigner()
        alert.innerHTML = `
        FundMe: <b>${ethers.formatEther(await provider.getBalance(FundMeAddress))} ETH</b><br/>
        Donner: <b>${ethers.formatEther(await provider.getBalance(signer.address))} ETH</b>`
    } catch (error) {
        console.log(error)
    }
}

async function listonForTXMining(tx_response, provider) {
    console.log("Mining...", tx_response.hash)
    const tx_receipt = await tx_response.wait(1)
    console.log("Transaction Receipt:", tx_receipt)
}