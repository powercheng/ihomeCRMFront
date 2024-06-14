import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import { usePermissStore } from './store/permiss';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
import axios from 'axios';
import { ElLoading,ElMessage } from 'element-plus';

// 设置默认的基础 URL
axios.defaults.baseURL = 'http://localhost:8080/';
const app = createApp(App);
app.use(createPinia());
app.use(router);

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 自定义权限指令
const permiss = usePermissStore();
app.directive('permiss', {
    mounted(el, binding) {
        if (binding.value && !permiss.key.includes(String(binding.value))) {
            el['hidden'] = true;
        }
    },
});

// loading
let loadingInstance;

axios.interceptors.request.use(config => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'loading...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;

}, error => {
  if (loadingInstance) loadingInstance.close();
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  const data = response.data;
  if (loadingInstance) loadingInstance.close();
  if (data.code === 200) {
    return response
} else {
    if (data.code === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      console.log(data.msg);
      ElMessage.error(!data.msg ? 'system error' : data.msg);
    }
    // 拒绝流程继续往下走
    return Promise.reject(data.msg);
}
  return response;
}, error => {
  if (loadingInstance) loadingInstance.close();
  ElMessage.error(error.message);
  return Promise.reject(error);
});

app.mount('#app');
