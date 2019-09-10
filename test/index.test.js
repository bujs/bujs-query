'use strict'

const Query = require('../lib')

const query = new Query({
  host: 'http://127.0.0.1:36002',
  timeout: 1000 * 60
})

test('getAccountInfo', async () => {
  const result = await query.getAccountInfo('buQrH4ab27ZCD4WCxGJtmPpFQ5SubFg6t3bj')
  console.log(result)
})

test('getMetadata', async () => {
  const result = await query.getMetadata('buQrH4ab27ZCD4WCxGJtmPpFQ5SubFg6t3bj', 'test')
  console.log(result)
})

test('getBalance', async () => {
  const result = await query.getBalance('buQrH4ab27ZCD4WCxGJtmPpFQ5SubFg6t3bj')
  console.log(result)
  console.log(typeof result)
})

test('getNonce', async () => {
  const result = await query.getNonce('buQrH4ab27ZCD4WCxGJtmPpFQ5SubFg6t3bj')
  console.log(result)
})
