// 配置API接口地址
var root = '/api/v1'
// 引用axios
var axios = require('axios')

axios.defaults.headers.post['Content-Type'] = 'application/json';

function apiAxios(method, url, headers, params) {
  return axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    headers,
    withCredentials: false
  })
}

// 返回在vue模板中的调用接口
export default {
  get: (url, headers, params) => {
    return apiAxios('GET', url, headers, params)
  },
  post: (url, headers, params) => {
    return apiAxios('POST', url, headers, params)
  },
  put: (url, headers, params) => {
    return apiAxios('PUT', url, headers, params)
  },
  delete: (url, headers, params) => {
    return apiAxios('DELETE', url, headers, params)
  }
}