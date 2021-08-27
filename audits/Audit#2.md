# Audit report

|    Name    | Information                                                                                                       |
| :--------: | ----------------------------------------------------------------------------------------------------------------- |
| Repository | https://github.com/DePayFi/depay-evm-launchpad                                                                    |
|  Checked   | [DePayLaunchpadV1.sol](https://github.com/DePayFi/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol) |
|   Branch   | [master](https://github.com/DePayFi/depay-evm-launchpad)                                                          |
|    Time    | Thur, 26 Aug 2021 06:00:35 UTC                                                                                    |
|   Author   | Temitayo Daniel                                                                                                   |

# Result

| Severity | Count | Link                                                |
| :------: | ----: | --------------------------------------------------- |
|   High   |     0 |                                                     |  |
|  Medium  |     0 |                                                     |
|   Low    |     2 |                                                     |
|          |       | [L01 - Emit an event for parameter changes](#L01)   |
|          |       | [L02 - Lack of Zero Check](#L02)                    |
|  Notes   |     2 |                                                     |
|          |       | [N01 - Use a lower solidity version compiler](#N01) |
|          |       | [N01 - Remove redundant checks](#N01)               |

<a name="L01"/>

## L01 - Emit an event for parameter changes

|       Affected       | Severity | Count |                                                                                                                                        Lines |
| :------------------: | :------- | ----: | -------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayLaunchpadV1.sol | Low      |     5 | [66-70](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L66-L70) |
|                      |          |     2 | [97-98](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L97-L98) |

When state variables are being modified, it is important to emit events that alert the state of change of these critical transitions. a simple fix would be to have some events that emit the updated value of state variables that were modified in the functions [`init`](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L60) and [`start`](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L96)

<a name="L02"/>

## L02 - Lack of Zero Check

|       Affected       | Severity | Count |                                                                                                                                        Lines |
| :------------------: | :------- | ----: | -------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayLaunchpadV1.sol | Low      |     1 | [61-64](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L61-L64) |

When important operation is to be carried out on an arbitrary address, it is important to check that it is not the Zero address. This applies to variables [`_launchedToken`](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L61),[`_paymentToken`](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L62) and [`splitReleaseAddress`](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L64) and can be easily mitigated by doing

```solidity
require(addressVariable!=address(0),"Zero Address: Not Allowed");
```

<a name="N01"/>

## N01 - Use a lower solidity version compiler

|       Affected       | Severity | Count |                                                                                                                               Lines |
| :------------------: | :------- | ----: | ----------------------------------------------------------------------------------------------------------------------------------: |
| DePayLaunchpadV1.sol | Notes    |     1 | [3](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L3) |

[`solc-0.8.6`](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L3) is not recommended for deployment as it is still new and might contain some bugs

Consider deploying with `0.8.1`

<a name="N02"/>

## N02 - Remove redundant checks

|       Affected       | Severity | Count |                                                                                                                                            Lines |
| :------------------: | :------- | ----: | -----------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayLaunchpadV1.sol | Notes    |     1 | [157-158](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L157-L158) |

There is a Comparison to boolean constant that is been done in lines [157](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L157) and [158](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L158). Recommendation would be to remove the equality to the boolean constant.

_Before_

```solidity
if(splitRelease && splitReleases[forAddress] == false){ require(claimedAmount > splitReleaseAmount, 'Claimed amount is smaller then splitRelease!'); }
    if(splitRelease == false){ require(splitReleases[forAddress] == false, 'You cannot change splitRelease once set!'); }
```

_After_

```solidity
if(splitRelease && !splitReleases[forAddress]){ require(claimedAmount > splitReleaseAmount, 'Claimed amount is smaller then splitRelease!'); }
    if(!splitRelease){ require(!splitReleases[forAddress], 'You cannot change splitRelease once set!'); }
```

<a name="N03"/>

## N03 - Perform division after multiplication

|       Affected       | Severity | Count |                                                                                                                                            Lines |
| :------------------: | :------- | ----: | -----------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayLaunchpadV1.sol | Notes    |     1 | [160](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L160) |

Although by default Division is supposed to come before multiplication, but since solidity doesn't support float, be careful when doing division before multiplications.

_Before_

```solidity
uint256 payedAmount = claimedAmount.div(10**ERC20(paymentToken).decimals()).mul(price);
```

_After_

```solidity
uint256 payedAmount = claimedAmount.mul(price).div(10**ERC20(paymentToken).decimals());
```

<a name="N04"/>

## N04 - Use safeTransfer over transfer

|       Affected       | Severity | Count |                                                                                                                                            Lines |
| :------------------: | :------- | ----: | -----------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayLaunchpadV1.sol | Notes    |     1 | [219](https://github.com/DePayFi/depay-evm-launchpad/blob/5c3288f1b9cc1273b8cef2b064c017b162165b19/contracts/DePayLaunchpadV1.sol#L219) |

Make sure to use safeTransfer over transfer.

_Before_

```solidity
ERC20(paymentToken).transfer(owner(), ERC20(paymentToken).balanceOf(address(this)));
```

_After_

```solidity
ERC20(paymentToken).safeTransfer(owner(), ERC20(paymentToken).balanceOf(address(this)));
```
