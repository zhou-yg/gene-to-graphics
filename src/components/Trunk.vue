<template>
  <div class="trunk">

    <div class="preview-box">
      <div class="preview" ref="preview">
        <canvas ref="canvas" width="100%" height="100%"></canvas>
      </div>
    </div>

    <el-table
      border
      :data="trunkList">
      <el-table-column
        prop="name"
        label="名称" >
      </el-table-column>
      <el-table-column
        label="操作"
        width="250px">
        <template slot-scope="scope">
          <el-button @click="renameTrunk(scope.row._id)">重命名</el-button>
          <el-button @click="deleteTrunk(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js';
import trunkToPixi from './trunkToPixi';

export default {
  components: {
  },
  name: 'trunk',
  data () {
    return {
      trunkList: [],
    };
  },
  mounted () {
    this.getTrunkList();
    this.$nextTick(() => {
      this.app = new PIXI.Application({
        backgroundColor: 0xffffff,
        forceCanvas: true,
        view: this.$refs.canvas,
        width: 320,
        height: 568,
      });
    });
  },
  methods: {
    getTrunkList () {
      this.$api.sms.trunk('find').then(res => {
        this.trunkList = [].concat(res.data);
        this.showPreview();
      });
    },
    showPreview () {
      this.app.stage.addChild(trunkToPixi(this.trunkList));
    },
    renameTrunk (id) {
      this.$prompt('新的图形名称', '重命名', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPattern: /[\w\W]+/,
        inputErrorMessage: '请输入名称',
      }).then(({value}) => {
        this.$api.sms.trunk('updateOne', {
          _id: id,
          _doc: {
            $set: {
              name: value,
            },
          },
        }).then(res => {
          this.getTrunkList();
        });
      }).catch(e => {
      });
    },
    deleteTrunk (id) {
      this.$api.sms.trunk('deleteOne', {
        _id: id,
      }).then(res => {
        this.getTrunkList();
      });
    },
  },
}
</script>

<style>
.trunk {
}
.preview-box{
  text-align: center;
}
.preview {
  border: 1px solid #999;
  width: 320px;
  height: 568px;
  display: inline-block;
}
</style>
