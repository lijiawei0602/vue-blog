import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth.js';
import editor from './editor.js';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        auth,
        editor
    }
});

export default store;