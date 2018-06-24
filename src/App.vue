<template>
  <div id="app">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基因列表" name="a" >
        <header class="header">
          <el-button @click="newGene" size="small">新建基因</el-button>
        </header>
        <el-table
          border
          :data="geneList">
          <el-table-column
            prop="name"
            label="名称"
            width="180">
          </el-table-column>

          <el-table-column
            prop="leftGeneValue"
            label="左侧" >
            <template slot-scope="scope">
              {{scope.row.leftGeneValue}}
              ~
              {{scope.row.leftGeneValueMax}}
            </template>
          </el-table-column>
          <el-table-column
            prop="rightGeneValue"
            label="右侧" >
            <template slot-scope="scope">
              {{scope.row.rightGeneValue}}
              ~
              {{scope.row.rightGeneValueMax}}
            </template>
          </el-table-column>
          <el-table-column
            prop="calTypeText"
            label="计算方式" >
          </el-table-column>

          <el-table-column
            prop="outputTypeText"
            label="输出方式" >
          </el-table-column>

          <el-table-column
            label="操作"
            width="180px">
            <template slot-scope="scope">
              <el-button @click="updateGene(scope.row.id)">修改</el-button>
              <el-button @click="deleteGene(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
      <el-tab-pane label="基本图库" name="b" >
        <Gallery :geneList="geneList"/>
      </el-tab-pane>
      <el-tab-pane label="组成图形" name="c" >
        <Trunk />
      </el-tab-pane>
    </el-tabs>
    <NewGeneDialog ref="ngd" @submit="settingSubmit"/>
  </div>
</template>

<script>
import NewGeneDialog from './components/NewGeneDialog.vue'
import Gene from './lib/Gene';
import Trunk from './components/Trunk.vue';
import Gallery from './components/Gallery.vue';

export default {
  components: {
    NewGeneDialog,
    Trunk,
    Gallery,
  },
  name: 'app',
  data () {
    return {
      activeName: 'a',
      geneList: [],
      trunkList: [],
    };
  },
  mounted () {
    this.getGeneList();
    this.getTrunkList();
  },
  methods: {
    getGeneList () {
      this.$api.sms.gene('find').then(res => {
        this.geneList = [].concat(res.data).map(obj => new Gene(obj));
      });
    },
    getTrunkList () {
      this.$api.sms.trunk('find').then(res => {
        this.trunkList = [].concat(res.data);
      });
    },
    newGene () {
      this.$refs.ngd.show();
    },
    updateGene(id) {
      const find = this.geneList.filter(obj => obj.id === id)[0];
      this.$refs.ngd.show(find);
    },
    deleteGene (id) {
      this.$api.sms.gene('deleteOne', {_id: id}).then(res => {
        this.getGeneList();
      });
    },

    settingSubmit () {
      this.getGeneList()
    },
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.header {
  margin-bottom: 10px;
}
ul {
  margin: 0;
  padding: 0;
}
ul li {
    list-style: none;
    margin: 0;
    padding: 0;
}
</style>
