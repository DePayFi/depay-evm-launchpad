// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DePayLaunchpadV1 is Ownable, ReentrancyGuard {
  
  using SafeERC20 for ERC20;

  // The address of the token to be launched
  address public launchedToken;

  // The address of the token to be accepted as payment for claiming the launched token
  address public paymentToken;

  // Total amount of launched tokens to be claimable by others
  uint256 public totalClaimable;

  // Total amount of tokens already claimed
  uint256 public totalClaimed;

  // Time the claiming perioud ends
  uint256 public endTime;

  // Price represents amount of tokens required to pay (paymentToken) per token claimed (launchedToken)
  uint256 public price;

  // Stores all whitelisted address
  mapping (address => bool) public whitelist;

  // Stores all claims per address
  mapping (address => uint256) public claims;

  // Split release address
  address public splitReleaseAddress;

  // Split release amount
  uint256 public splitReleaseAmount;

  // Stores if release is supposed to be split
  mapping (address => bool) public splitReleases;

  // Limit executions to uninitalized launchpad state only
  modifier onlyUninitialized() {
    require(
      launchedToken == address(0x0),
      "You can only initialize a launchpad once!"
    );
    _;
  }

  // Initalizes the launchpad and ensures that launchedToken and paymentToken are set.
  // Makes sure you cant initialize the launchpad without any claimable token amounts.
  function init(
    address _launchedToken,
    address _paymentToken,
    uint256 _splitReleaseAmount,
    address _splitReleaseAddress
  ) external onlyUninitialized onlyOwner returns(bool) {
    require(_launchedToken != address(0x0), "Zero Address: Not Allowed");
    require(_paymentToken != address(0x0), "Zero Address: Not Allowed");
    require(_splitReleaseAddress != address(0x0), "Zero Address: Not Allowed");
    launchedToken = _launchedToken;
    paymentToken = _paymentToken;
    splitReleaseAddress = _splitReleaseAddress;
    splitReleaseAmount = _splitReleaseAmount;
    totalClaimable = ERC20(launchedToken).balanceOf(address(this));
    require(totalClaimable > 0, "You need to initalize the launchpad with claimable tokens!");
    return true;
  }

  // Limit executions to initalized launchpad state only
  modifier onlyInitialized() {
    require(
      totalClaimable > 0,
      "Launchpad has not been initialized yet!"
    );
    _;
  }

  // Limit executions to unstarted launchpad state only
  modifier onlyUnstarted() {
    require(
      endTime == 0,
      "You can only start a launchpad once!"
    );
    _;
  }

  // Starts the claiming process.
  // Makes sure endTime is in the future and not to far in the future.
  // Also makes sure that the price per launched token is set properly.
  function start(
    uint256 _endTime,
    uint256 _price
  ) external onlyOwner onlyInitialized onlyUnstarted returns(bool) {
    require(_endTime > block.timestamp, "endTime needs to be in the future!");
    require(_endTime < (block.timestamp + 12 weeks), "endTime needs to be less than 12 weeks in the future!");
    endTime = _endTime;
    price = _price;
    return true;
  }

  // Whitelist address (enables them to claim launched token)
  function _whitelistAddress(
    address _address,
    bool status
  ) private returns(bool) {
    require(_address != address(0x0), "Zero Address: Not Allowed");
    whitelist[_address] = status;
    return true;
  }

  // Whitelist single address
  function whitelistAddress(
    address _address,
    bool status
  ) external onlyOwner returns(bool) {
    require(_whitelistAddress(_address, status));
    return true;
  }

  // Whitelist multiple addresses
  function whitelistAddresses(
    address[] memory _addresses,
    bool status
  ) external onlyOwner returns(bool) {
    for (uint256 i = 0; i < _addresses.length; i++) {
      require(_whitelistAddress(_addresses[i], status));
    }
    return true;
  }

  // Limit executions to launchpad in progress only
  modifier onlyInProgress() {
    require(
      endTime > 0,
      "Launchpad has not been started yet!"
    );
    require(
      endTime > block.timestamp,
      "Launchpad has been finished!"
    );
    _;
  }

  // Claims a token allocation for claimedAmount.
  // Makes sure that the payment for the allocation is sent along and stored in the smart contract (payedAmount).
  // Also ensures that its not possible to claim more than totalClaimable.
  function claim(
    address forAddress,
    uint256 claimedAmount,
    bool splitRelease
  ) external onlyInProgress nonReentrant returns(bool) {
    require(whitelist[forAddress], 'Address has not been whitelisted for this launch!');
    if(splitRelease && !splitReleases[forAddress]){ require(claimedAmount > splitReleaseAmount, 'Claimed amount is smaller then splitRelease!'); }
    if(!splitRelease){ require(!splitReleases[forAddress], 'You cannot change splitRelease once set!'); }
    uint256 payedAmount = claimedAmount * price / (10**ERC20(paymentToken).decimals());
    ERC20(paymentToken).safeTransferFrom(msg.sender, address(this), payedAmount);
    claims[forAddress] += claimedAmount;
    splitReleases[forAddress] = splitRelease;
    totalClaimed += claimedAmount;
    require(totalClaimed <= totalClaimable, 'Claiming attempt exceeds totalClaimable amount!');
    return true;
  }

  // Limit executions to launchpad ended state only
  modifier onlyEnded() {
    require(
      endTime > 0,
      "Launchpad has not been started yet!"
    );
    require(
      endTime < block.timestamp,
      "Launchpad has not ended yet!"
    );
    _;
  }

  // Releases ones claim for the launched token.
  // Can be executed by anyone, but makes sure the claimed token is released to claimer and not to the sender.
  function _release(
    address forAddress
  ) private returns(bool) {
    uint256 claimedAmount = claims[forAddress];
    require(claimedAmount > 0, 'Nothing to release!');
    if(splitReleases[forAddress]) {
      ERC20(launchedToken).safeTransfer(splitReleaseAddress, splitReleaseAmount);
      ERC20(launchedToken).safeTransfer(forAddress, (claimedAmount - splitReleaseAmount));
    } else {
      ERC20(launchedToken).safeTransfer(forAddress, claimedAmount);
    }
    claims[forAddress] = 0;
    return true;
  }

  // Releases claim for a single address
  function release(
    address forAddress
  ) external onlyEnded nonReentrant returns(bool) {
    require(_release(forAddress));
    return true;
  }

  // Releases claim for multiple addresses
  function multiRelease(
    address[] memory forAddresses
  ) external onlyEnded nonReentrant returns(bool) {
    for (uint256 i = 0; i < forAddresses.length; i++) {
      require(_release(forAddresses[i]));
    }
    return true;
  }

  // Releases payment token to the owner.
  function releasePayments() external onlyEnded onlyOwner nonReentrant returns(bool) {
    ERC20(paymentToken).safeTransfer(owner(), ERC20(paymentToken).balanceOf(address(this)));
    return true;
  }

  // Releases unclaimed launched tokens back to the owner.
  function releaseUnclaimed() external onlyEnded onlyOwner nonReentrant returns(bool) {
    uint256 unclaimed = totalClaimable-totalClaimed;
    ERC20(launchedToken).safeTransfer(owner(), unclaimed);
    totalClaimable -= unclaimed;
    return true;
  }
}
