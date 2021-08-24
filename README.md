# DePay's Launchpad

EVM Smart Contract to whitelist, claim and release tokens in a launchpad fashion.

## Deployments

`DePayLaunchpadV1`

Binance Smart Chain: [...](...)

Binance Smart Chain Testnet: []()

## Summary

This Launchpad contract allows users to participate in a token launch.

The initiater (`owner`) `deploys` this contract, and sends the amount to be distributed with the launchpad into the `launchpad` contract.

The `owner` then calls `init(_launchedToken:address, _paymentToken:address)` to initialize the launchpad.

The `totalClaimable` amount is determined by the `balance` of the `launchedToken` within the `launchpad` upon initialization.

Before the `start` of the claiming process, the `owner` has the ability to `whitelistAddress` or `whitelistAddresses`.

Those whitelisted addresses will be able to participate claiming tokens during the `launch`.


## Functionalities

### `...` ...

...

Arguments:

`path`: The path of the token conversion:

```
...
```


## Audits

1. 
2. 
3. 

## Development

### Quick Start

```
yarn install
yarn test
```

### Testing

```
yarn test
```

### Deploy

1. `yarn flatten`

2. Deploy flatten contract via remix
