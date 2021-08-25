# DePay's Launchpad

EVM Smart Contract to whitelist, claim and release tokens in a launchpad fashion.

## Deployments

`DePayLaunchpadV1`

Binance Smart Chain: [...](...)

Binance Smart Chain Testnet: [0x012af92a2a1274566256dbc756f708e8c70d983d](https://testnet.bscscan.com/address/0x012af92a2a1274566256dbc756f708e8c70d983d)

## Summary

This launchpad smart contract allows users to participate in a token launch.

The initiator (`owner`) deploys this contract, and sends the token to be distributed with the launchpad into the launchpad contract.

The `owner` then calls `init` to initialize the launchpad.

The `totalClaimable` amount is determined by the balance of the `launchedToken` within the launchpad upon initialization.

Before the start of the claiming process, the `owner` has the ability to `whitelistAddress` or `whitelistAddresses`.

Those whitelisted addresses will be able to participate claiming tokens during the launch.

Once the owner starts the launchpad using `start` and setting `endTime` and `price`, people can claim allocations using `claim`.

Upon executing `claim`, people can also decide if they want to split released tokens with the `splitReleaseAddress` for other purposes.

Once an individual claim for an address has been set to split release, it cannot be reverted (as the to be split amount also has been payed in already).

Once the launchpad has ended (`block.timestamp > endTime`), people with claims can release their share of the launched tokens by calling `release`.

If a split release has been configured, released amounts of launched tokens will be deducted by the `splitReleaseAmount` which will be send to the `splitReleaseAddress`,
the remaining claim of launched tokens will be send to the claiming address.

If no split release has been configured the entire claimed amount will be send to the claimer upon `release`.

After the launchpad ended, the initiator (`owner`) can `releasePayments` and `releaseUnclaimed` tokens which have not been claimed to finish the launchpad process.

## Functionalities

### `init`

Initializes the launchpad with given `_launchedToken` and `_paymentToken`.

Also allows you to setup release split if `_splitReleaseAddress` & `_splitReleaseAmount` is provided.

Make sure you transfer the to be launched tokens into the launchpad contract before initialization.

`totalClaimable` will be set with the balance of the launchpad's `_launchedToken` upon executing `init`.

Arguments:

`_launchedToken`: The token to be launched.

`_paymentToken`: The token accepted as payment.

`_splitReleaseAmount`: Splits the release amount by the given amount and sends it upon release to `_splitReleaseAddress`.

`_splitReleaseAddress`: Address used to send split release to.

Example: https://testnet.bscscan.com/tx/0xb197355a7d2495c29357d20472aa3573a0f5563e5cea3dffd1ecf02820ea44bf

### `whitelistAddress`

Allows to add a single address to the whitelist.

Whitelisted addresses can participate in the launchpad once started.

Arguments:

`_address`: The address to set the whitelist status for.

`status`: If whitelisted or not (e.g. true or false).

Example: https://testnet.bscscan.com/tx/0xc27ba361cbdeace5b4aa5501d666ca689a22685e6d5846e2063ca5284037356d

### `whitelistAddresses`

Allows to add multiple addresses to the whitelist.

Whitelisted addresses can participate in the launchpad once started.

Arguments:

`_addresses[]`: The addresses to set the whitelist status for.

`status`: If whitelisted or not (e.g. true or false).

Example: https://testnet.bscscan.com/tx/0xc99816adc321b6106277d31c37987bb7daf1c035615ed2b4834c9157e34cc9f6

### `start`

Starts the launchpad. Requires to set the `endTime` and the `price`.

The `endTime` needs to be in the future and is not allowed to be bigger than 12 weeks from now.

The `price` determines how much `paymentToken` participants have to pay per `launchedToken` upon claiming.

Arguments:

`endTime`: The end of the launchpad (after which participants can release launchedTokens).

`price`: Amount of `paymentToken` required to be paid per claimed `launchedToken`.

Example: https://testnet.bscscan.com/tx/0xaad62394d2b83c593538c3304a1c99dbb47e9128d7420612072e81735a2112df

### `claim`

Claims an allocation. Requires approval for the launchpad contract to spend senders `paymentToken`.

`paymentToken` will be pulled into the launchpad and claim will be record (in `claims`).

People can execute `claim` multiple times, which will just increase individual allocations.

Arguments:

`_for`: The address you are creating the claim for.

`amount`: The amount of launched tokens you are claiming.

`splitRelease`: Boolean indicating if participant wants to split release with `splitReleaseAddress`.

Example: https://testnet.bscscan.com/tx/0xd287fe3909ad26fcc9156afb51fb2138f53045571fde48d257629f14497fcfe0

### `release`

Release the previously claimed token.

`launchedToken` will be send to the claimer (not the message sender) for the amount claimed, deducting `splitReleaseAmount` and send to `splitReleaseAddress` if configured as part of the claim.

Arguments:

`forAddress`: The address to release the launchedToken for.

Example: https://testnet.bscscan.com/tx/0xe5d4d248c5d53c1fc2ec1dac39b8bacac21e19582fd78e55790b26c381199aba

### `multiRelease`

Release previously claimed tokens for multiple addresses at once.

`launchedToken` will be send to the multiple claimers (not the message sender) for the individually amount claimed.

Arguments:

`forAddresses`: The addresses to release the launchedToken for.

Example: https://testnet.bscscan.com/tx/0xb907e79fbf1abfcaf15a29378c3b403ed2082dcd6f552eeac851aaae358bd51e

### `releasePayments`

Releases all payments made with `paymentToken` for a token launch allocation back to the `owner`.

Example: https://testnet.bscscan.com/tx/0xbacbc16df2d0ed392ebc6f1b780a1c7d15ca6c6fa8b24e2a5ebb21355be263fc

### `releaseUnclaimed`

Releases all unclaimed tokens back to the `owner`.

Example: https://testnet.bscscan.com/tx/0x997a2ff2b35def9c0bf6f3b1aaf2bb4e81bcccc3a862a1576678cc0f27af0da5

## Audits

1. PENDING
2. PENDING
3. PENDING

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
