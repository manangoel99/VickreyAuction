const BiddingRing = artifacts.require("BiddingRing");
const VickreyAuction = artifacts.require("VickreyAuction");

contract('Test for Bidding Ring', async (accounts) => {
    it("Normal Bid", async () => {
        let instance = await BiddingRing.deployed();
        
        let bid = web3.eth.abi.encodeParameters(['uint', 'uint'], [10, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid, {encoding: "hex"}), {from: accounts[1], gas: 3000000});
        
        let bid1 = web3.eth.abi.encodeParameters(['uint', 'uint'], [20, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
        let bid2 = web3.eth.abi.encodeParameters(['uint', 'uint'], [40, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[3], gas: 3000000});

        let count = await instance.getNumBidders.call({from: accounts[0]});
        assert.equal(count.valueOf(), 3, "Please check function");

    });

    it("Highest Bid", async () => {
        let instance = await BiddingRing.deployed();
        
        let bid = web3.eth.abi.encodeParameters(['uint', 'uint'], [10, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid, {encoding: "hex"}), {from: accounts[1], gas: 3000000});
        
        let bid1 = web3.eth.abi.encodeParameters(['uint', 'uint'], [20, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
        let bid2 = web3.eth.abi.encodeParameters(['uint', 'uint'], [40, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[3], gas: 3000000});

        // await instance.bid.sendTransaction(50, 10, {from: accounts[1], gas: 3000000});
        // await instance.bid.sendTransaction(20, 10, {from: accounts[2], gas: 3000000});
        // await instance.bid.sendTransaction(10, 10, {from: accounts[3], gas: 3000000});
        
        await instance.reveal.sendTransaction(10, {from: accounts[1], gas: 3000000, value:10});
        let highestBidder = await instance.getHighest.call();
        assert.equal(highestBidder.valueOf(), accounts[1], "Please Check Bid");
        let bal1 = await instance.getBalance.call();
        assert.equal(bal1.valueOf(), 10, "HAHA1");

        await instance.reveal.sendTransaction(10, {from: accounts[2], gas: 3000000, value:20});
        let highestBidder1 = await instance.getHighest.call();
        assert.equal(highestBidder1.valueOf(), accounts[2], "Please Check Bid");
        let bal2 = await instance.getBalance.call();
        assert.equal(bal2.valueOf(), 20, "HAHA2");

        await instance.reveal.sendTransaction(10, {from: accounts[3], gas: 3000000, value:40});
        let highestBidder2 = await instance.getHighest.call();
        assert.equal(highestBidder2.valueOf(), accounts[3], "Please Check Bid");
        let bal3 = await instance.getBalance.call();
        assert.equal(bal3.valueOf(), 40, "HAHA3");

    });

    // it("With Auction", async () => {
    //     let instance = await BiddingRing.deployed();
        
    //     let bid = web3.eth.abi.encodeParameters(['uint', 'uint'], [10, 10]);
    //     await instance.bid.sendTransaction(web3.utils.keccak256(bid, {encoding: "hex"}), {from: accounts[1], gas: 3000000});
        
    //     let bid1 = web3.eth.abi.encodeParameters(['uint', 'uint'], [20, 10]);
    //     await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
    //     let bid2 = web3.eth.abi.encodeParameters(['uint', 'uint'], [40, 10]);
    //     await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[3], gas: 3000000});

    //     await instance.reveal.sendTransaction(10, 10, {from: accounts[1], gas: 3000000});
    //     await instance.reveal.sendTransaction(20, 10, {from: accounts[2], gas: 3000000});
    //     await instance.reveal.sendTransaction(40, 10, {from: accounts[3], gas: 3000000});

    //     let auction = await VickreyAuction.deployed();
    //     await instance.setAuctionAddress.sendTransaction(auction.address);
    //     let address = await instance.getAuctionAddress.call();
    //     assert.equal(address.valueOf(), auction.address)
    //     await instance.submitToAuction.sendTransaction({from: accounts[0]});
    //     let bidders = await auction.getNumBidders.call();
    //     assert.equal(bidders.valueOf(), 1);
    //     // await auction.reveal.sendTransaction(40, 10, {from: accounts[3], gas: 3000000});
    // });
});