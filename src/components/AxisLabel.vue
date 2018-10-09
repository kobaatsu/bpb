<template lang='pug'>
  text(
    :x="x"
    :y="y"
  ) {{label}}
</template>

<script>

export default {
  name: 'AxisLabel',
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang='stylus'>
text
  font-size 12px
  fill #000
</style>
