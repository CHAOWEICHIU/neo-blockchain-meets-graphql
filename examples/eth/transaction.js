const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx')
const web3 = new Web3('https://mainnet.infura.io/v3/653f561fce7e40e8959d497b9aecfb3f');
const toHex = str => web3.utils.toHex(str)

const fromAccount = web3.eth.accounts.create()
const toAccount = web3.eth.accounts.create()
const fromAccountAddress = fromAccount.address
const fromAccountPrivateKey = fromAccount.privateKey
const toAccountAddress = toAccount.address
const toAccountPrivateKey = toAccount.privateKey

web3.eth.getTransactionCount(fromAccountAddress, (err, res) => {
  console.log('res',res)
  const txParams = {
    nonce: toHex(res),
    to: toAccountAddress,
    value: toHex(web3.utils.toWei('1', 'ether')) ,
    gasLimit: toHex(21000),
    gasPrice: toHex(web3.utils.toWei('10', 'gwei'))
  }
  const tx = new EthereumTx(txParams)
  tx.sign(Buffer.from(fromAccountPrivateKey.slice(2), 'hex'))
  const serializedTx = tx.serialize()
  const raw = '0x' + serializedTx.toString('hex')
  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    console.log(txHash);
  })
})
