<template lang="html">
  <div class="gallery">
    <header class="header">
      <el-button @click="newGraphics" size="small">新建图形</el-button>
    </header>
    <el-tabs v-model="tabName" >
      <el-tab-pane
        v-for="c in allGraphics"
        :label="c.name"
        :name="c.category"
        :key="c.category">
        <el-table
          border
          :data="c.graphicsList">
          <el-table-column
            prop="nameText"
            label="名称" >
          </el-table-column>
          <el-table-column
            label="操作"
            width="270px">
            <template slot-scope="scope">
              <el-button type="danger" @click="deleteGraphics(scope.row.id, c.name)">删除</el-button>
              <el-button @click="updateGraphics(scope.row.id, c.name)">编辑</el-button>
              <el-button @click="outputGraphics(scope.row.id, c.name)">导出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <GraphicsDialog ref="gd" :genes="geneList" @submit="submitGraphics" />
  </div>
</template>

<script>
import GraphicsDialog from './GraphicsDialog.vue'

const categoryMap = {
  other: '其它',
  eye: '眼',
  head: '头',
  horn: '角',
};

export default {
  components: {
    GraphicsDialog,
  },
  props: {
    geneList: Array,
  },
  data () {
    return {
      tabName: 'other',
      graphicsList: [],
    };
  },
  computed: {
    allGraphics () {
      var r = {};
      this.graphicsList.map(obj => {
        var category = obj.category;
        if (!category) {
          category = 'other';
        }
        if (!categoryMap[category]) {
          // throw new Error(`${category} not found map`);
        }
        if (!r[category]) {
          r[category] = {
            category,
            name: categoryMap[category] || 'other',
            graphicsList: [],
          }
        }
        var list = r[category];
        list.graphicsList.push(obj);
      });
      r = Object.values(r);
      console.log(r);
      return r;
    },
  },
  mounted () {
    this.getGraphicsList();
  },
  methods: {
    newGraphics (h) {
      let name;
      let category;
      const prompt = (h) => (<p key={Date.now()}>
          <el-input placeholder="名字" onInput={v => name = v}/>
          <span>&nbsp;</span>
          <el-input placeholder="分类" onInput={v => category = v}/>
        </p>);

      this.$msgbox({
        key: Date.now(),
        title: '新建图形',
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        message: prompt(this.$createElement),
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            // instance.confirmButtonLoading = true;
            // instance.confirmButtonText = '执行中...';
            this.$api.sms.graphics('insertOne', {
              name,
              category,
            }).then(res => {
              done();
              this.getGraphicsList();
            });
          } else {
            done();
          }
        },
      });

      // this.$prompt('请输入，图形名称', '新建图形', {
      //   confirmButtonText: '保存',
      //   cancelButtonText: '取消',
      //   inputPattern: /[\w\W]+/,
      //   inputErrorMessage: '请输入名称',
      // }).then(({value}) => {
      //   this.$api.sms.graphics('insertOne', {
      //     name: value,
      //   }).then(res => {
      //     this.getGraphicsList();
      //   });
      // }).catch(e => {
      //
      // });
    },

    getGraphicsList () {
      this.$api.sms.graphics('find').then(res => {
        this.graphicsList = [].concat(res.data).map(obj => ({
          ...obj,
          id: obj._id,
          nameText: decodeURIComponent(obj.name),
          showData: this.$refs.gd.initShowData(obj.showData || []),
        }));
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
        this.getGraphicsList();
      });
    },
    outputGraphics (id) {
      const graphicsOne = this.graphicsList.filter(g => g.id === id)[0];
      const sd = graphicsOne.showData;

      const outputData = sd.map(g => g.output());

      this.$api.sms.trunk('insertOne', {
        name: `${graphicsOne.nameText}-${Date.now()}`,
        g: outputData,
        index: 0,
      }).then(res => {
        // this.getTrunkList();
      });
    },
    submitGraphics () {
      this.getGraphicsList();
    },
  },
}
</script>

<style lang="css">
</style>
