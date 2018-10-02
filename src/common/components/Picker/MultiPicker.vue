<template>
  <div :id="multiPickerId"></div>
</template>

<script>
/* eslint-disable no-new */
import MultiPicker from 'mob-multi-picker'
import { assignWith, isEmpty } from 'lodash'

let count = 1

export default {
  name: 'MultiPicker',

  components: {},

  props: {
    pickerVisibleId: {
      type: String,
      default: 'multiPickerVisible'
    },
    dataList: {
      type: Array,
      default () {
        return []
      }
    },
    alias: { // id,value,child的别名
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      multiPickerId: `multiPicker_${count++}`,
      picker: null
    }
  },

  computed: {
    aliasObj () {
      return assignWith({
        id: 'id',
        value: 'value',
        child: 'child'
      }, this.alias)
    },

    list () {
      if (!this.dataList.length) {
        return [{ // dataList的普通模式
          id: '',
          value: ''
        }]
      }

      if (isEmpty(this.alias)) {
        return this.dataList
      }

      return this.deepChangDataList(this.dataList)
    }
  },

  mounted () {
    this.initPicker()
  },

  watch: {
    dataList: 'initPicker'
  },

  methods: {
    initPicker () {
      if (this.dataList.length === 0) {
        return
      }

      const vm = this
      vm.picker = new MultiPicker({
        input: vm.pickerVisibleId,
        container: vm.multiPickerId,
        jsonData: isEmpty(this.alias) ? this.dataList.slice() : this.deepChangDataList(this.dataList),
        success: vm.select
      })
    },

    deepChangDataList (arr) {
      return arr.map(item => {
        const obj = {}
        obj.id = item[this.aliasObj.id]
        obj.value = item[this.aliasObj.value]

        const child = item[this.aliasObj.child]
        if (child && child.length) {
          obj.child = this.deepChangDataList(child)
        }
        return obj
      })
    },

    select (arr) {
      this.$emit('select', arr.map(item => item.index))
    }
  }
}
</script>

<style lang="scss">
  @import "~mob-multi-picker/index.css";

  .multi-picker-container {
    .multi-picker-btn-box {
      @include border-1px($bd-color, bottom);
      background-color: $white-color;
      .multi-picker-btn {
        color: $font-color;
        font-size: .28rem;
        &:last-of-type {
          color: $theme-color;
        }
      }
    }
    .multi-picker-line {
      @include border-1px($bd-color, top bottom);
      position: absolute;
      border: none;
    }
  }
</style>
