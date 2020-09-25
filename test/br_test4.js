const BiddingRing = artifacts.require("BiddingRing");
const VickreyAuction = artifacts.require("VickreyAuction");

contract('Bidding Ring tests', async (accounts) => {
    it("Bidding Ring test 4", async () => {
        let auction = await VickreyAuction.deployed();
        let ring = await BiddingRing.deployed();

        let bid = web3.eth.abi.encodeParameters(['uint', 'uint'], [3, 10]);
        await ring.bid.sendTransaction(web3.utils.keccak256(bid, {encoding: "hex"}), {from: accounts[1], gas: 3000000});

        let bid1 = web3.eth.abi.encodeParameters(['uint', 'uint'], [4, 10]);
        await ring.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
    
        await ring.reveal.sendTransaction(10, {from: accounts[1], gas: 3000000, value:3});
        await ring.reveal.sendTransaction(10, {from: accounts[2], gas: 3000000, value:4});

        await ring.setAuctionAddress.sendTransaction(auction.address);
        let address = await ring.getAuctionAddress.call();
        assert.equal(address.valueOf(), auction.address);

        await ring.submitToAuction.sendTransaction();
        let bidders = await auction.getNumBidders.call();
        assert.equal(bidders.valueOf(), 1);

        let bid4 = web3.eth.abi.encodeParameters(['uint', 'uint'], [1, 10]);
        await auction.bid.sendTransaction(web3.utils.keccak256(bid4, {encoding: "hex"}), {from: accounts[3], gas: 3000000});

        let bid6 = web3.eth.abi.encodeParameters(['uint', 'uint'], [2, 10]);
        await auction.bid.sendTransaction(web3.utils.keccak256(bid6, {encoding: "hex"}), {from: accounts[4], gas: 3000000});

        await auction.reveal.sendTransaction(10, {from: accounts[3], gas: 3000000, value:1});
        await auction.reveal.sendTransaction(10, {from: accounts[4], gas: 3000000, value:2});

        let bal = await auction.getNumRevealed.call();
        assert(bal.valueOf(), 2, "Not Matching");
        await auction.claimBalance.sendTransaction({from: accounts[4]});

        let ans = await auction.getBid.call();
        assert(ans[0].valueOf(), accounts[3], "Incorrect Highest Bidder");
        assert(ans[1].valueOf(), 1, "Incorrect Second highest Bid amount");

        let balanceAuction = await auction.getBalance.call();
        assert(balanceAuction[1].valueOf(), 1, "Incorrect Final Balance");

        let balanceRing = await ring.getBalance.call();
        assert(balanceRing.valueOf(), 4, "Incorrect Final Balance");
    });
});