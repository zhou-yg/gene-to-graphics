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

      <div class="sprite-list">
          精灵：
          <ul>
            <li v-for="(obj, si) in spriteList" @click="editIndex = si" :key="si" :class="{
                selected: editIndex === si,
              }">{{obj.type}}({{si}})</li>

            <li @click="cloneCurrent">
              复制
            </li>
          </ul>
      </div>

      <header v-if="editArr.single.length > 0 || editArr.multi.length > 0">
        属性：
        <div class="properties">
          <div v-for="(childEditArr, i) in editArr.multi" :key="`multiEdit` + i" :ref="childEditArr[0].name" >
            <p v-for="(childEdit, ii) in childEditArr" :key="`childEdit${childEdit.inputValue}` + i + '' + ii" >
              {{ii+1}}
              <el-radio-group :value="childEdit.mode" @input="v => changeData(childEdit, 'mode', v)" >
                <el-radio disabled :label="0">
                  <el-input :value="childEdit.inputValue" @input="v => changeData(childEdit, 'input', v)" @blur="refresh" />
                </el-radio>
                <el-radio disabled :label="1">
                  <el-select :value="childEdit.selectGene.name" @input="v => changeData(childEdit, 'gene', v)">
                    <el-option v-for="g in genes" :key="g.name" :value="g.name" :label="g.name" />
                  </el-select>
                </el-radio>
              </el-radio-group>
              &nbsp;
              <el-button size="small" @click="removeItem(childEdit, ii)" type="danger">删除</el-button>
            </p>
            <p class="op">
              <el-button size="small" @click="appendItem(childEditArr)">新增</el-button>
            </p>
          </div>
          <p></p>
          <p v-for="(edit, j) in editArr.single" :key="`edit` + j">
            {{edit.name}}：
            <el-radio-group :value="edit.mode" @input="v => changeData(edit, 'mode', v)" >
              <el-radio disabled :label="0" :key="`edit-1` + j">
                <el-input :value="edit.inputValue" @input="v => changeData(edit, 'input', v)" @blur="refresh" />
              </el-radio>
              <el-radio disabled :label="1" :key="`edit-2` + j" >
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
import {Circle, Rect, Polygon} from '../lib/G';
import Sortable from 'sortablejs';
import cloneDeep from 'lodash/cloneDeep';

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
    spriteList () {
      return this.showData.map(obj => {
        return obj;
      });
    },
    editArr () {
      const sd = this.showData[this.editIndex] || {};

      const arr = Object.keys(sd.attrs || {}).map(k => {
        const g = sd.genes[k];
        const value = sd.attrs[k];

        if (Array.isArray(value)) {
          return value.map((v1, i1) => {
            const g1 = g[i1];
            return {
              name: k,
              index: i1,
              mode: g1 ? 1 : 0,
              inputValue: g1 ? '' : v1,
              selectGene: g1 || {},
            };
          });
        } else {
          return {
            name: k,
            mode: g ? 1 : 0,
            inputValue: g ? '' : value,
            selectGene: g || {},
          }
        }
      });
      const r = {
        single: arr.filter((item) => !Array.isArray(item)),
        multi: arr.filter((item) => Array.isArray(item)),
      };
      console.log(r);

      return r;
    },
  },
  methods: {
    cloneCurrent () {
      if (this.editIndex >= 0) {
        this.showData.push(cloneDeep(this.showData[this.editIndex]));
        this.editIndex = this.showData.length - 1;
      }
    },
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
          case Polygon.name:
            return new Polygon(originData);
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
    makeSortable () {
      const multi = this.editArr.multi;
      this.$nextTick(() => {
        multi.forEach(arr => {
          const name = arr[0].name;
          const el = this.$refs[name];

          new Sortable(el[0], {
            animation: 150,
            filter: ".op",
            onUpdate: ({oldIndex, newIndex}) => {
              const graphics = this.showData[this.editIndex];
              const arrAttr = graphics.attrs[name];

              let t = arrAttr[oldIndex];
              arrAttr[oldIndex] = arrAttr[newIndex];
              arrAttr[newIndex] = t;

              graphics.attrs[name] = arrAttr;

              this.showData = this.showData.slice();
            },
          });
        });
      });
    },
    refresh () {
      this.app.stage.removeChildren();
      this.showData.forEach((obj, i) => {
        var g = new PIXI.Graphics();
        this.app.stage.addChild(g);
        g.interactive = true;
        g.on('mousedown', () => {
          console.log(i);
          this.editIndex = i;
          this.makeSortable();
        });
        console.log(`obj:`, obj);
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
          case Polygon:
            (() => {
              let {pointers} = obj.getAttrs();
              g.drawPolygon(pointers);
              g.endFill();
            })();
            break;
          default:
        }
      });
      this.showData = this.showData.slice();
    },
    removeItem (obj, index) {
      const graphics = this.showData[this.editIndex];
      graphics.attrs[obj.name].splice(index, 1);
      this.showData = this.showData.slice();
    },
    appendItem (arr) {
      const obj = arr[0];
      const graphics = this.showData[this.editIndex];

      graphics.attrs[obj.name].push(0);

      this.showData = this.showData.slice();
    },
    changeData(obj, prop, value) {
      const graphics = this.showData[this.editIndex];

      value = isNaN(Number(value)) ? value : Number(value);

      const targetGene = this.genes.filter(g => g.name === value)[0];

      switch (prop) {
        case 'mode':
          if (value === 0) {
            delete graphics.genes[obj.name];
          }
          this.refresh();
          break;
        case 'input':
          if (Array.isArray(graphics.attrs[obj.name])) {
            graphics.attrs[obj.name][obj.index] = value;

            if (graphics.genes[obj.name]) {
              graphics.genes[obj.name][obj.index] = null;
            }
          } else {
            graphics.attrs[obj.name] = value;
            delete graphics.genes[obj.name];
          }
          break;
        case 'gene':
          if (Array.isArray(graphics.attrs[obj.name])) {
            if (!graphics.genes[obj.name]) {
              graphics.genes[obj.name] = [];
            }
            graphics.genes[obj.name][obj.index] = targetGene;
          } else {
            graphics.genes[obj.name] = targetGene;
          }
          this.refresh();
          break;
        default:
      }
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
.sprite-list ul {
  display: inline-block;
}
.sprite-list ul li.selected{
  background-color: green;
  border-color: green;
  color: white;
}
.sprite-list ul li{
  margin: 0 5px;
  padding: 0 5px;
  border: 1px solid #999;
  display: inline-block;
  cursor: pointer;
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
