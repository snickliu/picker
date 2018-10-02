<template>
  <picker
    @select="handleSelect(arguments)"
    :data="dateData"
    :selected-index="tempIndex"
    ref="picker"
    :title="title"
    @cancel="init"
    :shadow="shadow"
    @change="handleChange"
    :cancelTxt="cancelTxt"
    :confirmTxt="confirmTxt">
  </picker>
</template>

<script type="text/ecmascript-6">
import Picker from './Picker.vue'

const COMPONENT_NAME = 'DatePicker'

export default {
  name: COMPONENT_NAME,
  components: {
    Picker
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    selectedIndex: {
      type: Array,
      default () {
        return [0, 0, 0]
      }
    },
    shadow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    cancelTxt: {
      type: String
    },
    confirmTxt: {
      type: String
    },
    defaultDate: {
      type: String,
      default: () => {
        const dd = new Date()
        return dd.getFullYear() + '/' + (dd.getMonth() + 1) + '/' + dd.getDate()
      }
    },
    startDate: {
      type: String,
      default: () => {
        const sd = new Date()
        return (sd.getFullYear() - 5) + '/' + (sd.getMonth() + 1) + '/' + sd.getDate()
      }
    },
    endDate: {
      type: String,
      default: () => {
        const ed = new Date()
        return (ed.getFullYear() + 5) + '/' + (ed.getMonth() + 1) + '/' + ed.getDate()
      }
    },
    hasYear: {
      type: Boolean,
      default: true
    },
    hasDate: {
      type: Boolean,
      default: true
    },
    hasMonth: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      canClick: true,
      dateData: [],
      visible: false,
      texts: [],
      i: 0,
      pickerDom: [],
      hierarchy: [],
      tempIndex: this.selectedIndex
    }
  },
  created () {
    this.init()
  },
  computed: {
  },
  mounted () {
  },
  watch: {
    dateData () {
      this.$refs.picker.refresh()
    },
    defaultDate () {
      // debugger // eslint-disable-line
      this.init()
    }
  },
  methods: {
    init () {
      this.dateData = []
      this.hierarchy = []
      this.checkParam()
    },
    checkParam () {
      const d = new Date()
      if (new Date(this.startDate) === 'Invalid Date') {
        this.startDate = (d.getFullYear() - 5) + '/' + (d.getMonth() + 1) + '/' + d.getDate()
      }
      if (new Date(this.endDate) === 'Invalid Date') {
        this.endDate = (d.getFullYear() + 5) + '/' + (d.getMonth() + 1) + '/' + d.getDate()
      }
      if (new Date(this.defaultDate) === 'Invalid Date') {
        this.defaultDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
      }
      if (this.defaultDate > this.endDate) this.defaultDate = this.endDate
      if (this.defaultDate < this.startDate) this.defaultDate = this.startDate

      const ss = this.startDate.split('/')
      const es = this.endDate.split('/')
      const ds = this.defaultDate.split('/')
      this.dateData.push(this.setData(ss[0] - 0, es[0] - 0))
      this.hierarchy.push(ds[0] - ss[0])
      let temp = 0
      if (ds[1] - 0 < 11) {
        temp = new Date(new Date(ds[0] + '/' + (ds[1] - 0 + 1) + '/01').getTime() - 24 * 60 * 60 * 1000).getDate()
      } else {
        temp = 31
      }
      if (ds[0] > ss[0] && ds[0] < es[0]) {
        this.hierarchy.push(ds[1] - 1)
        this.hierarchy.push(ds[2] - 1)
        this.dateData.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        this.dateData.push(this.setData(1, temp))
      } else if (ds[0] === ss[0]) {
        this.hierarchy.push(ds[1] - ss[1])
        this.dateData.push(this.setData(ss[1] - 0, 12))
        if (ds[1] === ss[1]) {
          this.hierarchy.push(ds[2] - ss[2])
          this.dateData.push(this.setData(ss[2] - 0, temp))
        } else {
          this.hierarchy.push(ds[2] - 1)
          this.dateData.push(this.setData(1, temp))
        }
      } else if (ds[0] === es[0]) {
        this.hierarchy.push(ds[1] - 1)
        this.dateData.push(this.setData(1, es[1]))
        if (ds[1] === es[1]) {
          this.hierarchy.push(ds[2] - 1)
          this.dateData.push(this.setData(1, es[2] - 0))
        } else {
          this.hierarchy.push(ds[2] - 1)
          this.dateData.push(this.setData(1, temp))
        }
      }
      this.tempIndex = this.hierarchy
    },
    setData (start, end) {
      let d = []
      for (let i = start; i < end + 1; i++) {
        d.push(i)
      }
      return d
    },
    show () {
      this.$refs.picker.setData(this.dateData)
      this.$refs.picker.show()
    },
    time0 (time) {
      return time < 10 ? '0' + time : time
    },
    timeYMD (time) {
      return time[0] + '-' + this.time0(time[1]) + '-' + this.time0(time[2])
    },
    handleSelect (args) {
      args[1] = this.timeYMD(args[1])
      this.$emit('select', ...args)
    },
    daysInMonth (month, year) {
      return new Date(year, month, 0).getDate()
    },
    daysNumber (i, index) {
      let days = 0
      this.init()
      if (i === 0) {
        days = this.daysInMonth(1, this.dateData[0][index])
      } else {
        days = this.daysInMonth(this.dateData[1][index], this.dateData[0][this.hierarchy[0]])
      }
      switch (days) {
        case 31:
          this.dateData[2].push(days)
          break
        case 29:
          this.dateData[2].pop()
          break
        case 28:this.dateData[2].splice(28, 30)
          break
      }
    },
    handleChange (i, newIndex) {
      if (newIndex !== this.tempIndex[i]) {
        for (let j = 2; j > i; j--) {
          this.tempIndex.splice(j, 1, 0)
          this.$refs.picker.scrollTo(j, 0)
        }
        if (i === 0 || i === 1) {
          this.daysNumber(i, newIndex)
        }
        this.tempIndex.splice(i, 1, newIndex)
      }
    }
  }
}
</script>
