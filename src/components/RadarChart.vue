<template lang='pug'>
  svg(width="200" height="200")
    g
      polygon(
        :points='points'
      )
      circle(cx='100' cy='100' r='40')
      circle(cx='100' cy='100' r='80')
      axis-label(
        v-for='(label, i) in labels'
        :key='i'
        :x='label.x'
        :y='label.y'
        :label='label.label'
      )
</template>

<script>
import AxisLabel from './AxisLabel'

export default {
  name: 'RaderChart',
  components: {
    AxisLabel
  },
  props: {
    score: {
      type: Object,
      default () { return {} }
    }
  },
  computed: {
    total () {
      return Object.keys(this.score).length
    },
    points () {
      const score = this.score
      const total = this.total
      return Object.keys(score).map((elm, i) => {
        var point = this.valueToPoint(score[elm].per, i, total)
        return point.x + ',' + point.y
      }).join(' ')
    },
    labels () {
      const score = this.score
      const total = this.total
      return Object.keys(score).map((elm, i) => {
        var point = this.valueToPoint(score[elm].per, i, total)
        return {
          label: score[elm].label,
          x: point.x,
          y: point.y
        }
      })
    }
  },
  methods: {
    valueToPoint (value, index, total) {
      const x = 0
      const y = -value * 0.8
      const angle = Math.PI * 2 / total * index
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const tx = x * cos - y * sin + 100
      const ty = x * sin + y * cos + 100
      return {
        x: tx,
        y: ty
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
polygon
  fill #42b983
  opacity .75

circle
  fill transparent
  stroke #999
</style>
