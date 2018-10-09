<template lang='pug'>
  .export
    el-input(
      v-if='!pitcherError'
      type='textarea'
      v-model='exportData'
      readonly
      autosize
    )
    .alerts(v-if='pitcherError')
      el-alert(
        type='warning'
        title='ピッチャーの設定が完了していません'
        description='データを出力するには設定を完了する必要があります'
        :closable="false"
        show-icon
      )
</template>

<script>
import { mapState } from 'vuex'

import { exportLabels } from '@/constants/'

export default {
  data () {
    return {
      exportLabels
    }
  },
  computed: {
    ...mapState({
      pitcherError: 'PITCHER_ERROR',
      pitcherData: 'PITCHER_DATA'
    }),
    exportData () {
      let data = ''
      data += this.exportLabels.header
      data += '\n'
      data += this.exportLabels.pitcher
      data += '\n'
      const rows = this.pitcherData.map(elm => {
        let row = 'P' + ' '
        row += this.padName(elm.name) + ' '
        row += (elm.form + '  ').slice(0, 3)
        row += (elm.type + '  ').slice(0, 3)
        row += elm.speed + '  '
        row += elm.sharpness + '  '
        row += elm.control + '  '
        row += elm.stability + '  '
        row += elm.characteristics + '  '
        row += elm.skill + '  '
        row += elm.stamina + '  '
        row += elm.recovery + '  '
        row += elm.average
        return row
      })
      data += rows.join('\n')
      return data
    }
  },
  methods: {
    padName (name) {
      // 半角16文字
      let padded = ''
      let b = 0
      Array.prototype.forEach.call(name, (c) => {
        // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
        if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
          b += 1
        } else {
          b += 2
        }
      })
      let sp = 16 - b
      padded += name
      while (sp > 0) {
        padded += ' '
        sp--
      }
      return padded
    }
  }
}
</script>

<style lang='stylus'>
textarea
  font-family: MeiryoKe_Gothic, "Ricty Diminished", "Osaka－等幅", "Osaka-等幅", Osaka-mono, "ＭＳ ゴシック", "MS Gothic", "Courier New", Courier, Monaco, Menlo, Consolas, "Lucida Console", monospace
</style>
