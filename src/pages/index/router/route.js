import Vue from 'vue';
import Router from 'vue-router';
import Hljs from 'highlight.js';

Vue.use(Router);

Vue.directive('hljs', function(el) {
  let blocks = el.querySelectorAll('pre code');
  Array.prototype.forEach.call(blocks, Hljs.highlightBlock);
})


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