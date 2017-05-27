<style scoped lang="scss">
        .el-editor{
            display: inline-block;
            width: 100%;
        }
</style>
<template>
    <div ref="editor" class="el-editor"></div>

</template>
<script>
    import './ueditor.config'
    import './ueditor.all.min'
    import './zh-cn'
    export default {
        data(){
            return{
                id:new Date().getTime()+'ueditorId',
                isReady:false
            }
        },
        props:{
            value:String,
            config:{
                type:Object,
                required: false,
                default(){
                    return {}
                }
            },
            content:String
        },
        watch:{
            value:function (val,oldVal) {
                if (this.isReady && val !== null && !this.editor.isFocus()) {
                    this.editor.setContent(val);
                    console.log('aa')
                }
            },
            content:function (val) {
                if (this.isReady) {
                    this.editor.setContent(val);
                }
            }
        },
        mounted() {
            this.$nextTick(function f1() {
                // 保证 this.$el 已经插入文档

                this.$refs.editor.id = this.id;
                if(!this.editor)this.editor = UE.getEditor(this.id, this.config);

                this.editor.ready(function f2() {
                    this.isReady=true;
                    this.editor.setContent(this.value);

                    this.editor.addListener("contentChange", function () {
                        const content = this.editor.getContent();
                        this.$emit('input', content);
                    }.bind(this));

                    this.$emit('ready', this.editor);
                }.bind(this));
            });
        },
    }
</script>
