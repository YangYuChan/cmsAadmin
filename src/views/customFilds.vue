<style scoped lang="scss">
</style>
<template>
    <div>
        <el-button type="primary" @click="create" class="page-button">新建</el-button>
        <el-table :data="fields">
            <el-table-column prop="title" label="标题">
                <template scope="scope">
                    <el-button @click="edit(scope.row.id)" type="text" size="small">{{scope.row.title}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="字段数">
                <template scope="scope">
                    <span>{{scope.row.fields.length}}</span>
                </template>
            </el-table-column>
            <el-table-column>
                <template scope="scope">
                    <el-button icon="delete" @click="deleteField(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

</template>
<script>
    import  api from '../api'
    export default {
        data(){
            return{
                fields:[]
            }
        },
        methods:{
            edit:function (id) {
                this.$router.push('/custom/edit/'+id);
            },
            create:function () {
                this.$router.push({path:'/custom/create'})
            },
            deleteField:function (id) {
                let _this=this;
                api.deleteCustom(id).then(() => {
                    _this.feachData();
                })
            },
            feachData:function () {
                let _this=this;
                api.getCustoms().then( data => {
                    _this.fields=data;
                })
            }
        },
        created(){
            this.feachData();
        }
    }
</script>
