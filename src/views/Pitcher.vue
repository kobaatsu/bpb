<template lang='pug'>
  .pitcher
    .alerts(v-if='ruleErrors.length')
      el-alert(
        v-for='error in ruleErrors'
        type='warning'
        :title='error.title'
        :description='error.description'
        :closable="false"
        show-icon
      )

    el-container
      el-main
        el-table(
          :data='pitcherData'
          stripe
          style="width: 100%"
        )
          el-table-column(
            fixed
            prop='position'
          )
          el-table-column(
            fixed
            label='名前'
            width='200'
          )
            template(slot-scope='scope')
              el-input(
                v-model='scope.row.name'
                @input='setPitcherData'
              )
          el-table-column(
            label='投法'
            width='120'
          )
            template(slot-scope='scope')
              el-select(
                v-model='scope.row.form'
                placeholder='--'
                @change='setPitcherData'
              )
                el-option(
                  v-for='(form, index) in pitchingForms'
                  :key='index'
                  :value='form.value'
                  :label='form.label'
                )
          el-table-column(
            label='タイプ'
            width='120'
          )
            template(slot-scope='scope')
              el-select(
                v-model='scope.row.type'
                placeholder='--'
                @change='setPitcherData'
              )
                el-option(
                  v-for='(type, index) in pitchingTypes'
                  :key='index'
                  :value='type'
                  :label='type'
                )

          el-table-column(
            label='球速'
            width='200'
          )
            template(slot-scope='scope')
              el-input-number(
                v-model='scope.row.speed'
                :step='pitcherSetting.speed.step'
                :min='pitcherSetting.speed.base'
                :max='pitcherSetting.speed.max'
                @input='setPitcherData'
              )
          el-table-column(
            label='切れ'
            width='90'
          )
            template(slot-scope='scope')
              el-select(
                v-model='scope.row.sharpness'
                placeholder='--'
                @change='setPitcherData'
              )
                el-option(
                  v-for='param in params'
                  :key='param'
                  :value='param'
                  :label='param'
                )
          el-table-column(
            label='制球'
            width='90'
          )
            template(slot-scope='scope')
              el-select(
                v-model='scope.row.control'
                placeholder='--'
                @change='setPitcherData'
              )
                el-option(
                  v-for='param in params'
                  :key='param'
                  :value='param'
                  :label='param'
                )
          el-table-column(
            label='安定'
            width='90'
          )
            template(slot-scope='scope')
              el-select(
                v-model='scope.row.stability'
                placeholder='--'
                @change='setPitcherData'
              )
                el-option(
                  v-for='param in params'
                  :key='param'
                  :value='param'
                  :label='param'
                )
          el-table-column(
            label='球質'
            width='90'
          )
            template(slot-scope='scope')
              el-select(
                v-model='scope.row.characteristics'
                placeholder='--'
                @change='setPitcherData'
              )
                el-option(
                  v-for='param in params'
                  :key='param'
                  :value='param'
                  :label='param'
                )
          el-table-column(
            label='投球術'
            width='90'
          )
            template(slot-scope='scope')
              el-select(
                v-model='scope.row.skill'
                placeholder='--'
                @change='setPitcherData'
              )
                el-option(
                  v-for='param in params'
                  :key='param'
                  :value='param'
                  :label='param'
                )
          el-table-column(
            label='スタミナ'
            width='90'
          )
            template(slot-scope='scope')
              el-select(
                v-model='scope.row.stamina'
                placeholder='--'
                @change='setPitcherData'
              )
                el-option(
                  v-for='param in params'
                  :key='param'
                  :value='param'
                  :label='param'
                )
          el-table-column(
            label='回復'
            width='200'
          )
            template(slot-scope='scope')
              el-input-number(
                v-model='scope.row.recovery'
                :step='pitcherSetting.recovery.step'
                :min='pitcherSetting.recovery.base'
                :max='pitcherSetting.recovery.max'
                @input='setPitcherData'
              )
          el-table-column(
            label='打率'
            width='100'
            prop='average'
          )

        el-row(
          :style='{"marginTop": "50px"}'
          :gutter="10"
        )
          el-button(
            type='danger'
            icon='el-icon-delete'
            @click='formatMembers'
          ) データを初期化する

      el-aside(width='200px')
        rader-chart(
          :score='score'
        )

</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

import { params, pitcherPosition, pitchingForms, pitchingTypes, pitcherParam } from '@/constants/'
import { randName } from '@/utility.js'

import RaderChart from '@/components/RadarChart'

