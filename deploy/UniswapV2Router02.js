const { WETH } = require("@flareswap/core-sdk")

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  let wethAddress = "0x1659941d425224408c5679eeef606666c7991a8A";
  
  const factoryAddress = (await deployments.get("UniswapV2Factory")).address

  await deploy("UniswapV2Router02", {
    from: deployer,
    args: [factoryAddress, wethAddress],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["UniswapV2Router02", "AMM"]
module.exports.dependencies = ["UniswapV2Factory", "Mocks"]