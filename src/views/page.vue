<style scoped lang="scss">
</style>
<template>
    <div class="wrap">
        <el-form :model="postForm"  ref="postForm" label-position="top" :rules="rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="postForm.title"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <ueditor  style="width: 600px" v-model="postForm.content"></ueditor>
            </el-form-item>
            <el-form-item label="提交动作" prop="statue">
                <el-radio-group v-model="postForm.statue">
                    <el-radio label="publish">发布</el-radio>
                    <el-radio label="draft">存为草稿</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('postForm')">{{postForm.id?'更新':'创建'}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import  api from '../api'
    export default {
        data(){
            return{
                postForm:{
                    title:"",
                    content:'',
                    statue:'publish',
                    id:""
                },
                rules:{
                    title:{required:true,trigger:'blur',message:'标题不能为空'}
                },
            }
        },
        methods:{
            fetchData:function () {
                let _this=this;
                if(this.$route.params && this.$route.params.id){
                    this.id=this.$route.params.id;
                    api.getPageById(this.$route.params.id).then(function (data) {
                        Object.assign(_this.postForm,data)
                    })
                }else {
                    this.postForm={
                        title:"",
                        content:'',
                        statue:'publish',
                    }
                }
            },
            onSubmit:function (ref) {
                let _this=this;
                this.$refs[ref].validate( valid =>{
                    if(valid){
                       let data=this.postForm;
                        data.id=this.id;
                        api.putPage(data).then(data =>{
                            _this.$router.replace({path:'/page/edit/'+data.id})
                        })
                    }else {
                        return false;
                    }
                })
            },
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
        },
        watch:{
            '$route':function () {
                this.fetchData()
            }
        }
    }
</script>
