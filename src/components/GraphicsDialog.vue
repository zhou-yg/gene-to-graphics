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
          <li @click="insertPolygon">polygon</li>
          <li @click="refresh" >刷新</li>
          <li @click="deleteOne" style="color:red;" >删除</li>
        </ul>
      </header>
      <header v-if="editArr.length > 0">
        属性：
        <div class="properties">
          <p v-for="(edit, i) in editArr" :key="`edit` + i">
            {{edit.name}}：
            <el-radio-group :value="edit.mode" @input="v => changeData(edit, 'mode', v)" >
              <el-radio disabled :label="0">
                <el-input :value="edit.inputValue" @input="v => changeData(edit, 'input', v)" @blur="refresh" />
              </el-radio>
              <el-radio disabled :label="1">
                <el-select :value="edit.selectGene.name" @input="v => changeData(edit, 'gene', v)">
                  <el-option v-for="g in genes" :key="g.name" :value="g.name" :label="g.name" />
                </el-select>
              </el-radio>
            </el-radio-group>
          </p>
        </div>
      </header>
      <div id="svg" ref="svg">

      </div>
      <footer>
        <el-button type="primary" @click="save">保存</el-button>
      </footer>
    </div>

  </el-dialog>
</template>

<script>
import * as PIXI from 'pixi.js';
import {Circle, Rect, Polygon} from './G';

window.PIXI = PIXI

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

      console.log(this.showData);

      this.$nextTick(() => {
        if (!this.app) {
          // this.r = Raphael('svg');
          const app = new PIXI.Application(600, 400, {
            antialias: true,
            backgroundColor: 0xceb2a8,
          });
          this.app = app;
          this.$refs.svg.appendChild(app.view);
        }
        this.refresh();
      });
    },
    initShowData (data = []) {
      return data.map(originData => {
        // console.log(JSON.stringify(originData));
        originData = {
          ...originData,
          genes: Object.keys(originData.genes).map(prop => {
            const geneName = originData.genes[prop]

            if (!geneName) {
              return {};
            }
            return {
              [prop]: this.genes.filter(gen => gen.name === prop)[0],
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
    insertPolygon () {
      this.showData.push(new Polygon());
      this.refresh();
    },
    deleteOne () {
      this.showData = this.showData.filter((_, i) => i !== this.editIndex);
      this.refresh();
    },
    refresh () {
      this.app.stage.removeChildren();
      this.showData.forEach((obj, i) => {
        var g = new PIXI.Graphics();
        this.app.stage.addChild(g);
        g.interactive = true;
        g.on('mousedown', () => {
          this.editIndex = i;
        });
        let {fill} = obj.getAttrs();
        fill = parseInt(String(fill).replace('#', '0x'));
        g.beginFill(fill, 1);
        switch (obj.constructor) {
          case Rect:
            (() => {
              let {x,y,w,h} = obj.getAttrs();
              g.drawRect(x,y,w,h);
              g.endFill();
            })();
            break;
          case Circle:
            (() => {
              let {x,y,r} = obj.getAttrs();
              g.drawCircle(x,y,r);
              g.endFill();
            })();
            break;
          default:
        }
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
            console.log(o.genes, prop);
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
