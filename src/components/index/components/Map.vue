<template>
  <div class="map">
    <div id="map">

    </div>
    <div class="mark" v-if="false">
      <el-progress type="dashboard" :percentage="percentage" :color="colors"></el-progress>
    </div>
  </div>
</template>

<script>
var isBuildOrFloor = 'build'
// import Cesium from 'cesium/Cesium'
// import 'cesium/Widgets/widgets.css'
import { EventBus } from "js/event-bus.js"
import { mapState } from 'vuex';
export default {
  props: ['mapData'],
  data () {
    return {
      percentage: 0,
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ]
    }
  },
  watch:{
    nowBuild () {
      if(!this.nowBuild.offset){
        if(isBuildOrFloor != 'floor') {
          isBuildOrFloor = 'floor'
          this.init_floor()
        }
        this.main_initFloor(this.nowBuild)
      }else{
        if (isBuildOrFloor != 'build') {
          isBuildOrFloor = 'build'
          viewer.destroy()
          this.init_NineBuilds()
        }
      }
    }
  },
  computed: {
    ...mapState(['nowBuild'])
  },
  methods: {
    main_offset(lon,lat,height,tileset){//位置偏移
      var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(0)));
      var rotationY = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(0)));
      var rotationZ = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(0)));
      var position = Cesium.Cartesian3.fromDegrees(lon,lat,height);
      var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      Cesium.Matrix4.multiply(mat, rotationX, mat);
      Cesium.Matrix4.multiply(mat, rotationY, mat);
      Cesium.Matrix4.multiply(mat, rotationZ, mat);
      tileset._root.transform = mat;
    },
    main_initBuild (url3d,mapId,offset) {
      var url3d = url3d || "/3DTile/jz/dx/tileset.json"
      var mapId = mapId || "30fe9d0f506849349e6b20f685b69dfb"
      var offset = offset || '{"lon":120.6886555,"lat":30.7629445,"height":-24.977567649375775}'
      var tileset = new Cesium.Cesium3DTileset({
        url: this.resorceIp +'/static'+ url3d,
        maximumScreenSpaceError: 2,        //最大的屏幕空间误差
        maximumNumberOfLoadedTiles: 10000,  //最大加载瓦片个数
        skipLevelOfDetail : true, //开启跳级加载
        maximumMemoryUsage : 2000, //最大内存占用
        dynamicScreenSpaceError:true,//优化选项。tileset是否应根据动态屏幕空间错误进行优化。较远的瓷砖将以比较近的瓷砖更低的细节呈现。这可以通过渲染更少的图块并减少请求来提高性能，但可能会导致距离中图块的视觉质量略有下降。该算法偏向于“街景”，其中摄像机靠近拼块的地平面并且看着地平线。此外，对于紧密拟合边界体积（如框和区域），结果更准确。
        immediatelyLoadDesiredLevelOfDetail:true,//如果skipLevelOfDetail是true，则只会下载满足最大屏幕空间错误的切片。忽略跳过因子，只加载所需的切片。
      });

      viewer.camera.cancelFlight();

      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10;//最小变焦距离
      // this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 500;//最大变焦距离
      viewer.scene.primitives.add(tileset);
      // viewer.zoomTo(tileset)
      //		触发事件以指示已加载满足此帧的屏幕空间错误的所有切片。加载初始视图中的所有切片时，将触发此事件一次。
      //		渲染场景后，在帧结束时触发此事件。
      tileset.readyPromise.then( ()=>{
        let {lon,lat,height} = JSON.parse(offset)
        /****tileset偏移位置****/
        this.main_offset(lon,lat,height,tileset);
      });
    },
    main_initFloor (item) {
      let {url3d,mainView} = item
      var tileset = new Cesium.Cesium3DTileset({
        url: this.resorceIp +'/static'+ url3d,
        maximumScreenSpaceError: 2,        //最大的屏幕空间误差
        maximumNumberOfLoadedTiles: 10000,  //最大加载瓦片个数
        skipLevelOfDetail : true, //开启跳级加载
        maximumMemoryUsage : 2000, //最大内存占用
        dynamicScreenSpaceError:true,//优化选项。tileset是否应根据动态屏幕空间错误进行优化。较远的瓷砖将以比较近的瓷砖更低的细节呈现。这可以通过渲染更少的图块并减少请求来提高性能，但可能会导致距离中图块的视觉质量略有下降。该算法偏向于“街景”，其中摄像机靠近拼块的地平面并且看着地平线。此外，对于紧密拟合边界体积（如框和区域），结果更准确。
        immediatelyLoadDesiredLevelOfDetail:true,//如果skipLevelOfDetail是true，则只会下载满足最大屏幕空间错误的切片。忽略跳过因子，只加载所需的切片。
      });
      viewer.camera.cancelFlight();

      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10;//最小变焦距离
      // this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 500;//最大变焦距离
      viewer.scene.primitives.add(tileset);
      viewer.zoomTo(tileset)
      tileset.readyPromise.then( ()=>{
        flyMain(item)
      });
    },
    flyMain (item) {
      let {lon,lat,height,heading,pitch} = JSON.parse(item.mainView)
      let point = Cesium.Cartesian3.fromDegrees(lon, lat, height);
			viewer.camera.flyTo({
				destination : point,
				orientation: {
					heading : Cesium.Math.toRadians(heading), //默认值
					pitch : Cesium.Math.toRadians(pitch), // 默认值
					roll : 0.0 //默认值
				}
			});
    },
    // 初始化楼层数据
    init_mapData (data) {
      let map = data.list[0];
      this.main_initBuild(map.url3d,map.id,map.offset)
      for(var key of map.nodes) {
        this.main_initBuild(key.url3d,key.id,key.offset)
      }
      this.flyMain(map)
    },
    // 9幢楼加载
    init_NineBuilds () {
      var url_earth = this.resorceIp +'/static'+ "/earth_tms"
      var url_local = this.resorceIp +'/static'+ "/jxftc_tms"

      var wgs84 = new Cesium.GeographicTilingScheme({ellipsoid: Cesium.Ellipsoid.WGS84});
      viewer = new Cesium.Viewer('map',{
        animation:false,//动画
        baseLayerPicker:false,//图层选择器 选择要显示的地图服务和地形服务
        infoBox:false,//右侧的iframe弹窗信息
        geocoder:false,//查找工具
        homeButton:false,//视角返回出事位置
        sceneModePicker:false,//3d 2d
        navigationHelpButton:false,//导航
        timeline:false,//时间线
        fullscreenButton:false,	
        skyBox:new Cesium.SkyBox({show :false}),
        imageryProvider ://本地地球地图
          new Cesium.UrlTemplateImageryProvider({
            url: url_earth+"/{z}/{x}/{y}.jpg",
            credit: "mapname",
            tilingScheme: wgs84,// tilingScheme: mercator
            minimumLevel: 0,
            maximumLevel: 4
        }),
      });
      // /*****本地地图*****/
      viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: url_local+"/{z}/{x}/{y}.jpg",
          credit: "mapname",
          tilingScheme: wgs84,// tilingScheme: mercator
          minimumLevel: 0,
          maximumLevel: 19,
          rectangle : Cesium.Rectangle.fromDegrees(120.68552222222222,  30.760638888888888, 120.69093611111111,  30.764583333333334)
        })
      );
      viewer.scene.sun.destroy(); //去掉太阳
      viewer.scene.sun = undefined; //去掉太阳
      viewer.scene.moon.destroy(); //去掉月亮
      viewer.scene.moon = undefined; //去掉月亮
      // this.viewer.scene.globe.show = false;//地球的显示隐藏
      viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
      viewer._cesiumWidget._creditContainer.style.display="none";//隐藏版权信息
      this.axios.get(this.reqIp + '/manage/dimTourBasArea/getArea').then(data => {
        if (data.data.obj) {
          this.init_mapData(data.data.obj)
        }else{
          console.log('数据为空');
        }
      })
    },
    // 初始化楼层
    init_floor () {
      viewer.destroy()
      viewer = new Cesium.Viewer('map',{
        animation:false,//动画
        baseLayerPicker:false,//图层选择器 选择要显示的地图服务和地形服务
        infoBox:false,//右侧的iframe弹窗信息
        geocoder:false,//查找工具
        homeButton:false,//视角返回出事位置
        sceneModePicker:false,//3d 2d
        navigationHelpButton:false,//导航
        timeline:false,//时间线
        fullscreenButton:false,	
        skyBox:new Cesium.SkyBox({show :false}),
        orderIndependentTranslucency: false,//如果为true且配置支持它，请使用与顺序无关的半透明。
        contextOptions: {//Context和WebGL创建属性对应options传递给Scene。
          webgl: {
            alpha: true,
          }
        }
      });
      viewer.scene.sun.destroy(); //去掉太阳
      viewer.scene.sun = undefined; //去掉太阳
      viewer.scene.moon.destroy(); //去掉月亮
      viewer.scene.moon = undefined; //去掉月亮
      viewer.scene.globe.show = false;//地球的显示隐藏
      viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
      viewer._cesiumWidget._creditContainer.style.display="none";//隐藏版权信息
    }
  },
  mounted () {
    this.init_NineBuilds();
  },
  beforeDestroy () {
    viewer.destroy()
    viewer = null
  },
  created () {
    EventBus.$on("flyView", ({item})=>{
      this.flyMain(item)
    });
  }
}
</script>
<style lang="stylus" scoped>
.map .mark >>> .el-progress {
  left: 261px;
  top: 100px;
}
.map
  width 100vw
  height 100vh
  position relative
  #map 
    width 100%
    height 100%
  .mark
    position absolute
    top: 0
    left: 0
    z-index 9
    width 100vw
    height 100vh
    background-color red
</style>