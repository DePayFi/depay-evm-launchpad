import '@nomiclabs/hardhat-waffle'
import 'hardhat-typechain'
import 'solidity-coverage'
import { HardhatUserConfig } from 'hardhat/types'

export default {
  solidity: {
    version: '0.8.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
