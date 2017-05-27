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
        <div>
            <el-form :model="custom" :rules="rules">
                <el-form-item prop="title" label="标题">
                    <el-input v-model="custom.title"></el-input>
                </el-form-item>
            </el-form>
            <el-table :data="custom.fields" :expand-row-keys="expandKeys" :row-key="rowKey" @expand="expand">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form class="leftForm" label-position="left" label-width="100px">
                            <el-form-item label="名称" required>
                                <el-input type="text" v-model="props.row.name"></el-input>
                            </el-form-item>
                            <el-form-item label="别名" required>
                                <el-input type="text" v-model="props.row.key"></el-input>
                            </el-form-item>
                            <el-form-item label="类型" prop="type" required>
                                <el-select v-model="props.row.type">
                                    <el-option v-for="item in fieldTypes":label="item.label" :value="item.value" :key="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-show="props.row.type=='select' || props.row.type=='selects'" label="选项：输入选项，每行一个
                                        如果需要更多控制，你按照一下格式，定义一个值和标签对：
                                        red : Red
                                        blue : Blue" required>
                                <el-input  type="textarea"
                                           :autosize="{minRows:4}" v-model="props.row.select"></el-input>
                            </el-form-item>
                            <el-form-item label="描述">
                                <el-input v-model="props.row.description" type="text"></el-input>
                            </el-form-item>
                            <el-form-item label="必填">
                                <el-switch v-model="props.row.required" on-text="" off-text=""></el-switch>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="字段名">

                </el-table-column>
                <el-table-column prop="key" label="别名">

                </el-table-column>
                <el-table-column prop="type" label="类型">

                </el-table-column>
            </el-table>
            <div style="overflow: hidden">
                <el-button class="pull-right" type="primary" @click="addField">添加字段</el-button>
            </div>
            <el-form :model="custom" :rules="rules">
                <el-form-item label="显示此字段组的文章分类" prop="category">
                    <el-select v-model="custom.category">
                        <el-option
                                v-for="item in categories"
                                :key="item.id"
                                :value="item.id"
                                :label="item.name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="commit" type="primary">{{custom.id?'跟新':'发布'}}</el-button>
                </el-form-item>
            </el-form>
        </div>

</template>
<script>
    import api from  '../api'
    export default {
        data(){
            return {
                custom:{
                    fields:[],
                    category:'',
                    title:'',
                },
                expandKeys:[-1],
                rowKey:function (row) {
                  return row.rowIndex;
                },
                fieldTypes:[
                    {
                        label:'文本',
                        value:'text'
                    },
                    {
                        label:'文本段',
                        value:'textarea'
                    },
                    {
                        label:'选择',
                        value:'select'
                    },
                    {
                        label:'多项选择',
                        value:'selects'
                    },
                    {
                        label:'真/假',
                        value:"switch"
                    },
                    {
                        label:'图片',
                        value:'image'
                    },
                    {
                        label:'图片画廊',
                        value:'gallery'
                    }
                ],
                rules:{
                    title:{required:true,message:'标题不能为空'},
                    category:{required:true,message:'显示规则不能为空'}
                },
            }
        },
        methods:{
              optionChange:function () {
                  console.log("aa")
              },
            addField:function () {
                  this.expandKeys.push(this.custom.fields.length);
                this.custom.fields.push({
                    name:"",
                    key:'',
                    type:'text',
                    required:false,
                    description:'',
                    selections:[],
                    select:'',
                    rowIndex:this.custom.fields.length
                });

            },
            expand:function (row,expanded) {
                if(!expanded && this.expandKeys.indexOf(row.rowIndex)>-1){
                    this.expandKeys.splice(this.expandKeys.indexOf(row.rowIndex),1)
                }
            },
            commit:function () {
                if(this.custom.category && this.custom.title){
                    let _this=this;
                    for(let i=0;i<this.custom.fields.length;i++){
                        let field=_this.custom.fields[i];
                        if(!field.name || !field.key || !field.type){
                            this.custom.fields.splice(i,1);
                        }
                        field.selections=[];
                        if(field.select){
                            let oArr=field.select.split('\n');
                            oArr.map(function (option) {
                                let optionArr=option.split(':');
                                if(optionArr.length==2)field.selections.push({value:optionArr[1],name:optionArr[0]})
                            })
                        }
                    }
                    api.postCustom(this.custom).then(function (res) {
                        _this.$router.replace({path:'/custom/edit/'+res.id});
                    })
                }
            }
        },
        created(){
            if (this.$route.params && this.$route.params.id) {
                let _this = this;
                api.getCustom(this.$route.params.id).then(data => {
                    _this.custom = data;
                })
            }
        },
        computed:{
            categories() {
                return this.$store.state.categories;
            }
        },

    }
</script>
