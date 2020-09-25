const VickreyAuction = artifacts.require("VickreyAuction");

function bids(a, b){
    return web3.eth.abi.encodeParameters(['uint','uint'], [a, b]);
}

contract('Test6: Vickery Auction', async accounts => {

    it("Some bids unrevealed", async () => {
        let instance = await VickreyAuction.deployed();
        
        let bid1 = bids(6, 20);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[1], gas: 3000000});
        
        let bid2 = bids(4, 15);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
        let bid3 = bids(7, 15);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid3, {encoding: "hex"}), {from: accounts[3], gas: 3000000});

        let bid4 = bids(8, 15);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid4, {encoding: "hex"}), {from: accounts[4], gas: 3000000});

        let bid5 = bids(1, 15);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid5, {encoding: "hex"}), {from: accounts[5], gas: 3000000});

        // ################## //
        await instance.reveal.sendTransaction(15, {from: accounts[2], gas: 3000000, value:4});
        
        let bal1 = await instance.getBalance.call();
        assert.equal(bal1[1].valueOf(), 4, "Wrong account balance 2");
        
        // await instance.reveal.sendTransaction(20, {from: accounts[1], gas: 3000000, value:6});
        // let bal2 = await instance.getBalance.call();
        // assert.equal(bal2[1].valueOf(), 6, "Wrong account balance 1");

        await instance.reveal.sendTransaction(15, {from: accounts[3], gas: 3000000, value:7});
        let bal3 = await instance.getBalance.call();
        assert.equal(bal3[1].valueOf(), 7, "Wrong account balance 1");

        await instance.reveal.sendTransaction(15, {from: accounts[5], gas: 3000000, value:1});
        let bal4 = await instance.getBalance.call();
        assert.equal(bal4[1].valueOf(), 7, "Wrong account balance 1");

        let val1 = await instance.getBid.call();
        assert.equal(val1[0].valueOf(), accounts[3], "Wrong high bidder");
        assert.equal(val1[1].valueOf(), 4, "Wrong second bid");

        // ################## //
        let highestBidder = await instance.getHighest.call();
        assert.equal(highestBidder.valueOf(), accounts[3], "High bidder wrong");
        await instance.claimBalance.sendTransaction({from: highestBidder, gas: 300000});
        let bal5 = await instance.getBalance.call();
        assert.equal(bal5[1].valueOf(), 4, "Wrong contract balance");
    });
});