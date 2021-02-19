import Server from './server'
import { baseUrl } from '../config/config'

 /**
   *  res返回结果
   *  @description code 0返回结果不弹窗 1返回成功弹窗 2返回失败弹窗并提示问题
   *  @return {promise}
   */

class USERDICTAPI extends Server{
   /**
   *  用途：获取用户词典列表
   *  @url api/v1/dictionary/type/list
   *  @method post
   *  @return {promise}
   */
  async getDictStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/type/list', data)
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
   *  用途：新增用户词典
   *  @url api/v1/dictionary/type/add
   *  @method post
   *  @return {promise}
   */
  async addDictStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/type/add', data)
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
          message: '新建词典失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：删除用户词典
   *  @url api/v1/dictionary/type/delete
   *  @method post
   *  @return {promise}
   */
  async deleteDictStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/type/delete', data)
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
          message: '删除词典失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：用户词典更名
   *  @url api/v1/dictionary/type/update
   *  @method post
   *  @return {promise}
   */
  async updateDictStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/type/update', data)
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
          message: '修改保存失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }



   /**
   *  用途：获取词条列表--分页
   *  @url api/v1/dictionary/rule/page
   *  @method post
   *  @return {promise}
   */
  async getDictRule (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/rule/page', data)
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
   *  用途：新增词条
   *  @url api/v1/dictionary/rule/add
   *  @method post
   *  @return {promise}
   */
  async addDictRule (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/rule/add', data)
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
          message: '添加词条失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：删除词条
   *  @url api/v1/dictionary/rule/delete
   *  @method post
   *  @return {promise}
   */
  async deleteDictRule (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/rule/delete', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '删除词条成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '词条删除失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：查看单个词条
   *  @url api/v1/dictionary/rule/query
   *  @method post
   *  @return {promise}
   */
  async queryDictRule (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/rule/query', data)
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
          message: '获取词条数据失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：编辑更新词条
   *  @url api/v1/dictionary/rule/update
   *  @method post
   *  @return {promise}
   */
  async updateDictRule (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/rule/update', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '配置更新成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '更新词条失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：上传词条
   *  @url api/v1/dictionary/upload/file
   *  @method post
   *  @return {promise}
   */
  async uploadDictRule (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/upload/file', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '上传成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '上传词条失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：分页词条搜索--根据关键词
   *  @url api/v1/dictionary/rule/search/by/keyword
   *  @method post
   *  @return {promise}
   */
  async searchDictRule (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/dictionary/rule/search/by/keyword', data)
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
export default new USERDICTAPI()