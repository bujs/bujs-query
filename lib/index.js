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
   * @param method
   * @param params
   * @returns {Promise<*>}
   * @private
   */
  async _get (method, params) {
    const info = await this.http.get(method, {
      params: params
    })
    let result = null
    if (info.status === 200 && info.data['error_code'] === 0) {
      result = info.data.result
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
    if (info.status === 200 && info.data['error_code'] === 0) {
      result = info.data.result
    }
    return result
  }

  /**
   * Get account information
   * @param address
   * @returns {Promise<*>}
   * @public
   */
  async getAccountInfo (address) {
    try {
      const info = await this._get('/getAccount', {
        address: address
      })
      const result = {
        address: info.address,
        balance: info.balance,
        nonce: info.nonce || '0',
        assets: info.assets || [],
        priv: info.priv || {}
      }
      return util.bigNumberToString(result)
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
      const info = await this._get('/getAccount', {
        address: address
      })
      const metadata = {}
      const metadatas = info.metadatas

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
      const info = await this._get('/getAccount', {
        address: address
      })

      if (info) {
        balance = util.bigNumberToString(info.balance)
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
      const info = await this._get('/getAccount', {
        address: address
      })
      const nonce = info.nonce || '0'
      return util.bigNumberToString(nonce)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = Query
