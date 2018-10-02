<template>
  <transition name="picker-fade">
    <div class="p-beetscroll" :class="{'shadow': shadow}" v-show="state===1" @touchmove.prevent @click="cancel">
      <transition name="picker-move">
        <div class="picker-panel" v-show="state===1" @click.stop>
          <div class="picker-choose border-bottom-1px">
            <span class="cancel fs-30" @click="cancel">{{cancelTxt}}</span>
            <span class="confirm fs-30" @click="confirm">{{confirmTxt}}</span>
            <span class="picker-title fs-30">{{title}}</span>
          </div>
          <div class="picker-content">
            <div class="mask-top border-bottom-1px"></div>
            <div class="mask-bottom border-top-1px"></div>
            <div class="wheel-wrapper" ref="wheelWrapper">
              <div class="wheel" v-for="(data,i) in pickerData" :key="i">
                <ul class="wheel-scroll">
                  <li v-for="(item,index) in data"  :key="index" class="wheel-item">{{item[alias.name]||item.name|| dateTime(item,i)}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="picker-footer"></div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll'

const STATE_HIDE = 0
const STATE_SHOW = 1

const COMPONENT_NAME = 'picker'
const EVENT_SELECT = 'select'
const EVENT_VALUE_CHANGE = 'valuechange'
const EVENT_CANCEL = 'cancel'
const EVENT_CHANGE = 'change'

export default {
  name: COMPONENT_NAME,
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String
    },
    shadow: {
      type: Boolean,
      default: false
    },
    alias: { // name,num的别名
      type: Object,
      default () {
        return {}
      }
    },
    cancelTxt: {
      type: String,
      default: '取消'
    },
    confirmTxt: {
      type: String,
      default: '确定'
    },
    selectedIndex: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      state: STATE_HIDE,
      pickerData: this.data.slice(),
      pickerSelectedIndex: this.selectedIndex,
      pickerSelectedVal: [],
      pickerSelectedText: []
    }
  },
  created () {
    if (!this.pickerSelectedIndex.length) {
      this.pickerSelectedIndex = []
      for (let i = 0; i < this.pickerData.length; i++) {
        this.pickerSelectedIndex[i] = 0
      }
    }
  },
  methods: {
    dateTime (time, i) {
      switch (i) {
        case 0:
          return time + '年'
        case 1:
          return time + '月'
        case 2:
          return time + '日'
        default:
          return time
      }
    },
    confirm () {
      if (!this._canConfirm()) {
        return
      }
      this.hide()

      let changed = false
      for (let i = 0; i < this.pickerData.length; i++) {
        let index = this.wheels[i].getSelectedIndex()
        this.pickerSelectedIndex[i] = index

        let value = null
        if (this.pickerData[i][Object.keys(this.pickerData[i])[index]]) {
          value = this.pickerData[i][Object.keys(this.pickerData[i])[index]].id || this.pickerData[i][index].displayId
        }
        if (this.pickerSelectedVal[i] !== value) {
          changed = true
        }
        this.pickerSelectedText[i] = this.pickerData[i][Object.keys(this.pickerData[i])[index]]
      }

      this.$emit(EVENT_SELECT, this.pickerSelectedIndex, this.pickerSelectedText)

      if (changed) {
        this.$emit(EVENT_VALUE_CHANGE, this.pickerSelectedIndex, this.pickerSelectedText)
      }
    },
    cancel () {
      this.hide()
      this.$emit(EVENT_CANCEL)
    },
    show () {
      if (this.state === STATE_SHOW) {
        return
      }
      this.state = STATE_SHOW

      if (!this.wheels || this.dirty) {
        this.$nextTick(() => {
          this.wheels = []
          let wheelWrapper = this.$refs.wheelWrapper
          for (let i = 0; i < this.pickerData.length; i++) {
            this._createWheel(wheelWrapper, i)
          }
          this.dirty = false
        })
      } else {
        for (let i = 0; i < this.pickerData.length; i++) {
          this.wheels[i].enable()
          this.wheels[i].wheelTo(this.pickerSelectedIndex[i])
        }
      }
    },
    hide () {
      this.state = STATE_HIDE

      for (let i = 0; i < this.pickerData.length; i++) {
        this.wheels[i].disable()
      }
    },
    setData (data) {
      this.pickerData = data.slice()
      this.dirty = true
    },
    setSelectedIndex (index) {
      this.pickerSelectedIndex = index
    },
    refill (datas) {
      let ret = []
      if (!datas.length) {
        return ret
      }
      datas.forEach((data, index) => {
        ret[index] = this.refillColumn(index, data)
      })
      return ret
    },
    refillColumn (index, data) {
      if (this.state !== STATE_SHOW) {
        console.error('can not use refillColumn when picker is not show')
        return
      }
      const wheelWrapper = this.$refs.wheelWrapper
      let scroll = wheelWrapper.children[index].querySelector('.wheel-scroll')
      let wheel = this.wheels[index]
      if (scroll && wheel) {
        let oldData = this.pickerData[index]
        this.$set(this.pickerData, index, data)
        let selectedIndex = wheel.getSelectedIndex()
        let dist = 0
        if (oldData.length) {
          let oldValue = oldData[selectedIndex].value
          for (let i = 0; i < data.length; i++) {
            if (data[i].value === oldValue) {
              dist = i
              break
            }
          }
        }
        this.pickerSelectedIndex[index] = dist
        this.$nextTick(() => {
          // recreate wheel so that the wrapperHeight will be correct.
          wheel = this._createWheel(wheelWrapper, index)
          wheel.wheelTo(dist)
        })
        return dist
      }
    },
    scrollTo (index, dist) {
      const wheel = this.wheels[index]
      this.pickerSelectedIndex[index] = dist
      wheel.wheelTo(dist)
    },
    refresh () {
      this.$nextTick(() => {
        if (this.wheels) {
          this.wheels.forEach((wheel, index) => {
            wheel.refresh()
          })
        }
      })
    },
    _createWheel (wheelWrapper, i) {
      if (!this.wheels[i]) {
        this.wheels[i] = new BScroll(wheelWrapper.children[i], {
          wheel: {
            selectedIndex: this.pickerSelectedIndex[i],
            /** 默认值就是下面配置的两个，为了展示二者的作用，这里再配置一下 */
            wheelWrapperClass: 'wheel-scroll',
            wheelItemClass: 'wheel-item'
          },
          probeType: 3
        })

        this.wheels[i].on('scrollEnd', () => {
          this.$emit(EVENT_CHANGE, i, this.wheels[i].getSelectedIndex())
        })
      } else {
        this.wheels[i].refresh()
      }

      return this.wheels[i]
    },
    _canConfirm () {
      return this.wheels.every((wheel) => {
        return !wheel.isInTransition
      })
    }
  },
  watch: {
    data (newData) {
      this.setData(newData)
    },
    selectedIndex (value) {
      this.pickerSelectedIndex = value
    }
  }
}
</script>

