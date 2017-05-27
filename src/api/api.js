import axios from 'axios';

let base = '';

export const requestLogin = params => {
    return axios.post(`login`, params).then(function (res) {
        return res.data;
    });
};

export const requestLoginOut = params => {
    return axios.get(`loginout`, params).then(res => res.data);
};

export const getPostList = params => {
    return axios.get(`posts`, {params:params}).then(res => res.data);
};

export const getPostById = id => {
    return axios.get(`post/`+id).then(res => res.data);
};

export const putPost = params => {
    if(params.id && params.id!==''){
        return axios.put(`post/`+params.id, params).then(res => res.data);
    }else {
        return axios.post(`post/`, params).then(res => res.data);
    }
};

export const getPageList = params => {
    return axios.get(`pages`, {params:params}).then(res => res.data);
};

export const getPageById = id => {
    return axios.get(`page/`+id, {}).then(res => res.data);
};

export const putPage = params => {
    if(params.id && params.id!==''){
        return axios.put(`page/`+params.id, params).then(res => res.data);
    }else {
        return axios.post(`page/`, params).then(res => res.data);
    }
};

export const putCategory = params => {
    if(params.id && params.id!==''){
        return axios.put(`category/`+params.id, params).then(res => res.data);
    }else {
        return axios.post(`category/`, params).then(res => res.data);
    }
};

export const getCategories = () => {
    return axios.get(`category/`, {}).then(res => res.data);
};

export const deleteCategory = (id) => {
    return axios.delete(`category/id`, {}).then(res => res.data);
};

export const deletePostById = id => {
    return axios.delete(`post/`+id).then(res => res.data);
};

export const getImages = () => {
    return axios.get(`file/images`).then(res => res.data);
};

export const getCustoms = () => {
    return axios.get(`customs`).then(res => res.data);
};

export const getCustom = (id) => {
    return axios.get(`custom/`+id, {}).then(res => res.data);
};
export const postCustom = (data) => {
    if(data.id){
        return axios.put(`custom/`+data.id, data).then(res => res.data);
    }else {
        return axios.post(`custom/`, data).then(res => res.data);
    }
};

export const deleteCustom = (id) => {
    return axios.delete('custom/'+id).then(res =>res.data)

};
export const getCustomByc= (id) => {
    return axios.get('custom/category/'+id).then(res => res.data)

};

export const setMenus= (value,site) => {
    return axios.put('option/option_menu_'+site,value).then(res => res.data)

};
export const getMenus= (site) => {
    return axios.get('option/option_menu_'+site).then(res => {
        if(res.data.option_value && res.data.option_value.length){
           return JSON.parse(res.data.option_value)
        }
        return [];
    })

};
