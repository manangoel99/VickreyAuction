pragma solidity >=0.4.25 <0.7.0;

contract BiddingRing {
    mapping (address => uint) bidderToBid;
    uint numBids;
    uint[] bids;
    bool ringOn;

    constructor () public {
        numBids = 0;
        ringOn = true;
    }

    function bid(uint price, address bidder) public {
        require(ringOn == true, "Ring is Closed");
        bidderToBid[numBids++] = bidder;
        bids.push(price);
    }

    function closeRing() public {
        require(ringOn == true, "Ring Already Closed");
        ringOn = false;
    }

    function findBestBid() public view returns (address, uint) {
        require(ringOn == false, "Bidding Ring is still going on");

        uint highestPrice = 0;
        address winner;

        for (uint i = 0; i < bids.length; i++) {
            if (highestPrice <= bids[i]) {
                highestPrice = bids[i];
                winner = bidderToBid[i];
            }
        }
        return (winner, highestPrice);
    }
}