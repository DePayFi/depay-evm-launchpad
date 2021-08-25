# DePay's Launchpad

EVM Smart Contract to whitelist, claim and release tokens in a launchpad fashion.

## Deployments

`DePayLaunchpadV1`

Binance Smart Chain: [...](...)

Binance Smart Chain Testnet: [0x1a9777d2a3bb52255bf71376d56575c0dbb35814](https://testnet.bscscan.com/address/0x1a9777d2a3bb52255bf71376d56575c0dbb35814)

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

Example: https://testnet.bscscan.com/tx/0x88d85538d667c719f454b318ca67fdc9052a5c6e0d096495b6bce335609e057b

### `whitelistAddress`

Allows to add a single address to the whitelist.

Whitelisted addresses can participate in the launchpad once started.

Arguments:

`_address`: The address to set the whitelist status for.

`status`: If whitelisted or not (e.g. true or false).

Example: https://testnet.bscscan.com/tx/0x81db50cb8a8015709b4d9068b2b0b3f0050da37694b25b5b2c5dcd679e91c4e1

### `whitelistAddresses`

Allows to add multiple addresses to the whitelist.

Whitelisted addresses can participate in the launchpad once started.

Arguments:

`_addresses[]`: The addresses to set the whitelist status for.

`status`: If whitelisted or not (e.g. true or false).

Example: https://testnet.bscscan.com/tx/0x8c4bea12608260d18598de1bdd04c99d38d5fc68458814dc98e287f2bfffe656

### `start`

Starts the launchpad. Requires to set the `endTime` and the `price`.

The `endTime` needs to be in the future and is not allowed to be bigger than 12 weeks from now.

The `price` determines how much `paymentToken` participants have to pay per `launchedToken` upon claiming.

Arguments:

`endTime`: The end of the launchpad (after which participants can release launchedTokens).

`price`: Amount of `paymentToken` required to be paid per claimed `launchedToken`.

Example: https://testnet.bscscan.com/tx/0x8362c2b316646dac5205ae9bf34081bc62a48ef916d9851269aff72d90baa443

### `claim`

Claims an allocation. Requires approval for the launchpad contract to spend senders `paymentToken`.

`paymentToken` will be pulled into the launchpad and claim will be record (in `claims`).

People can execute `claim` multiple times, which will just increase individual allocations.

Arguments:

`_for`: The address you are creating the claim for.

`amount`: The amount of launched tokens you are claiming.

`splitRelease`: Boolean indicating if participant wants to split release with `splitReleaseAddress`.

Example: https://testnet.bscscan.com/tx/0xf23242ff1dbefc4bc4b0969305a4e45aba974df3810302aea35f5076e529e241

### `release`

Release the previously claimed token.

`launchedToken` will be send to the claimer (not the message sender) for the amount claimed, deducting `splitReleaseAmount` and send to `splitReleaseAddress` if configured as part of the claim.

Arguments:

`forAddress`: The address to release the launchedToken for.

Example: https://testnet.bscscan.com/tx/0xa9c4e313df34cb7d48275078779bfc2ba12b429ced1bc53d45892f2ae84a2541

### `multiRelease`

Release previously claimed tokens for multiple addresses at once.

`launchedToken` will be send to the multiple claimers (not the message sender) for the individually amount claimed.

Arguments:

`forAddresses`: The addresses to release the launchedToken for.

Example: https://testnet.bscscan.com/tx/0xb522320740fb7001fcdc257b3022e575e30199cf6d943345c811bfb330cffb96

### `releasePayments`

Releases all payments made with `paymentToken` for a token launch allocation back to the `owner`.

Example: https://testnet.bscscan.com/tx/0x612306065d10040fe4437acfda07d4cbd198b5679bdc86d5f3b975131023c1b2

### `releaseUnclaimed`

Releases all unclaimed tokens back to the `owner`.

Example: https://testnet.bscscan.com/tx/0x55513a020ca5e8ce16c829768f53814c93551ad1798f73b62da30e87de802d71

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
