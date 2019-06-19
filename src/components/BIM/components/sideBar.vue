<template>
  <div class="sidebar">
    <el-tree 
    :data="data" 
    :props="defaultProps" 
    :default-expand-all="true" 
    empty-text="'暂无数据'"
    @node-click="handelClick"
  ></el-tree>

  <transition name="slide-fade">
    <div class="valueSide" v-if="show">
      <div class="title">
        <h4>{{title}}</h4>
        <a href="javascript:;" @click="handleHideOrShow()">×</a>
      </div>
      <ul class="list" v-show="equipmentArr">
        <li class="item" v-for="item of equipmentArr" :key="item.id" @click="getPoint(item.id)">
          <div class="img-box">
            <img :src="'http://192.168.8.111:8080/bim' + '/upload' + item.icon" alt="">
          </div>
          <span class="i-text">{{ item.name }}({{item.statusName}})</span>
        </li>
      </ul>
      <h2 v-show="!equipmentArr" class="notValue">暂无数据</h2>
    </div>
  </transition>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import CesiumMap from 'js/map.js';
export default {
  props:['areaId'],
  data() {
    return {
      data: [{
        label: '楼宇监控',
        typeName: 'video'
      },{
        label: '水表',
        typeName: 'watermeter'
      },{
        label: '消防设备',
        typeName: 'fire'
      },{
        label: '电表',
        typeName: 'ammeter'
      },{
        label: '水浸',
        typeName: 'sensor'
      },{
        label: '照明',
        typeName: 'light'
      },{
        label: '变电房',
        typeName: 'substation'
      },{
        label: '门禁',
        typeName: 'entranceGuard'
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      equipmentArr: [],
      show: false,
      title: '',
    };
  },
  computed: {
    ...mapState(['nowBuild'])
  },
  watch: {
    nowBuild () {
      viewer.entities.removeAll();//清空所有实体
      this.show = false
    }
  },
  methods: {
    // 树形控件点击事件
    handelClick (item) {
      if(!item.children) {
        this.title = item.label
        this.equipment(item.typeName)
      }
    },
    // 请求设备资源数据
    equipment (typeName) {
      let url = this.reqIp + `/manage/dimTourBas3dResource/findPointByPageCascade?areaId=${this.nowBuild.id}&typeName=${typeName}`
      this.axios.get(url).then(data => {
        if(data.data.res) {
          this.equipmentArr = data.data.obj[typeName]
          this.show = true
        }else{
          
        }
      })
    },
    handleHideOrShow () {
      this.show = false
    },

    getPoint (id) {
      CesiumMap.addSelectBox(id)
      viewer.flyTo(viewer.entities.getById(id))
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
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.sidebar
  position absolute
  top: 40px
  right: 0
  bottom 0
  padding-top: 20px
  width 200px
  background #fff
  z-index 10
  filter: drop-shadow(0 0 5px rgba(0,0,0,0.3));
  .valueSide
    position absolute
    top:0
    left: -201px
    width 200px
    bottom: 0
    background #ffff
    .title
      position relative
      line-height: 40px;
      text-align: center;
      border-bottom: 1px solid rgba(51,51,51,.2);
      a
        position absolute
        top: 0
        right 10px 
    .list
      .item
        height 40px
        position relative
        overflow hidden
        cursor pointer
        &:before
          content: '';
          position: absolute;
          height: 1px;
          width: 90%;
          background: rgba(51,51,51,.2);
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        &:hover
          background-color rgba(51,51,51,.1);
        .img-box
          margin-top: 5px;
          margin-left: 10px;
          width: 30px;
          height: 30px;
        .i-text
          position: absolute;
          top: 0;
          line-height: 40px;
          left: 48px;
          width: 145px;
    .notValue
      line-height 40px
      text-align center
</style>
