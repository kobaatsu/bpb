<template lang="pug">
  el-menu(
    mode="horizontal"
  )
    el-menu-item(
      v-for='(menu, index) in menuItems'
      :key='index'
      :index='index+""'
    )
      router-link(
        :to="{ name: menu.name }"
        v-text='menu.label'
      )
</template>

<script>
export default {
  name: 'MainMenu',
  props: {
    defaultActive: {
      type: Number,
      default: 2
    }
  },
  data: () => ({
    menuItems: [
      {
        name: 'config',
        label: '設定'
      },
      {
        name: 'batter',
        label: '野手'
      },
      {
        name: 'pitcher',
        label: '投手'
      },
      {
        name: 'export',
        label: '出力'
      }
    ]
  }),
  mounted: () => {
  }
}
</script>

<style lang="stylus">
</style>
