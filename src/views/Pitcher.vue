<template lang='pug'>
  .pitcher
    .alerts(v-if='ruleErrors.length')
      el-alert(
        v-for='error in ruleErrors'
        type='error'
        :title='error.title'
        :description='error.description'
      )
    el-table(
      :data='pitcherData'
      stripe
      style="width: 100%"
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
        fixed
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
              v-for='(type, index) in pitcherTypes'
              :key='index'
              :value='index + 1'
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
    el-row(
      :style='{"marginTop": "50px"}'
      :gutter="10"
    )
      el-button(
        type='danger'
        icon='el-icon-delete'
        @click='formatMembers'
      ) データを初期化する
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

import { params, pitcherTypes, pitcherParam } from '@/constants/'
import { randName } from '@/utility.js'

export default {
  name: 'Pitcher',
  data () {
    return {
      pitcherData: [],
      pitcherTypes,
      params,
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
        type: '',
        speed: this.pitcherSetting.speed.base,
        recovery: this.pitcherSetting.recovery.base
      }
      this.pitcherParam.forEach(elm => {
        template[elm] = 'C'
      })
      return template
    },
    ruleErrors () {
      let errors = []
      // タイプのチェック
      let starterNum = 0
      let relieverNum = 0
      let closerNum = 0

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
        switch (elm.type) {
          case 1 :
            starterNum++
            break
          case 2 :
            relieverNum++
            break
          case 3 :
            closerNum++
            break
        }

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

      let typeError = {
        description: ''
      }
      if (starterNum !== this.pitcherSetting.type.starter) {
        typeError.description += `先発は${this.pitcherSetting.type.starter}人です。`
      }
      if (relieverNum !== this.pitcherSetting.type.reliever) {
        typeError.description += `中継ぎは${this.pitcherSetting.type.reliever}人です。`
      }
      if (closerNum !== this.pitcherSetting.type.closer) {
        typeError.description += `抑えは${this.pitcherSetting.type.closer}人です。`
      }
      if (typeError.description !== '') {
        typeError.title = 'メンバーを修正してください'
        errors.push(typeError)
      }

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
          description: `${this.pitcherSetting.speed.point}ポイントを回復に振り分けます。`
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
            error.description = `${rule.min}以上の回復を指定できるのは${rule.limit}人までです（現在${rule.num}人）。`
          }
          if (rule.equal) {
            error.description = `${rule.equal}の回復を指定できるのは${rule.limit}人までです（現在${rule.num}人）。`
          }
          errors.push(error)
        }
      })

      return errors
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
      const members = this.pitcherSetting.type
      let memberNum = 0
      Object.keys(members).forEach(elm => {
        memberNum += members[elm]
      })
      const template = this.dataTemplate
      this.pitcherData = Array.from(Array(memberNum).keys()).map(i => {
        let data = Object.assign({}, template)
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
