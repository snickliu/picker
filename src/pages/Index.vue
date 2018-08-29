<template>
  <Popup
    class="calender-filter"
    v-model="visible"
    :mask="false"
    transition="left-to-right"
    pos="full">
    <div class="calender">
      <KsHeader
        leftIcon="arrowLeft"
        :leftBack="false"
        rightText="清除"
        @tapLeft="visible = false"
        @tapRight="deleteCalender">
        <span class="fs-36">自定义筛选</span>
      </KsHeader>
      <ul class="list">
        <li class="item">
          <span class="text">开始时间</span>
          <div id="startPicker" class="time" @click="selectTime('start')" :class="{disable: !startTime}">{{startTime || '请选择开始时间'}}</div>
          <i class="iconfont icon-arrow-right"></i>
        </li>
        <li class="item">
          <span class="text">结束时间</span>
          <div id="endPicker" class="time" @click="selectTime('end')" :class="{disable: !endTime}">{{endTime || '请选择结束时间'}}</div>
          <i class="iconfont icon-arrow-right"></i>
        </li>
      </ul>
    </div>
    <DatePicker
      v-if="visible"
      :defaultDate="defaultDateTime"
      :pickerVisible="pickerVisible"
      :titleText="titleText"
      @select="selectStartTime"
      @changeVisible="changeVisible"
    ></DatePicker>
  </Popup>
</template>

<script>
import Popup from '../common/ui/Popup'
import { DatePicker } from '../common/ui/Picker'

export default {
  name: 'CalendarFilter',

  model: {
    prop: 'calendarVisible',
    event: 'changeVisible'
  },

  props: {
    calendarVisible: Boolean,
    filterList: {
      type: Array,
      default () {
        return []
      }
    },
    filterType: {
      type: Number,
      default: 0
    }
  },

  components: {
    Popup,
    DatePicker
  },

  data () {
    return {
      visible: true,
      pickerVisible: false,
      startTime: null,
      endTime: null,
      titleText: '开始时间',
      defaultDate: ''
    }
  },

  computed: {
    btnText () {
      return '确定'
    },
    defaultDateTime () {
      const dd = new Date()
      return this.defaultDate || dd.getFullYear() + '/' + (dd.getMonth() + 1) + '/' + dd.getDate()
    }
  },

  created () {
  },

  watch: {
    visible (visible) {
      this.$emit('changeVisible', visible)
    },

    calendarVisible (visible) {
      this.visible = visible
    }
  },

  methods: {
    deleteCalender () {
      this.startTime = null
      this.endTime = null
      this.pickerVisible = false
    },
    changeVisible (visible) {
      this.pickerVisible = visible
    },
    selectTime (type) {
      this.titleText = type === 'end' ? '结束时间' : '开始时间'
      this.pickerVisible = true
      let typeAr = {
        'end': this.endTime,
        'start': this.startTime
      }
      if (this.endTime || this.startTime) {
        this.defaultDate = !typeAr[type] ? '' : typeAr[type].replace(/-/g, '/')
      }
    },
    selectStartTime (time) {
      time = time[0] + '-' + time[1] + '-' + time[2]
      if (this.titleText === '开始时间') {
        this.startTime = time
      } else {
        this.endTime = time
      }
    },
    selectEndTime (time) {
      this.endTime = time
    },

    submitDate () {
      this.$emit('selectDate', this.startTime || '', this.endTime || '')
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/base.scss';
  .calender-filter {
    background-color: $bg-color;
    .calender {
      position: relative;
      z-index: 100;
      .list {
        margin-bottom: 1.2rem;
        .item {
          @include border-1px($bd-color, bottom);
          background-color: $white-color;
          font-size: .28rem;
          .text, .iconfont {
            @include set-center(v);
            z-index: 1;
          }
          .text {
            left: .2rem;
          }
          .iconfont {
            right: .2rem;
          }
          .time {
            position: relative;
            z-index: 10;
            text-align: right;
            padding: .26rem .2rem;
            line-height: .36rem;
            margin-right: .34rem;
            &.disable {
              color: $text-assist-color;
            }
          }
        }
      }
    }
  }
</style>
