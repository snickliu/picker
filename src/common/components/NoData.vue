<template>
  <div class="m-no-data">
    <img class="img" :src="require(`IMAGES/no-${type}.png`)" :alt="noData[type]">
    <p class="text fs-28">{{text || noData[type]}}</p>
  </div>
</template>

<script>
export default {
  name: 'NoData',

  components: {},

  props: {
    type: {
      type: String,
      default: 'record'
    },
    text: String
  },

  data () {
    return {
      noData: {
        record: '暂无记录',
        search: '搜索为空',
        network: '网络不给力，请重新加载',
        open: '功能开发中，敬请期待......',
        server: '系统维护中......'
      }
    }
  },

  created () {
  },

  methods: {}
}
</script>

<style lang="scss" scoped>
  .m-no-data {
    padding-top: 1.2rem;
    text-align: center;
    .img {
      width: 2.8rem;
    }
    .text {
      margin-top: .8rem;
    }
  }
</style>
