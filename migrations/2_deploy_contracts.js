const VickreyAuction = artifacts.require("VickreyAuction");
const BiddingRing = artifacts.require("BiddingRing");

module.exports = function(deployer) {
  deployer.deploy(VickreyAuction, 10, 10);
  deployer.link(VickreyAuction, BiddingRing);
  deployer.deploy(BiddingRing, 10, 10);
};
