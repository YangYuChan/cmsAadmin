import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import category from './views/category.vue'
import posts from './views/Posts.vue'
import editPost from './views/EditPost.vue'
import custom from './views/customField.vue'
import customs from './views/customFilds.vue'
import test from './views/test.vue'
import Menu from './views/menu.vue'

import Page from './views/page.vue'

import PageList from './views/pageList.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path:'/',
        component:Home,
        name:'首页',
        leaf:true,
        children:[
            { path: '/', component: Main, name: '仪表盘'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '文章',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/posts', component: posts, name: '所有文章'},
            { path: '/post/create/', component: editPost, name: '新建文章' },
            { path: '/post/edit/:id', component: editPost, name: '编辑文章',hidden:true},
            { path: '/post/category', component: category, name: '文章分类' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '页面',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/pages', component: PageList, name: '所有页面'},
            { path: '/page/new/', component: Page, name: '新建页面' },
            { path: '/page/edit/:id', component: Page, name: '编辑页面',hidden:true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '字段',
        leaf:true,
        iconCls: 'el-icon-message',//图标样式class
        children:[
            {path:"/customs",component:customs,name:'字段'},
            {path:"/custom/create",component:custom,name:'新建字段组',hidden:true},
            {path:"/custom/edit/:id",component:custom,name:'编辑字段组',hidden:true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '测试',
        leaf:true,
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/test', component: test, name: '测试'},
        ]
    },
    {
        path:'/',
        component:Home,
        name:"菜单",
        leaf:true,
        iconCls: 'el-icon-message',
        children: [
            { path: '/menu', component: Menu, name: '菜单'},
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;