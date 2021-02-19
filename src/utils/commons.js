import { message } from 'antd';

/**
 * 用于get方法后面参数的拼接，传入data是对象
 * @param {*} name 
 */
export const getUrlConcat = function (data) {
    let dataStr = ''; //数据拼接字符串
    let url = ''
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&')); // 去除掉最后一个"&"字符
      url = url + '?'+ dataStr;
    }
    return url
  }

/**
 * 获取随机数
 * @param {*} 
 */
export const getRandom = function () {
  let data = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  let nums = ''
  for (let i = 0; i < 20; i++) {
    let r = parseInt(Math.random() * 61)
    nums += data[r]
  }
  return nums
}

/**
 * 获取当前时间(时间格式)
 * @param {*} 
 */
export const getNowTime = function () {
  let time = +new Date()
  var date = new Date(time + 8 * 3600 * 1000)
  return date.toJSON().substr(0, 19).replace('T', ' ')
}
 
/**
 * axios请求发出后处理
 * @callback handleRes返回结果弹窗
 */
export const handleAxios = {
  handleRes(res) {
    if(res.code === 0) {
      return res.response
    } else if (res.code === 1) {
      message.success(res.message)
    } else if (res.code === 2) {
      message.error (res.message + '：' + res.response)
      const err = res.response
      throw new Error(err)
    } else {
      return res
    }
  }
}

/**
 * localStorage存储
 * @param {*} key
 * @param {*} value
 */
export const setStorage = function (key, value) {
  localStorage.setItem(key,value)
}

/**
 * localStorage读取userIs
 * @callback localStorage的userId
 */
export const getStorageUserId = () => {
  if ( localStorage ) {
    const localStorages = localStorage
    if (localStorages.userId) {
        return localStorages.userId
    } else {
        message.warning('无用户信息，请重新登陆')
        return null
    }
  } else {
    message.warning('无用户信息，请重新登陆')
    return null
  }
}
/**
 * localStorage读取面包屑导航
 * @callback localStorage的breadcrumb
 */
export const getStorageNav = () => {
  if ( localStorage ) {
    const localStorages = localStorage
    if (localStorages.breadcrumb) {
        return localStorages.breadcrumb
    } else {
        return null
    }
  }
}
