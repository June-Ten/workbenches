// import { Loading } from 'element-ui';
import { checkUrl } from '@/utils/utils'
import axios from 'axios';
window.$glob = {
  url: '',
  params: {},
  query: {},
  header: {}
};
function getGlobParams () {
  let search = "";
  if (window.location.href.indexOf('?') !== -1) {
    search = window.location.href.split('?')[1];
  }
  var query = search;
  query = query.split("&");
  query.forEach(ele => {
    var pair = ele.split("=");
    window.$glob.params[pair[0]] = pair[1]
  })
  console.log(query, window.location)
}
if (window.location.href.indexOf('/view/') == -1) {
  // getGlobParams();
}
axios.defaults.timeout = 10000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
// let loadingInstance = '';
// axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
  // loadingInstance = Loading.service({
  //   text: '拼命加载中',
  //   background: 'rgba(0,0,0,0)',
  //   spinner: 'el-icon-loading'
  // });
  if (!checkUrl(config.url)) config.url = window.$glob.url + config.url;
  let header = window.$glob.header || {};
  config.headers = Object.assign(config.headers, header);
  let data = window.$glob.query || {}
  let key;
  if (config.method == 'get') {
    key = "params"
  } else if (config.method == 'post') {
    key = "data"
  }
  if (typeof (config[key]) === 'object') {
    config[key] = Object.assign(config[key] || {}, data)
  }

  // 1.从缓存中获取到token,这里的Authorization时登录时你给用户设置token的键值
  let authorization = localStorage.getItem("Authorization");
  // 2.如果token不为null，那么设置到请求头中，此处哪怕为null，我们也不进行处理，因为后台会进行拦截
  if (authorization) {
    //后台给登录用户设置的token的键时什么，headers['''']里的键也应该保持一致
    config.headers['Authorization'] = authorization;
  }
  // 3.放行
  return config
}, error => {
  return Promise.reject(error)
});
//HTTPrequest拦截
axios.interceptors.response.use(config => {
  // loadingInstance.close();
  if (config.data.Results) {
    config.data.data = config.data.Results;
  } else if (config.data.Result) {
    config.data.data = config.data.Result;
  }
  console.log(config.data)
  return config;
}, error => {
  // loadingInstance.close();
  return Promise.reject(new Error(error));
})

export default axios;
