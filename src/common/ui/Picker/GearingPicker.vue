<template>
  <picker
    @select="handleSelect(arguments)"
    :data="linkageData"
    :selected-index="selectedIndex"
    ref="picker"
    :alias="alias"
    :title="title"
    :shadow="shadow"
    @cancel="dataList(0)"
    @change="handleChange"
    :cancelTxt="cancelTxt"
    :confirmTxt="confirmTxt">
  </picker>
</template>

<script type="text/ecmascript-6">
import Picker from './Picker.vue'

const COMPONENT_NAME = 'GearingPicker'

export default {
  name: COMPONENT_NAME,
  components: {
    Picker
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    alias: { // name,num的别名
      type: Object,
      default () {
        return {}
      }
    },
    title: {
      type: String
    },
    selectedIndex: {
      type: Array,
      default () {
        return [0, 0]
      }
    },
    cancelTxt: {
      type: String
    },
    confirmTxt: {
      type: String
    },
    shadow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tempIndex: [0, 0],
      linkageData: []
    }
  },
  mounted () {
    this.dataList(0)
  },
  computed: {
  },
  watch: {
    linkageData () {
      this.$refs.picker.refresh()
    },
    selectedIndex () {
      this.$refs.picker.setSelectedIndex([0, 0])
      this.dataList(0)
    }
  },
  methods: {
    dataList (index) {
      if (index === 0) {
        this.tempIndex = [0, 0]
      }
      const childList = [this.data[index].list][0]
      this.linkageData = [this.data, childList]
    },
    show () {
      this.$refs.picker.setData(this.linkageData)
      this.$refs.picker.show()
    },
    handleSelect (args) {
      this.$emit('select', ...args)
    },
    handleChange (i, newIndex) {
      if (newIndex !== this.tempIndex[i]) {
        for (let j = 1; j > i; j--) {
          this.tempIndex.splice(j, 1)
          this.$refs.picker.scrollTo(j, 0)
        }
        this.tempIndex.splice(i, 1, newIndex)
        if (i === 0) {
          this.dataList(newIndex)
        }
      }
    }
  }
}
</script>
