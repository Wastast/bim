<template>
  <div class="home">
    <!-- <guide-header :titleText="'引导页'">  </guide-header> -->
    <guide-boot></guide-boot>
  </div>
</template>

<script>
import GuideHeader from '../public/Header';
import GuideBoot from './components/Boot';
export default {
  name: 'guideHome',
  components: {
    GuideHeader,
    GuideBoot
  }
}
</script>

<style lang="stylus" scoped>

</style>

