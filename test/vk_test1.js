const VickreyAuction = artifacts.require("VickreyAuction");

function bids(a, b){
    return web3.eth.abi.encodeParameters(['uint','uint'], [a, b]);
}

contract('Test1: Vickery Auction', async accounts => {
    it("Check Number of bids", async () => {
        let instance = await VickreyAuction.deployed();
        
        let bid1 = bids(100, 10);
        await instance.bid.sendTransaction(web3.utils.keccak256(bid1, {encoding: "hex"}), {from: accounts[1], gas: 3000000});
        
        let bid2 = bids(200, 10)
        await instance.bid.sendTransaction(web3.utils.keccak256(bid2, {encoding: "hex"}), {from: accounts[2], gas: 3000000});
        
        let bid3 = bids(400, 10)
        await instance.bid.sendTransaction(web3.utils.keccak256(bid3, {encoding: "hex"}), {from: accounts[3], gas: 3000000});

        let count = await instance.getNumBidders.call({from: accounts[0]});
        assert.equal(count.valueOf(), 3, "Wrong Number of bidders");
    });
});