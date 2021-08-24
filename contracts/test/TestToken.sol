// SPDX-License-Identifier: MIT

// only used for running automated hardhat tests

pragma solidity >=0.8.6 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {

  constructor() ERC20("TestToken", "TT") {
      _mint(msg.sender, 1000000000000000000000000);
  }
}
