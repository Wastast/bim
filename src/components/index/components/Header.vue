<template>
  <div class="header">
    <div class="logo">
      <div class="img-box">
        <img :src="this.resorceIp + '/static/img/earth.png' " alt="">
      </div>
    </div>
    <div class="h-text">
      <h2>BIM综合管控平台</h2>
    </div>
    <!-- <div class="meteorological">
      <div class="time">
        <dl>
          <dt>09:22:12</dt>
          <dd>2019年1月1日 星期日</dd>
        </dl>
      </div>
      <div class="tianqi">
        <dl>
          <dt>27/31</dt>
          <dd>多云转晴</dd>
        </dl>
      </div>
      <div class="kongqi">
        <dl>
          <dt>空气指数：优</dt>
          <dd>PM2.5：16</dd>
        </dl>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="stylus" scoped>
.header
  width 100vw
  height 40px
  background:#f5f5f5
  position absolute
  top: 0
  left: 0
  z-index: 99999
  filter: drop-shadow(0 0 5px rgba(0,0,0,.3))
  div
    float left
  .logo
    width 26px
    height 26px
    margin 7px 7px 7px 15px
    position relative
    img
      position absolute
      width 100%
      height 100%
      top: 0
      left: 0
  .h-text
    h2
      font-size:20px;
      font-family:PangMenZhengDao;
      font-weight:400;
      line-height:40px
      color:rgba(173,173,173,1)
      margin-left 5px
  .meteorological
    float right
    div
      float left
</style>
