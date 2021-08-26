#  Audit report
  
  
|    Name    | Information                                                                                                       |
| :--------: | ----------------------------------------------------------------------------------------------------------------- |
| Repository | https://github.com/DePayFi/depay-evm-launchpad                                                                    |
|  Checked   | [DePayLaunchpadV1.sol](https://github.com/DePayFi/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol ) |
|   Branch   | [master](https://github.com/DePayFi/depay-evm-launchpad )                                                          |
|    Time    | Thur, 26 Aug 2021 06:00:35 UTC                                                                                    |
|   Author   | Temitayo Daniel                                                                                                   |
  
#  Result
  
  
| Severity | Count | Link                                             |
| :------: | ----: | ------------------------------------------------ |
|   High   |     2 |                                                  |
|          |       | [H01- Return value ignored](#H01 )                |
|          |       | [H02- Return value ignored](#H02 )                |
|  Medium  |     0 |                                                  |
|   Low    |     3 |                                                  |
|          |       | [L01 - Duplicate function names](#L01 )           |
|          |       | [L02 - Inconsistent variable type](#L02 )         |
|          |       | [L03 - Lack of comments on most functions](#L03 ) |
|  Notes   |     1 |                                                  |
|          |       | [N01 - Consider using address(0)](#N01 )          |
  
##  L01 - Duplicate function names
  
  
|          Affected           | Severity | Count |                                                                                                                                                                  Lines |
| :-------------------------: | :------- | ----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayPaymentProcessorV1.sol | Low      |     1 | [68-75](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1.sol#L68l#L68-L75 ) |
  
There are two private functions that share the same name `_ensureBalance`, It is advised to change one of them so as to avoid confusion especially when using them in other functions.
  
```solidity
 function _ensureBalance(address tokenOut, uint balanceBefore) private {
    require(_balance(tokenOut) >= balanceBefore, 'DePay: Insufficient balance after payment!');
  }
```
  
```solidity
 function _ensureBalance(address[] calldata path) private returns (uint balance) {
    balance = _balance(path[path.length-1]);
    if(path[path.length-1] == ZERO) { balance -= msg.value; }
  }
```
  
<a name="L0"/>
  
##  L02 - Inconsistent variable types
  
  
| Affected                         | Severity | Count |                                                                                                                                                               Lines |
| :------------------------------- | :------- | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayPaymentProcessorV1.sol      | Low      |     1 | [14](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1Uniswap01.sol#L14 ) |
| DePayPaymentProcessorV1Uniswap01 | Low      |     1 | [29](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1Uniswap01.sol#L29 ) |
| DePayPaymentProcessorV1Uniswap01 | Low      |     1 | [30](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1Uniswap01.sol#L30 ) |
| DePayPaymentProcessorV1Uniswap01 | Low      |     1 | [31](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1Uniswap01.sol#L31 ) |
| DePayPaymentProcessorV1Uniswap01 | Low      |     1 | [42](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1Uniswap01.sol#L42 ) |
  
Defined [here](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1.sol#L12 ) in `DePayPaymentProcessorV1`
  
Variable type `uint256` was used in the underlying contract library [TransferHelper](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/master/contracts/libraries/TransferHelper.sol ) while `uint` is used in both [DePayPaymentProcessorV1Uniswap01](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/master/contracts/DePayPaymentProcessorV1Uniswap01.sol ) and [DePayPaymentProcessorV1](https://github.com/DePayFi/depay-evm-launchpad/blob/master/contracts/DePayLaunchpadV1.sol ). Note that `uint` and `uint256` may have the same byte space allocation but it is advised to use a consistent variable naming strategy throughout a codebase so as to improve readability and maintainability.
  
<a name="L03"/>
  
##  L03 - Lack of comments on most functions
  
  
| Affected                  | Severity | Count |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          Lines |
| :------------------------ | :------- | ----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| DePayLiquidityStaking.sol | Low      |     7 | [34](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1.sol#L34 ), [55](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1.sol#L55 ), [60](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1.sol#L60 ), [68](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1.sol#L68 ), [77](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1.sol#L77 ), [85](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1.sol#L85 ), [93](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1.sol#L93 ), [98](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1.sol#L98 ) |
  
Most of these internal functions in `DePayPaymentProcessorV1` require a lot of explanation which can be done in comments, especially core external functions like [pay](https://github.com/DePayFi/depay-ethereum-payment-processing/blob/dc5204fb96f9b0f53d733fb89e91e856c1db1dbb/contracts/DePayPaymentProcessorV1Uniswap01.sol#L27 ) in `DePayPaymentProcessorV1Uniswap01` .
Consider adding comments that do a thorough explanation on how these functions use their arguments and the values they return
  
<a name="N01"/>
  
##  N01 - Consider using address(0)
  
  
```solidity
  // Address ZERO
  address private ZERO = 0x0000000000000000000000000000000000000000;
```
  
To improve readability and also preserve some storage, consider using `address(0)`
  