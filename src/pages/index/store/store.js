import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const tagApi = {
    getAllTags: "http://localhost:8086/api/tags",
};

const store = new Vuex.Store({
    state: {
        tagList: [],
    },
    getters: {
        tagList: state => state.tagList,
    },
    actions: {
        GET_ALL_TAGS(context){
            return axios.get(tagApi.getAllTags).then(res => {
                if(res.data.success){
                    context.commit("get_all_tags", res.data.tagArr);
                }
                return new Promise((resolve, reject) => {
                    resolve(res);
                });
            }).catch(err => {
                return new Promise((resolve, reject) => {
                    reject(err);
                });
            });
        }
    },
    mutations: {
        toggle_side_box(state){

        },
        set_select_tags(state, arr){

        },
        get_all_tags(state, tagList){
            state.tagList = tagList;
        },
    }
});

export default store;