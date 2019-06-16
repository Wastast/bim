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
      <span class="custom-tree-node" slot-scope="{ node, data }" style="display: block;width: 100%;">
        <span 
        @click="handelClick(data,node)" 
        @mouseover="mouseTilestChangeColor(data)" 
        @mouseout="mouseTilestCloseColor(data)" 
        style="display: block;line-height: 26px;"
        >{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
var tileset = 0;
import { EventBus } from "js/event-bus.js"
import { mapState,mapMutations } from 'vuex';
export default {
  props: ['mapData','mapArr'],
  data() {
    return {
      data: [],
    };
  },
  watch: {
    mapData () {
      this.initData(this.mapData)
    }
  },
  computed: {
    ...mapState(['titlestArr'])
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
      this.setnowBuild(item)
      if(item.offset) {
        if(node.childNodes.length>0 && !node.expanded) {
          let id = item.id;
          EventBus.$emit("flyView", {
            item
          });
        }
        if (node.childNodes.length==0) {
          let id = item.id;
          EventBus.$emit("flyView", {
            item
          });
        }
      }
    },
    // 处理层级递归函数
    deconstructionValue (data) {
      let arr = [];
      for (let key of data) {
        let {name,id,url3d,center,code,mainView,play,range,offset} = key
        let obj = {label:name,id,url3d,center,code,mainView,play,range,offset}
        if( key.nodes.length>0 ){
          obj.children = [...this.deconstructionValue(key.nodes)]
        } 
        arr.push(obj);
      }
      return arr;
    },
    // 移入模型变色
    mouseTilestChangeColor (item) {
      let titlestArr = viewer.scene.primitives._primitives
      if(item.offset) {
        for(let key of titlestArr) {
          if (key.url.indexOf(item.url3d) != -1) {
            tileset = key
            key.style = new Cesium.Cesium3DTileStyle({color:"rgb(127, 59, 8)"})
          }
        }
      }
    },
    // 移出模型取消变色
    mouseTilestCloseColor (item) {
      if(tileset) {
        tileset.style = null
        tileset = null
      }
    },
    ...mapMutations(['setnowBuild'])
  },
  mounted () {
  },
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

