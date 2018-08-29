<template>
  <transition :name="transition">
    <div class="m-popup" v-show="value">
      <div
        @click="hide"
        v-show="mask || (mask && pos === 'center')"
        class="mask"
        :style="{'opacity': maskOpacity}"></div>
      <div :class="`content content-${pos}`">
        <template v-if="pos === 'center'">
          <div class="wrap-center">
            <slot></slot>
          </div>
        </template>
        <template v-else>
          <slot></slot>
        </template>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'Popup',

  props: {
    value: Boolean,
    pos: {
      type: String,
      default: 'center'
    },
    mask: {
      type: Boolean,
      default: true
    },
    clikMaskClose: {
      type: Boolean,
      default: true
    },
    transition: {
      type: String,
      default: 'popup-show'
    },
    maskOpacity: {
      type: Number,
      default: 0.3
    }
  },

  methods: {
    hide () {
      this.clikMaskClose && this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  .m-popup {
    position: fixed;
    z-index: 2000;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    .mask {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background-color: $black-color;
    }
    .content {
      position: absolute;
      &-center {
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);  
        border-radius: .1rem;
      }
      &-bottom {
        width: 100%;
        bottom: 0;
        left: 0;
      }
      &-top {
        width: 100%;
        top: 0;
        left: 0;
      }
      &-full {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
      &-right {
        height: 100%;
        right: 0;
      }
    }
  }
</style>
