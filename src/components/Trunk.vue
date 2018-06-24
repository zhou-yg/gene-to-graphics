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
        width="150px"
        label="层级" >
        <template slot-scope="scope">
          <el-input
            :value="scope.row.index"
            @input="v => changeProp(scope.row._id, 'index', v)"
            @blur="realUpdate(scope.row._id)" />
        </template>
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
import trunkToPixi from '../lib/trunkToPixi';

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
        width: 320 * 2,
        height: 568 * 2,
      });
    });
  },
  methods: {
    getTrunkList () {
      this.$api.sms.trunk('find').then(res => {
        this.trunkList = [].concat(res.data).sort((p, n) => n.index > p.index ? -1 : 1);
        this.showPreview();
      });
    },
    showPreview () {
      this.app.stage.addChild(trunkToPixi(this.trunkList.map(obj => obj.g)));
    },
    changeProp (id, prop, v) {
      this.trunkList = this.trunkList.map(obj => {
        if (obj._id === id) {
          obj[prop] = v;
        }
        return obj;
      });
    },
    realUpdate (id) {
      this.trunkList.forEach(obj => {
        if (obj._id === id) {
          this.updateTrunkOne(id, {
            index: obj.index,
          });
        }
      });
    },
    updateTrunkOne (id, setObj) {
      this.$api.sms.trunk('updateOne', {
        _id: id,
        _doc: {
          $set: setObj,
        },
      }).then(res => {
        this.getTrunkList();
      });
    },
    renameTrunk (id) {
      this.$prompt('新的图形名称', '重命名', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPattern: /[\w\W]+/,
        inputErrorMessage: '请输入名称',
      }).then(({value}) => {
        this.updateTrunkOne(id, {
          name: value,
        });
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
.preview > canvas{
  width: 100%;
  height: 100%;
}
</style>
