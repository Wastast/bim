<template>
  <div class="sidebar">
    <el-tree 
    :data="data" 
    :props="defaultProps" 
    :default-expand-all="true" 
    empty-text="'暂无数据'"
    @node-click="handelClick"
  ></el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [{
        label: '资源信息',
        id: '2',
        children: [{
          label: '闲置空间',
        }]
      }, {
        label: '视频监控',
        children: [{
          label: '楼宇监控',
        }]
      }, {
        label: '设备信息',
        children: [{
          label: '水电表',
        }, {
          label: '消防设备',
        }]
      },{
        label: '门禁',
        children: [{
          label: '二级 3-1',
        }, {
          label: '二级 3-2',
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  methods: {
    // 树形控件点击事件
    handelClick (item) {
      if(!item.children) {
        console.log(item);
      }
    }
  },
  mounted () {
    
  } 
}
</script>

<style lang="stylus" scoped>
.sidebar >>> .el-tree-node__content {
  height 30px
}
.sidebar
  position absolute
  top: 40px
  right: 0
  bottom 0
  padding-top: 20px
  width 200px
  background #fff
  z-index 9999
</style>
