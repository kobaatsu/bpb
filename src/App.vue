<template lang='pug'>
  #app
    el-header
      MainMenu
    el-main
      router-view
</template>

<script>
import MainMenu from '@/components/MainMenu'

export default {
  components: {
    MainMenu
  }
}
</script>

<style lang="stylus">
  a
    text-decoration none
</style>
