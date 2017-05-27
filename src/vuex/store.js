import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import  util from  '../common/js/util'

Vue.use(Vuex);

// 应用初始状态
const state = {
    count: 10,
    categories:[],
    appInit:false
};

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    SETCATEGORY(state,categories){
        state.categories=categories;
    },
    INITAPP(state){
        state.appInit=true;
    },
    PUSHCAGERY(state,category){
        state.categories.splice(0,0,category);
    },
    editCategory(state,category){
        let index=util.getIndexForArray('id',category.id,state.categories);
        if(index>-1){
            Object.assign(state.categories[index],category);
        }
    },
    deleteCategory(state,id){
        let index=util.getIndexForArray('id',id,state.categories);
        if(index>-1){
            state.categories.splice(index,1);
        }
    }
};

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})