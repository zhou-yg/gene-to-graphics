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
          </el-table-column>
          <el-table-column
            prop="rightGeneValue"
            label="右侧" >
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
            label="操作" >
            <template slot-scope="scope">
              <el-button @click="updateGene(scope.row.id)">修改</el-button>
              <el-button @click="deleteGene(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
      <el-tab-pane label="图形列表" name="b" >
        <header class="header">
          <el-button @click="newGraphics" size="small">新建图形</el-button>
        </header>
        <el-table
          border
          :data="graphicsList">
          <el-table-column
            prop="nameText"
            label="名称" >
          </el-table-column>
          <el-table-column
            label="操作"
            width="300px">
            <template slot-scope="scope">
              <el-button @click="updateGraphics(scope.row.id)">编辑</el-button>
              <el-button @click="deleteGraphics(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <NewGeneDialog ref="ngd" @submit="settingSubmit"/>
    <GraphicsDialog ref="gd" :genes="geneList" @submit="submitGraphics" />
  </div>
</template>

<script>
import NewGeneDialog from './components/NewGeneDialog.vue'
import GraphicsDialog from './components/GraphicsDialog.vue'

export default {
  components: {
    NewGeneDialog,
    GraphicsDialog,
  },
  name: 'app',
  data () {
    return {
      activeName: 'a',
      geneList: [],
      graphicsList: [],
    };
  },
  mounted () {
    this.getGeneList();
    this.getGraphicsList();
  },
  methods: {
    getGeneList () {
      this.$api.sms.gene('find').then(res => {
        const calMap = ['加法', '减法'];
        const outputMap = ['数字', '颜色'];
        this.geneList = [].concat(res.data).map(obj => {
          return {
            ...obj,
            name: decodeURIComponent(obj.name),
            id: obj._id,
            calTypeText: calMap[obj.calType],
            outputTypeText: outputMap[obj.outputType],
          };
        });
      });
    },
    getGraphicsList () {
      this.$api.sms.graphics('find').then(res => {
        console.log(res);
        this.graphicsList = [].concat(res.data).map(obj => ({
          ...obj,
          id: obj._id,
          nameText: decodeURIComponent(obj.name),
          showData: (obj.showData || []).map(graphics => {
            return {
              ...graphics,
              genes: Object.keys(graphics.genes).map(prop => {
                const geneName = graphics.genes[prop]
                return {
                  [prop]: this.geneList.filter(gen => gen.name === geneName)[0],
                }
              }).reduce((p, c) => Object.assign(p, c), {}),
            };
          }),
        }));
      });
    },
    newGene () {
      this.$refs.ngd.show();
    },
    newGraphics () {
      this.$prompt('请输入，图形名称', '新建图形', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPattern: /[\w\W]+/,
        inputErrorMessage: '请输入名称',
      }).then(({value}) => {
        this.$api.sms.graphics('insertOne', {name: value}).then(res => {
          this.getGraphicsList();
        });
      }).catch(e => {

      });
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
    updateGraphics (id) {
      const graphicsOne = this.graphicsList.filter(g => g.id === id)[0];
      this.$refs.gd.show({
        id,
        showData: graphicsOne.showData || [],
      });
    },
    deleteGraphics (id) {
      this.$api.sms.graphics('deleteOne', {_id: id}).then(res => {
        this.getGeneList();
      });
    },
    settingSubmit () {
      this.getGeneList()
    },
    submitGraphics () {
      this.getGraphicsList();
    }
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
