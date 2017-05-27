/**
 * Created by Administrator on 2017/5/9.
 */
import  Ueditor from './Ueditor.vue'
var VueUeditor = {
    install: function(Vue) {
        Vue.component('ueditor', Ueditor)
    }
};
module.exports = VueUeditor;