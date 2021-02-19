// 全局配置

let baseUrl = ''
let tryUrl = 'http://192.168.128.202:9002/DMService/api/v2/try'
if (process.env.NODE_ENV === 'development'){
    baseUrl = 'http://192.168.128.202:9004/NLPManagement/'
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://192.168.128.202:9004/NLPManagement/'
}

export  {
  baseUrl, tryUrl
}