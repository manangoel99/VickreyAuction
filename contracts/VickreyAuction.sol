pragma solidity >=0.4.25 <0.7.0;


contract VickreyAuction {
    address seller;

    uint public endOfBidding;
    uint public endOfRevealing;

    address public highBidder;
    uint public highBid;
    uint public secondBid;
    uint public numBidders = 0;

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

    function bid(bytes32 hash) public payable {
        require(now < endOfBidding, "Bidding period is over");
        require(msg.sender != seller, "Seller not allowed to bid");

        hashedBidOf[msg.sender] = hash;
        numBidders++;
        // balanceOf[msg.sender] += msg.value;
        // require(balanceOf[msg.sender] >= reservePrice);
    }

    function getNumBidders() public view returns(uint) {
        return numBidders;
    }

    function reveal(uint amount, uint nonce) public {
        require(now >= endOfBidding && now < endOfRevealing);

        require(keccak256(abi.encodePacked(amount, nonce)) == hashedBidOf[msg.sender], "No data present for this seller with given amount");

        require(!revealed[msg.sender], "Bidder has already revealed the bid");
        revealed[msg.sender] = true;

        if (amount >= highBid) {
            secondBid = highBid;
            highBid = amount;
            highBidder = msg.sender;

        } else if (amount > secondBid) {
            secondBid = amount;
       }
    }
}