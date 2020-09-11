const VickreyAuction = artifacts.require("VickreyAuction");

function bids(a, b){
    return web3.eth.abi.encodeParameters(['uint','uint'], [a, b]);
}

contract('Test3: Vickery Auction', async accounts => {
    it("Reveal Order Change", async () => {
        let instance = await VickreyAuction.deployed();
        
        let bid1 = bids(15, 10);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[1], gas: 3000000});
        
        let bid2 = bids(45, 10);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
        let bid3 = bids(25, 10);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid3, {encoding: "hex"}), {from: accounts[3], gas: 3000000});

        // ################## //
        await instance.reveal.sendTransaction(10, {from: accounts[2], gas: 3000000, value:45});
        
        let highestBidder1 = await instance.getHighest.call();
        assert.equal(highestBidder1.valueOf(), accounts[2], "Please Check Bid");
        
        let bal1 = await instance.getBalance.call();
        assert.equal(bal1[1].valueOf(), 45, "HAHA1");
        // ################## //
        await instance.reveal.sendTransaction(10, {from: accounts[3], gas: 3000000, value:25});
        
        let highestBidder2 = await instance.getHighest.call();
        assert.equal(highestBidder2.valueOf(), accounts[2], "Please Check Bid");
        
        let bal2 = await instance.getBalance.call();
        assert.equal(bal2[1].valueOf(), 45, "HAHA2");
        // ################## //
        await instance.reveal.sendTransaction(10, {from: accounts[1], gas: 3000000, value:15});
        
        let highestBidder3 = await instance.getHighest.call();
        assert.equal(highestBidder3.valueOf(), accounts[2], "Please Check Bid");
        
        let bal3 = await instance.getBalance.call();
        assert.equal(bal3[1].valueOf(), 45, "HAHA3");
        // ################## //
        let val = await instance.getBid.call();
        assert.equal(val[0].valueOf(), accounts[2], "Please check function 2");
        assert.equal(val[1].valueOf(), 25, "Wrong second bids");

        let highestBidder4 = await instance.getHighest.call();
        await instance.claimBalance.sendTransaction({from: highestBidder4, gas: 300000});
        let bal4 = await instance.getBalance.call();
        assert.equal(bal4[1].valueOf(), 25, "HAHA4");

        let bal = await instance.getNumRevealed.call();
        assert.equal(bal.valueOf(), 3, "Not matching");
    });
});