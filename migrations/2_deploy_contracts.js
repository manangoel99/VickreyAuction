const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const VickreyAuction = artifacts.require("VickreyAuction");
const BiddingRing = artifacts.require("BiddingRing");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(VickreyAuction, 10, 10);
  deployer.link(VickreyAuction, BiddingRing);
  deployer.deploy(BiddingRing, 10, 10);
};
