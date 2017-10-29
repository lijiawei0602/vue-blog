import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8086/api';

const API = {
    token: "/token"
};

export default {
    state: {
        token: sessionStorage.getItem('vue-blog-token')
    },
    actions: {
        CREATE_TOKEN(context, obj){
            return axios.post(API.token, obj).then( res =>{
                if(res.data.success){
                    context.commit("create_token", res.data.token);
                }else{
                    context.commit("delete_token");
                }
                return new Promise((resolve, reject) => {
                    resolve(res);
                });
            });
        }
    },
    mutations: {
        create_token(state, data){
            state.token = data;
            sessionStorage.setItem("vue-blog-token", data);
        },
        delete_token(state, data){
            state.token = null;
            sessionStorage.setItem("vue-blog-token", '');
        }
    }
}