<style lang="scss" scoped>
.shadow {
  background-color: rgba(37, 38, 45, .4);
}
.p-beetscroll {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  &.picker-fade-enter, &.picker-fade-leave-active {
    opacity: 0;
  }
  &.picker-fade-enter-active, &.picker-fade-leave-active {
    transition: all .3s ease-in-out;
  }
  .picker-panel {
    position: absolute;
    z-index: 600;
    bottom: 0;
    width: 100%;
    height: 5rem;
    background: #fff;
    &.picker-move-enter, &.picker-move-leave-active {
      transform: translate3d(0, 5rem, 0);
    }
    &.picker-move-enter-active, &.picker-move-leave-active {
      transition: all .3s ease-in-out;
    }
    .picker-choose {
      position: relative;
      height: 0.8rem;
      color:  $text-assist-color;
      background-color: $bd-color;
      line-height: 0.8rem;
      .picker-title {
        margin: 0;
        font-weight: normal;
        text-align: center;
        color: $font-color;
      }
      .confirm, .cancel {
        position: absolute;
        padding: 0 0.2rem 0 0.2rem;
      }
      .confirm {
        right: 0;
        color: $theme-color;
        &:active {
          color: $ball-red-color;
        }
      }
      .cancel {
        left: 0;
        &:active {
          color: $text-light-color;
       }
      }
    }
    .picker-content {
      position: relative;
      top: 0.5rem;
      .mask-top, .mask-bottom {
        z-index: 10;
        width: 100%;
        height: 1.2rem;
        pointer-events: none;
        transform: translateZ(0);
      }
      .mask-top {
        position: absolute;
        top: 0;
        background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
      }
      .mask-bottom {
        position: absolute;
        bottom: 1px;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
      }
      .wheel-wrapper {
        display: flex;
        padding: 0 0.2rem;
        .wheel {
          flex: 1;
          height: 3.1rem;
          overflow: hidden;
          font-size: 0.4rem;
          .wheel-scroll {
            padding: 0;
            margin-top: 1.2rem;
            line-height: 0.66rem;
            list-style: none;
            .wheel-item {
              list-style: none;
              height: 0.66rem;
              overflow: hidden;
              white-space: nowrap;
              color: $font-color;
            }
          }
        }
      }
    }
    .picker-footer {
      height: 0.2rem;
    }
  }
  .border-top-1px, .border-right-1px, .border-bottom-1px, .border-left-1px {
    position: relative;
    &:before, &:after {
      content: "";
      display: block;
      position: absolute;
      transform-origin: 0 0;
    }
  }
  .border-top-1px {
    &:before {
      border-top: 1px solid #ebebeb;
      left: 0;
      top: 0;
      width: 100%;
      transform-origin: 0 top;
    }
  }
  .border-bottom-1px {
    &:after {
      border-bottom: 1px solid #ebebeb;
      left: 0;
      bottom: 0;
      width: 100%;
      transform-origin: 0 bottom;
    }
  }
  @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
    .border-top-1px {
      &:before {
        width: 200%;
        transform: scale(.5) translateZ(0);
      }
    }
    .border-bottom-1px {
      &:after {
        width: 200%;
        transform: scale(.5) translateZ(0);
      }
    }
  }
  @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
    .border-top-1px {
      &:before {
        width: 300%;
        transform: scale(.333) translateZ(0);
      }
    }
    .border-bottom-1px {
      &:after {
        width: 300%;
        transform: scale(.333) translateZ(0);
      }
    }
  }
}
</style>
