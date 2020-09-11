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
        
        await instance.reveal.sendTransaction(10, {from: accounts[3], gas: 3000000, value:40});
        let highestBidder = await instance.getHighest.call();
        assert.equal(highestBidder.valueOf(), accounts[3], "Please Check Bid");
        let bal1 = await instance.getBalance.call();
        assert.equal(bal1.valueOf(), 40, "HAHA1");

        await instance.reveal.sendTransaction(10, {from: accounts[2], gas: 3000000, value:20});
        let highestBidder1 = await instance.getHighest.call();
        assert.equal(highestBidder1.valueOf(), accounts[3], "Please Check Bid");
        let bal2 = await instance.getBalance.call();
        assert.equal(bal2.valueOf(), 40, "HAHA2");

        await instance.reveal.sendTransaction(10, {from: accounts[1], gas: 3000000, value:10});
        let highestBidder2 = await instance.getHighest.call();
        assert.equal(highestBidder2.valueOf(), accounts[3], "Please Check Bid");
        let bal3 = await instance.getBalance.call();
        assert.equal(bal3.valueOf(), 40, "HAHA3");

    });

    it("With Auction", async () => {
        let instance = await BiddingRing.deployed();
        
        let bid = web3.eth.abi.encodeParameters(['uint', 'uint'], [10, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid, {encoding: "hex"}), {from: accounts[1], gas: 3000000});
        
        let bid1 = web3.eth.abi.encodeParameters(['uint', 'uint'], [20, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
        let bid2 = web3.eth.abi.encodeParameters(['uint', 'uint'], [40, 10]);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[3], gas: 3000000});

        await instance.reveal.sendTransaction(10, {from: accounts[1], gas: 3000000, value:10});
        await instance.reveal.sendTransaction(10, {from: accounts[2], gas: 3000000, value:20});
        await instance.reveal.sendTransaction(10, {from: accounts[3], gas: 3000000, value:40});

        let auction = await VickreyAuction.deployed();
        await instance.setAuctionAddress.sendTransaction(auction.address);
        let address = await instance.getAuctionAddress.call();
        assert.equal(address.valueOf(), auction.address);


        // let address1 = await auction.getSeller.call();
        // assert.equal(address1.valueOf(), instance.address);

        await instance.submitToAuction.sendTransaction();

        let bidders = await auction.getNumBidders.call();
        assert.equal(bidders.valueOf(), 1);

        // let bid3 = web3.eth.abi.encodeParameters(['uint', 'uint'], [30, 10]);
        // await auction.bid.sendTransaction(web3.utils.keccak256(bid3, {encoding: "hex"}), {from: accounts[5], gas: 3000000});


        // await auction.bid(web3.utils.keccak256(bid1, {encoding: "hex"}));
        // let bidders1 = await auction.getNumBidders.call();
        // assert.equal(bidders1.valueOf(), 2);

        // await auction.reveal.sendTransaction(10, {from: accounts[5], gas: 3000000, value: 30});

        await instance.revealToAuction.sendTransaction();
        let bal = await auction.getNumRevealed.call();
        assert.equal(bal.valueOf(), 1, "Not matching");
        // await auction.reveal.sendTransaction(10, {from: instance.address, gas: 3000000, value: 40});
    });
});