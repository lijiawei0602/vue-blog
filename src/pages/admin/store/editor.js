import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8086/api';

const tagApi = {
    getAllTags: "/tags",
    deleteTag: "/tags/",
    createTag: "/tags",
}

const articleApi = {
    saveArticle: "/articles/",
    createArticle: "/articles",
    publishArticle: "/articles/",
    notPublishArticle: "/articles/",
    deleteArticle: "/articles/",
    getAllArticles:"/articles/"
}

const state = {
    tagList: [],
    articleList: [],
    curPage: 1,
    allPage: 1,
    currentArticle: {
        id: -1,
        index: -1,
        title: '',
        content: '',
        tags: [],
        save: true,
        publish: false
    },
    selectTagArr: []
};

const getters = {
    tagList: state => state.tagList,
    articleList: state => state.articleList,
    curPage: state => state.curPage,
    allPage: state => state.allPage,
    currentArticle: state => state.currentArticle,
    selectTagArr: state => state.selectTagArr
};

const actions = {
    GET_ALL_TAGS(context){
        return axios.get(tagApi.getAllTags).then((res) => {
            if(res.data.success){
                context.commit("get_all_tags", res.data.tagArr);
            }
            return new Promise((resolve, reject) => {
                resolve(res);
            })
        }).catch((err) => {
            return new Promise((resolve, reject) => {
                reject(err);
            });
        });
    },
    DELETE_TAG(context, id){
        return axios.delete(tagApi.deleteTag + id).then((res) => {
            if(res.data.success){
                context.commit("delete_tag", id);
            }
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        }).catch((err) => {
            return new Promise((resolve, reject) => {
                reject(err);
            });
        });
    },
    GET_ALL_ARTICLES(context, { tag= '', page= 1, limit= 0 } = {}){
        return axios.get(articleApi.getAllArticles + '?tag='+ tag +'&page='+ page +'&limit='+ limit).then(res => {
            if(res.data.success){
                context.commit("get_all_articles", {articleList: res.data.articleArr, allPage: res.data.allPage, curPage: page});
                context.dispatch("GET_CURRENT_ARTICLE", 0);
                return new Promise((resolve, reject) => {
                    resolve(res);
                });
            }
        });
    },
    GET_CURRENT_ARTICLE(context, index){
        let article;
        if(state.articleList.length === 0 || index === -1){
            article = {
                id: -1,
                index: -1,
                title: '',
                content: '<!--more-->',
                save: true,
                publish: false,
                tags: []
            }
        }else{
            article = {
                id: state.articleList[index].id,
                index: index,
                title: state.articleList[index].title,
                content: state.articleList[index].content,
                save: true,
                publish: state.articleList[index].publish,
                tags: state.articleList[index].tags
            }
        }

        context.commit("get_current_article", article);
    },
    SAVE_ARTICLE(context, {id, article}){
        return axios.patch(articleApi.saveArticle + id, article).then((res) => {
            if(res.data.success){
                context.commit("save_article", {id, article});
            }  
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        }).catch((err) => {
            return new Promise((resolve, reject) => {
                reject(err);
            });
        });
    },
    DELETE_CURRENT_TAG(context, index){
        context.commit("delete_current_tag",index);
    },
    CREATE_ARTICLE(context, article){
        let abstract, data;
        if(article.content.indexOf("<!--more-->") !== -1){
            abstract = article.content.split("<!--more-->")[0];
        }else{
            abstract = article.content.substr(0,80);
        }
        data = Object.assign({abstract: abstract}, article);

        return axios.post(articleApi.createArticle, data).then((res) => {
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        }).catch((err) => {
            return new Promise((resolve,reject) => {
                reject(err);
            })
        });
    },
    PUBLISH_ARTICLE(context, id){
        return axios.patch(articleApi.publishArticle + id, {publish: true}).then((res) => {
            if(res.data.success){
                context.commit("publish_article", id);
            }
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        }).catch((err) => {
            return new Promise((resolve, reject) => {
                reject(err);
            });
        });
    },
    NOT_PUBLISH_ARTICLE(context, id){
        return axios.patch(articleApi.notPublishArticle + id, {publish: false}).then((res) => {
            if(res.data.success){
                context.commit("not_publish_article", id);
            }
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        }).catch((err) => {
            return new Promise((resolve, reject) => {
                reject(err);
            });
        });
    },
    DELETE_ARTICLE(context, id){
        return axios.delete(articleApi.deleteArticle + id).then((res) => {
            if(res.data.success){
                if(context.state.articleList.length <= 1){
                    let article = {
                        id: -1,
                        index: 0,
                        title: "",
                        content: "",
                        save: false,
                        publish: false
                    };
                    context.commit("get_current_article", article);
                }
            }
            return new Promise((resolve, reject) => {
                resolve(res);
            });
        }).catch((err) => {
            return new Promise((resolve,reject) => {
                reject(err);
            });
        });
    },
    CREATE_TAG(context, data){
        return axios.post(tagApi.createTag , data).then((res) => {
            if(res.data.success){
                context.commit("create_tag", res.data.tag);
                
                return new Promise((resolve, reject) => {
                    resolve(res);
                });
            }
        }).catch((err) => {
            return new Promise((resolve,reject) => {
                reject(err);
            });
        });
    },
    CHANGE_ARTICLE(context){
        context.commit("change_article");
    }
}

const mutations = {
    get_all_tags(state, data){
        state.tagList = data;
    },
    delete_tag(state, id){
        state.tagList = state.tagList.filter((e) => {
            return e.id !== id;
        });
    },
    get_current_article(state, article){
        state.currentArticle = article;
    },
    delete_current_tag(state, index){
        state.currentArticle.tags.splice(index, 1);
    },
    clear_select_tag(state){
        state.selectTagArr = [];
    },
    publish_article(state, id){
        //修改当前文章publish以及articleList中对应ID的文章的publish
        state.currentArticle.publish = true;
        state.articleList.find((item) => item.id === id).publish = true;
    },
    not_publish_article(state, id){
        state.currentArticle.publish = false;
        state.articleList.find((item) => item.id === id).publish = false;
    },
    save_article(state,{ id, article }){
        state.currentArticle.save = true;
    },
    create_tag(state, tag){
        state.currentArticle.tags.push(tag);
    },
    change_article(state){
        state.currentArticle.save = false;
    },
    get_all_articles(state, data){
        state.articleList = data.articleList;
        state.allPage = data.allPage;
        state.curPage = data.curPage;
    },
    set_all_page(state, allPage){
        state.allPage = allPage;
    },
    set_cur_page(state, curPage){
        state.curPage = curPage;
    },
    toggle_select_tag(state, id){
        if(!state.selectTagArr.includes(id)){
            state.selectTagArr.push(id);
        }else{
            //删选不是该ID的标签并重新赋值给本身
            state.selectTagArr = state.selectTagArr.filter((e) => {
                return e !== id;
            });
        }
    }
};


export default {
    state,
    actions,
    getters,
    mutations
}