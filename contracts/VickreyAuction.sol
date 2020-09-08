pragma solidity >=0.4.25 <0.7.0;


contract VickreyAuction {
    address seller;
    bool isOpen;
    uint totalBuyers;
    mapping (uint => address) buyers;
    uint[] offers;
    uint starting;

    constructor(uint _starting) public {
        seller = msg.sender;
        isOpen = true;
        totalBuyers = 0;
        starting = _starting;
    }

    function getTotalBuyers() public view returns (uint) {
        return totalBuyers;
    }

    function getIsOpen() public view returns (bool) {
        return isOpen;
    }

    function bid(uint price, address buyer) public {
        require(isOpen == true, "Auction must be open for bidding");
        require(starting < price, "Bidding value should be greater than starting value");

        buyers[totalBuyers] = buyer;
        offers.push(price);
        totalBuyers++;
    }

    function closeAuction() public {
        require(msg.sender == seller, "Auction can be closed only by the seller");
        isOpen = false;
    }

    

    function findWinner() returns (address, uint) {
        require(isOpen == false, "Auction must be closed before winner can be found");
        uint highestPrice = 0;
        uint higherPrice = 0;
        address winner;
        for(uint i = 0; i < offers.length; i++){
          if(highestPrice < offers[i]){
            higherPrice = highestPrice;
            highestPrice = offers[i];
            winner = buyers[i];
          }else{
            if(higherPrice < offers[i]){
              higherPrice = offers[i];
            }
          }
        }
        return (winner, higherPrice);
    }
}