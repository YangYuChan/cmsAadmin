<style scoped lang="scss">
    .form-description{
        line-height: normal;
        text-indent:2em;
    }
    .ivu-select-item:hover{
        background: #e4e8f1;
    }
    .ivu-select-multiple .ivu-select-item-selected{
        color: #20a0ff;
    }
    .ivu-select-item{
        font-size: 14px !important;
    }
    .ivu-tag{
        font-size: 14px;
        background-color: rgba(32,160,255,.1);
        border-color: rgba(32,160,255,.2);
    }
</style>
<template>
    <div class="wrap">
        <el-form :model="postForm"  ref="postForm" label-position="top" :rules="rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="postForm.title"></el-input>
            </el-form-item>
            <el-form-item label="摘要" prop="digest">
                <el-input v-model="postForm.digest" type="textarea" :rows='4'></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <ueditor  style="width: 100%" v-model="postForm.content"></ueditor>
            </el-form-item>
            <el-form-item label="文章分类" prop="category">
                <el-select v-model="postForm.category" @change="changeCategory">
                    <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提交动作" prop="statue">
                <el-radio-group v-model="postForm.statue">
                    <el-radio label="publish">发布</el-radio>
                    <el-radio label="draft">存为草稿</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-for="field in customFields" :label="field.name" :key="field.key"
                          :prop="'meta.' + field.key"
                          :rules="field.required?{required: true, message: '内容不能空'}:null">
                    <p class="form-description" v-if="field.description"><small>{{field.description}}</small></p>
                    <el-input v-if="field.type=='text'" v-model="postForm.meta[field.key]" ></el-input>
                    <el-input v-else-if="field.type=='textarea'" v-model="postForm.meta[field.key]" type="textarea" :autosize="{ minRows: 3}"></el-input>
                    <el-select v-else-if="field.type=='select'" v-model="postForm.meta[field.key]" style="width: inherit;min-width: 200px">
                        <el-option v-for="option in field.selections" :key="option.value" :value="option.value" :label="option.name"></el-option>
                    </el-select>
                    <el-select v-else-if="field.type=='selects'" v-model="postForm.meta[field.key]" multiple style="width: inherit;min-width: 200px">
                        <el-option v-for="option in field.selections" :key="option.value" :value="option.value" :label="option.name"></el-option>
                    </el-select>
                <el-radio-group v-else-if="field.type=='switch'" v-model="postForm.meta[field.key]">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
                <Media v-else-if="field.type=='image'" v-model="postForm.meta[field.key]"></Media>
                <Media v-else-if="field.type=='gallery'" v-model="postForm.meta[field.key]" multiple></Media>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('postForm')">{{postForm.id?'更新':'创建'}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import  api from '../api'
    import  Media from '../components/media/mediaLibrary.vue'
    export default {
        data(){
            return{
                postForm:{
                    title:"",
                    digest:'',
                    content:'',
                    category:'',
                    statue:'publish',
                    pic:'http://localhost:3000/upload/img/022.png',
                    meta:{},
                    metaKey:'customField'
                },
                rules:{
                    title:{required:true,trigger:'blur',message:'标题不能为空'}
                },
                customFields:[],
            }
        },
        methods:{
            fetchData:function () {
                let _this=this;
                if(this.$route.params && this.$route.params.id){
                    this.id=this.$route.params.id;
                    api.getPostById(this.$route.params.id).then(function (data) {
                        Object.assign(_this.postForm,data)
                    })
                }else {
                    this.postForm={
                        title:"",
                        digest:'',
                        content:'',
                        category:'',
                        statue:'publish',
                        pic:'http://localhost:3000/upload/img/022.png',
                        meta:{},
                        metaKey:'customField'
                    }
                }
            },
            onSubmit:function (ref) {
                let _this=this;
                this.$refs[ref].validate( valid =>{
                    if(valid){
                        let meta={};
                        for(let i=0;i<_this.customFields.length;i++){
                            meta=_this.postForm.meta[_this.customFields[i].key];
                        }

                        let data=this.postForm;
                        data.meta=meta;
                        data.id=this.id;
                        api.putPost(data).then(data =>{
                            _this.$router.replace({path:'/post/edit/'+data.id})
                        })
                    }else {
                        return false;
                    }
                })
            },
            changeCategory:function () {
                let _this=this;
                api.getCustomByc(this.postForm.category).then(res => {
                    for(let i=0;i<res.length;i++){
                        let field=res[i];
                        if(!_this.postForm.meta[field.key]){
                            _this.$set(_this.postForm.meta,field.key,"")
                        }
                    }
                    _this.customFields=res;
                })
            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
        },
        computed:{
            categories() {
                return this.$store.state.categories;
            }
        },
        components:{
            Media
        },
        watch:{
            '$route':function () {
                this.fetchData()
            }
        }
    }
</script>
