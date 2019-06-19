<template>
  <div class="boot">
    <div class="large-content">
      <div class="large-group clearfix">
        <h3 class="large-header">
          <em>BIM管控平台</em>
        </h3>
        <div class="large-switch clearfix">
          <div class="large-switch-middle bd">
            <ul class="clearfix">
              <router-link tag="li" to="/bim" class="large-switch-item">
                <div class="large-item-img">
                  <img :src="this.resorceIp + '/img/pic-001.png'" alt="">
                </div>
                <div class="large-item-title">综合管控平台</div>
                <div class="large-item-text">展示三维数据</div>
              </router-link>
              <li class="large-switch-item-clear">
                <div class="large-switch-dx">敬请期待</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus">
  /* 必要布局样式css */
.large-content {
  height 100vh
  width 100vw
  background: url('~img/port-bg.png') no-repeat;
  transition: all 1s;
  padding: 100px 0;
  box-sizing border-box
}

.large-group {
  width: 1180px;
  margin: 0 auto;
  position: relative;
  height: auto;
}

.large-header {
  font-weight: normal;
  text-align: center;
  margin-bottom: 40px;
  color: #fff;
}

.large-header em {
  display: block;
  margin-bottom: 14px;
  font-style: normal;
  font-size: 30px;
}

.large-switch-circle ul {
  font-size: 16px;
  color: #fff;
  text-align: center;
}

.large-switch-circle ul li {
  opacity: .8;
  cursor: pointer;
  margin: 0 20px;
  position: relative;
  display: inline-block;
}

.large-switch-circle ul li:hover {
  color: #fff;
  opacity: 1;
}

.large-switch-circle ul .on {
  opacity: 1;
}

.large-switch-circle ul .on:after {
  content: '';
  width: 20px;
  height: 1px;
  display: inline-block;
  background: #fff;
  position: absolute;
  bottom: -10px;
  left: calc(50% - 10px);
  animation: bigdata-underline-grow both .3s;
}

.large-switch-middle {
  width: 1180px;
  margin-top: 40px;
  position: absolute;
  z-index: 1;
}

.large-switch-middle ul li {
  cursor: pointer;
  width: 234px;
  height: 210px;
  color: #fff;
  overflow: hidden;
  float: left;
  margin: .5px;
  background-image: -webkit-linear-gradient(bottom, rgba(47, 42, 65, 0.5) 0%, #2e3d50 100%);
  background-image: -moz-linear-gradient(bottom, rgba(47, 42, 65, 0.5) 0%, #2e3d50 100%);
  background-image: -moz-linear-gradient(to top, rgba(47, 42, 65, 0.5) 0%, #2e3d50 100%);
  background-image: -o-linear-gradient(to top, rgba(47, 42, 65, 0.5) 0%, #2e3d50 100%);
  background-image: linear-gradient(to top, rgba(47, 42, 65, 0.5) 0%, #2e3d50 100%);
  background-repeat: repeat;
}

.large-switch-item {
  opacity: 1;
  -webkit-transition: opacity 0.3s;
  -moz-transition: opacity 0.3s;
  -ms-transition: opacity 0.3s;
  -o-transition: opacity 0.3s;
  transition: opacity 0.3s;
}

.large-item-img {
  width: 60px;
  display: block;
  text-align: center;
  height: 80px;
  margin: 0 auto;
  -webkit-transition: all 0.8s;
  -moz-transition: all 0.8s;
  -ms-transition: all 0.8s;
  -o-transition: all 0.8s;
  transition: all 0.8s;
}

.large-item-img img {
  width: 50px;
  height: 50px;
}

.large-item-title {
  position: relative;
  text-align: center;
}

.large-item-title:after {
  content: '';
  display: block;
  position: absolute;
  width: 20px;
  height: 1px;
  background: #fff;
  bottom: -10px;
  left: calc(50% - 10px);
}

.large-item-text {
  opacity: .4;
  height: 0;
  margin: 20px 0;
  padding: 0 20px;
  text-align: center;
  font-size: 12px;
  overflow: hidden;
  line-height: 20px;
}

.large-item-link {
  opacity: 0;
  display: block;
  width: 100px;
  margin: auto;
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 28px;
  border: 1px solid #fff;
  text-decoration: none;
  cursor: pointer;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -ms-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}

.large-switch-middle .large-item-link:hover {
  color: #fff;
  border-color: #108cee;
  background: #108cee
}

.large-switch-middle .large-switch-item:hover {
  background-image: -webkit-linear-gradient(top, #406594 0%, rgba(87, 17, 118, 0.4) 100%);
  background-image: -moz-linear-gradient(top, #406594 0%, rgba(87, 17, 118, 0.4) 100%);
  background-image: -moz-linear-gradient(to bottom, #406594 0%, rgba(87, 17, 118, 0.4) 100%);
  background-image: -o-linear-gradient(to bottom, #406594 0%, rgba(87, 17, 118, 0.4) 100%);
  background-image: linear-gradient(to bottom, #406594 0%, rgba(87, 17, 118, 0.4) 100%);
  background-repeat: repeat
}

.large-switch-middle ul li:hover .large-item-img {
  height: 45px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
  margin-top: 15px;
}

.large-switch-middle .large-switch-item:hover .large-item-img img {
  width: 30px;
  height: 30px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.large-switch-middle .large-switch-item:hover .large-item-text {
  height: initial;
}

.large-switch-middle .large-switch-item:hover .large-item-link {
  opacity: 1;
}

.large-switch-item .large-item-img {
  margin-top: 50px;
}

.large-switch-dx {
  position: relative;
  text-align: center;
  line-height: 212px;
}

.large-switch {
  width: 100%;
}
</style>
