import deployLaunchpad from '../test/helpers/deploy/launchpad'
import deployToken from '../test/helpers/deploy/token'
import now from '../test/helpers/now'
import { ethers } from 'hardhat'
import { expect } from 'chai'

describe('DePayLaunchpadV1', function() {

  let ownerWallet,
      otherWallet,
      anotherWallet,
      yetAnotherWallet,
      launchpad,
      launchedToken,
      paymentToken,
      amountLaunched
  
  let DAY = 86400;    
  let runTime = 300000;
  let endTime = now() + runTime;
  let price = ethers.utils.parseUnits('2.1', 18);
  let totalClaimed = ethers.BigNumber.from('0');

  beforeEach(async ()=>{
    [ownerWallet, otherWallet, anotherWallet, yetAnotherWallet] = await ethers.getSigners();
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
      launchpad.connect(otherWallet).whitelistAddress(otherWallet.address, true)
    ).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('allows the owner to whitelist addresses', async ()=> {
    await launchpad.connect(ownerWallet).whitelistAddress(otherWallet.address, true);
    await launchpad.connect(ownerWallet).whitelistAddresses([anotherWallet.address, yetAnotherWallet.address], true);
    expect(await launchpad.whitelist(otherWallet.address)).to.eq(true);
  })

  it('requires to pay enough of the payment token in order to store a claim', async ()=>{
    await expect(
      launchpad.connect(otherWallet).claim(otherWallet.address, ethers.utils.parseUnits('1', 18))
    ).to.be.revertedWith(
      'ERC20: transfer amount exceeds balance'
    )
  })

  it('allows people to claim an allocation if they have been whitelisted', async ()=>{
    let claimedAmount = ethers.utils.parseUnits('1', 18);
    let payedAmount = claimedAmount.div(ethers.BigNumber.from((10**18).toString())).mul(price);
    await paymentToken.connect(ownerWallet).transfer(otherWallet.address, payedAmount);
    await paymentToken.connect(otherWallet).approve(launchpad.address, payedAmount);
    await expect(()=> 
      launchpad.connect(otherWallet).claim(otherWallet.address, claimedAmount)
    ).to.changeTokenBalance(paymentToken, launchpad, payedAmount);
    totalClaimed = totalClaimed.add(claimedAmount);
    expect(await launchpad.claims(otherWallet.address)).to.eq(claimedAmount);
    expect(await launchpad.totalClaimed()).to.eq(totalClaimed);
  })

  it('just increases someones claim if you claim a second time', async ()=>{
    let claimedAmount = ethers.utils.parseUnits('1', 18);
    let payedAmount = claimedAmount.div(ethers.BigNumber.from((10**18).toString())).mul(price);
    await paymentToken.connect(ownerWallet).transfer(otherWallet.address, payedAmount);
    await paymentToken.connect(otherWallet).approve(launchpad.address, payedAmount);
    await expect(()=> 
      launchpad.connect(otherWallet).claim(otherWallet.address, claimedAmount)
    ).to.changeTokenBalance(paymentToken, launchpad, payedAmount);
    totalClaimed = totalClaimed.add(claimedAmount);
    expect(await launchpad.claims(otherWallet.address)).to.eq(claimedAmount.mul(ethers.BigNumber.from('2')));
    expect(await launchpad.totalClaimed()).to.eq(totalClaimed);
  })

  it('allows ownerWallet to claim in the name of anotherWallet', async ()=>{
    let claimedAmount = ethers.utils.parseUnits('1', 18);
    let payedAmount = claimedAmount.div(ethers.BigNumber.from((10**18).toString())).mul(price);
    await paymentToken.connect(ownerWallet).approve(launchpad.address, payedAmount);
    await expect(()=> 
      launchpad.connect(ownerWallet).claim(anotherWallet.address, claimedAmount)
    ).to.changeTokenBalance(paymentToken, launchpad, payedAmount);
    totalClaimed = totalClaimed.add(claimedAmount);
    expect(await launchpad.claims(anotherWallet.address)).to.eq(claimedAmount);
    expect(await launchpad.totalClaimed()).to.eq(totalClaimed);
  })

  it('allows yetAnotherWallet to claim an allocation', async ()=>{
    let claimedAmount = ethers.utils.parseUnits('1', 18);
    let payedAmount = claimedAmount.div(ethers.BigNumber.from((10**18).toString())).mul(price);
    await paymentToken.connect(ownerWallet).transfer(yetAnotherWallet.address, payedAmount);
    await paymentToken.connect(yetAnotherWallet).approve(launchpad.address, payedAmount);
    await expect(()=> 
      launchpad.connect(yetAnotherWallet).claim(yetAnotherWallet.address, claimedAmount)
    ).to.changeTokenBalance(paymentToken, launchpad, payedAmount);
    totalClaimed = totalClaimed.add(claimedAmount);
    expect(await launchpad.claims(yetAnotherWallet.address)).to.eq(claimedAmount);
    expect(await launchpad.totalClaimed()).to.eq(totalClaimed);
  })

  it('prevents people to claim more than is claimable', async ()=> {
    let payedAmount = amountLaunched.div(ethers.BigNumber.from((10**18).toString())).mul(price);
    await paymentToken.connect(ownerWallet).transfer(otherWallet.address, payedAmount);
    await paymentToken.connect(otherWallet).approve(launchpad.address, payedAmount);
    await expect(
      launchpad.connect(otherWallet).claim(otherWallet.address, amountLaunched)
    ).to.be.revertedWith(
      'Claiming attempt exceeds totalClaimable amount!'
    )
  })

  it('does not allow people to release claims if launchpad has not ended yet', async ()=> {
    await expect(
      launchpad.connect(otherWallet).release(otherWallet.address)
    ).to.be.revertedWith(
      'Launchpad has not ended yet!'
    )
  })

  it('does not allow to release payments before launchpad ends', async()=>{
    await expect(
      launchpad.connect(ownerWallet).releasePayments()
    ).to.be.revertedWith(
      'Launchpad has not ended yet!'
    )
  })

  it('does not allow to release unclaimed tokens before launchpad ends', async()=>{
    await expect(
      launchpad.connect(ownerWallet).releaseUnclaimed()
    ).to.be.revertedWith(
      'Launchpad has not ended yet!'
    )
  })

  it('ends the launchpad', async()=>{
    await ethers.provider.send("evm_increaseTime", [runTime]);
    await ethers.provider.send("evm_mine", []);
  })

  it('allows the owner to release payments afer launchpad ended', async()=>{
    let balance = await paymentToken.balanceOf(launchpad.address);
    await expect(()=>
      launchpad.connect(ownerWallet).releasePayments()
    ).to.changeTokenBalance(paymentToken, ownerWallet, balance);
    expect(await paymentToken.balanceOf(launchpad.address)).to.eq(ethers.BigNumber.from('0'));
  })

  it('allows the owner to release unclaimed tokens afer launchpad ended', async()=>{
    let unclaimedAmount = (await launchpad.totalClaimable()).sub(await launchpad.totalClaimed());
    await expect(()=>
      launchpad.connect(ownerWallet).releaseUnclaimed()
    ).to.changeTokenBalance(launchedToken, ownerWallet, unclaimedAmount);
    expect(await launchedToken.balanceOf(launchpad.address)).to.eq(await launchpad.totalClaimed());
  })

  it('sends nothing if trying to release unclaimed tokens a second time', async()=>{
    let unclaimedAmount = (await launchpad.totalClaimable()).sub(await launchpad.totalClaimed());
    await expect(()=>
      launchpad.connect(ownerWallet).releaseUnclaimed()
    ).to.changeTokenBalance(launchedToken, ownerWallet, ethers.BigNumber.from('0'));
  })

  it('allows to release launched token after launchpad ended to participants', async ()=> {
    let totalClaimedAmount = ethers.utils.parseUnits('2', 18);
    await expect(()=> 
      launchpad.connect(otherWallet).release(otherWallet.address)
    ).to.changeTokenBalance(launchedToken, otherWallet, totalClaimedAmount);
    expect(await launchpad.claims(otherWallet.address)).to.equal(ethers.BigNumber.from('0'));
  })

  it('fails if trying to release multiple times', async ()=> {
    let totalClaimedAmount = ethers.utils.parseUnits('2', 18);
    await expect(
      launchpad.connect(otherWallet).release(otherWallet.address)
    ).to.be.revertedWith(
      'Nothing to release!'
    )
  })

  it('does not allow others to release payments', async()=>{
    await expect(
      launchpad.connect(otherWallet).releasePayments()
    ).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('does not allow others to release unclaimed tokens', async()=>{
    await expect(
      launchpad.connect(otherWallet).releaseUnclaimed()
    ).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
  })

  it('allows to multiRelease to multiple addresses', async()=> {
    await expect(async ()=>{
      await expect(()=>{
        launchpad.connect(otherWallet).multiRelease([anotherWallet.address, yetAnotherWallet.address])
      }).to.changeTokenBalance(launchedToken, anotherWallet, ethers.utils.parseUnits('1', 18))
    }).to.changeTokenBalance(launchedToken, yetAnotherWallet, ethers.utils.parseUnits('1', 18))
  })

  it('leaves the launchpad empty after the entire launch has been processed', async ()=>{
    expect(await paymentToken.balanceOf(launchpad.address)).to.eq(ethers.BigNumber.from('0'));
    expect(await launchedToken.balanceOf(launchpad.address)).to.eq(ethers.BigNumber.from('0'));
  })
})
