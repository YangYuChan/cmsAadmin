<style scoped lang="scss">
    .cy-container {
        position: relative;
    }

    .select-dialog {
        position: fixed;
        z-index: 1005;
        overflow: auto;
        top: 50px;
        bottom: 50px;
        left: 50px;
        right: 50px;

        .dialog-container {
            position: relative;
            display: flex;
            flex-direction: column;
            background-color: #ffffff;
            width: 100%;
            height: 100%;
            .dialog-header {
                padding: 20px 20px 0;
                .close {
                    display: inline-block;
                    float: right;
                }
            }
            .dialog-content {
                flex: 1;
                border-top: 1px #e6e6e6 solid;
                border-bottom: 1px #e6e6e6 solid;
                li {
                    list-style: none;
                    float: left;
                    width: 160px;
                    height: 160px;
                    padding: 8px;
                    overflow: hidden;
                    position: relative;
                    .image-list {
                        height: 100%;
                        overflow: hidden;
                        img {
                            max-height: 100%;
                        }

                    }
                    .check-mark{
                        display: none;
                        position: absolute;
                        background-color: #0073aa;
                        color: #ffffff;
                        line-height: normal;
                        padding: 5px;
                        right: 7px;
                        top: 7px;
                        font-size: 10px;
                        transform: translateX(50%)translateY(-50%)

                    }
                }
                li.checked{
                    -webkit-box-shadow: inset 0 0 0 3px #fff,inset 0 0 0 7px #0073aa;
                    box-shadow: inset 0 0 0 3px #fff,inset 0 0 0 7px #0073aa;
                    .check-mark{
                        display: inline-block;
                    }
                }
            }
            .dialog-footer {
                height: 49px;
            }
        }
    }
    .has-img {
        li{
            list-style: none;
            float: left;
            position: relative;
            margin: 0 5px;
            width: 160px;
            height: 160px;
            img{
                width: 100%;
            }
            .close{
                position: absolute;
                right: 5px;
                top:0;
                display: none;
                transform: translateX(100%);
            }

        }
        li:hover .close{
            display: inherit;
        }
    }
    .img-list{
        width: 100%;
        height: 100%;
        background-size: cover;
    }
    .v-model {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: .5;
        background: #000;
        z-index: 1004;
    }
    .cus-progress{
        transform-origin: center;
        transform: rotate(-90deg);
    }
    circle {
        -webkit-transition: stroke-dasharray .25s;
        transition: stroke-dasharray .25s;
    }
</style>
<template>
    <div>
        <div class="no-img" v-show="images.length==0" v-if="!multiple">
            <p>没有选择图片
                <el-button type="primary" @click="showDialogE">选择图片<i class="el-icon-upload el-icon--right"></i>
                </el-button>
            </p>
        </div>
        <div class="has-img" v-show="images.length>0">
            <ul>
                <li v-for="(item,index) in images">
                    <div class="img-list" :style="{backgroundImage: 'url('+item+')'}"></div>
                    <div class="close" @click="deleteSelect(index)">
                        <i class="el-icon-delete"></i>
                    </div>
                </li>
                <li v-if="multiple" style="line-height: 160px;text-align: center">
                    <el-button type="primary" @click="showDialogE">选择图片<i class="el-icon-upload el-icon--right"></i>
                    </el-button>
                </li>
            </ul>
        </div>
        <div v-show="showDialog" class="select-dialog">
            <div class="dialog-container">
                <div class="dialog-header">
                    <span class="dialog-title" @click="showUpload=false">选择图片</span>
                    <span class="dialog-title" @click="showUpload=true">本地上传</span>
                    <i class="el-icon-close pull-right" @click="cancalDialog"></i>
                </div>
                <div v-show="!showUpload" class="dialog-content">
                    <div class="content-images">
                        <ul>
                            <li class="el-upload-dragger" @click="handleClick">
                                <i class="el-icon-upload" style="margin-top: 0"></i>
                                <div class="el-upload__text">将文件拖到此处<br><em>点击上传</em></div>
                                <input type="file" 
                                       accept="image/jpeg,image/png,image/bmp" 
                                       ref="uploadInput" style="display: none"
                                       @change="handleChange" :multiple="multiple"
                                >
                            </li>
                            <li v-for="item in uploads">
                               <svg width="100%" height="100%">
                                   <circle cx="50%" cy="50%" r="50" stroke-width="8" stroke="#e5e9f2" fill="none"></circle>
                                   <circle ref="cusProgress" cx="50%" cy="50%" r="50" stroke-width="8" stroke="#20a0ff" fill="none" :stroke-dasharray="item.percentage"></circle>
                               </svg>
                            </li>
                            <li v-for="(item ,index) in allImages" :class="{checked:item.checked}">
                                <div class="image-list" @click="check(index)"><img :src="item.url"></div>
                                <div class="check-mark" ><i class="el-icon-check"></i></div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="dialog-footer">
                    <el-button type="primary" class="pull-right" @click="selectImages">选择图片</el-button>
                </div>

            </div>
        </div>
        <div v-show="showDialog" class="v-model"></div>
    </div>
