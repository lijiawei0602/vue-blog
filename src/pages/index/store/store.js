import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const tagApi = {
    getAllTags: "http://localhost:8086/api/tags",
};

const articleApi = {
    getAllPublishArticles: "http://localhost:8086/api/publishArticles",
    getPublishArticle: "http://localhost:8086/api/articles/",
}

const store = new Vuex.Store({
    state: {
        tagList: [],
        pubArtList: [],
        curPage: 0,
        allPage: 0,
        selectTag: [],
        currentArticle: {
            id: '',
            title: '',
            content: '',
            createTime: '',
        },
        sideBoxShow: false,
    },
    getters: {
        tagList: state => state.tagList,
        pubArtList: state => state.pubArtList,
        allPage: state => state.allPage,
        curPage: state => state.curPage,
        selectTag: state => state.selectTag,
        currentArticle: state => state.currentArticle,
        sideBoxShow: state => state.sideBoxShow,
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
        },
        GET_ALL_PUBLISH_ARTICLES(context, { tag='', page=1, limit=5} = {}){
            return axios.get(articleApi.getAllPublishArticles + '?tag='+ tag +'&page='+ page +'&limit='+ limit).then(res => {
                if(res.data.success){
                    context.commit("get_all_publish_articles", { pubArtList: res.data.articleArr, allPage: res.data.allPage, curPage: page });
                }
                return new Promise((resolve, reject) => {
                    resolve(res);
                });
            }).catch(err => {
                return Promise((resolve, reject) => {
                    reject(err);
                });
            });
        },
        GET_PUBLISH_ARTICLE(context, id){
            let article = context.state.pubArtList.find((item) => {
                return item.id == id;
            });
            if(article && article.content){
                context.commit("get_publish_article", article);
                return new Promise((resolve, reject) => {
                    resolve(article);
                });
            }else{
                return axios.get(articleApi.getPublishArticle + id).then(res => {
                    if(res.data.success){
                        context.commit("get_publish_article", res.data.article);
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
        }
    },
    mutations: {
        toggle_side_box(state){
            state.sideBoxShow = !state.sideBoxShow;
        },
        set_select_tags(state, arr){
            state.selectTag = arr;
        },
        get_all_tags(state, tagList){
            state.tagList = tagList;
        },
        get_all_publish_articles(state, data){
            state.pubArtList = data.pubArtList;
            state.allPage = data.allPage;
            state.curPage = data.curPage;
        },
        toggle_select_tags(state,{ id, name }){
            if(typeof state.selectTag.find(e => {
                return e.id == id;
            }) == 'undefined'){
                state.selectTag.push({
                    id,
                    name
                });
            }else{
                state.selectTag = state.selectTag.filter(e => {
                    return e.id != id;
                });
            }
        },
        get_publish_article(state, article){
            state.currentArticle = article;
        }
    }
});

export default store;