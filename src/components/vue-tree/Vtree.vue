<style scoped lang="scss">
    .tree-node { /* 普通节点 */
        display: list-item;
        list-style: none;
        font-size: 14px;
    }
    .tree-node.empty-node { /* 空节点 */
        height: .5em;
        list-style-type: none;
    }
    .tree-node-children { /* 层次缩进 */
        margin-left: 2em;
    }
    .menu-bar{
        border: 1px solid #ddd;
        cursor: move;
        background: #F5F5F5;
        padding: 10px 15px;
    }
    .menu-content{
        padding: 10px 0 10px 10px;
        position: relative;
        z-index: 10;
        border: 1px solid #e5e5e5;
        display: flex;
        .menu-tag{
            flex: 1;
            margin: 0 15px;
        }
        .menu-delete{
            margin-right: 10px;
        }
    }
    .menu-bar.drag-bg{
        background: #20A0FF;
    }
    .tree-node.empty-node.drag-bg{
        background: #20A0FF;
    }
</style>
<template>
    <div class="tree-node"  :class="{ 'empty-node': !node.name,'drag-bg':Draging }"
         :draggable="!!node.name && node.name!='菜单结构'"
         @dragover.prevent
         @dragstart.stop="handleDragStart"
         @drop.stop="handleDrop"
         @dragenter.stop="handleDragEnter"
         @dragleave.stop="handleDragLeave"
         @dragend.prevent="handleDragEnd">
        <div class="menu-bar" :class="{'drag-bg':Draging}" v-if="!!node.name">
            <span>{{node.name}}</span>
            <span class="pull-right">{{node.type}}</span>
        </div>
        <div class="menu-content" v-if="!!node.name && node.name!=='菜单结构'"  draggable="false">
            <label style="line-height: 36px">导航标签</label>
            <el-input type="text" v-model="node.name" class="menu-tag"></el-input>
            <el-button size="mini" class="menu-delete" @click="deleteMenu">移除除</el-button>
        </div>
        <div class="tree-node-children">
            <tree-node v-for="(child , $index) in children" :key="child.key"
                       :vm="vm" :node="child" :idx="$index" @changeVm="handleChangeVm">
            </tree-node>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                Draging:false
            }
        },
        name: 'tree-node', // 递归组件需指明 name
        props: {
            vm: { twoWay: true }, // 正在拖动的节点实例（TreeNode 组件通用，须双向绑定）
            node: Object, // 节点数据，形如 { name: 'xxx', children: [] }
            idx: Number, // v-for 的索引，用于相邻节点的判别
        },
        computed: {
            children () { // 为每个子节点前后都生成空节点，便于实现兄弟节点间的“插入排序”
                // 举例：原本是 [N1, N2, N3]
                let { children } = this.node;
                if (!children || !children.length) return [];

                let _children = [];
                children.forEach(child => _children.push({}, child));
                _children.push({});

                // 最后生成 [E1, N1, E2, N2, E3, N3, E4]（其中 N 表示节点，E 表示空节点）
                return _children;
            },
            isParent () { // 拖放限制 1：判断“我”是否为被拖动节点的父节点
                return this === this.vm.$parent;

            },
            isNextToMe () { // 拖放限制 2：判断“我”是否为被拖动节点的相邻节点
                return this.$parent === this.vm.$parent && Math.abs(this.idx - this.vm.idx) === 1;
            },
            isMeOrMyAncestor () { // 拖放限制 3：判断被拖动节点是否为“我”自身或“我”的祖先
                let p = this;
                while (p) {
                    if (this.vm === p) return true;
                    p = p.$parent
                }
            },
            isAllowToDrop () { // 上述拖放限制条件的综合
                return !(this.isParent || this.isNextToMe || this.isMeOrMyAncestor);
            }
        },
        methods: {
            deleteMenu(){
                this.$parent.node.children.remove(this.node);
            },
            clearBgColor () { // 清理样式
                this.Draging=false;
            },
            handleDragStart () {
                this.$emit('changeVm', this); // 设置本组件为当前正在拖动的实例，此举将同步 sync 到所有 TreeNode 实例
//                this.$el.style.backgroundColor = 'silver'
            },
            handleDrop () {
                this.clearBgColor(); // 此时 this 为目的地节点，vm 才是被拖动节点
                console.log(this.isAllowToDrop);
                if (!this.isAllowToDrop) return;

                // 无论如何都直接删除被拖动节点
                this.vm.$parent.node.children.remove(this.vm.node);

                // 情况 1：拖入空节点，成其兄弟（使用 splice 插入节点）
                if (!this.node.name)
                    return this.$parent.node.children.splice(this.idx / 2, 0, this.vm.node);

                // 情况2：拖入普通节点，成为其子
                if (!this.node.children){
                    this.$set(this.node,'children', []); // 须用 $set 引入双向绑定
                }
                this.node.children.push(this.vm.node)
            },
            handleDragEnter () { // 允许拖放才会显示样式
                if (!this.isAllowToDrop) return;
                this.Draging=true;
            },
            handleDragLeave () {
                this.clearBgColor()
            },
            handleDragEnd () {
                this.clearBgColor()
            },
            handleChangeVm(vm){
                this.$emit('changeVm', vm);
            }
        }

    }
</script>
