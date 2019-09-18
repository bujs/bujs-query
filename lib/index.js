'use strict'

const JSONBig = require('json-bigint')
const util = require('bujs-util')
const axios = require('axios')

class Query {
  constructor (options = {}) {
    const host = options.host
    const timeout = options.timeout || 1000
    this.http = axios.create({
      baseURL: host,
      timeout: timeout,
      transformResponse: [data => JSONBig.parse(data)]
    })
  }

  /**
   * HTTP get request
   *
   * @param {String} method
   * @param {Object} [params]
   * @returns {Promise<*>}
   * @private
   */
  async _get (method, params) {
    const info = await this.http.get(method, {
      params: params
    })
    let result = null
    if (info.status === 200 && info.data) {
      result = info.data
    }
    return result
  }

  /**
   * HTTP post request
   *
   * @param method
   * @param params
   * @returns {Promise<*>}
   * @private
   */
  async _post (method, params) {
    const info = await this.http.post(method, params)
    let result = null
    if (info.status === 200 && info.data) {
      result = info.data
    }
    return result
  }

  /**
   * Get account information
   * @param {String} address
   * @returns {Promise<*>}
   * @public
   */
  async getAccountInfo (address) {
    try {
      let info = {}
      const data = await this._get('/getAccount', {
        address: address
      })

      if (data['error_code'] === 0) {
        if (data.result) {
          const result = data.result
          info.address = result.address
          info.balance = result.balance
          info.nonce = result.nonce || '0'
          info.assets = result.assets || []
          info.priv = result.priv || {}
        }
      }
      return util.bigNumberToString(info)
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Get account metadata
   *
   * @param {String} address
   * @param {String} key
   * @returns {Promise<Object>}
   * @public
   */
  async getMetadata (address, key) {
    try {
      const data = await this._get('/getAccount', {
        address: address
      })
      const metadata = {}

      if (data['error_code'] === 0) {
        const metadatas = data.result.metadatas
        if (metadatas && Array.isArray(metadatas) && metadatas.length > 0) {
          metadatas.some(item => {
            if (item.key === key) {
              metadata.key = item.key
              metadata.value = item.value
              metadata.version = item.version
              return true
            }
          })
        }
      }

      return metadata
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Get balance for the address
   *
   * @param  {String} address
   * @return {Promise<String>}
   * @public
   */
  async getBalance (address) {
    try {
      let balance = '0'
      const data = await this._get('/getAccount', {
        address: address
      })

      if (data['error_code'] === 0) {
        balance = util.bigNumberToString(data.result.balance)
      }

      return balance
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Get account nonce
   *
   * @param {String} address
   * @returns {Promise<String>}
   * @public
   */
  async getNonce (address) {
    try {
      let nonce = '0'
      const data = await this._get('/getAccount', {
        address: address
      })

      if (data['error_code'] === 0) {
        nonce = util.bigNumberToString(data.result.nonce || '0')
      }

      return nonce
    } catch (err) {
      console.log(err)
    }
  }

  async getBlockNumber () {
    const info = await this._get('/getLedger')
    return info.header.seq
  }

  async checkBlockStatus () {
    const data = await this._get('/getModulesStatus')
    const info = data.ledger_manager

    let isSynchronous = false
    if (info.chain_max_ledger_seq === info.ledger_sequence) {
      isSynchronous = true
    }
    return isSynchronous
  }

  async getTransactions (blockNumber) {
    const info = await this._get('/getTransactionHistory', {
      ledger_seq: blockNumber
    })
    return info
  }

  async getBlockInfo (blockNumber) {
    const data = await this._get('/getLedger', {
      seq: blockNumber
    })
    let info = {}
    if (data.error_code === 0) {
      if (data.result && data.result.header) {
        const header = data.result.header
        const closeTime = header.close_time || ''
        const number = header.seq
        const txCount = header.tx_count || ''
        const version = header.version || ''
        info.closeTime = closeTime
        info.number = number
        info.txCount = txCount
        info.version = version
      }
    }
    info = util.bigNumberToString(info)
    return info
  }

  async getLatestInfo () {
    const data = await this._get('/getLedger')
    let info = {}

    if (data['error_code'] === 0) {
      if (data.result && data.result.header) {
        const header = data.result.header
        const closeTime = header.close_time || ''
        const number = header.seq
        const txCount = header.tx_count || ''
        const version = header.version || ''

        info.closeTime = closeTime
        info.number = number
        info.txCount = txCount
        info.version = version
      }
    }
    info = util.bigNumberToString(info)
    return info
  }

  async getValidators (blockNumber) {
    const data = await this._get('/getLedger', {
      seq: blockNumber,
      with_validator: true
    })
    let validators = []
    if (data['error_code'] === 0) {
      validators = data.result['validators']
    }
    return validators
  }

  async getLatestValidators () {
    const data = await this._get('/getLedger', {
      with_validator: true
    })
    let validators = []
    if (data['error_code'] === 0) {
      validators = data.result['validators']
    }
    return validators
  }

  /**
   * Send transaction
   *
   * @param {Object} signedTransactionInfo
   * @returns {Promise<String>}
   */
  async sendTransaction (signedTransactionInfo) {
    const data = await this._post('submitTransaction', signedTransactionInfo)
    const results = data.results

    if (Array.isArray(results) && results.length > 0) {
      const info = results[0]

      if (info['error_code'] === '0') {
        return info.hash
      }

      throw new Error(JSON.stringify(info))
    }

    return ''
  }
}

module.exports = Query
