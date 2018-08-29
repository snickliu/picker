<template>
  <div
    v-show="visible"
    class="m-toast">
    <div class="iconfont" :class="`icon-${type}`" v-if="type"></div>
    <p>{{message}}</p>
  </div>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      duration: 3000,
      timer: null,
      message: '',
      type: ''
    }
  },

  methods: {
    show (options) {
      this.message = options.message
      this.mask = !!options.mask
      this.type = options.type || ''
      this.visible = true

      let duration = null

      if (!parseInt(options.duration) || parseInt(options.duration) <= 0) {
        duration = this.duration
      } else {
        duration = options.duration
      }

      clearTimeout(this.timer)
      return new Promise((resolve) => {
        this.timer = setTimeout(() => {
          this.hide()
          resolve()
        }, duration)
      })
    },

    hide () {
      this.visible = false
      clearTimeout(this.timer)
    }
  }
}
</script>
<style lang="scss">
.m-toast {
  position: absolute;
  left: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: .1rem;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px 20px;
  text-align: center;
  .iconfont {
    font-size: 40px;
    margin-bottom: 10px;
  }
}
</style>
