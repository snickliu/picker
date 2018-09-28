<template>
  <Popup
    class="calender-filter"
    v-model="visible"
    :mask="false"
    transition="right-to-left"
    pos="full">
    <div class="calender">
      <KsHeader
        leftIcon="arrowLeft"
        :leftBack="false">
        <span class="fs-36">时间pack</span>
      </KsHeader>
      <ul class="list">
        <li class="item">
          <span class="text">开始时间</span>
          <div class="time" @click="selectTime('start', 2)" :class="{disable: !startTime}">{{ startTime || '请选择开始时间' }}</div>
          <i class="iconfont icon-arrow-right"></i>
        </li>
        <li class="item">
          <span class="text">结束时间</span>
          <div class="time" @click="selectTime('end', 3)" :class="{disable: !endTime}">{{ endTime || '请选择结束时间' }}</div>
          <i class="iconfont icon-arrow-right"></i>
        </li>
      </ul>
      <KsButton
        :text="btnText"
        @onTap="submitDate"
        :disable="true"
        size="big"></KsButton>
    </div>
    <DatePickerBt
      @select="selectStartTime"
      :data="data[1]"
      ref="picker2"
      :shadow="false"
      :title="'开始时间'"
    ></DatePickerBt>
    <DatePickerBt
      @select="selectEndTime"
      ref="picker3"
      :shadow="false"
      :title="'结束时间'"
    ></DatePickerBt>
  </Popup>
</template>

<script>
import Popup from 'UI/Popup'
import KsButton from 'COMPONENTS/Button'
import { DatePickerBt, Picker } from 'UI/Picker'
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
    isSport: Boolean
  },

  components: {
    Popup,
    KsButton,
    DatePickerBt,
    Picker
  },

  data () {
    return {
      data: [
        [this.filterList]
      ],
      selectedIndex: [
        [0],
        [0, 0],
        [0, 0, 0]
      ],
      selectedD: '全部',
      selectedS: '全部',
      visible: true,
      pickerVisible: false,
      startTime: null,
      endTime: null,
      defaultDate: '',
      species: null,
      param: {},
      sportFilter: true
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
  mounted () {
    // debugger //eslint-disable-line
  },
  watch: {
  },

  methods: {
    showPicker (index) {
      let picker = this.$refs['picker' + index]
      picker.show()
    },
    changeVisible (visible) {
      this.pickerVisible = visible
    },
    // 时间组件保存原有选择时间
    selectTime (type, index) {
      this.pickerVisible = true
      let typeAr = {
        'end': this.endTime,
        'start': this.startTime
      }
      if (this.endTime || this.startTime) {
        this.defaultDate = !typeAr[type] ? '' : typeAr[type].replace(/-/g, '/')
      }
      this.showPicker(index)
    },
    // 结束时间
    selectEndTime (selectedIndex, time) {
      if (this.startTime && new Date(this.startTime).getTime() > new Date(time).getTime()) {
        this.$toast('开始时间不能大于结束时间')
        return
      }
      this.endTime = time
    },
    // 开始时间
    selectStartTime (selectedIndex, time) {
      if (this.startTime && new Date(this.startTime).getTime() > new Date(time).getTime()) {
        this.$toast('开始时间不能大于结束时间')
        return
      }
      this.startTime = time
    },
    // 确定事件
    submitDate () {
      this.param.startTime = this.startTime || ''
      this.param.endTime = this.endTime || ''
      this.$emit('selectDate', this.param)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
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
