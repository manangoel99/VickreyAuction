const VickreyAuction = artifacts.require("VickreyAuction");

contract('Test for Vickery Auction', async (accounts) => {
    it("Normal Bid", async () => {
        let instance = await VickreyAuction.deployed();
        
        let bid = web3.eth.abi.encodeParameters(['uint', 'uint'], [100, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid, {encoding: "hex"}), {from: accounts[1], gas: 3000000});
        
        let bid1 = web3.eth.abi.encodeParameters(['uint', 'uint'], [200, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
        let bid2 = web3.eth.abi.encodeParameters(['uint', 'uint'], [400, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[3], gas: 3000000});

        let count = await instance.getNumBidders.call({from: accounts[0]});
        assert.equal(count.valueOf(), 3, "Please check function");
    });

    it("Highest Bid", async () => {
        let instance = await VickreyAuction.deployed();
        
        let bid = web3.eth.abi.encodeParameters(['uint', 'uint'], [10, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid, {encoding: "hex"}), {from: accounts[4], gas: 3000000});
        
        let bid1 = web3.eth.abi.encodeParameters(['uint', 'uint'], [40, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[5], gas: 3000000});
        
        let bid2 = web3.eth.abi.encodeParameters(['uint', 'uint'], [20, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[6], gas: 3000000});


        await instance.reveal.sendTransaction(10, {from: accounts[4], gas: 3000000, value:10});
        let highestBidder1 = await instance.getHighest.call();
        assert.equal(highestBidder1.valueOf(), accounts[4], "Please Check Bid");
        let bal1 = await instance.getBalance.call();
        assert.equal(bal1[1].valueOf(), 10, "HAHA1");

        await instance.reveal.sendTransaction(10, {from: accounts[5], gas: 3000000, value:40});
        let highestBidder2 = await instance.getHighest.call();
        assert.equal(highestBidder2.valueOf(), accounts[5], "Please Check Bid");
        let bal2 = await instance.getBalance.call();
        assert.equal(bal2[1].valueOf(), 40, "HAHA1");

        await instance.reveal.sendTransaction(10, {from: accounts[6], gas: 3000000, value:20});
        let highestBidder3 = await instance.getHighest.call();
        assert.equal(highestBidder3.valueOf(), accounts[5], "Please Check Bid");
        let bal3 = await instance.getBalance.call();
        assert.equal(bal3[1].valueOf(), 40, "HAHA1");
        let val = await instance.getBid.call();
        assert.equal(val[0].valueOf(), accounts[5], "Please check function 2");
        assert.equal(val[1].valueOf(), 20, "Please check function 2");

        let highestBidder4 = await instance.getHighest.call();
        await instance.claimBalance.sendTransaction({from: highestBidder4, gas: 300000});
        let bal4 = await instance.getBalance.call();
        assert.equal(bal4[1].valueOf(), 20, "HAHA4");
    });
});