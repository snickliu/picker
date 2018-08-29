<template>
  <Popup
    v-model="visible"
    pos="top">
    <ul class="m-select-list">
      <li
        class="item"
        v-for="(item, index) in list"
        :key="index"
        :class="{active: activeIndex === index}"
        @click="select(item, index)">
        {{item | getText}}
        <i class="iconfont icon-select-cornermark" v-show="activeIndex === index"></i>
      </li>
    </ul>
  </Popup>
</template>

<script>
import Popup from 'UI/Popup'
import { isEmpty, assignWith } from 'lodash'

export default {
  name: '',

  components: {
    Popup
  },

  model: {
    prop: 'selectVisible',
    event: 'changeVisible'
  },

  props: {
    selectVisible: Boolean,
    selectList: Array,
    defaultIndex: {
      type: Number,
      default: 0
    },
    alias: { // name,num的别名
      type: Object,
      default () {
        return {}
      }
    }
  },

  computed: {
    aliasObj () {
      return assignWith({
        name: 'name',
        num: 'num'
      }, this.alias)
    },

    list () {
      if (!this.selectList.length) {
        return [{ // selectList的默认模式
          name: '',
          num: ''
        }]
      }

      if (isEmpty(this.alias)) {
        return this.selectList
      }

      return this.selectList.map(item => {
        return {
          name: item[this.aliasObj.name],
          num: item[this.aliasObj.num]
        }
      })
    }
  },

  data () {
    return {
      visible: this.selectVisible,
      activeIndex: this.defaultIndex
    }
  },

  filters: {
    getText (item) {
      return !isNaN(Number(item.num)) ? `${item.name} ${item.num}` : item.name
    }
  },

  created () {
  },

  watch: {
    visible (visible) {
      this.activeIndex = this.defaultIndex
      this.$emit('changeVisible', visible)
    },

    selectVisible (visible) {
      this.visible = visible
    }
  },

  methods: {
    select (item, index) {
      this.visible = false
      this.activeIndex = index
      this.$emit('select', item, index)
    }
  }
}
</script>

<style lang="scss" scoped>
  .m-popup {
    margin-top: .88rem;
    .m-select-list {
      background-color: $white-color;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: .3rem .2rem 0 .2rem;
      .item {
        position: relative;
        overflow: hidden;
        border: 1px solid $bd-color;
        border-radius: .1rem;
        margin-bottom: .3rem;
        width: 2.1rem;
        padding: .06rem 0;
        text-align: center;
        font-size: .3rem;
        &.active {
          border-color: $theme-color;
          color: $theme-color;
        }
        .iconfont {
          position: absolute;
          bottom: -.02rem;
          right: 0;
          color: $theme-color;
        }
      }
    }
  }
</style>
