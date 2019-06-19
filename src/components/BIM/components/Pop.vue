<template>
  <div>
    <el-button :plain="true" :offset="50"></el-button>

    <div class="pop-box" v-if="coordinates" :style="{left: coordinates.x+20 +'px',top: coordinates.y-height-65 +'px'}">
      <div class="top">
        <span class="name">{{title}}</span>
        <a href="javascript:;" @click="closePop()">×</a>
      </div>
      <div class="box">
        <div class="body">
        </div>
      </div>
      <div class="bottom">
      </div>
      <div class="line">
      </div>
    </div>

    <el-button type="text"></el-button>
  </div>
  
</template>

<script>

import { EventBus } from 'js/event-bus';
import { mapState } from 'vuex';
var _cartesian;
var isShowPop = false;
export default {
  data () {
    return {
      coordinates: null,
      width: '',
      height: '',
      title: '',
    }
  },
  watch:{
    isBuildOrFloor () {
      this.closePop()
      this.MonitorEvent()
    }
  },
  computed: {
    ...mapState(['isBuildOrFloor'])
  },
  methods: {
    popPosition (coordinates) {
      this.coordinates = coordinates
      this.$nextTick(()=>{
        if(coordinates) {
          if(document.querySelector('.pop-box')) {
            this.height = document.querySelector('.pop-box').offsetHeight
            this.width = document.querySelector('.pop-box').offsetWidth
          }
        }
      })
    },
    // 获取点位数据
    getResource (objId,name) {
      this.closePop()
      let url = this.reqIp + `/manage/dimTourBas3dResource/findByIdCascade?id=${objId}&typeName=${name}`
      this.axios.get(url).then(data=>{
        let value = data.data.obj[name]
        switch(name){
          case 'video':
            this.videoHTMl(value)
            break;
          case 'light':
            this.lightHTMl(value)
            break;
          case 'watermeter':
            this.watermeterHTMl(value)
            break;
          case 'fire':
            this.fireHTML(value)
            break;
          case 'ammeter':
            this.ammeterHTML(value)
            break;
          case 'sensor':
            this.sensorHTML(value)
            break;
          case 'entranceGuard':
            this.entranceGuardHTML(value)
            break
          case 'substation':
            this.substationHTML(value)
            break
        }
      })
    },
    videoHTMl (data) {
      if(data.status == 0) {
        this.openAlert('该设备离线,无法播放')
      }else{
        let html = `<video src="${this.resorceIp + '/video/test.mp4'}" width="700" height="400" controls></video>`
        this.openBox(html,data.name)
      }
    },
    lightHTMl (data) {
      if(data.status == 0) {
        this.openAlert('该设备离线,无法查看')
      }else{
        isShowPop = true;
        let html = `<p>亮度：0.5</p>`
        this.setPOPhtml(html,data.name)
      }
    },
    watermeterHTMl (data) {
      if(data.status == 0) {
        this.openAlert('该设备离线,无法查看')
      }else{
        isShowPop = true;
        let html = `<p>设备号: abcdefg</p>
                    <p>当前度数: 105.11</p>
                    <p>近期故障数：3</p>`
        this.setPOPhtml(html,data.name)
      }
    },
    fireHTML (data) {
      if(data.status == 0) {
        this.openAlert('该设备离线,无法查看')
      }else{
        isShowPop = true;
        let html = `<p>亮度：0.5</p>`
        this.setPOPhtml(html,data.name)
      }
    },
    ammeterHTML (data) {
      if(data.status == 0) {
        this.openAlert('该设备离线,无法查看')
      }else{
        isShowPop = true;
        let html = `<p>设备号: abcdefg</p>
                    <p>当前度数: 105.11</p>
                    <p>近期故障数：3</p>`
        this.setPOPhtml(html,data.name)
      }
    },
    sensorHTML (data) {
      if(data.status == 0) {
        this.openAlert('该设备离线,无法查看')
      }else{
        isShowPop = true;
        let html = `<p>亮度：0.5</p>`
        this.setPOPhtml(html,data.name)
      }
    },
    entranceGuardHTML (data) {
      if(data.status == 0) {
        this.openAlert('该设备离线,无法查看')
      }else{
        isShowPop = true;
        let html = `<p>出入情况: 5人</p>`
        this.setPOPhtml(html,data.name)
      }
    },
    substationHTML (data) {
      if(data.status == 0) {
        this.openAlert('该设备离线,无法查看')
      }else{
        this.openAlert('数据暂无')
        // isShowPop = true;
        // let html = `<p>出入情况: 5人</p>`
        // this.setPOPhtml(html,data.name)
      }
    },
    // 关闭界面中的提示框
    closePop () {
      isShowPop = false;
      this.coordinates = null
    },
    // 打开警告提示文字
    openAlert (text) {
      this.$message(text);
    },
    // 打开弹窗传入HTML
    openBox (html,name) {
      this.$alert(html, name, {
        dangerouslyUseHTMLString: true,
        showConfirmButton: false
      });
    },
    // 设置提示框的html
    setPOPhtml (html,title) {
      setTimeout(() => {
        this.$nextTick(()=>{
          if(document.querySelector('.pop-box .box .body')){
            this.title = title
            document.querySelector('.pop-box .box .body').innerHTML = html
          }
        })
      }, 0);
    },
    // 重新监听事件
    MonitorEvent () {
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      handler.setInputAction( (CLICK) => {
        var feature = viewer.scene.pick(CLICK.position);
        if( Cesium.defined(feature) && Cesium.defined(feature.id)){
          if(feature.id._id!="point_lbl"&&feature.id._id!="point_room"){
            _cartesian =  feature.id.position._value;
            // 获取点击对象的id值
            var objId = feature.id.id;
            var name = feature.id.name;
            this.getResource(objId,name);  // 获取点位的资源信息
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK); //left_CLICK 左键点击事件
      
      viewer.scene.postRender.addEventListener(() => {
        // 通过弹出框布尔值，来判断是否进入
        if(isShowPop){
          let coordinates = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, _cartesian);
          this.popPosition(coordinates);
        }
      });
    }
  },
  mounted () {
    this.MonitorEvent()
    // var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    // handler.setInputAction( (CLICK) => {
    //   var feature = viewer.scene.pick(CLICK.position);
    //   if( Cesium.defined(feature) && Cesium.defined(feature.id)){
    //     if(feature.id._id!="point_lbl"&&feature.id._id!="point_room"){
    //       _cartesian =  feature.id.position._value;
    //       // 获取点击对象的id值
    //       var objId = feature.id.id;
    //       var name = feature.id.name;
    //       this.getResource(objId,name);  // 获取点位的资源信息
    //     }
    //   }
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK); //left_CLICK 左键点击事件
    
    // viewer.scene.postRender.addEventListener(() => {
    //   // 通过弹出框布尔值，来判断是否进入
    //   if(isShowPop){
    //     let coordinates = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, _cartesian);
    //     this.popPosition(coordinates);
    //   }
    // });
  },
  created ( ) {
    EventBus.$on("popCoordinate", ({coordinate,item}) => {
      isShowPop = false
      if(coordinate) {
        coordinate.y = coordinate.y - 50
      }
      this.popPosition(coordinate)
      if(item) {
        var html = `
          <p>楼层数量: 7楼</p>
          <p>总面积： 100m</p>
          <p>闲置面积: 100m</p>
          <p>企业数量： 10家</p>`;
        this.setPOPhtml(html,item.label) 
      }
    });
  }
}
</script>

<style lang="stylus" scoped>
.big-box >>> .el-message-box {
  width: auto; 
}
.pop-box 
  position absolute
  left: 100px
  z-index 8
  top: 100px;
  .top
    width: 100%;
    height: 60px;
    background: url('~img/head.png');
    background-size: 100% 100%;
    position: absolute;
    top: -.87rem;
    left: 0;
    .name
      position: absolute;
      bottom: 23px;
      left: 0px;
      font-size: 13px;
      right: 0;
      text-align: center;
    a
      position: absolute;
      right: 11px;
      top: 23px;
  .box
    position: relative;
    width: 150px;
    overflow: hidden;
    .body 
      width: 100%;
      margin-top: -0.38rem;
      background: url('~img/body.png');
      background-size: 100% 100%;
      overflow: hidden;
      color: #fff
      padding-top: 30px;
      padding-left: 20px;
      box-sizing: border-box;
      line-height 20px
  .bottom 
    width: 100%;
    height: 40px;
    background: url('~img/bottom.png');
    background-size: 100% 100%;
    position absolute
    bottom: -0.45rem
    left: 0;
  .line 
    width: 40px;
    height: 65px;
    background: url('~img/line.png');
    background-size: contain;
    position: absolute;
    bottom: -1.4rem;
    left: -0.5rem;
.big-box
  position absolute
  top: 30%
  left: 30%
  width 700px
  height 400px
  z-index: 99
</style>
