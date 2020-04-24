// import axios from 'axios'
// import qs from 'qs'
// import router from '@/router'
// import { Message } from 'element-ui'
// import { BASE_URL } from '@/config'

// let baseUrl: any
// let env = process.env.NODE_ENV
// env ? baseUrl = BASE_URL[env] : baseUrl = ''

// axios.interceptors.request.use(
//   config => {
//     // 在发送请求之前做某件事
//     // if (env === 'dev') {
//     //   config.headers['X-jwt-sub'] = 1
//     // }
//     if (
//       config.method === 'post' ||
//       config.method === 'put' ||
//       config.method === 'delete'
//     ) {
//       // 序列化
//       // if (!config.headers['Content-Type']) {
//       //   config.data = qs.stringify(config.data)
//       // }
//       config.headers['Content-Type'] = 'application/json'
//     }

//     // 若是有做鉴权token , 就给头部带上token
//     if (sessionStorage.token) {
//       config.headers.Authorization = sessionStorage.token
//     }
//     return config
//   },
//   error => {
//     Message({
//       //  饿了么的消息弹窗组件,类似toast
//       showClose: true,
//       message: error,
//       type: 'error'
//     })
//     return Promise.reject(error.data.error.message)
//   }
// )

// /**
//  * 提示函数
//  * 禁止点击蒙层、显示一秒后关闭
//  */
// const tip = (msg: any) => {
//   Message({
//     //  饿了么的消息弹窗组件,类似toast
//     showClose: true,
//     message: msg,
//     type: 'error'
//   })
// }

// /**
// * 跳转登录页
// * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
// */
// const toLogin = () => {
//   router.replace({
//     path: '/login'
//   })
// }
// // 防抖函数
// let timer: any = null
// const debounce = (msg: any, delay: number, callback: Function) => {
//   if (timer) {
//     clearTimeout(timer)
//     timer = null
//   }
//   timer = setTimeout(() => {
//     tip(msg)
//     callback()
//   }, delay)
// }
// /**
//  * 请求失败后的错误统一处理
//  * @param {Number} status 请求失败的状态码
//  */
// const errorHandle = (status: any, other: any) => {
//   // 状态码判断
//   switch (status) {
//     case 400:
//       tip('参数有误')
//       break
//     // 401: 未登录状态，跳转登录页
//     case 401:
//       debounce(other, 1000, toLogin)
//       break
//     // 403 token过期
//     // 清除token并跳转登录页
//     case 403:
//       debounce('登录过期，请重新登录', 1000, toLogin)
//       sessionStorage.removeItem('token')
//       break
//     case 404:
//       tip('请求的资源不存在')
//       break
//     case 500:
//       tip('服务器错误')
//       break
//     default:
//     // console.log(other)
//   }
// }

// axios.interceptors.response.use(
//   config => {
//     return config
//   },
//   error => {
//     const { response } = error
//     if (response) {
//       // 请求已发出，但是不在2xx的范围
//       // ||response.data.msg加这个为了适配登录超时或被账号在它处登录
//       errorHandle(response.status, response.data.message || response.data.msg)
//     }
//     return Promise.reject(response || error)
//   }
// )

// export const request = (param: any): any => {
//   let url
//   param.isUseBasePath === 'isUseBasePath' ? url = param.url : url = `${baseUrl}${param.url}`
//   let method = String(param.method || 'GET').toUpperCase()
//   if (method === 'GET') {
//     return axios
//       .get(url, {
//         params: param.data || {},
//         cancelToken: param.cancelToken
//       })
//       .then((res: any) => {
//         // 演示 暂时
//         if (res.data.code !== 100200 && res.data.code !== 'Success' && res.data.resultCode !== 'Success') {
//           if (!param.notShowToast && res.data.msg) {
//             tip(res.data.msg)
//           }
//         }
//         return res.data
//       })
//   } else if (method === 'POST') {
//     // return axios.post(url, param.data || {}).then(res => {
//     //   return res.data
//     // })
//     return axios({
//       method: 'post',
//       url: url,
//       data: param.data || {},
//       headers: param.headers || {},
//       cancelToken: param.cancelToken
//     }).then((res: any) => {
//       if (res.data.code !== 100200 && res.data.code !== 'Success' && res.data.resultCode !== 'Success') {
//         if (!param.notShowToast && res.data.msg) {
//           tip(res.data.msg)
//         }
//       }
//       return res.data
//     })
//   } else {
//     return axios({
//       method: param.method,
//       url: url,
//       data: param.data || {},
//       headers: param.headers || {},
//       cancelToken: param.cancelToken
//     }).then((res: any) => {
//       if (res.data.code !== 100200 && res.data.code !== 'Success' && res.data.resultCode !== 'Success') {
//         tip(res.data.msg || res.data.code)
//       }
//       return res.data
//     })
//   }
// }
// const PROXY_MAP: { [key: string]: string } = {
//   // '^/assetHealth': 'http://10.122.61.205:8090/assetshealthiness-api/'
// }
// export const requestWithErrorHandle = <T>(param: any): Promise<Response & T> => {
//   return new Promise((resolve, reject) => {
//     if (env !== 'dev') {
//       Object.keys(PROXY_MAP).forEach(key => {
//         if (new RegExp(key).test(param.url)) {
//           param.url = PROXY_MAP[key] + param.url
//           param.isUseBasePath = 'isUseBasePath'
//         }
//       })
//     }
//     request(param).then((res: any) => {
//       if (res.resultCode !== 'Success' && res.code !== 'Success') {
//         if (res.code !== 'EmptyData') {
//           tip(res.msg || res.data)
//         }
//         reject(res)
//       } else {
//         resolve(res)
//       }
//     })
//   })
// }

// export const exportExel = (param: any): any => {
//   let url
//   if (param.method === 'get') {
//     if (param.isCustomize) {
//       url = `${baseUrl}${param.url}`
//     } else {
//       url = `${baseUrl}${param.url}?id=${param.data.id}`
//     }
//   } else {
//     url = `${baseUrl}${param.url}`
//   }
//   return axios({ // 用axios发送post请求
//     method: param.method || 'post',
//     url: url, // 请求地址
//     data: param.data, // 参数
//     responseType: 'blob' // 表明返回服务器返回的数据类型

//   }).then((res: any) => {
//     // 下载失败时解析数据流
//     if (res.data.type === 'application/json') {
//       let reader: any = new FileReader()
//       reader.readAsText(res.data, 'utf-8')
//       reader.onload = () => {
//         let response = JSON.parse(reader.result)
//         Message({
//           showClose: true,
//           message: response.data || '下载失败',
//           type: 'error'
//         })
//       }
//     } else {
//       // 处理返回的文件流
//       const blob = new Blob([res.data]) // new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
//       const fileName = `${param.name}.xlsx` // 下载文件名称
//       // const fileName = `${param.name}.xls` // 下载文件名称
//       const elink = document.createElement('a')
//       elink.download = fileName
//       elink.style.display = 'none'
//       elink.href = URL.createObjectURL(blob)
//       document.body.appendChild(elink)
//       elink.click()
//       URL.revokeObjectURL(elink.href) // 释放URL 对象
//       document.body.removeChild(elink)
//     }
//   })
// }
