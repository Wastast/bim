<template>
  <div class="home">
    <index-header :titleText="'综合管控平台'"></index-header>
    <index-sideBar :areaId="areaId"></index-sideBar>
    <index-right-side :mapData='mapData' @getAreaId="setAreaId"> </index-right-side>
    <index-map :mapData='mapData'> </index-map>
  </div>
</template>

<script>
import IndexMap from './components/Map'
import IndexHeader from '../public/Header'
import IndexSideBar from './components/sideBar'
import IndexRightSide from './components/rightSide'
export default {
  data () {
    return {
      mapData: [],
      areaId: '',
    }
  },
  methods: {
    setAreaId (id) {
      this.areaId = id
    }
  },
  mounted () {
    this.axios.get(this.reqIp + '/manage/dimTourBasArea/getArea').then(data => {
      if (data.data.obj) {
        this.mapData = data.data.obj
      }else{
        console.log('数据为空');
      }
    })
  },
  components: {
    IndexMap,
    IndexSideBar,
    IndexRightSide,
    IndexHeader
  }
}
</script>

<style lang="stylus" scoped>
  .home {
    width 100vw
    height 100vh
    background-color rgba(24,29,39,1);
    position relative
  }
</style>