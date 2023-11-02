// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// import "./AggregatorV3Interface.sol";

library PriceConverter {
    /**
    * Network: Sepolia
    * Data Feed: ETH/USD
    * Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
    */

    // function getDecimals() internal view returns (uint8) {
    //     AggregatorV3Interface dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    //     return dataFeed.decimals();
    // }

    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        // AggregatorV3Interface dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        (, int256 price,,,) = priceFeed.latestRoundData();
        //since it have 8 decimal we add 10 to be 18 like msg.value
        return uint256(price) * 10**10;
    }

    function getConversionRate(uint256 ethAmout, AggregatorV3Interface priceFeed) internal view returns (uint256) {
        // uint256 ethPrice = getPrice();
        return (getPrice(priceFeed) * ethAmout) / 1e18;
    }
}