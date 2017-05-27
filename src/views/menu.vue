<style scoped lang="scss">
    .menu-select{
        width: 300px;
    }
    .horizontalContainer{
        display: flex;
    }
    .el-checkbox+.el-checkbox {
        margin-left: 0px;
    }
    .add-menu{
        float: right;
        margin-top: 15px;
    }
</style>
<template>
    <div>
        <div style="margin: 15px 0">
            <el-select v-model="menuSite" @change="changeSite">
                <el-option label="顶部菜单" value="top">

                </el-option>
                <el-option label="底部菜单" value="bottom">

                </el-option>
            </el-select>
        </div>
        <div class="horizontalContainer">
            <div class="menu-select">
                <el-collapse>
                    <el-collapse-item title="文章分类" name="1">
                        <el-checkbox-group
                                v-model="checkedCategories">
                            <el-checkbox v-for="(item,index) in categories"
                                         :label="index"
                                         :key="item.index" style="display: block;margin-right: 15px">
                                {{item.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                        <el-button type="primary" class="add-menu" @click="addMenuItem('category')">
                            添加至菜单
                        </el-button>
                    </el-collapse-item>
                    <el-collapse-item title="页面" name="2">
                        <el-checkbox-group
                                v-model="checkedPages">
                            <el-checkbox v-for="(item,index) in pages"
                                         :label="index"
                                         :key="item.index"
                                         style="display: block;margin-right: 15px">
                                {{item.title}}
                            </el-checkbox>
                        </el-checkbox-group>
                        <el-button type="primary" class="add-menu" @click="addMenuItem('page')">
                            添加至菜单
                        </el-button>
                    </el-collapse-item>
                    <el-collapse-item title="自定义连接" name="3">
                        <el-form :model="URLMenu" :rules="rules" ref="urlForm">
                            <el-form-item label="URL" prop="url">
                                <el-input type="text" v-model="URLMenu.url"></el-input>
                            </el-form-item>
                            <el-form-item label="连接文本" prop="name">
                                <el-input type="text" v-model="URLMenu.name">

                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="add-menu" @click="addMenuItem('URL')">
                                    添加至菜单
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>

            </div>
            <div style="flex: 1;margin: 0 15px">
                <tree-node :vm="vm" :node="treeData" @changeVm="changeVm" style="width: 500px">

                </tree-node>
            </div>
            <el-button type="primary" @click="saveMenu" style="height: 36px">保存菜单</el-button>
        </div>
    </div>

</template>
<script>
    import  api from '../api'
    export default {
        data(){
            return {
                vm:null,
                treeData: {
                    name: '菜单结构',
                    children: []
                },
                pages:[],
                checkedCategories:[],
                checkedPages:[],
                URLMenu:{
                    url:'http://',
                    name:''
                },
                rules:{
                    url:[
                        {required:true,message:'请输入连接'},
                        {type:'url',message:'请输入正确的格式'}
                    ],
                    name:{required:true,message:'请输入连接文本'}
                },
                menuSite:'top'
            }
        },
        methods:{
            changeVm(vm){
                this.vm=vm;
            },
            addMenuItem(type){
                switch (type){
                    case 'category':
                        for(let i=0;i<this.checkedCategories.length;i++){
                            let ca=this.categories[this.checkedCategories[i]];
                            this.treeData.children.push({
                                name:ca.name,
                                id:ca.id,
                                type:'文章分类',
                                key:"category"+ca.id,
                            })
                        }
                        break;
                        case 'page':
                            for(let i=0;i<this.checkedPages.length;i++){
                                let page=this.pages[this.checkedPages[i]];
                                this.treeData.children.push({
                                    name:page.title,
                                    id:page.id,
                                    type:'页面',
                                    key:"page"+page.id,
                                })
                            }
                        break;
                        case 'URL':
                            this.$refs.urlForm.validate(valid => {
                                if(valid){
                                    this.treeData.children.push({
                                        name:this.URLMenu.name,
                                        url:this.URLMenu.url,
                                        type:'连接',
                                        key:"url"+this.URLMenu.url,
                                    })
                                }
                            });
                        break;
                }

            },
            changeSite(){
                let _this=this;
                api.getMenus(this.menuSite).then(res => {
                    _this.treeData.children=res;
                })
            },
            saveMenu(){
                api.setMenus(this.treeData.children,this.menuSite).then(res => {

                })
            }
        },
        created(){
            let _this=this;
            api.getPageList({page:0,limit:999}).then(pages => {
                _this.pages=pages.rows;
            });
            api.getMenus(this.menuSite).then(res => {
                _this.treeData.children=res;
            })
        },
        computed:{
            categories() {
              return  this.$store.state.categories

            }
        },
    }
</script>
