pragma solidity >=0.4.25 <0.7.0;

import "./VickreyAuction.sol";

contract BiddingRing {
    uint public endOfBidding;
    uint public endOfRevealing;
    uint public _biddingPeriod;
    uint public _revealingPeriod;
    uint public numBidders = 0;
    VickreyAuction public auction;
    address auctionAddress;

    constructor (uint biddingPeriod, uint revealingPeriod) public {
        endOfBidding = now + biddingPeriod;
        endOfRevealing = endOfBidding + revealingPeriod;
        // auctionAddress = _auction;
        // auction = VickreyAuction(_auction);
    }

    function setAuctionAddress(address _address) public {
        auctionAddress = _address;
        auction = VickreyAuction(_address);
    }

    function getAuctionAddress() public view returns(address) {
        return auctionAddress;
    }

    mapping(address => bytes32) public hashedBidOff;

    function bid(bytes32 hashed) public payable {
        require(now < endOfBidding, "Bidding Period is over");
        // bytes32 hashed = keccak256(abi.encodePacked(price, nonce));
        hashedBidOff[msg.sender] = hashed;
        numBidders++;
    }

    function getNumBidders() public view returns(uint) {
        return numBidders;
    }

    address public highBidder = msg.sender;
    uint public nonceBid;
    uint public highBid;

    function reveal(uint amount, uint nonce) public {
        // Following line must be uncommented
        // This function should not return anything! It is just for checking
        // require(now >= endOfBidding && now < endOfRevealing, "Reveal not performed during reveal period");
        // bytes memory encoding = abi.encodePacked(amount, nonce);
        require(keccak256(abi.encodePacked(amount, nonce)) == hashedBidOff[msg.sender], "This User has not made this bid");
        if (amount > highBid) {
            highBid = amount;
            highBidder = msg.sender;
            nonceBid = nonce;   
        }
    }

    function getHighest() public view returns (address) {
        return highBidder;
    }


    function submitToAuction() public {
        // require(now > endOfRevealing);
        auction.bid(keccak256(abi.encodePacked(highBid, nonceBid)));
    }
}