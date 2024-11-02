import axios from "axios";
import {
  showSuccessToast,
  showLoadingToast,
  showFailToast,
  closeToast,
} from "vant";
import { parse } from "vue/compiler-sfc";
// import { useUserStore } from "@/store/user";

// 创建一个 Axios 实例
const request = axios.create({
  baseURL: "http://api.aidao.top", // 设置基础 URL，根据您的实际情况进行修改
  // baseURL:"http://aidao.88kuaifa.com",
  timeout: 5000, // 设置请求超时时间，单位为毫秒
});
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // const token = useUserStore().token;
    showLoadingToast({
      message: "加载中...",
      forbidClick: true,
    });
    const token = localStorage.getItem("token");
    config.headers["Authorization"] = token;
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    closeToast();
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么，例如处理错误码、统一处理错误等
    let flag=''
    if (response.config.data) {
     flag= JSON.parse(response.config.data)
    }
    // if (!flag.flag) {
    //   closeToast();      
    // }
    closeToast();   
    return response.data;
  },
  (error) => {
    // 对响应错误做些什么
    closeToast();
    return Promise.reject(error);
  }
);

export default request;
