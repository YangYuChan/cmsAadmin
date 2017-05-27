//test
import api from '../api'
export const increment = ({commit}) => {
    commit('INCREMENT')
};
export const decrement = ({commit}) => {
    commit('DECREMENT')
};
export const getCategories = ({commit}) => {
   api.getCategories().then(data => {
       data.push({id:-1,name:'未分类'})
       commit('SETCATEGORY',data)
   })
};
