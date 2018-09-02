const Web3 = require('web3');
const { ethRpcEndpoint } = require('../../env')
const web3 = new Web3(ethRpcEndpoint)
const address = '0x2f61E7e1023Bc22063B8da897d8323965a7712B7'

web3
  .eth
  .getBalance(address, (err, balanceInWei) => {
    const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether')
    console.log(balanceInEther)
  })
