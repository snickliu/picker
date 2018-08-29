<template>
  <header :class="`g-header ${type}`">
    <div class="left" @click="tapLeft">
      <slot name="left">
        <i v-if="leftIcon" :class="`fs-48 iconfont icon-${leftIcon}`"></i>
        <span v-if="leftText" class="fs-30">{{leftText}}</span>
      </slot>
    </div>
    <div class="middle">
      <slot><h1 class="fs-36" v-if="title">{{title}}</h1></slot>
    </div>
    <div class="right" @click="tapRight">
      <slot name="right">
        <span v-if="rightText" class="fs-30">{{rightText}}</span>
        <i v-if="rightIcon" :class="`fs-48 iconfont icon-${rightIcon}`"></i>
      </slot>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',

  components: {},

  props: {
    leftIcon: String,
    leftText: String,
    rightText: String,
    rightIcon: String,
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'theme'
    },
    leftBack: {
      type: Boolean,
      default: true
    },
    rightRouter: Object
  },

  data () {
    return {}
  },

  created () {
  },

  methods: {
    tapLeft () {
      if (this.leftBack) {
        this.$router.go(-1)
      }
      this.$emit('tapLeft')
    },

    tapRight () {
      if (this.rightRouter) {
        this.$router.push(this.rightRouter)
      }
      this.$emit('tapRight')
    }
  }
}
</script>

<style lang="scss" scoped>
  .g-header {
    position: relative;
    min-height: .88rem;
    text-align: center;
    .fs-48 {
      font-size: 0.48rem;
    }
    .fs-30 {
      font-size: 0.30rem;
    }
    .fs-36 {
      font-size: 0.36rem;
    }
    &.theme {
      background-color: $theme-color;
      color: $white-color;
      .iconfont {
        color: $white-color;
      }
    }
    &.white {
      background-color: $white-color;
      color: $font-color;
      .iconfont {
        color: $font-color;
      }
    }
    .left, .right {
      position: absolute;
      z-index: 100;
      top: 50%;
      transform: translate(0, -50%);
    }
    .left {
      left: .2rem;
    }
    .right {
      right: .2rem;
    }
    .middle {
      z-index: 10;
      width: 100%;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
