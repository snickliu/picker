<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  created () {
    //this.init()
  },

  methods: {
    init () {
      this.$server.initTimestamp().then(() => {
        this.$server.fetch('getHelpList').then(res => {
          console.log('res', res)
        })
      })
    }
  }
}
</script>
<style lang="scss">
@import './assets/styles/base.scss';
</style>
