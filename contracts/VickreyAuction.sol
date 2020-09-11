pragma solidity >=0.4.25 <0.7.0;


contract VickreyAuction {
    address payable seller;

    address payable public highBidder;
    uint public highBid;
    uint public secondBid;
    uint public endOfBidding;
    uint public endOfRevealing;
    uint public numBidders = 0;
    uint public numRevealed = 0;

    mapping(address => bool) public revealed;

    constructor (uint biddingPeriod, uint revealingPeriod) public {
        endOfBidding = now + biddingPeriod;
        endOfRevealing = endOfBidding + revealingPeriod;
        
        seller = msg.sender;
        highBidder = seller;
        highBid = 0;
        secondBid = 0;
    }

    mapping(address => bytes32) public hashedBidOf;

    function bid(bytes32 hash) public {
        // require(now < endOfBidding, "Bidding period is over");
        // require(msg.sender != seller, "Seller not allowed to bid");
        hashedBidOf[msg.sender] = hash;
        numBidders++;
    }

    function getNumRevealed() public view returns(uint) {
        return numRevealed;
    }

    function getSeller() public view returns(address) {
        return seller;
    }
    function getNumBidders() public view returns(uint) {
        return numBidders;
    }

    function getBid() public view returns(address, uint) {
        return (highBidder, secondBid);
    }

    function getBalance() public view returns(address, uint){
        return (address(this), address(this).balance);
    }

    function getHighest() public view returns (address) {
        return highBidder;
    }

    function reveal(uint nonce) public payable {
        // require(now >= endOfBidding && now < endOfRevealing);
        uint amount = msg.value;
        
        require(keccak256(abi.encodePacked(amount, nonce)) == hashedBidOf[msg.sender], "No data present for this seller with given amount");
        require(!revealed[msg.sender], "Bidder has already revealed the bid");
        
        revealed[msg.sender] = true;
        numRevealed++;
        
        if (numRevealed == 1){
            highBid = amount;
            highBidder = msg.sender;
        }
        else if (amount >= highBid){
            highBidder.transfer(highBid);
            secondBid = highBid;
            highBid = amount;
            highBidder = msg.sender;
        }
        else if (amount > secondBid) {
            secondBid = amount;
            msg.sender.transfer(secondBid);
        }
        else{
            msg.sender.transfer(amount);
        }
    }
    
    function claimBalance() public payable {
        require(msg.sender == highBidder, "Only highest bidder can claim");
        // require(now >= endOfRevealing, "Can only be claimed after end of revealing period");
        if(numRevealed == 1){
            secondBid = highBid;
        }
        msg.sender.transfer(highBid - secondBid);
    }
}