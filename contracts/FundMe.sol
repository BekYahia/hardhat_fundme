// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
//769,283
//748,041 - constant
//738,687 - immutable
//713,552 - error - not owner
//674,796 - error 2


error FundMe__NotOwner();
error FundMe__InsufficientBalance(uint256 available, uint256 required);
error FundMe__SendingFailed();

contract FundMe {

    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 15 * 1e18;
    address[] private s_funders;
    mapping (address => uint256) private s_addressToAmountFunded;
    address private immutable i_owner;

    AggregatorV3Interface public s_priceFeed;


    modifier onlyOwner() {
        if(msg.sender != i_owner)
            revert FundMe__NotOwner();
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // if someone send money without calling the fund method using the contract address
    receive() external payable { fund(); }
    fallback() external payable { fund(); }

    function fund() public payable {
        // require(msg.value.getConversionRate() >= MINIMUM_USD, "Did not send enough money");
        if(msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD)
            revert FundMe__InsufficientBalance({
                available: msg.value.getConversionRate(s_priceFeed),
                required: MINIMUM_USD
            });

        if(msg.value >= msg.sender.balance)
            revert FundMe__InsufficientBalance({
                available: msg.value.getConversionRate(s_priceFeed),
                required: MINIMUM_USD
            });    

        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        //reset addressTofunderIndex
        for(uint256 funderIndex; funderIndex < s_funders.length; funderIndex++) {
            // address funder = s_funders[funderIndex];
            s_addressToAmountFunded[s_funders[funderIndex]] = 0;
        }

        //reset funder
        s_funders = new address[](0);
        
        // //withdraw ways:
        // //1. transfer
        //     //msg.sender = address
        //     //payyable(msg.sender) = payable address 
        // payable(msg.sender).transfer(address(this).balance); //throw error when faild 2.3k gas
        // //2. send
        // bool successSend = payable(msg.sender).send(address(this).balance); //2.3 gas; return bool
        // require(successSend, "Send Faild!");
        //3. call

        (bool successCall,) = payable(msg.sender).call{value: address(this).balance}("");
        // require(successCall, "Send Failed!");
        if(!successCall) revert FundMe__SendingFailed();
    }

    function cheaperWithdraw() public onlyOwner {

        address[] memory funders = s_funders;

        //reset addressTofunderIndex
        for(uint256 funderIndex; funderIndex < funders.length; funderIndex++) {
            // address funder = funders[funderIndex];
            s_addressToAmountFunded[funders[funderIndex]] = 0;
        }

        //reset funder
        s_funders = new address[](0);
        
        // //withdraw ways:
        // //1. transfer
        //     //msg.sender = address
        //     //payyable(msg.sender) = payable address 
        // payable(msg.sender).transfer(address(this).balance); //throw error when faild 2.3k gas
        // //2. send
        // bool successSend = payable(msg.sender).send(address(this).balance); //2.3 gas; return bool
        // require(successSend, "Send Faild!");
        //3. call

        (bool successCall,) = payable(msg.sender).call{value: address(this).balance}("");
        // require(successCall, "Send Failed!");
        if(!successCall) revert FundMe__SendingFailed();
    }
    
    function getOwner() public view returns (address) {
        return i_owner;
    }
    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }
    function getAddressToAmountFunded(address funder) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }
    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
    function getSenderBalance() public view returns (uint256) {
        return msg.sender.balance;
    }
}

/*
*  Notes:
-   use  constant when you set the value at init
    use immutable when you send the value in the s2nd init and it will never change later
    - msg.sender avalable only inside a function.
*/