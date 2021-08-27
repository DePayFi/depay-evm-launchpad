// SPDX-License-Identifier: MIT

// only used for running automated hardhat tests

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {

  constructor() ERC20("TestToken", "TT") {
      _mint(msg.sender, 10000000000000000000000000);
  }
}
