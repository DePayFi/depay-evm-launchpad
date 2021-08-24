import { ethers } from 'hardhat'

export default async () => {
  const Token = await ethers.getContractFactory('TestToken')
  const token = await Token.deploy()
  await token.deployed()

  return token
}
