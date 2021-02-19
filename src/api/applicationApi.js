import Server from './server'
import { baseUrl, tryUrl } from '../config/config'

 /**
   *  res返回结果
   *  @description code 0返回结果不弹窗 1返回成功弹窗 2返回失败弹窗并提示问题
   *  @return {promise}
   */

class APPLICATIONAPI extends Server{
   /**
   *  用途：获取应用库列表
   *  @url api/v1/application/list
   *  @method post
   *  @return {promise}
   */
  async getApplicationStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/list', data)
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
   /**
   *  用途：新增应用库
   *  @url api/v1/application/add
   *  @method post
   *  @return {promise}
   */
  async addApplicationStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/add', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '添加成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '新建机器人失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：删除应用库
   *  @url api/v1/application/delete
   *  @method post
   *  @return {promise}
   */
  async deleteApplicationStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/delete', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '删除成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '删除机器人失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：应用库更名
   *  @url api/v1/application/name/update
   *  @method post
   *  @return {promise}
   */
  async updateApplicationStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/name/update', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '修改成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '修改失败，请刷新重试',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：查询应用库--name
   *  @url api/v1/application/search
   *  @method post
   *  @return {promise}
   */
  async searchApplicationStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/search', data)
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
          message: '查询失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：应用搜索--根据名称
   *  @url api/v1/application/search
   *  @method post
   *  @return {promise}
   */
  async searchAppStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/search', data)
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
          message: '查询失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }


  
  /**
   *  用途：获取应用信息
   *  @url api/v1/application/query
   *  @method post
   *  @return {promise}
   */
  async getApplicationInfo (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/query', data)
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
          message: '获取信息失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
  /**
   *  用途：获取应用配置技能列表
   *  @url api/v1/application/skill/list
   *  @method post
   *  @return {promise}
   */
  async getApplicationSkill (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/skill/list', data)
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
  /**
   *  用途：新增应用配置技能
   *  @url api/v1/application/skill/add
   *  @method post
   *  @return {promise}
   */
  async addApplicationSkill (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/skill/add', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '添加成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '添加配置失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
  /**
   *  用途：删除应用配置技能
   *  @url api/v1/application/skill/delete
   *  @method post
   *  @return {promise}
   */
  async deleteApplicationSkill (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/skill/delete', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '删除成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '删除失败 请刷新重试',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
  /**
   *  用途：保存重载应用配置
   *  @url api/v1/application/update
   *  @method post
   *  @return {promise}
   */
  async reloadApplication (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/application/update', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '重载成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '重载失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }



  /**
   *  用途：机器人对话
   *  @url tryUrl
   *  @method post
   *  @return {promise}
   */
  async robotSendCall (data, appkey) {
    try {
      let result = await this.axios('post', tryUrl + '?appKey=' + appkey, data)
      if (result.code === 0) {
        let res = {
          code: 0,
          message: '',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 3,
          data: result
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
}
export default new APPLICATIONAPI()