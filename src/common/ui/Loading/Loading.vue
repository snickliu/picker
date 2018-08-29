<template>
  <Popup
    v-model="visible"
    :mask="mask"
    transition=""
    class="m-loading">
    <i class="iconfont icon-loading"></i>
  </Popup>
</template>
<script>
import Popup from '../Popup.vue'

export default {
  components: {
    [Popup.name]: Popup
  },

  data () {
    return {
      visible: false,
      mask: false
    }
  },

  methods: {
    show (options) {
      this.mask = !!(options && options.mask)
      this.visible = true
    },

    hide () {
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
  .m-loading {
    .content {
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 10px 20px;
      .iconfont {
        font-size: 40px;
        text-align: center;
        display: block;
        width: 44px;
        height: 44px;
        margin-bottom: 0;

        animation: circle 1s infinite linear;
        -webkit-animation: circle 1s infinite linear;
        transform-origin: center center;
        color: #fff;

        @keyframes circle {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }
  }
</style>
