<template>
  <div class="map">
    <div id="map">

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CesiumNavigation from "cesium-navigation-es6"
import { EventBus } from 'js/event-bus';
import CesiumMap from 'js/map.js';

export default {
  props: ['mapData'],
  data () {
    return {
    }
  },
  watch:{
  },
  computed: {
    ...mapState(['nowBuild'])
  },
  methods: {
    // 显示楼层
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
      //		触发事件以指示已加载满足此帧的屏幕空间错误的所有切片。加载初始视图中的所有切片时，将触发此事件一次。
      //		渲染场景后，在帧结束时触发此事件。
      tileset.readyPromise.then( ()=>{
        /****tileset偏移位置****/
        CesiumMap.main_offset(offset,tileset);
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

      // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10;//最小变焦距离
      // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 500;//最大变焦距离
      viewer.scene.primitives.add(tileset);
      // viewer.zoomTo(tileset)
      tileset.readyPromise.then( ()=>{
        CesiumMap.flyMain(item.mainView)
      });
    },

    // 初始化楼层数据
    init_mapData (data) {
      let map = data.list[0];
      this.main_initBuild(map.url3d,map.id,map.offset)
      for(var key of map.nodes) {
        this.main_initBuild(key.url3d,key.id,key.offset)
      }
      // 飞入主视角
      CesiumMap.flyMain(map.mainView)
    },

    // 9幢楼加载
    init_NineBuilds () {
      if(viewer) {
        viewer.destroy()
      }
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
        fullscreenButton:false,	//  全屏按钮
        skyBox:new Cesium.SkyBox({show :false}),
        // shadows:true,  // 阴影
        // terrainShadows:Cesium.ShadowMode.RECEIVE_ONLY,  // 
        imageryProvider ://本地地球地图
          new Cesium.UrlTemplateImageryProvider({
            url: url_earth+"/{z}/{x}/{y}.jpg",
            credit: "mapname",
            tilingScheme: wgs84,// tilingScheme: mercator
            minimumLevel: 0,
            maximumLevel: 4
        }),
      });
      /*****本地地图*****/
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

      // 改变操作模式
      CesiumMap.changeOperational(0,600)
      this.axios.get(this.reqIp + '/manage/dimTourBasArea/getArea').then(data => {
        if (data.data.obj) {
          this.init_mapData(data.data.obj)
        }else{
          console.log('数据为空');
        }
      })
      this.getPoint('30fe9d0f506849349e6b20f685b69dfb')
      this.compass()
    },
    // 初始化楼层
    init_floor () {
      if(viewer) {
        viewer.destroy()
      }
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
      // 改变操作模式
      CesiumMap.changeOperational(0,600)
      this.compass()
    },
    // 指南针
    compass () {
      var options = {};
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass= true;
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls= true;
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend= false;
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing= false;
      CesiumNavigation(viewer, options);
    },
    getPoint (id) {
      let url = this.reqIp + `/manage/dimTourBas3dResource/findPointByPageCascade?areaId=${id}`
      this.axios.get(url).then(data => {
        var data = data.data
        if(data.res==1) {
          // 循环数据描绘点位
          for(var key in data.obj) {
            if(data.obj[key]!= null && data.obj[key].length>0) {
              var item = data.obj[key];
              item.forEach( e =>{
                this.point_drawPoint(e,key);
              });
            }
          }
        }else{
          alert('获取数据失败');
        }
      })
    },
    point_drawPoint(resource,type){
      let billboardGraphics = new Cesium.BillboardGraphics({
        image : this.resorceIp + "/static/upload"+resource.icon, //属性指定的图像、URI或帆布用于广告牌。
        show : true, // 一个布尔属性指定广告牌的可见性。
        pixelOffset : new Cesium.Cartesian2(0,0), // 一个Cartesian2属性指定像素偏移量。
        eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0), //一个Cartesian3属性指定偏移量。
        horizontalOrigin : Cesium.HorizontalOrigin.CENTER, //一个属性指定HorizontalOrigin。
        verticalOrigin : Cesium.VerticalOrigin.CENTER, //一个属性指定VerticalOrigin。
        scale : 1.0, //一个数值属性指定适用于图像大小的规模。
        color : Cesium.Color.WHITE, //属性指定色彩Color的形象。
        //rotation : Cesium.Math.PI, //一个数值属性指定关于alignedAxis旋转。
        alignedAxis : Cesium.Cartesian3.ZERO, //一个Cartesian3属性指定单位向量旋转轴。
        width : parseFloat(resource.iconWidth), // default: undefined
        height : parseFloat(resource.iconHeight), // default: undefined
        sizeInMeters:true//是否以米为单位 如果以米
      });//广告牌
      let html = '';
      let entity = viewer.entities.add({
        id:	resource.id,
        name : type,
        position: {
          x:resource.x,y:resource.y,z:resource.z
        },//Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883,3000), 位置
        billboard: billboardGraphics,
        description:html
      });
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
    EventBus.$on("initMainBuild", ({item})=>{
      this.init_NineBuilds()
    });

    EventBus.$on("initMainFloor", ({item})=>{
      this.init_floor()
    });

    EventBus.$on("tabFloor", ({item})=>{
      this.main_initFloor(item)
      this.getPoint(item.id)
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