export default {
  name: 'Pitcher',
  components: {
    RaderChart
  },
  data () {
    return {
      pitcherData: [],
      pitcherPosition,
      params,
      pitchingForms,
      pitchingTypes,
      pitcherParam
    }
  },
  computed: {
    ...mapState({
      pitcherSetting: 'PITCHER_SETTING'
    }),
    dataTemplate () {
      let template = {
        name: '',
        position: null,
        form: '',
        type: '',
        speed: this.pitcherSetting.speed.base,
        recovery: this.pitcherSetting.recovery.base,
        average: '.' + this.pitcherSetting.average
      }
      this.pitcherParam.forEach(elm => {
        template[elm] = 'C'
      })
      return template
    },
    ruleErrors () {
      let errors = []

      // スピードのチェック
      let speedPoint = 0
      let speedRules = this.pitcherSetting.speed.rules.map(elm => {
        let obj = Object.assign({}, elm)
        obj.num = 0
        return obj
      })
      // パラメータのチェック
      let paramNums = {
        S: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0
      }
      // 回復のチェック
      let recoverPoint = 0
      let recoverRules = this.pitcherSetting.recovery.rules.map(elm => {
        let obj = Object.assign({}, elm)
        obj.num = 0
        return obj
      })

      this.pitcherData.forEach(elm => {
        speedPoint += elm.speed - this.pitcherSetting.speed.base
        speedRules.forEach(rule => {
          if (rule.min && rule.min <= elm.speed) {
            rule.num++
          }
          if (rule.equal && rule.equal === elm.speed) {
            rule.num++
          }
        })

        this.pitcherParam.forEach(prm => {
          paramNums[elm[prm]]++
        })

        recoverPoint += elm.recovery - this.pitcherSetting.recovery.base
        recoverRules.forEach(rule => {
          if (rule.min && rule.min <= elm.recovery) {
            rule.num++
          }
          if (rule.equal && rule.equal === elm.recovery) {
            rule.num++
          }
        })
      })

      if (speedPoint !== this.pitcherSetting.speed.point) {
        let error = {
          title: '球速を修正してください',
          description: `${this.pitcherSetting.speed.point}ポイントを球速に振り分けます。`
        }
        if (speedPoint < this.pitcherSetting.speed.point) {
          error.description += `残り${this.pitcherSetting.speed.point - speedPoint}ポイントです。`
        }
        if (speedPoint > this.pitcherSetting.speed.point) {
          error.description += `${speedPoint - this.pitcherSetting.speed.point}ポイント超過しています。`
        }
        errors.push(error)
      }

      speedRules.forEach(rule => {
        if (rule.num > rule.limit) {
          const error = {
            title: '球速を修正してください'
          }
          if (rule.min) {
            error.description = `${rule.min}km/h以上の球速を指定できるのは${rule.limit}人までです（現在${rule.num}人）。`
          }
          if (rule.equal) {
            error.description = `${rule.equal}km/hの球速を指定できるのは${rule.limit}人までです（現在${rule.num}人）。`
          }
          errors.push(error)
        }
      })

      let paramError = {
        description: ''
      }
      const paramLimit = this.pitcherSetting.paramLimit
      Object.keys(paramNums).forEach(key => {
        if (paramNums[key] !== paramLimit[key]) {
          paramError.description += `${key}を${paramLimit[key]}個指定します（現在${paramNums[key]}個）。`
        }
      })
      if (paramError.description !== '') {
        paramError.title = `パラメータの振り分けを修正してください`
        errors.push(paramError)
      }

      if (recoverPoint !== this.pitcherSetting.recovery.point) {
        let error = {
          title: '回復を修正してください',
          description: `${this.pitcherSetting.recovery.point}ポイントを回復値に振り分けます。`
        }
        if (recoverPoint < this.pitcherSetting.recovery.point) {
          error.description += `残り${this.pitcherSetting.recovery.point - recoverPoint}ポイントです。`
        }
        if (recoverPoint > this.pitcherSetting.recovery.point) {
          error.description += `${recoverPoint - this.pitcherSetting.recovery.point}ポイント超過しています。`
        }
        errors.push(error)
      }

      recoverRules.forEach(rule => {
        if (rule.num > rule.limit) {
          const error = {
            title: '回復を修正してください'
          }
          if (rule.min) {
            error.description = `回復値${rule.min}以上を指定できるのは${rule.limit}人までです（現在${rule.num}人）。`
          }
          if (rule.equal) {
            error.description = `回復値${rule.equal}を指定できるのは${rule.limit}人までです（現在${rule.num}人）。`
          }
          errors.push(error)
        }
      })

      return errors
    },
    score () {
      const maxPoint = 6 * 12
      const points = {
        S: 6,
        A: 5,
        B: 4,
        C: 3,
        D: 2,
        E: 1
      }
      let score = {
        sharpness: {
          label: '切れ',
          point: 0
        },
        control: {
          label: '制球',
          point: 0
        },
        stability: {
          label: '安定',
          point: 0
        },
        characteristics: {
          label: '球質',
          point: 0
        },
        skill: {
          label: '投球術',
          point: 0
        },
        stamina: {
          label: 'スタミナ',
          point: 0
        }
      }
      const params = this.pitcherParam

      this.pitcherData.forEach(elm => {
        const self = elm
        params.forEach(item => {
          score[item].point += points[self[item]]
        })
      })
      Object.keys(score).forEach(item => {
        score[item].per = 0 | (score[item].point / maxPoint * 100)
      })
      return score
    }
  },
  methods: {
    ...mapMutations({
      updatePitcherError: 'UPDATE_PITCHER_ERROR'
    }),
    ...mapActions({
      registerPitcherData: 'REGISTER_PITCHER_DATA'
    }),
    formatMembers () {
      const setting = this.pitcherSetting
      const template = this.dataTemplate
      // ラベル用に展開
      let positions = []
      setting.positions.forEach(elm => {
        const labels = Array.from(Array(elm.num).keys()).map(() => elm.label)
        positions.push(...labels)
      })
      this.pitcherData = Array.from(Array(setting.member).keys()).map(i => {
        let data = Object.assign({}, template)
        data.position = positions[i]
        data.name = randName()
        return data
      })
      this.setPitcherData()
    },
    initializeMembers () {
      if (localStorage.getItem('PITCHER_DATA')) {
        try {
          this.pitcherData = JSON.parse(localStorage.getItem('PITCHER_DATA'))
        } catch (e) {
          this.formatMembers()
        }
      } else {
        this.formatMembers()
      }
      this.setPitcherData()
    },
    setPitcherData () {
      this.registerPitcherData(this.pitcherData)
    }
  },
  watch: {
    ruleErrors () {
      if (this.ruleErrors.length) {
        this.updatePitcherError(true)
      } else {
        this.updatePitcherError(false)
      }
    }
  },
  mounted () {
    this.initializeMembers()
  }
}
</script>

<style lang='stylus'>
  .alerts
    margin-bottom 30px
  .el-alert + .el-alert
    margin-top 10px
</style>
