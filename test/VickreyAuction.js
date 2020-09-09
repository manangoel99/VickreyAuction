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
        
        let bid1 = web3.eth.abi.encodeParameters(['uint', 'uint'], [20, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[5], gas: 3000000});
        
        let bid2 = web3.eth.abi.encodeParameters(['uint', 'uint'], [40, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[6], gas: 3000000});

        // await instance.bid.sendTransaction(50, 10, {from: accounts[1], gas: 3000000});
        // await instance.bid.sendTransaction(20, 10, {from: accounts[2], gas: 3000000});
        // await instance.bid.sendTransaction(10, 10, {from: accounts[3], gas: 3000000});
		await instance.reveal.sendTransaction(10, 10, {from: accounts[4], gas: 3000000});
		await instance.reveal.sendTransaction(20, 10, {from: accounts[5], gas: 3000000});
		await instance.reveal.sendTransaction(40, 10, {from: accounts[6], gas: 3000000});
		// let count1 = await instance.getNumBidders.call({from: accounts[1]});
        // assert.equal(count1.valueOf(), 3, "Please check function");
        let val = await instance.getBid.call();
        assert.equal(val[0].valueOf(), accounts[6], "Please check function 2");
        assert.equal(val[1].valueOf(), 20, "Please check function 2");

		// let highestBidder = await instance.reveal.call(10, 10, {from: accounts[1], gas: 3000000});
        // assert.equal(highestBidder.valueOf(), accounts[1], "Please Check Bid");
        // let highestBidder1 = await instance.reveal.call(20, 10, {from: accounts[2], gas: 3000000});
        // assert.equal(highestBidder1.valueOf(), accounts[2], "Please Check Bid");
        // let highestBidder2 = await instance.reveal.call(40, 10, {from: accounts[3], gas: 3000000});
        // assert.equal(highestBidder2.valueOf(), accounts[3], "Please Check Bid");

    });
});