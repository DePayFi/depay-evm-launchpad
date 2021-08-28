# Audit report

|    Name    | Information                                                                                                       |
| :--------: | ----------------------------------------------------------------------------------------------------------------- |
| Repository | https://github.com/DePayFi/depay-evm-launchpad                                                                    |
|  Checked   | [DePayLaunchpadV1.sol](https://github.com/DePayFi/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol) |
|   Branch   | [master](https://github.com/DePayFi/depay-evm-launchpad)                                                          |
|    Time    | Saturday, 28 Aug 2021 08:00:17 UTC                                                                                |
|   Author   | Francis Isberto                                                                                                   |

# Result

| Severity | Count | Link                                                |
| :------: | ----: | --------------------------------------------------- |
|   High   |     0 |                                                     |  |
|  Medium  |     0 |                                                     |
|   Low    |     2 |                                                     |
|          |       | [L01 - block.timestamp possibly manipulated by miners](#L01)   |
|          |       | [L02 - Verify if address is zero](#L02)             |
|  Notes   |     2 |                                                     |
|          |       | [N01 - Can not use address(0)](#N01)                |
|          |       | [N02 - Change Solidity version to save gas & manage bug](#N02)               |

<a name="L01"/>

## L01 - block.timestamp possibly manipulated by miners
|       Affected       | Severity | Count |                                                                                                                                        Lines |
| :------------------: | :------- | ----: | -------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayLaunchpadV1.sol | Low      |     2 | [103-104](https://github.com/icebert04/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol#L103-L104) |

`block.timestamp` and its alias `now` can be manipulated by miners if they have some incentive to do so. 

Using Solidity’s time units and Suffixes like seconds, minutes, hours, and days after literal numbers can be used to convert between units of time.


<a name="L02"/>

## L02 - Verify if address is zero

|       Affected       | Severity | Count |                                                                                                                                        Lines |
| :------------------: | :------- | ----: | -------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayLaunchpadV1.sol | Low      |     3 | [66-68](https://github.com/icebert04/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol#L66-L68) |

Before making an action on a particular address, it is imperative to validate if the said address is not empty.  
Case in point, the variables called [_launchedToken](https://github.com/icebert04/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol#L66), [_paymentToken](https://github.com/icebert04/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol#L67), and [_splitReleaseAddress](https://github.com/icebert04/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol#L68) that can be modified by doing this...

```require(_addressVariable!=address(0x0),"Empty Address: Prohibited");```

<a name="N01"/>

## N01 - Cannot use address(0)

|       Affected       | Severity | Count |                                                                                                                               Lines |
| :------------------: | :------- | ----: | ----------------------------------------------------------------------------------------------------------------------------------: |
| DePayLaunchpadV1.sol | Notes    |     4 | [52](https://github.com/icebert04/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol#L52) |
|                      |          |       | [66-68](https://github.com/icebert04/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol#L66-L68) |

In Solidity version 0.5.0 and above, you can not compare directly with 0 to 0x0, or “0” to “0x0” since these types are not treated as addresses anymore.

It is best to use ``address(0x0)`` to ease compatibility for future use.

<a name="N02"/>

## N02 - Change Solidity version to save gas & manage bug fixes

|       Affected       | Severity | Count |                                                                                                                                            Lines |
| :------------------: | :------- | ----: | -----------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayLaunchpadV1.sol | Notes    |     1 | [3](https://github.com/icebert04/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol#L3) |

Endorsing Version 0.8.2 to lower gas and provide more means to work with code documentation.
