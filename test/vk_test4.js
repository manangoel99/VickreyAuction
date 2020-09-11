const VickreyAuction = artifacts.require("VickreyAuction");

function bids(a, b){
    return web3.eth.abi.encodeParameters(['uint','uint'], [a, b]);
}

contract('Test4: Vickery Auction', async accounts => {
    it("One bid", async () => {
        let instance = await VickreyAuction.deployed();
        
        let bid = bids(150, 10);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid, {encoding: "hex"}), {from: accounts[1], gas: 3000000});

        await instance.reveal.sendTransaction(10, {from: accounts[1], gas: 3000000, value:150});
        
        let highestBidder = await instance.getHighest.call();
        assert.equal(highestBidder.valueOf(), accounts[1], "High bidder wrong");
        
        await instance.claimBalance.sendTransaction({from: highestBidder, gas: 300000});
        let bal = await instance.getBalance.call();
        assert.equal(bal[1].valueOf(), 150, "Wrong contract balance");
        
        let val = await instance.getBid.call();
        assert.equal(val[1].valueOf(), 150, "Wrong second bid");
    });
});