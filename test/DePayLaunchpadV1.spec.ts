import deployLaunchpad from '../test/helpers/deploy/launchpad'
import deployToken from '../test/helpers/deploy/token'
import now from '../test/helpers/now'
import { ethers } from 'hardhat'
import { expect } from 'chai'

describe('DePayLaunchpadV1', function() {

  let ownerWallet,
      otherWallet,
      launchpad,
      launchedToken,
      paymentToken,
      amountLaunched
  
  let DAY = 86400;    
  let endTime = now() + 300000;
  let price = ethers.utils.parseUnits('2.1', 18);

  beforeEach(async ()=>{
    [ownerWallet, otherWallet] = await ethers.getSigners();
  })

  it('wants to launch an existing token accepting another token as means of payment', async ()=>{
    launchedToken = await deployToken();
    paymentToken = await deployToken();
    amountLaunched = ethers.utils.parseUnits('500000', 18);
  })

  it('deploys the launchpad', async ()=>{
    launchpad = await deployLaunchpad();
  })

  it('does not allow to initialize the launchpad by anybody else but the owner', async ()=>{
    await expect(
      launchpad.connect(otherWallet).init(launchedToken.address, paymentToken.address)
    ).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('does not allow to initialize with 0 claimable tokens', async ()=>{
    await expect(
      launchpad.connect(ownerWallet).init(launchedToken.address, paymentToken.address)
    ).to.be.revertedWith(
      'You need to initalize the launchpad with claimable tokens!'
    )
  })

  it('does not allow to start the launchpad if it has not been initialized yet', async ()=>{
    await expect(
      launchpad.connect(ownerWallet).start(endTime, price)
    ).to.be.revertedWith(
      'Launchpad has not been initialized yet!'
    )
  })

  it('allows to initialize the launchpad by the owner', async ()=>{
    await launchedToken.connect(ownerWallet).transfer(launchpad.address, amountLaunched);
    await launchpad.connect(ownerWallet).init(launchedToken.address, paymentToken.address);
    expect(await launchpad.launchedToken()).to.equal(launchedToken.address);
    expect(await launchpad.paymentToken()).to.equal(paymentToken.address);
    expect(await launchpad.totalClaimable()).to.equal(amountLaunched);
    expect(await launchpad.totalClaimed()).to.equal(0);
  })

  it('does not allow to initialize the launchpad multiple times', async ()=>{
    await expect(
      launchpad.connect(ownerWallet).init(launchedToken.address, paymentToken.address)
    ).to.be.revertedWith(
      'You can only initialize a launchpad once!'
    )
    await expect(
      launchpad.connect(ownerWallet).init(launchedToken.address, paymentToken.address)
    ).to.be.revertedWith(
      'You can only initialize a launchpad once!'
    )
  })

  it('does not allow others but the owner to start the claiming process', async ()=> {
    await expect(
      launchpad.connect(otherWallet).start(endTime, price)
    ).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('does not allow to start the claiming process with endTime in the past', async ()=> {
    await expect(
      launchpad.connect(ownerWallet).start(now()-1000, price)
    ).to.be.revertedWith(
      'endTime needs to be in the future!'
    )
  })

  it('does not allow to start the claiming process with endTime beeing more than 12 weeks in the future', async ()=> {
    await expect(
      launchpad.connect(ownerWallet).start(now()+(DAY*7*13), price)
    ).to.be.revertedWith(
      'endTime needs to be less than 12 weeks in the future!'
    )
  })
  
  it('does not allow people to claim if launchpad has not been started yet', async ()=> {
    await expect(
      launchpad.connect(otherWallet).claim(otherWallet.address, ethers.utils.parseUnits('1', 18))
    ).to.be.revertedWith(
      'Launchpad has not been started yet!'
    )
  })

  it('allows the owner to start the claiming process', async ()=> {
    await launchpad.connect(ownerWallet).start(endTime, price);
    expect(await launchpad.endTime()).to.equal(endTime);
    expect(await launchpad.price()).to.equal(price);
  })

  it('does not allow to start the claiming process multiple times', async ()=>{
    await expect(
      launchpad.connect(ownerWallet).start(endTime, price)
    ).to.be.revertedWith(
      'You can only start a launchpad once!'
    )
    await expect(
      launchpad.connect(ownerWallet).start(endTime, price)
    ).to.be.revertedWith(
      'You can only start a launchpad once!'
    )
  })

  it('does not allow people to claim an allocation if they havent been whitelisted', async ()=>{
    await expect(
      launchpad.connect(otherWallet).claim(otherWallet.address, ethers.utils.parseUnits('1', 18))
    ).to.be.revertedWith(
      'Address has not been whitelisted for this launch!'
    )
  })

  it('does not allow others to whitelist addresses', async ()=> {
    await expect(
      launchpad.connect(otherWallet).setWhitelist(otherWallet.address, true)
    ).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('allows the owner to whitelist addresses', async ()=> {
    await launchpad.connect(ownerWallet).setWhitelist(otherWallet.address, true);
    expect(await launchpad.whitelist(otherWallet.address)).to.eq(true);
  })

  it('requires to pay enough of the payment token in order to store a claim', async ()=>{
    await expect(
      launchpad.connect(otherWallet).claim(otherWallet.address, ethers.utils.parseUnits('1', 18))
    ).to.be.revertedWith(
      'ERC20: transfer amount exceeds balance'
    )
  })

  it('allows people to claim an allocation', async ()=>{
    let claimedAmount = ethers.utils.parseUnits('1', 18);
    let payedAmount = claimedAmount.div(ethers.BigNumber.from((10**18).toString())).mul(price);
    await paymentToken.connect(ownerWallet).transfer(otherWallet.address, payedAmount);
    await paymentToken.connect(otherWallet).approve(launchpad.address, payedAmount);
    await expect(()=> 
      launchpad.connect(otherWallet).claim(otherWallet.address, claimedAmount)
    ).to.changeTokenBalance(paymentToken, launchpad, payedAmount);
    expect(await launchpad.claims(otherWallet.address)).to.eq(claimedAmount);
  })

  it('does not allow people to claim if launchpad has been finished', async ()=> {
    // await expect(
    //   launchpad.connect(otherWallet).claim(otherWallet.address, ethers.utils.parseUnits('1', 18))
    // ).to.be.revertedWith(
    //   'Launchpad has not been started yet!'
    // )  
  })
})
