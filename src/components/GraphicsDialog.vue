<template>
  <el-dialog
    :visible.sync="isShow"
    title="编辑图形"
    custom-class="graphics-dialog-top">

    <div class="graphics-dialog">
      <header>
        图形：
        <ul>
          <li @click="insertRect" >rect</li>
          <li @click="insertCircle">circle</li>
          <li @click="refresh" >刷新</li>
          <li @click="deleteOne" style="color:red;" >删除</li>
        </ul>
      </header>
      <header v-if="editArr.length > 0">
        属性：
        <div class="properties">
          <p v-for="edit in editArr" >
            {{edit.name}}：
            <el-radio-group :value="edit.mode" @input="v => changeData(edit, 'mode', v)" >
              <el-radio disabled :label="0">
                <el-input :value="edit.inputValue" @input="v => changeData(edit, 'input', v)" @blur="refresh" />
              </el-radio>
              <el-radio disabled :label="1">
                <el-select :value="edit.selectGene.name" @input="v => changeData(edit, 'gene', v)">
                  <el-option v-for="g in genes" :value="g.name" :label="g.name" />
                </el-select>
              </el-radio>
            </el-radio-group>
          </p>
        </div>
      </header>
      <div id="svg">

      </div>
      <footer>
        <el-button type="primary" @click="save">保存</el-button>
      </footer>
    </div>

  </el-dialog>
</template>

<script>
import pick from 'lodash/pick';
import Raphael from 'raphael';

class G {
  constructor (initial) {
    this.type = initial.type || '';
    this.attrs = initial.attrs || {};
    this.genes = initial.genes || {};
  }
  getAttrs () {
    const attrKeys = Object.keys(this.attrs);
    return attrKeys.map(k => {
      const gene = this.genes[k];
      return {
        [k]: gene ? gene.getExpress ? gene.getExpress() : 0 : this.attrs[k],
      }
    }).reduce((p, c) => Object.assign(p, c), {});
  }
  output () {
    return {
      type: this.type,
      ...this.getAttrs(),
    }
  }
}

class Rect extends G {
  constructor (initial = {}) {
    super(initial);
    this.type = Rect.name;
    if (!initial.attrs) {
      this.attrs = {
        x: 20,
        y: 20,
        w: 80,
        h: 50,
        fill: '#000000',
      };
    }
  }
}
class Circle extends G {
  constructor (initial = {}) {
    super(initial);
    this.type = Circle.name;
    if (!initial.attrs) {
      this.attrs = {
        x: 100,
        y: 100,
        r: 30,
        fill: '#000000',
      };
    }
  }
}

export default {
  name: 'GraphicsDialog',
  props: {
    genes: {
      type: Array,
      default () {
        return [];
      },
    },
  },
  data () {
    return {
      id: null,
      isShow: false,
      showData: [
      ],
      editIndex: null,
    }
  },
  mounted () {
    this.$nextTick(() => {
    });
  },
  computed: {
    editArr () {
      const sd = this.showData[this.editIndex] || {};
      const arr = Object.keys(sd.attrs || {}).map(k => {
        const g = sd.genes[k];
        const value = sd.attrs[k];
        return {
          name: k,
          mode: g ? 1 : 0,
          inputValue: g ? '' : value,
          selectGene: g || {},
        }
      });
      return arr;
    },
  },
  methods: {
    show (config = {}) {
      this.isShow = true;
      config.showData = this.initShowData(config.showData);
      this.id = config.id;
      this.showData = config.showData;

      this.$nextTick(() => {
        if (!this.r) {
          this.r = Raphael('svg');
        }
        this.refresh();
      });
    },
    initShowData (data = []) {
      return data.map(originData => {
        originData = {
          ...originData,
          genes: Object.keys(originData.genes).map(prop => {
            const geneName = originData.genes[prop]
            return {
              [prop]: this.genes.filter(gen => gen.name === geneName)[0],
            }
          }).reduce((p, c) => Object.assign(p, c), {}),
        };

        switch (originData.type) {
          case Rect.name:
            return new Rect(originData);
          case Circle.name:
            return new Circle(originData);
        }
      }).filter(_ => _);
    },
    insertRect () {
      this.showData.push(new Rect());
      this.refresh();
    },
    insertCircle () {
      this.showData.push(new Circle());
      this.refresh();
    },
    deleteOne () {
      this.showData = this.showData.filter((_, i) => i !== this.editIndex);
      this.refresh();
    },
    refresh () {
      this.r.clear();
      this.showData.forEach((obj, i) => {
        var g;
        switch (obj.constructor) {
          case Rect:
            (() => {
              let {x,y,w,h} = obj.getAttrs();
              g = this.r.rect(x,y,w,h);
            })();
            break;
          case Circle:
            (() => {
              let {x,y,r} = obj.getAttrs();
              g = this.r.circle(x,y,r);
            })();
            break;
          default:
        }
        g.attr({
          fill: obj.getAttrs().fill,
        });
        g.click(() => {
          this.editIndex = i;
        });
      });
      this.showData = this.showData.slice();
    },
    changeData(obj, prop, value) {
      const graphics = this.showData[this.editIndex];

      value = isNaN(Number(value)) ? value : Number(value);

      switch (prop) {
        case 'mode':
          if (value === 0) {
            delete graphics.genes[obj.name];
          }
          if (value === 1) {

          }
          break;
        case 'input':
          graphics.attrs[obj.name] = value;
          delete graphics.genes[obj.name];
          break;
        case 'gene':
          graphics.genes[obj.name] = this.genes.filter(g => g.name === value)[0];
          break;
        default:
      }
      this.refresh();
    },
    save () {
      this.isShow = false;
      const sd = this.showData.map(o => {
        return {
          ...o,
          genes: Object.keys(o.genes).map(prop => {
            return {
              [prop]: o.genes[prop].name
            };
          }).reduce((p, c) => Object.assign(p, c), {}),
        };
      });
      this.$api.sms.graphics('updateOne', {
        _id: this.id,
        _doc: {
          $set: {
            showData: sd,
          }
        }
      }).then(res => {
        if (res.success) {
          this.$message.success('编辑图形成功');
          this.$emit('submit');
        } else {
          this.$message.success('编辑图形失败');
        }
      });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.graphics-dialog-top.el-dialog {
  width: 640px;
}
.graphics-dialog-top > .el-dialog__body {
  width: 600px;
}
.graphics-dialog {
}

.graphics-dialog .el-input {
    width: 180px;
}
.graphics-dialog header {
  margin-bottom: 10px;
}
.graphics-dialog header .properties{
  vertical-align: top;
  display: inline-block;
}
.graphics-dialog header .properties > p{
  margin-top: 0;
}

.graphics-dialog header ul {
  display: inline-block;
}
.graphics-dialog header li {
  margin-right: 4px;
  border: 1px solid #eee;
  padding: 4px 10px;
  display: inline-block;
  cursor: pointer;
  user-select:none;
}
.graphics-dialog header li:hover {
  background-color: #999;
  color: #fff;
}

.graphics-dialog footer{
  margin-top: 15px;
}

#svg {
  background-color:#fff;
  background-image:linear-gradient(180deg, #eee 1px, transparent 0),linear-gradient(270deg, #eee 1px, transparent 0) ;
  background-size:10px 10px;
  box-sizing: border-box;
  border: 1px solid #eee;
  width: 600px;
  height: 400px;
}
#svg svg {
  width: 100%;
  height: 100%;
}
</style>