</template>
<script>
    import  api from '../../api'
    import  util from '../../common/js/util'
    import  upload from './upload'
    export default {
        data(){
            return {
                images: [],
                allImages: [],
                showDialog: false,
                keydownCtrl:false,
                showUpload:false,
                showFileList:false,
                uploads:[],
                preSelected:-1,
                perimeter:50*2*Math.PI

            }
        },
        props: {
            value:String,
            action: {
                type: String,
                default:'http://127.0.0.1:3000/v1/file/upload'
            },
            multiple:Boolean
        },
        methods: {
            cancalDialog: function () {
                this.clear();
            },
            check:function (index) {
                    this.allImages[index].checked=!this.allImages[index].checked;
                    if(this.preSelected!=-1 && this.preSelected!=index && !this.multiple){
                        this.allImages[this.preSelected].checked=false;
                    }
                this.preSelected=index;

            },
            selectImages:function () {
                this.images=[];
                this.allImages.map(item =>{
                    if(item.checked){
                        this.images.push(item.url);
                    }
                    item.checked=false;
                });
                this.showDialog = false;
                this.preSelected=-1;
                this.handleEmitChange();
            },
            showDialogE:function () {
                this.showDialog=true;
                if(this.allImages.length==0){
                    let _this =this;
                    api.getImages().then(files => {
                        files.map( file =>{
                            let imageInfo={
                                url:file,
                                checked:false,
                                status:'uploaded'
                            };
                            _this.allImages.push(imageInfo);
                        })
                    })
                }
            },
            deleteSelect:function (index) {
                this.images.splice(index,1);
                this.handleEmitChange();
            },
            onSuccess:function (res,file) {
                util.deleteByArray('name',file.name,this.uploads);
              this.allImages.unshift({
                  url:res.path,
                  checked:false,
              })
            },
            onProgress:function (event, file) {
                var index=util.getIndexForArray('name',file.name,this.uploads);
                if(index>-1){
                    this.uploads[index].percentage=event.percent/100*this.perimeter+' '+this.perimeter*(100-event.percent)/100;
                }
            },
            onError:function (err, file) {
                util.deleteByArray('name',file.name,this.uploads);
                this.$message.error(file.name+'上传失败：'+err.message)
            },
            handleClick:function () {
                this.$refs.uploadInput.click();
            },
            handleChange:function (event) {
                let _this=this;
                const files = event.target.files;
                if (!files) return;
                let postFiles = Array.prototype.slice.call(files);
                if (!this.multiple) { postFiles = postFiles.slice(0, 1); }
                let uploadFiles=[];
                postFiles.map(file =>{
                   if(util.getIndexForArray('name',file.name,this.uploads)==-1) {
                       const isLt2M = file.size / 1024 / 1024 < 2;
                       if(isLt2M){
                           uploadFiles.push(file);
                           _this.uploads.push({name:file.name,percentage:0});
                       }else {
                           this.$message.error(file.name+"超过2M不能上传");
                       }
                   }
                });
                upload(uploadFiles,{
                    action:this.action,
                    onSuccess:this.onSuccess,
                    onProgress:this.onProgress,
                    onError:this.onError,
                    onStart:this.onStart
                })
            },
            handleEmitChange:function () {
                this.$emit('input', this.images.join(','));
            },
            clear: function () {
                this.allImages.map(item => {
                    item.checked = false;
                });
                this.showDialog = false;
                this.preSelected=-1;
            }
        },
        created(){
            if(this.value && this.value.length>0){
                this.images=this.value.split(',');
            }
        }
    }
</script>
