<style scoped lang="scss">
    .wibkit{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
</style>
<template>
    <div>
        <el-button class="page-button" type="primary" @click="newPost">新建</el-button>
        <el-table :data="posts" border>
            <el-table-column
                    label="标题">
                <template scope="scope">
                    <span style="margin-left: 10px">{{scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="digest"
                    label="摘要">
                <template scope="scope">
                    <P class="wibkit">{{scope.row.digest}}</P>
                </template>
            </el-table-column>
            <el-table-column prop="category" label="分类">
                <template scope="scope">
                        {{categories[scope.row.category]?categories[scope.row.category].name:'未分类'}}
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建日期"></el-table-column>
            <el-table-column prop="updatedAt" label="最后修改日期"></el-table-column>
            <el-table-column  label="操作">
                <template scope="scope">
                    <el-button  type="text" size="small" @click="edit(scope.row.id)">编辑</el-button>
                    <el-button @click="deleteById(scope.row.id)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="text-align: right">
            <el-pagination
                    layout="prev, pager, next"
                    :page-size="1"
                    :total="total"
                    @current-change="changePage"
                    >
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import  {getPostList,deletePostById} from '../api/api';
    import  utile from '../common/js/util'
    export default {
        data(){
            return {
                posts:[],
                total:500
            }
        },
        methods:{
            newPost:function () {
                this.$router.push({path:'/post/edit/'})
            },
            edit:function (id) {
                this.$router.push({path:'/post/edit/'+id})
            },
            deleteById:function (id) {
                let _this=this;
                deletePostById(id).then(data=>{
                   let index= utile.getIndexForArray('id',id,_this.post);
                    _this.posts.splice(index,1);
                })
            },
            changeStatue:function (id,statue) {

            },
            changePage:function (page) {
                let  _this=this;
                getPostList({limit:20,page:page}).then(data => {
                    _this.posts=data.rows;
                    _this.total=data.count;
                })
            }
        },
        mounted:function () {
            let  _this=this;
            getPostList({limit:20,page:0}).then(data => {
                    _this.posts=data.rows;
                    _this.total=data.count;
            })
        },
        computed:{
            categories() {
                let categoryMap={};
                 this.$store.state.categories.forEach(category => {
                     categoryMap[category.id]=category;
                 });
                 return categoryMap;

            }
        },
    }
</script>
