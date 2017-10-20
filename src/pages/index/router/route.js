import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const List = (cb) => {
    require.ensure([],() => {
        cb(require("../../../components/index/List.vue"));
    });
};

const Article = (cb) => {
    require.ensure([], () => {
        cb(require("../../../components/index/Article.vue"));
    });
};

const router = new Router({
    routes: [
        {
            path: '/',
            component: List,
        },
        {
            path: '/article/:id',
            component: Article
        },
        {
            path: '/page/:page',
            component: List
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});

export default router;