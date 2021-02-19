import Server from './server'
import { getUrlConcat } from '../utils/commons'
class API extends Server{

    /**
   *  用途：账号密码登录
   *  @url http://cangdu.org:8001/v2/login
   *  @method post
   *  @return {promise}
   */
  async accountLogin (data) {
    try {
      let result = await this.axios('post', '/v2/login', data)
      if (result.status !== 0 && (result instanceof Object)) {
        return result || []
      } else {
        let err = {
          tip: '登录失败',
          response: result,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }

   /**
   * 获取用户消息
   * @param {*} get的拼接参数
   */
  async getUser (data) {
    try {
      let result = await this.axios('get', '/v1/user' + getUrlConcat(data) )
      if (result.status !== 0 && (result instanceof Object)) {
        return result || []
      } else {
        let err = {
          tip: '获取用户信息失败',
          response: result,
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

   /**
   *  用途：获取用户地址列表
   *  @url https://elm.cangdu.org/v1/addimg/shop
   *  返回status为1表示成功
   *  @method get
   */
  async getAddress(id){
    try{
      let result = await this.axios('get', '/v1/users/' + id + '/addresses'); 
      if(result){
        return result;
      }else{
        let err = {
          tip: '获取地址失败',
          response: result,
          url: '//elm.cangdu.org/v1/carts/addresses',
        }
        throw err;
      }
    }catch(err){
      throw err;
    }
  }

}

export default new API()