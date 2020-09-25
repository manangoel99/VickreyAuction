const BiddingRing = artifacts.require("BiddingRing");
const VickreyAuction = artifacts.require("VickreyAuction");

contract('Bidding Ring tests', async (accounts) => {
    it("Bidding Ring test 1", async () => {
        let auction = await VickreyAuction.deployed();
        let ring = await BiddingRing.deployed();

        let bid = web3.eth.abi.encodeParameters(['uint', 'uint'], [3, 10]);
        await ring.bid.sendTransaction(web3.utils.keccak256(bid, {encoding: "hex"}), {from: accounts[1], gas: 3000000});

        let bid1 = web3.eth.abi.encodeParameters(['uint', 'uint'], [4, 10]);
        await ring.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
        let bid2 = web3.eth.abi.encodeParameters(['uint', 'uint'], [5, 10]);
        await ring.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[3], gas: 3000000});

        let bid3 = web3.eth.abi.encodeParameters(['uint', 'uint'], [6, 10]);
        await ring.bid.sendTransaction(web3.utils.keccak256(bid3, {encoding: "hex"}), {from: accounts[4], gas: 3000000});

        await ring.reveal.sendTransaction(10, {from: accounts[1], gas: 3000000, value:3});
        await ring.reveal.sendTransaction(10, {from: accounts[2], gas: 3000000, value:4});
        await ring.reveal.sendTransaction(10, {from: accounts[3], gas: 3000000, value:5});
        await ring.reveal.sendTransaction(10, {from: accounts[4], gas: 3000000, value:6});

        await ring.setAuctionAddress.sendTransaction(auction.address);
        let address = await ring.getAuctionAddress.call();
        assert.equal(address.valueOf(), auction.address);

        await ring.submitToAuction.sendTransaction();
        let bidders = await auction.getNumBidders.call();
        assert.equal(bidders.valueOf(), 1);

        let bid4 = web3.eth.abi.encodeParameters(['uint', 'uint'], [1, 10]);
        await auction.bid.sendTransaction(web3.utils.keccak256(bid4, {encoding: "hex"}), {from: accounts[5], gas: 3000000});

        let bid5 = web3.eth.abi.encodeParameters(['uint', 'uint'], [2, 10]);
        await auction.bid.sendTransaction(web3.utils.keccak256(bid5, {encoding: "hex"}), {from: accounts[6], gas: 3000000});

        let bid6 = web3.eth.abi.encodeParameters(['uint', 'uint'], [3, 10]);
        await auction.bid.sendTransaction(web3.utils.keccak256(bid6, {encoding: "hex"}), {from: accounts[7], gas: 3000000});

        await auction.reveal.sendTransaction(10, {from: accounts[5], gas: 3000000, value:1});
        await auction.reveal.sendTransaction(10, {from: accounts[6], gas: 3000000, value:2});
        await auction.reveal.sendTransaction(10, {from: accounts[7], gas: 3000000, value:3});
        await ring.revealToAuction.sendTransaction({from: accounts[4], gas: 3000000});
        let bal = await auction.getNumRevealed.call();
        assert(bal.valueOf(), 4, "Not Matching");
        await auction.claimBalance.sendTransaction({from: accounts[4]});

        let ans = await auction.getBid.call();
        assert(ans[0].valueOf(), accounts[4], "Incorrect Highest Bidder");
        assert(ans[1].valueOf(), 3, "Incorrect Second highest Bid amount");

        let balanceAuction = await auction.getBalance.call();
        assert(balanceAuction[1].valueOf(), 3, "Incorrect Final Balance");
    });
});