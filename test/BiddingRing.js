const BiddingRing = artifacts.require("BiddingRing");

contract('Test for Bidding Ring', async (accounts) => {
    it("Normal Bid", async () => {
        let instance = await BiddingRing.deployed();
        await instance.bid.sendTransaction(50, 10, {from: accounts[1], gas: 3000000});
        await instance.bid.sendTransaction(20, 10, {from: accounts[2], gas: 3000000});
        await instance.bid.sendTransaction(10, 10, {from: accounts[3], gas: 3000000});

        let count = await instance.getNumBidders.call({from: accounts[0]});
        assert.equal(count.valueOf(), 3, "Please check function");
    });

    it("Highest Bid", async () => {
        let instance = await BiddingRing.deployed();
        await instance.bid.sendTransaction(50, 10, {from: accounts[1], gas: 3000000});
        await instance.bid.sendTransaction(20, 10, {from: accounts[2], gas: 3000000});
        await instance.bid.sendTransaction(10, 10, {from: accounts[3], gas: 3000000});
        
        let highestBidder = await instance.reveal.call(10, 10, {from: accounts[3], gas: 3000000});
        assert.equal(highestBidder.valueOf(), accounts[3], "Please Check Bid");
        let highestBidder1 = await instance.reveal.call(20, 10, {from: accounts[2], gas: 3000000});
        assert.equal(highestBidder1.valueOf(), accounts[2], "Please Check Bid");
        let highestBidder2 = await instance.reveal.call(50, 10, {from: accounts[1], gas: 3000000});
        assert.equal(highestBidder2.valueOf(), accounts[1], "Please Check Bid");

    });
});