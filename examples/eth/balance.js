const Web3 = require('web3');
const { ETH_RPC_ENDPOINT } = require('../../env')

const web3 = new Web3(ETH_RPC_ENDPOINT)
const address = '0x2f61E7e1023Bc22063B8da897d8323965a7712B7'

web3
  .eth
  .getBalance(address, (err, balanceInWei) => {
    const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether')
    console.log(balanceInEther)
  })
