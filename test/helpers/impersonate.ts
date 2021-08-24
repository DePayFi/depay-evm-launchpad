import { ethers } from 'hardhat'

export default async (address)=> {
  const signer = await ethers.provider.getSigner(address)
  await ethers.provider.send('hardhat_impersonateAccount', [signer._address])
  return signer
}
