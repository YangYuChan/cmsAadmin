/**
 * Created by Administrator on 2017/5/24.
 */
import  Vtree from './Vtree.vue'
var VueTree = {
    install: function(Vue) {
        Vue.component('tree-node', Vtree)
    }
};
module.exports = VueTree;