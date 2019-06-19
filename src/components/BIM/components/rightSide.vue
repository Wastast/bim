<template>
  <div class="right-side">
    <el-tree
      :data="data"
      node-key="id"
      v-loading="loading"
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
import { mapState,mapMutations } from 'vuex';
import { EventBus } from 'js/event-bus';
import CesiumMap from 'js/map.js';
import {mapid} from 'js/equipment.js';
export default {
  data() {
    return {
      data: [],
      loading: true
    };
  },
  watch: {
  },
  computed: {
    ...mapState(['titlestArr','isBuildOrFloor'])
  },
  methods: {
    // 初始化楼层数据
    initData (value) {
      this.data = [];
      let arr = [];
      for (let key of value.list) {
        let {name,id,url3d,center,code,mainView,play,range,offset} = key
        let obj = {label:name,id,url3d,center,code,mainView,play,range,offset}
        arr.push(obj);
      }
      this.data = arr;
      var datas = this.deconstructionValue(value.list[0].nodes)
      arr.push(...datas)
      this.data = arr
      this.loading = false
    },
    // 树形控件点击事件
    handelClick (item,node) {
      if(item.offset) {  // 点击的是否是楼层
        if (item.label == '未来科技城' && this.isBuildOrFloor != 'build') {
          this.setIsBuildOrFloor('build');
          EventBus.$emit("initMainBuild", {})
          this.setnowBuild(this.data[0])
        }
        if(item.laber != '未来科技城') {
          if(this.isBuildOrFloor == 'build') {
            // 判断是否扩展
            if(node.childNodes.length>0 && !node.expanded) {
              let id = item.id;
              CesiumMap.flyMain(item.mainView)
            }
            // 判断不具备楼层的大楼
            if (node.childNodes.length==0) {
              let id = item.id;
              CesiumMap.flyMain(item.mainView)
            }
          }
        }
      }else{
        if(this.isBuildOrFloor != 'floor') {
          this.setIsBuildOrFloor('floor');
          EventBus.$emit("initMainFloor", {});
        }
        this.setnowBuild(item)
        EventBus.$emit("tabFloor", {item});
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
      if(this.isBuildOrFloor == 'build' && item.label != '未来科技城') {
        var coordinate = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, (JSON.parse(item.center)))
        if(coordinate) {
          EventBus.$emit("popCoordinate", {coordinate,item});
        }
        if(item.offset) {
          for(let key of titlestArr) {
            if(key.url) {
              if (key.url.indexOf(item.url3d) != -1) {
                tileset = key
                CesiumMap.changeTilestColor(key,'rgb(160, 197, 232)')
              }
            }
          }
        }
      }
    },
    // 移出模型取消变色
    mouseTilestCloseColor (item) {
      if(tileset) {
        EventBus.$emit("popCoordinate", {coordinate:null});
        tileset.style = null
        tileset = null
      }
    },
    ...mapMutations(['setnowBuild','setIsBuildOrFloor'])
  },
  mounted () {
    this.axios.get(this.reqIp + '/manage/dimTourBasArea/getArea').then(data => {
      if (data.data.obj) {
        this.initData(data.data.obj)
      }else{
        console.log('数据为空');
      }
    })
  },
}
</script>

<style lang="stylus" scoped>
.right-side >>> .el-loading-mask {
  rgba(255,255,255,1);
}
.right-side
  position absolute
  top:40px
  bottom :0
  left : 0
  padding-top: 20px
  width 200px
  background #fff
  z-index 10
</style>

