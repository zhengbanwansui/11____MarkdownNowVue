import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import axios from "axios";
Vue.prototype.$axios = axios;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 判断是否存在token,如果存在将每个页面header添加token
  if (localStorage.getItem("token")) {
    config.headers.common['token'] = localStorage.getItem("token");
  }
  return config
}, function (error) {
  router.push('/login')
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data.code === 501 ||
  response.data.code === 502 ||
  response.data.code === 503 ||
  response.data.code === 504 ||
  response.data.code === 505) {
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  if (error.response) {
    switch (error.response.status) {
      case 401:
        store.commit('del_token')
        router.push('/login')
    }
  }
  return Promise.reject(error)
})

import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
Vue.use(mavonEditor);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
