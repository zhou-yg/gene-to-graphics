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
          <li>circle</li>
          <li @click="refresh" >刷新</li>
        </ul>
      </header>
      <header>
        属性：
      </header>
      <div id="svg">

      </div>
    </div>

  </el-dialog>
</template>

<script>
import pick from 'lodash/pick';
import Raphael from 'raphael';

class G {
  constructor () {
    this.type = '';
    this.attrs = {};
    this.genes = {};
  }
  getAttrs () {
    const attrKeys = Object.keys(this.attrs);
    return attrKeys.map(k => {
      const gene = this.genes[k];
      return {
        [k]: gene ? gene.getExpress() : this.attrs[k],
      }
    }).reduce((p, c) => Object.assign(p, c), {});
  }
}

class Rect extends G {
  constructor () {
    super();
    this.type = 'rect'
    this.attrs = {
      x: 20,
      y: 20,
      w: 80,
      h: 50,
      fill: '#000000',
    };
  }
}

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      isShow: true,
      showData: [
      ],
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.r = Raphael('svg')
    });
  },
  computed: {
  },
  methods: {
    show (config = {}) {
      this.isShow = true;
      Object.assign(this.shoData, config)
    },
    insertRect () {
      this.showData.push(new Rect());
      this.refresh();
    },
    refresh () {
      this.showData.forEach(obj => {
        var g;
        switch (obj.type) {
          case 'rect':
            let {x,y,w,h} = obj.getAttrs();
            g = this.r.rect(x,y,w,h);
            break;
          default:
        }
        g.attr({
          fill: obj.getAttrs().fill,
        });
      })
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
.graphics-dialog header ul {
  display: inline-block;
}
.graphics-dialog header li {
  margin-right: 4px;
  border: 1px solid #eee;
  padding: 4px 10px;
  display: inline-block;
  cursor: pointer;
}
.graphics-dialog header li:hover {
  background-color: #999;
  color: #fff;
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
