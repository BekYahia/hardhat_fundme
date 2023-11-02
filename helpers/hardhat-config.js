const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUSDPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    1: {
        name: "mainnet",
        ethUSDPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    },
}
const devChains = ["hardhat", "localhost"]
const decimals = 8;
const initAnswer = 150_000_000_000;

module.exports = {
    networkConfig,
    devChains,
    decimals,
    initAnswer,
}