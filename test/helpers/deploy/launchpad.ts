import { ethers } from 'hardhat'

export default async () => {
  const Router = await ethers.getContractFactory('DePayLaunchpadV1')
  const router = await Router.deploy()
  await router.deployed()

  return router
}
