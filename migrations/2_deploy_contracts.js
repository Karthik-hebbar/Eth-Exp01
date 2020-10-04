var Election = artifacts.require("./election.sol");
var Display = artifacts.require("./Display.sol");
module.exports = function (deployer) {
  deployer.deploy(Election);
  deployer.deploy(Display);
};
