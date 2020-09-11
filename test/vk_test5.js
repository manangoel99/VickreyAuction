const VickreyAuction = artifacts.require("VickreyAuction");

function bids(a, b){
    return web3.eth.abi.encodeParameters(['uint','uint'], [a, b]);
}

contract('Test5: Vickery Auction', async accounts => {

    it("Same High bid", async () => {
        let instance = await VickreyAuction.deployed();
        
        let bid1 = bids(30, 20);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[1], gas: 3000000});
        
        let bid2 = bids(30, 15);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
        // ################## //
        await instance.reveal.sendTransaction(20, {from: accounts[1], gas: 3000000, value:30});
        
        let bal1 = await instance.getBalance.call();
        assert.equal(bal1[1].valueOf(), 30, "Wrong account balance 1");
        
        let val1 = await instance.getBid.call();
        assert.equal(val1[0].valueOf(), accounts[1], "Wrong high bidder 1");
        // assert.equal(val1[1].valueOf(), 15, "Wrong second bid 1");
        // ################## //
        await instance.reveal.sendTransaction(15, {from: accounts[2], gas: 3000000, value:30});
        
        let bal2 = await instance.getBalance.call();
        assert.equal(bal2[1].valueOf(), 30, "Wrong account balance 2");

        let val2 = await instance.getBid.call();
        assert.equal(val2[0].valueOf(), accounts[2], "Wrong high bidder 2");
        assert.equal(val2[1].valueOf(), 30, "Wrong second bid 2");

        // ################## //
        let highestBidder = await instance.getHighest.call();
        assert.equal(highestBidder.valueOf(), accounts[2], "High bidder wrong");
        await instance.claimBalance.sendTransaction({from: highestBidder, gas: 300000});
        let bal5 = await instance.getBalance.call();
        assert.equal(bal5[1].valueOf(), 30, "Wrong contract balance");
    });
});