<template>
  <el-dialog
    :visible.sync="isShow"
    title="新建基因">

    <div class="new-gene-dialog">
      <p>
        名称：
        <el-input v-model="name" placeholder="仅英文"/>
        <span v-if="nameError" >
          名字仅限英文
        </span>
      </p>
      <p>
        左侧：
        <el-input v-model="leftGeneValue" placeholder="此处为最小值"/>
        ~
        <el-input v-model="leftGeneValueMax" placeholder="此处为最大值" />
      </p>
      <p>
        右侧：
        <el-input v-model="rightGeneValue" placeholder="此处为最小值"/>
        ~
        <el-input v-model="rightGeneValueMax" placeholder="此处为最大值" />
      </p>
      <p>
        计算：
        <el-select
          v-model="calType">
          <el-option label="加法" :value="0"/>
          <el-option label="减法" :value="1"/>
        </el-select>
      </p>
      <p>
        输出：
        <el-select
          v-model="outputType">
          <el-option label="数字" :value="0"/>
          <el-option label="颜色" :value="1"/>
        </el-select>
      </p>
      <footer>
        <el-button type="primary" @click="submit">{{submitText}}</el-button>
      </footer>
    </div>

  </el-dialog>
</template>

<script>
import pick from 'lodash/pick';

export default {
  name: 'NewGeneDialog',
  props: {
    msg: String
  },
  data () {
    return {
      isShow: false,
      id: 0,
      name: '',
      leftGeneValue: 0,
      leftGeneValueMax: 1,
      rightGeneValue: 0,
      rightGeneValueMax: 1,
      calType: 0,
      outputType: 0,
    }
  },
  computed: {
    nameError () {
      return this.name && !/\w+/.test(this.name);
    },
    submitText () {
      return this.id ? '更新' : '新建并保存';
    },
  },
  methods: {
    show (config = {
      id: null,
      leftGeneValue: 0,
      leftGeneValueMax: 1,
      rightGeneValue: 0,
      rightGeneValueMax: 1,
      calType: 0,
      outputType: 0,
    }) {
      this.isShow = true;
      Object.assign(this, config)      
    },
    submit () {
      this.isShow = false;
      var arg = pick(this, ['id', 'name', 'leftGeneValue', 'leftGeneValueMax', 'rightGeneValue','rightGeneValueMax', 'calType', 'outputType']);
      arg.leftGeneValue = parseInt(arg.leftGeneValue);
      arg.leftGeneValueMax = parseInt(arg.leftGeneValueMax);
      arg.rightGeneValue = parseInt(arg.rightGeneValue);
      arg.rightGeneValueMax = parseInt(arg.rightGeneValueMax);

      if (arg.leftGeneValueMax < arg.leftGeneValue) {
        arg.leftGeneValueMax = arg.leftGeneValue;
      }
      if (arg.rightGeneValueMax < arg.rightGeneValueMax) {
        arg.rightGeneValueMax = arg.rightGeneValue;
      }

      arg.calType = parseInt(arg.calType);
      arg.outputType = parseInt(arg.outputType);

      if (!arg.id) {
        delete arg.id;
        this.$api.sms.gene('insertOne', arg).then(res => {
          if (res.success) {
            this.$message.success('插入成功');
            this.$emit('submit');
          } else {
            this.$message.success('插入失败');
          }
        });
      } else {
        arg = {
          _id: arg.id,
          _doc: {
            '$set': arg
          }
        }
        this.$api.sms.gene('updateOne', arg).then(res => {
          if (res.success) {
            this.$message.success('修改成功');
            this.$emit('submit');
          } else {
            this.$message.success('修改失败');
          }
        });
      }
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
