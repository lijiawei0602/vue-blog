import vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import { Message, MessageBox } from 'element-ui';

import 'element-ui/lib/theme-default/index.css'

import store from '../store';

vue.use(Router);

//引入element-ui相关弹出组件
vue.prototype.$msgbox = MessageBox;
vue.prototype.$alert = MessageBox.alert;
vue.prototype.$confirm = MessageBox.confirm;
vue.prototype.$prompt = MessageBox.prompt;
vue.prototype.$message = (options) => {
    options = Object.assign(options, {durations: 500});
    return Message(options);
};

vue.prototype.$message.error = (err) => {
    var options = {
        message: err,
        durations: 500,
        type: 'error'
    };
    return Message(options);
};

//按需加载组件
var Login = function(cb){
    require.ensure([],function(){
        cb(require("../../../components/admin/Login.vue"));
    });
};

var Admin = function(cb){
    require.ensure([],function(){
        cb(require("../../../components/admin/Admin.vue"));
    });
};

const router =  new Router({
    // mode: "history",
    // scrollBehavior(to, from, savedPosition){
    //     if(savedPosition){
    //         return savedPosition;
    //     }
    // },
    routes: [
        { 
            path: '/admin/login', 
            component: Login,
            meta: { authPage: true }
        },
        { 
            path: '/admin', 
            component: Admin
        },
        { 
            path: '*', 
            redirect: '/admin' 
        }
    ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.authPage) { //login
    console.log("login");
    //判断状态中token是否为空，来判断是否登陆
    if(store.state.auth.token){
        next("/admin");
    }
    next();
  }else{
      //进入非Login组件，即进入Admin组件时
      if(store.state.auth.token){
        //对axios设置全局配置，对所有请求都有效
        axios.defaults.headers.common["Authorization"] = "Bearer " + store.state.auth.token;
        next();
      }else{
          //进入Admin组件状态中token为空时
          next("/admin/login");
      }
  }
});

//响应拦截器，防止token过期
axios.interceptors.response.use(function(response){
  return response;
},function(err){
  if(err.response.data.error.indexOf("token") !== -1){
      store.commit("delete_token");
  }
  return Promise.reject(err);
});

export default router;