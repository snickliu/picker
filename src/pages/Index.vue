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
        :leftBack="false"
        rightText="重置"
        @tapLeft="visible = false"
        @tapRight="deleteCalender">
        <span class="fs-36">自定义筛选</span>
      </KsHeader>
      <ul class="list">
        <li class="item" v-if="isSport">
          <span class="text">球类</span>
          <div class="time" @click="showPicker(0)" :class="{disable: !species}">{{ selectedS }}</div>
          <i class="iconfont icon-arrow-right"></i>
        </li>
        <li class="item" v-if="!isSport">
          <span class="text">彩种</span>
          <div class="time" @click="showPicker(1)" :class="{disable: !species}">{{ selectedD }}</div>
          <i class="iconfont icon-arrow-right"></i>
        </li>
        <li class="item" v-if="isSport">
          <span class="text">开始时间</span>
          <div class="time" @click="selectTime('start', 2)" :class="{disable: !startTime}">{{ startTime || '请选择开始时间' }}</div>
          <i class="iconfont icon-arrow-right"></i>
        </li>
        <li class="item" v-if="isSport">
          <span class="text">结束时间</span>
          <div class="time" @click="selectTime('end', 3)" :class="{disable: !endTime}">{{ endTime || '请选择结束时间' }}</div>
          <i class="iconfont icon-arrow-right"></i>
        </li>
      </ul>
    </div>
    <!-- 球类单个或多个不联动筛选 -->
    <Picker
      @select="selectSports"
      :selected-index="selectedIndex[0]"
      :alias="{name:'name'}"
      ref="picker0"
      :shadow="false"
      :title="'球类'">
    </Picker>
    <!-- 联动筛选 -->
    <GearingPicker
      @select="selectDigital"
      :data="data[0]"
      :shadow="false"
      :alias="{name:'displayName'}"
      :selected-index="selectedIndex[1]"
      ref="picker1"
      :title="'彩种'">
    </GearingPicker>
    <DatePicker
      @select="selectStartTime"
      :data="data[1]"
      ref="picker2"
      :shadow="false"
      :selected-index="selectedIndex[2]"
      :title="'开始时间'"
    ></DatePicker>
    <DatePicker
      @select="selectEndTime"
      ref="picker3"
      :shadow="false"
      :selected-index="selectedIndex[2]"
      :title="'结束时间'"
    ></DatePicker>
  </Popup>
</template>

<script>
import Popup from '../common/ui/Popup'
import { DatePicker, GearingPicker, Picker } from '../common/ui/Picker'

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
    DatePicker,
    GearingPicker,
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
      visible: this.calendarVisible,
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
    visible (visible) {
      this.$emit('changeVisible', visible)
    },
    filterList (list) {
      if (this.isSport && this.sportFilter) {
        this.sportFilter = false
        this.$refs.picker0.setData([list])
        this.$refs.picker0.setSelectedIndex([0])
      }
    },
    calendarVisible (visible) {
      this.visible = visible
    }
  },

  methods: {
    showPicker (index) {
      let picker = this.$refs['picker' + index]
      picker.show()
    },
    textValue (item) {
      return item !== '全部' ? item[0].displayName + ' ( ' + item[1].name + ' )' : item
    },
    selectDigital (index, item) {
      this.selectedD = this.textValue(item)
      this.param.digitalSelect = item
    },
    selectSports (index, item) {
      this.selectedS = item[0].name
      this.param.sportSelect = item[0]
    },
    deleteCalender () {
      if (this.isSport) {
        this.startTime = null
        this.endTime = null
        this.selectedS = '全部'
        this.param = {
          sportSelect: {
            id: 0
          }
        }
        this.$refs.picker0.setSelectedIndex([0])
      } else {
        this.selectedD = '全部'
        this.param = {
          digitalSelect: [{
            categoryId: ''
          }, {
            lotteryId: ''
          }]
        }
        this.selectedIndex[1] = [0, 0]
      }
      this.pickerVisible = false
    },
    changeVisible (visible) {
      this.pickerVisible = visible
    },
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
    selectEndTime (selectedIndex, time) {
      if (this.startTime && new Date(this.startTime).getTime() > new Date(time).getTime()) {
        this.$toast('开始时间不能大于结束时间')
        return
      }
      this.endTime = time
    },
    selectStartTime (selectedIndex, time) {
      this.startTime = time
    },
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
