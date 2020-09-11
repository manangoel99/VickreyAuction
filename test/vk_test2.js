const VickreyAuction = artifacts.require("VickreyAuction");

function bids(a, b){
    return web3.eth.abi.encodeParameters(['uint','uint'], [a, b]);
}

contract('Test2: Vickery Auction', async accounts => {
    it("Highest and Second Highest", async () => {
        let instance = await VickreyAuction.deployed();
        
        let bid1 = bids(15, 10);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[1], gas: 3000000});
        
        let bid2 = bids(47, 10);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
        let bid3 = bids(23, 10);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid3, {encoding: "hex"}), {from: accounts[3], gas: 3000000});
        
        let bid4 = bids(36, 10);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid4, {encoding: "hex"}), {from: accounts[4], gas: 3000000});
        
        // ################## //
        await instance.reveal.sendTransaction(10, {from: accounts[1], gas: 3000000, value:15});
        
        let bal1 = await instance.getBalance.call();
        assert.equal(bal1[1].valueOf(), 15, "Wrong account balance 1");
        
        let val1 = await instance.getBid.call();
        assert.equal(val1[0].valueOf(), accounts[1], "Wrong high bidder 1");
        // assert.equal(val1[1].valueOf(), 15, "Wrong second bid 1");
        // ################## //
        await instance.reveal.sendTransaction(10, {from: accounts[4], gas: 3000000, value:36});
        
        let bal2 = await instance.getBalance.call();
        assert.equal(bal2[1].valueOf(), 36, "Wrong account balance 2");

        let val2 = await instance.getBid.call();
        assert.equal(val2[0].valueOf(), accounts[4], "Wrong high bidder 2");
        assert.equal(val2[1].valueOf(), 15, "Wrong second bid 2");
        // ################## //
        await instance.reveal.sendTransaction(10, {from: accounts[3], gas: 3000000, value:23});
        
        let bal3 = await instance.getBalance.call();
        assert.equal(bal3[1].valueOf(), 36, "Wrong account balance 3");

        let val3 = await instance.getBid.call();
        assert.equal(val3[0].valueOf(), accounts[4], "Wrong high bidder 3");
        assert.equal(val3[1].valueOf(), 23, "Wrong second bid 3");
        // ################## //
        await instance.reveal.sendTransaction(10, {from: accounts[2], gas: 3000000, value:47});
        
        let bal4 = await instance.getBalance.call();
        assert.equal(bal4[1].valueOf(), 47, "Wrong account balance 3");

        let val4 = await instance.getBid.call();
        assert.equal(val4[0].valueOf(), accounts[2], "Wrong high bidder 3");
        assert.equal(val4[1].valueOf(), 36, "Wrong second bid 3");

        // ################## //
        let highestBidder = await instance.getHighest.call();
        await instance.claimBalance.sendTransaction({from: highestBidder, gas: 300000});
        let bal5 = await instance.getBalance.call();
        assert.equal(bal5[1].valueOf(), 36, "Wrong contract balance");
    });
});