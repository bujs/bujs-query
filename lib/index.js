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
    if (info.status === 200 && info.data['error_code'] === 0) {
      result = info.data.result
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
}

module.exports = Query
