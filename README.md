## bujs-query

A simple query module for the BU chain.

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

## Install

```bash
$ npm install --save bujs-query
```



## Test

The tests can be run with Node.js 

```bash
$ npm test
```



## Usage

> Create bujs-query instance

```js
const Query = require('bujs-query')
const query = new Query({
  host: 'http://seed1.bumotest.io:26002',
  timeout: 1000 * 60
})
```

> Get account info

```js
const address = 'buQrH4ab27ZCD4WCxGJtmPpFQ5SubFg6t3bj'
const accountInfo = await query.getAccountInfo(address)
console.log(accountInfo)

// result:
// {
//   address: 'buQrH4ab27ZCD4WCxGJtmPpFQ5SubFg6t3bj',
//   balance: '100000000000000000',
//   nonce: '0',
//   assets: [],
//   priv: {
//    master_weight: '1',
//    thresholds: {
//     tx_threshold: '1'
//    }
//   }
// }

```

> Get account metadata

```js
const address = 'buQrH4ab27ZCD4WCxGJtmPpFQ5SubFg6t3bj'
const key = 'test'
const metadata = await query.getMetadata(address, key)
console.log(metadata)

// result:
// {
//   key: 'test',
//   value: 'value',
//   version: 1.0
// }

```


> Get account balance

```js
const address = 'buQrH4ab27ZCD4WCxGJtmPpFQ5SubFg6t3bj'
const balance = await query.getBalance(address)
console.log(balance)

// result:
// "100000000000000000"

```


> Get account nonce

```js
const address = 'buQrH4ab27ZCD4WCxGJtmPpFQ5SubFg6t3bj'
const nonce = await query.getNonce(address)
console.log(nonce)

// result:
// "0"

```

> Get block info

```js
const blockNumber = '100'
const blockInfo = await query.getBlockInfo(blockNumber)
console.log(blockInfo)

// result:
// {
//  closeTime: '1567997123667055',
//  number: '100',
//  txCount: '',
//  version: '1003' 
// }

```


> Get get latest info

```js
const blockInfo = await query.getLatestInfo()
console.log(blockInfo)

// result:
// {
//  closeTime: '1567997123667055',
//  number: '100',
//  txCount: '',
//  version: '1003' 
// }

```


> Get validators for specific blockNumber

```js
const blockNumber = '100'
const validators = await query.getValidators(blockNumber)
console.log(validators)

// result:
// [ 'buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY' ]

```


> Get latest validators

```js
const validators = await query.getLatestValidators()
console.log(validators)

// result:
// [ 'buQBwe7LZYCYHfxiEGb1RE9XC9kN2qrGXWCY' ]

```



> Send transaction

```js

const signedTransactionInfo = {
  items: [{
    transaction_blob: blob,
    signatures: signatures
  }]
}

const hash = await query.sendTransaction(signedTransactionInfo)
console.log(hash)

// result:
// '8bb1d61daac2ac2f7726fe5114d0d3747eedbb0e3764d046b8976f8d614982bb'

```

