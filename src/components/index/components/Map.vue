<template>
  <div id="map">

  </div>
</template>

<script>
import Cesium from 'cesium/Cesium'
export default {
  props: ['mapData'],
  data () {
    return {
      tileset:'',
    }
  },
  watch: {
     mapData () {
      for(var key of this.mapData.list[0].nodes) {
        this.main_initCesium(key.url3d)
      }
    }
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
    main_initCesium (url3d) {
      var url3d = url3d || "/3DTile/jz/dx/tileset.json"
      var tileset = new Cesium.Cesium3DTileset({
        url: this.resorceIp +'/static'+ url3d,
        maximumScreenSpaceError: 2,        //最大的屏幕空间误差
        maximumNumberOfLoadedTiles: 10000,  //最大加载瓦片个数
        //modelMatrix: m //形状矩阵
        skipLevelOfDetail : true, //开启跳级加载
        maximumMemoryUsage : 2000, //最大内存占用
        dynamicScreenSpaceError:true,//优化选项。tileset是否应根据动态屏幕空间错误进行优化。较远的瓷砖将以比较近的瓷砖更低的细节呈现。这可以通过渲染更少的图块并减少请求来提高性能，但可能会导致距离中图块的视觉质量略有下降。该算法偏向于“街景”，其中摄像机靠近拼块的地平面并且看着地平线。此外，对于紧密拟合边界体积（如框和区域），结果更准确。
        immediatelyLoadDesiredLevelOfDetail:true,//如果skipLevelOfDetail是true，则只会下载满足最大屏幕空间错误的切片。忽略跳过因子，只加载所需的切片。
      });
      
      this.viewer.camera.cancelFlight();

      this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10;//最小变焦距离
      // this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 500;//最大变焦距离
      this.viewer.scene.primitives.add(tileset);
      //		触发事件以指示已加载满足此帧的屏幕空间错误的所有切片。加载初始视图中的所有切片时，将触发此事件一次。
      //		渲染场景后，在帧结束时触发此事件。
      // this.viewer.zoomTo(tileset);
      tileset.readyPromise.then( ()=>{
        /****tileset偏移位置****/
        switch(url3d) {
          case "/3DTile/jz/dx/tileset.json":
            this.main_offset(120.6886555,30.7629445,-24.977567649375775,tileset);
            break;
          case "/3DTile/jz/jz_1/tileset.json":
            this.main_offset(120.688790659505313+0.00018,30.763821178331963+0.000003,13.401983110120583,tileset);
            break
          case "/3DTile/jz/jz_2/tileset.json":
            this.main_offset(120.68824479738629+0.000045,30.763414551396263+0.000003,9.164029019262407,tileset);
            break
          case "/3DTile/jz/jz_3/tileset.json":
            this.main_offset(120.68764826045478+0.00010765,30.76292826268966+0.000002,39.60434010538359,tileset);
            break
          case "/3DTile/jz/jz_4/tileset.json":
            this.main_offset(120.68833049586982+0.000035,30.76291747719387+0.000001,7.23092994018476,tileset);
            break
          case "/3DTile/jz/jz_5/tileset.json":
            this.main_offset(120.6890953461709-0.000047,30.763354713340124+0.0000025,35.11112830907322,tileset);
            console.log(22222);
            break
          case "/3DTile/jz/jz_6/tileset.json":
            this.main_offset(120.68933281285905-0.000075,30.762965861130393+0.000001,7.525461668943948,tileset);
            break
          case "/3DTile/jz/jz_7/tileset.json":
            this.main_offset(120.68839482939352+0.0000275,30.762476746017267,6.584908985075351,tileset);
            break
          case "/3DTile/jz/jz_8/tileset.json":
            this.main_offset(120.68903926611709-0.000041,30.76248595433999+0.0000014,34.784345123467396,tileset);
            break
          case "/3DTile/jz/jz_9/tileset.json":
            this.main_offset(120.688949839387-0.00003,30.762022325973998,4.965175986596904,tileset);
            break
          default:
            break
        }
        this.viewer.zoomTo(tileset);
      });
    }
  },
  mounted () {
    var url_earth = this.resorceIp +'/static'+ "/earth_tms"
    var url_local = this.resorceIp +'/static'+ "/jxftc_tms"
    var wgs84 = new Cesium.GeographicTilingScheme({ellipsoid: Cesium.Ellipsoid.WGS84});
    this.viewer = new Cesium.Viewer('map',{
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
    this.viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: url_local+"/{z}/{x}/{y}.jpg",
        credit: "mapname",
        tilingScheme: wgs84,// tilingScheme: mercator
        minimumLevel: 0,
        maximumLevel: 19,
        rectangle : Cesium.Rectangle.fromDegrees(120.68552222222222,  30.760638888888888, 120.69093611111111,  30.764583333333334)
      })
    );
    this.viewer.scene.sun.destroy(); //去掉太阳
    this.viewer.scene.sun = undefined; //去掉太阳
    this.viewer.scene.moon.destroy(); //去掉月亮
    this.viewer.scene.moon = undefined; //去掉月亮
    // this.viewer.scene.globe.show = false;//地球的显示隐藏
    this.viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
    this.viewer._cesiumWidget._creditContainer.style.display="none";//隐藏版权信息
    this.main_initCesium()
  },
}
</script>
<style lang="stylus" scoped>
  #map {
    width 100vw
    height 100vh
  }
</style>