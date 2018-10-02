<template>
  <div :id="datePickerId"></div>
</template>

<script>
/* eslint-disable no-new */
import DateSelector from 'mob-date-selector'
import { sun } from 'LIB'

let count = 1

export default {
  name: 'DatePicker',

  components: {},

  props: {
    pickerVisibleId: {
      type: String,
      default: 'datePickerVisible'
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    startTime: {
      type: [Date, String, null],
      default () {
        return '2010-01-01'
      }
    },
    endTime: {
      type: [Date, String, null],
      default () {
        return '2030-01-01'
      }
    },
    curTime: {
      type: [Date, String, null],
      default () {
        return new Date()
      }
    }
  },

  data () {
    return {
      datePickerId: `datePicker_${count++}`
    }
  },

  computed: {
    param () {
      const arr = ['Y', 'M', 'D', 'h', 'm']
      return arr.filter(item => {
        if (new RegExp(item).test(this.format)) {
          return 1
        }
      }).map(i => 1)
    }
  },

  mounted () {
    this.initSelector()
  },

  methods: {
    initSelector () {
      if (this.selector) {
        this.selector = null
      }

      let vm = this
      this.selector = new DateSelector({
        input: vm.pickerVisibleId,
        container: vm.datePickerId,
        type: 0,
        param: vm.param,
        beginTime: vm.getTimeArr(vm.startTime),
        endTime: vm.getTimeArr(vm.endTime),
        recentTime: vm.getTimeArr(vm.curTime),
        success: vm.select
      })
    },

    getTimeArr (date) {
      return sun(date, this.format).formatArr
    },
    select (numberArr, stringArr) {
      this.$emit('select', sun(stringArr.join('/'), this.format).date)
    }
  }
}
</script>

<style lang="scss">
  @import "~mob-date-selector/index.css";

  .date-selector-container {
    .date-selector-btn-box {
      @include border-1px($bd-color, bottom);
      background-color: $white-color;
      .date-selector-btn {
        color: $font-color;
        font-size: .28rem;
        &:last-of-type {
          color: $theme-color;
        }
      }
    }
    .date-selector-line {
      @include border-1px($bd-color, top bottom);
      position: absolute;
      border: none;
    }
  }
</style>
