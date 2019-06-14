<template>
  <div class="right-side">
    <!-- <el-tree 
      :data="data" 
      :props="defaultProps" 
      empty-text="暂无数据"
      @node-click="handelClick"
    ></el-tree> -->
    <el-tree
      :data="data"
      node-key="id"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span @click="handelClick(data,node)" @mouseover="mouseTilestChangeColor(data)">{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  props: ['mapData'],
  data() {
    return {
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }],
    };
  },
  watch: {
    mapData () {
      this.initData(this.mapData)
    }
  },
  methods: {
    // 初始化楼层数据
    initData (value) {
      this.data = [];
      let arr = [];
      for (let key of value.list) {
        let {name,id,url3d,center,code,mainView,play,range} = key
        let obj = {label:name,id,url3d,center,code,mainView,play,range}
        arr.push(obj);
      }
      this.data = arr;
      var datas = this.deconstructionValue(value.list[0].nodes)
      arr.push(...datas)
      this.data = arr
    },
    // 树形控件点击事件
    handelClick (item,node) {
      let id = item.id;
      this.$emit('getAreaId',id)
    },
    // 处理层级递归函数
    deconstructionValue (data) {
      let arr = [];
      for (let key of data) {
        let {name,id,url3d,center,code,mainView,play,range} = key
        let obj = {label:name,id,url3d,center,code,mainView,play,range}
        if( key.nodes.length>0 ){
          obj.children = [...this.deconstructionValue(key.nodes)]
        } 
        arr.push(obj);
      }
      return arr;
    },
    // 移入模型变色
    mouseTilestChangeColor (item) {
      console.log(item);
    },

  },
  mounted () {
    // let url = this.reqIp + '/manage/dimTourBasArea/getArea'
    // this.axios.get(url).then(data => {
    //   console.log(data);
    //   if (data.data.obj) {
    //     this.initData(data.data.obj)
    //   }else{
    //     console.log('数据为空');
    //   }
    // })
  }
}
</script>

<style lang="stylus" scoped>
.right-side
  position absolute
  top:40px
  bottom :0
  left : 0
  padding-top: 20px
  width 200px
  background #fff
  z-index 9999
</style>

