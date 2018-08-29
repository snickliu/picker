<template>
  <div class="m-header-selector" :class="{rotate: selectVisible}" @click="select">
    {{text}}
  </div>
</template>

<script>
export default {
  name: '',

  components: {},

  model: {
    prop: 'selectVisible',
    event: 'changeVisible'
  },

  props: {
    selectVisible: Boolean,
    text: String
  },

  data () {
    return {}
  },

  created () {
  },

  methods: {
    select () {
      this.$emit('changeVisible', !this.selectVisible)
    }
  }
}
</script>

<style lang="scss" scoped>
  .m-header-selector {
    display: inline-block;
    @include border-1px($white-color, all, solid, .06rem);
    border: 1px solid $white-color;
    padding: .02rem .62rem .02rem .3rem;
    min-width: 2.4rem;
    min-height: .54rem;
    font-size: .36rem;
    &::before {
      content: '';
      position: absolute;
      top: .22rem;
      right: .22rem;
      display: inline-block;
      border: .1rem solid transparent;
      border-top-color: $white-color;
      width: .1rem;
      transform-origin: 50% 20%;
      transition: transform .5s;
    }
    &.rotate::before {
      transform: rotate(-180deg);
    }
  }
</style>
