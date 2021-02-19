import Server from './server'
import { baseUrl } from '../config/config'

 /**
   *  res返回结果
   *  @description code 0返回结果不弹窗 1返回成功弹窗 2返回失败弹窗并提示问题
   *  @return {promise}
   */

class INTENTIONAPI extends Server{
   /**
   *  用途：获取意图配置列表
   *  @url 
   *  @method post
   *  @return {promise}
   */
  async getIntentionStore (data) {
    try {
      let result = await this.axios('post', baseUrl + '', data)
      if (result.code === 0) {
        let res = {
          code: 0,
          message: '',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '获取列表失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
}
export default new INTENTIONAPI()