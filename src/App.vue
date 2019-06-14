<template>
  <div id="app">
    <!-- <index-map :mapData="mapData"></index-map> -->
    <router-view/>
  </div>
</template>

<script>
import IndexMap from './components/index/components/Map';
export default {
  name: 'App',
  data () {
    return {
      mapData: '',
    }
  },
  components: {
    IndexMap
  },
  mounted () {
    this.axios.get(this.reqIp + '/manage/dimTourBasArea/getArea').then(data => {
      if (data.data.obj) {
        this.mapData = data.data.obj
      }else{
        console.log('数据为空');
      }
    })
  }
}
</script>

<style lang="stylus">
  #app {
    position absolute
    top:0
    left: 0
  }
  // .el-tree-node__content {
  //   height 30px
  // }
</style>
