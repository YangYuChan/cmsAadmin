<style scoped lang="scss">
    .leftFormContainer{
        display: flex;
        .leftForm{
            width: 450px;
            margin-right: 50px;
        }
    }

</style>
<template>
    <div class="leftFormContainer">
        <el-form :model="current" :rules="rules" ref="categoryForm" class="leftForm">
            <el-form-item label="名称" prop="name">
                <el-input v-model="current.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('categoryForm')">{{current.id==''?'创建':'更新'}}</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="categories" border style="max-width:600px">
            <el-table-column label="名称">
                <template scope="scope">
                    <el-button @click="edit(scope.row.id)" type="text" size="small">{{scope.row.name}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button @click="deleteById(scope.row.id)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import  util from '../common/js/util';
    import  api from '../api'
    export default {
        data(){
            return{
                current:{
                    name:'',
                    id:''
                },
                rules:{
                    name:[
                        {required:true,message:'名称不能为空',trigger:'blur'},
                        {max:5,message:'长度不能大于5个字符',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            edit:function (id) {
                let index=util.getIndexForArray('id',id,this.categories);
                Object.assign(this.current,this.categories[index]);
            },
            deleteById(id){
                let _this=this;
                api.deleteCategory(id).then( data =>{
                    if(_this.current.id=id){
                        _this.current.id='';
                        _this.current.name='';

                    }
                    _this.$store.commit('deleteCategory',id);
                })
            },
            onSubmit:function (ref) {
                let _this=this;
                this.$refs[ref].validate(valid =>{
                    if(valid){
                        api.putCategory(this.current).then(data =>{
                            if(!_this.current.id || _this.current.id==''){
                                _this.current.id=data.id;
                                let tem={};
                                Object.assign(tem,data);
                                _this.$store.commit("PUSHCAGERY",tem);
                            }else {
                                _this.$store.commit('editCategory',_this.current)
                            }
                        })
                    }
                })
            }
        },
        computed:{
            categories:function () {
                return this.$store.state.categories;
            }
        }
    }
</script>
