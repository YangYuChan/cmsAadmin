import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import ueditor  from './components/vue-ueditor'
import 'element-ui/lib/theme-default/index.css'
import './styles/vars.scss'
import VueRouter from 'vue-router'
import store from './vuex/store'
import axios from 'axios';
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import 'iview/dist/styles/iview.css';
import tree from  './components/vue-tree';
axios.defaults.baseURL='http://127.0.0.1:3000/v1/';

Vue.use(ElementUI);
// Vue.use(iView);
Vue.use(ueditor);
Vue.use(tree);
Vue.use(VueRouter);
Vue.use(Vuex);


//NProgress.configure({ showSpinner: false });


axios.interceptors.response.use(function (response) {
    // Do something with response data
    if(response.data.code==0){
        console.log(response.data);
      return response.data
    }else {
        router.app.$message.error("网络请求错误 :"+response.data.msg);
        return Promise.reject(response.data.msg);
    }
}, function (error) {
  if(error.response.status==401){
      router.push('/login?redirect='+router.currentRoute.path);
  }else {
      router.app.$message.error("网络请求错误"+error.response.statusText);
  }
    return Promise.reject(error);

});

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
});

//router.afterEach(transition => {
//NProgress.done();
//});

//获取登录状态
axios.get('getUser',{}).then(data =>{
  console.log(data);
    if(data.data && data.data.role){
        store.dispatch('getCategories');
        sessionStorage.setItem('user',JSON.stringify(data.data));
    }
    new Vue({
        //el: '#app',
        //template: '<App/>',
        router,
        store,
        //components: { App }
        render: h => h(App)
    }).$mount('#app');

});


