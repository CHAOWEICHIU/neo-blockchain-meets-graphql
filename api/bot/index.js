
const request = require('superagent')
const _ = require('lodash')
const express = require('express')
const LineClient = require('@line/bot-sdk').Client;
const {
  channelAccessToken,
  channelSecret,
  yelpClientId,
  yelpApiKey,
} = require('../../env');
const COBINHOOD_URL = 'https://api.cobinhood.com'
const app = express();

const lineClient = new LineClient({
  channelAccessToken,
  channelSecret,
});

const getListOfWinnersLosers = (count = 1) => {
  return new Promise((resolve) => {
    request(`${COBINHOOD_URL}/v1/market/stats`)
    .then(res => {
      const coins = []
      _.mapKeys(res.body.result, (value, key) => {
        coins.push({ coin: key, percentChange24Hr: Number(value.percent_changed_24hr) })
      })
      const orderedCoins = _.orderBy(coins, ['percentChange24Hr'], ['desc'])
      const winnersString =
        _.take(orderedCoins, count)
          .map(winner => `${winner.coin}: ${_.floor(winner.percentChange24Hr, 3)}%`)
          .join('\n')
      const losersString = _.takeRight(orderedCoins, count)
          .map(winner => `${winner.coin}: ${_.floor(winner.percentChange24Hr, 3)}%`)
          .join('\n')

      resolve({
        winnersText: `Winners:😘\n${winnersString}`,
        losersText: `Losers:😣\n${losersString}`,
      })
    })
  })
}

app.post('/line', (req, res) => {
  const { message: { stickerId, type }, replyToken } = req.body.events[0]

  if(type === 'location') {
    return lineClient
        .replyMessage(replyToken,{type: 'text', text:'QQQQQQ🤪'})
        .then(() => res.send('ok'))
  }
  
  
  switch (Number(stickerId)) {
    case 4:
      return getListOfWinnersLosers(2)
        .then(({ winnersText, losersText }) => {
          lineClient
          .replyMessage(replyToken, [
              {type: 'text', text: winnersText },
              {type: 'text', text: losersText },
            ]
          )
        .then(() => res.send('ok'))
      })
    default:
      return lineClient
        .replyMessage(replyToken,{type: 'text', text:'🤪'})
        .then(() => res.send('ok'))
  }
})
app.get('/line', (req, res) => {
  return res.send('ok')
})

module.exports = app;
