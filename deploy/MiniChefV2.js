const { ChainId } = require("@flareswap/core-sdk")


const SUSHI = {
  [ChainId.COSTON]: '0xF328362C39975B8dc3C0609E19812B4b2F97EA86'
}

module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const chainId = await getChainId()

  let sushiAddress;

  if (chainId === '16') {
    sushiAddress = (await deployments.get("SushiToken")).address
  } else if (chainId in SUSHI) {
    sushiAddress = SUSHI[chainId]
  } else {
    throw Error("No SUSHI!")
  }

  await deploy("MiniChefV2", {
    from: deployer,
    args: [sushiAddress],
    log: true,
    deterministicDeployment: false
  })

  const miniChefV2 = await ethers.getContract("MiniChefV2")
  if (await miniChefV2.owner() !== dev) {
    console.log("Transfer ownership of MiniChef to dev")
    await (await miniChefV2.transferOwnership(dev, true, false)).wait()
  }
}

module.exports.tags = ["MiniChefV2"]
// module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
