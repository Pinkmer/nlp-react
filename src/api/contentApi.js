import Server from './server'
import { baseUrl } from '../config/config'

 /**
   *  res返回结果
   *  @description code 0返回结果不弹窗 1返回成功弹窗 2返回失败弹窗并提示问题
   *  @return {promise}
   */

class CONTENTAPI extends Server{
   /**
   *  用途：获取内容源库列表
   *  @url api/v1/content/type/list
   *  @method post
   *  @return {promise}
   */
  async getContentStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/type/list', data)
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
   *  用途：新增内容源库
   *  @url api/v1/content/type/add
   *  @method post
   *  @return {promise}
   */
  async addContentStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/type/add', data)
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
          message: '新建内容源库失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：删除内容源库
   *  @url api/v1/content/type/delete
   *  @method post
   *  @return {promise}
   */
  async deleteContentStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/type/delete', data)
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
          message: '删除失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
  /**
   *  用途：内容源更名
   *  @url api/v1/content/type/update
   *  @method post
   *  @return {promise}
   */
  async updateContentStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/type/update', data)
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
   *  用途：内容源搜索--根据名称
   *  @url api/v1/content/type/search
   *  @method post
   *  @return {promise}
   */
  async searchContentStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/type/search', data)
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
   *  用途：获取内容源列表
   *  @url api/v1/content/config/list
   *  @method post
   *  @return {promise}
   */
  async getContentInfo (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/config/list', data)
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
          message: '获取内容源失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：删除内容源
   *  @url api/v1/content/config/delete
   *  @method post
   *  @return {promise}
   */
  async deleteContentInfo (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/config/delete', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '删除内容源成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '内容源删除失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：新增内容源
   *  @url api/v1/content/config/add
   *  @method post
   *  @return {promise}
   */
  async addContentInfo (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/config/add', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '添加成功 已为您返回上一层',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '添加失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：获取内容源详情
   *  @url api/v1/content/config/delete
   *  @method post
   *  @return {promise}
   */
  async queryContentConfig (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/config/query', data)
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
          message: '获取配置失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：更新内容源
   *  @url api/v1/content/config/update
   *  @method post
   *  @return {promise}
   */
  async updateContentInfo (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/config/update', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '更新配置成功',
          response: result.data, 
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '更新配置失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：更新内容源
   *  @url api/v1/content/config/name/update
   *  @method post
   *  @return {promise}
   */
  async updateContentConfigName (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/config/name/update', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '更新配置成功',
          response: result.data, 
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '更新配置失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：内容源搜索--根据名称
   *  @url api/v1/content/config/list/by/name
   *  @method post
   *  @return {promise}
   */
  async searchContentInfo (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/content/config/list/by/name', data)
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
}
export default new CONTENTAPI()