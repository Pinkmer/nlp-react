import Server from './server'
import { baseUrl } from '../config/config'

 /**
   *  res返回结果
   *  @description code 0返回结果不弹窗 1返回成功弹窗 2返回失败弹窗并提示问题
   *  @return {promise}
   */

class SKILLAPI extends Server{
   /**
   *  用途：获取技能库列表
   *  @url api/v1/nlu/skill/list
   *  @method post
   *  @return {promise}
   */
  async getSkillStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/list', data)
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
   *  用途：技能库列表新增
   *  @url api/v1/nlu/skill/add
   *  @method post
   *  @return {promise}
   */
  async addSkillStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/add', data)
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
          message: '新建技能库失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：技能库复制
   *  @url api/v1/nlu/skill/copy
   *  @method post
   *  @return {promise}
   */
  async copySkillStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/copy', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '复制成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '复制技能库失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：技能库删除
   *  @url api/v1/nlu/skill/delete
   *  @method post
   *  @return {promise}
   */
  async deleteSkillStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/delete', data)
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
          message: '删除技能库失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：技能库更名
   *  @url api/v1/nlu/skill/update
   *  @method post
   *  @return {promise}
   */
  async renameSkillStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/update', data)
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
   *  用途：技能库搜索--根据名称
   *  @url api/v1/nlu/skill/search
   *  @method post
   *  @return {promise}
   */
  async searchSkillStore (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/search', data)
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
   *  用途：获取任务列表
   *  @url api/v1/nlu/skill/task/list
   *  @method post
   *  @return {promise}
   */
  async getSkillTask (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/task/list', data)
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
   *  用途：任务列表新增
   *  @url api/v1/nlu/skill/task/add
   *  @method post
   *  @return {promise}
   */
  async addSkillTask (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/task/add', data)
      if (result.code === 0) {
        if (result.code === 35001) {
          let res = {
            code: 1,
            message: '保存成功 NLU重载失败 已为您返回上一层',
            response: result.data,
          }
          return res
        } else if (result.code === 35002) {
          let res = {
            code: 1,
            message: '保存成功 语法错误 请重新进入编辑语法规则',
            response: result.data,
          }
          return res
        } else {
          let res = {
            code: 1,
            message: '添加成功 已为您返回上一层',
            response: result.data,
          }
          return res
        }
      } else {
        let err = {
          code: 2,
          message: '任务新建失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：任务列表删除
   *  @url api/v1/nlu/skill/task/delete
   *  @method post
   *  @return {promise}
   */
  async deleteSkillTask (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/task/delete', data)
      if (result.code === 0) {
        let res = {
          code: 1,
          message: '任务删除成功',
          response: result.data,
        }
        return res
      } else {
        let err = {
          code: 2,
          message: '任务删除失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }

   /**
   *  用途：任务列表搜索--根据名称
   *  @url api/v1/nlu/skill/task/list/by/name
   *  @method post
   *  @return {promise}
   */
  async searchSkillTask (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/task/list/by/name', data)
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
   *  用途：获取任务配置
   *  @url api/v1/nlu/skill/task/query
   *  @method post
   *  @return {promise}
   */
  async queryTaskConfig (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/task/query', data)
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
          message: '获取任务配置失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：任务配置更新
   *  @url api/v1/nlu/skill/task/update
   *  @method post
   *  @return {promise}
   */
  async updateTaskConfig (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/task/update', data)
      if (result.code === 0) {
        if (result.code === 35001) {
          let res = {
            code: 1,
            message: '保存成功 NLU重载失败',
            response: result.data,
          }
          return res
        } else if (result.code === 35002) {
          let res = {
            code: 1,
            message: '保存成功 语法错误 请重新编辑语法规则',
            response: result.data,
          }
          return res
        } else {
          let res = {
            code: 1,
            message: '配置更新成功',
            response: result.data,
          }
          return res
        }
      } else {
        let err = {
          code: 2,
          message: '配置更新失败',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：查询任务--id
   *  @url api/v1/nlu/skill/task/query/name
   *  @method post
   *  @return {promise}
   */
  async searchSkillTaskById (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/task/query/name', data)
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
          message: 'goto列表检索失败 下一轮对话列表仅展示id',
          response: result.message,
        }
        return err
      }
    } catch (err) {
      throw err
    }
  }
   /**
   *  用途：更改任务名--name
   *  @url api/v1/nlu/skill/task/aim/update
   *  @method post
   *  @return {promise}
   */
  async updateSkillTaskName (data) {
    try {
      let result = await this.axios('post', baseUrl + 'api/v1/nlu/skill/task/aim/update', data)
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
}
export default new SKILLAPI()