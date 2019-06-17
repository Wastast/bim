
class Map {
  constructor () {
  }

  /**
  * @description 改变操作模式,变为左键与右键
  * @param {number} cameraMinHeight 相机的最小高度
  * @param {number} cameraMaxHeight 相机的最大高度
  */
  changeOperational (cameraMinHeight,cameraMaxHeight) {
    /*放大*/
    viewer.camera.zoomIn(10);
    /*缩小*/
    viewer.camera.zoomOut(10);
    //设置操作习惯,更换中键和右键
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH//双指触摸
    ];
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.WHEEL
    ]
    if(cameraMinHeight) {
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = cameraMinHeight; //相机的最小高度
    }
    if(cameraMaxHeight) {
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = cameraMaxHeight;  //相机的最大高度
    }
  }

  /**
  * @description 飞入主视角
  * @param {object} mainView 主视角,携带x,y,z参数值
  */
  flyMain (mainView) {
    let {lon,lat,height,heading,pitch} = JSON.parse(mainView)
    let point = Cesium.Cartesian3.fromDegrees(lon, lat, height);
    viewer.camera.flyTo({
      destination : point,
      orientation: {
        heading : Cesium.Math.toRadians(heading), //默认值
        pitch : Cesium.Math.toRadians(pitch), // 默认值
        roll : 0.0 //默认值
      }
    })
  }

  /**
  * @description 修改模型颜色
  * @param {object} tiles 目标模型
  * @param {string} wantColor 想要修改的颜色，支持rgb,rgba
  */
  changeTilestColor (tiles,wantColor) {
    tiles.style = new Cesium.Cesium3DTileStyle({color:wantColor})
  }

  /**
  * @description 模型偏移
  * @param {object} offset 需要偏移的位置
  * @param {object} tiles 目标模型
  */
  main_offset(offset,tiles){//位置偏移
    let {lon,lat,height} = JSON.parse(offset)
    let rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(0)));
    let rotationY = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(0)));
    let rotationZ = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(0)));
    let position = Cesium.Cartesian3.fromDegrees(lon,lat,height);
    let mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    Cesium.Matrix4.multiply(mat, rotationX, mat);
    Cesium.Matrix4.multiply(mat, rotationY, mat);
    Cesium.Matrix4.multiply(mat, rotationZ, mat);
    tiles._root.transform = mat;
  }
  /**
  * @description 给点位添加选择框
  * @param {string} id 需要添加选择框的实体ID
  */
  addSelectBox (id) {
    let entity = viewer.entities.getById(id); // 找到点位数据
    let model2 = new Cesium.Entity({     // 创造一个假体
      position:entity._position._value
    });
    if(viewer._selectedEntity !== model2 && model2) {  // 判断选择框所在的点位，与创造的点位是否相同
      viewer._selectedEntity = model2; // 给选择框赋值
      var selectionIndicatorViewModel = viewer._selectionIndicator ? viewer._selectionIndicator.viewModel : undefined;
      if (model2) {
        if (selectionIndicatorViewModel) {
          selectionIndicatorViewModel.animateAppear();//为指标设置动画以引起对选择的注意。
        }
      } else if (selectionIndicatorViewModel) {
        selectionIndicatorViewModel.animateDepart();//为指标设置动画以释放选择。
      }
      viewer._selectedEntityChanged.raiseEvent(model2);
    }
  }
}

export default new Map()