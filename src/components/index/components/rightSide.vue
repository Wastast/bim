<template>
  <div class="right-side">
    <el-tree 
      :data="data" 
      :props="defaultProps" 
      empty-text="暂无数据"
      @node-click="handelClick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  props: ['mapData'],
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
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
        let obj = {}
        obj.label = key.name
        obj.areaId = key.id
        obj.url3d = key.url3d
        arr.push(obj);
      }
      this.data = arr;
      var datas = this.deconstructionValue(value.list[0].nodes)
      arr.push(...datas)
      this.data = arr
    },
    // 树形控件点击事件
    handelClick (item,node,event) {
      console.log(this.viewer);
      console.log(node);
    },
    // 处理层级函数
    deconstructionValue (data) {
      let arr = [];
      for (let key of data) {
        let obj = {}
        obj.label = key.name
        obj.areaId = key.id
        obj.url3d = key.url3d
        if( key.nodes.length>0 ){
          obj.children = [...this.deconstructionValue(key.nodes)]
        } 
        arr.push(obj);
      }
      return arr;
    }
  },
  mounted () {
    console.log(this.viewer);
    // this.axios.get(this.reqIp + '/manage/dimTourBasArea/getArea').then(data => {
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

