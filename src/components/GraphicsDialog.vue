<template>
  <el-dialog
    :visible.sync="isShow"
    title="编辑图形">

  </el-dialog>
</template>

<script>
import pick from 'lodash/pick';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      isShow: false,
      showData: {},
    }
  },
  computed: {
  },
  methods: {
    show (config = {}) {
      this.isShow = true;
      Object.assign(this.shoData, config)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.new-gene-dialog {
}
.new-gene-dialog .el-input {
    width: 180px;
}
</style>
