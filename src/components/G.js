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

      if (Array.isArray(this.attrs[k])) {
        let geneArr = gene || [];
        return {
          [k]: this.attrs[k].map((v, i) => {
            return geneArr[i] ? (geneArr[i].express || 0) : v;
          }),
        };
      }
      return {
        [k]: gene ? gene.express ? gene.express : 0 : this.attrs[k],
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

class Polygon extends G {
  constructor (initial = {}) {
    super(initial);
    this.type = Polygon.name;
    if (!initial.attrs) {
      this.attrs = {
        pointers: [20, 20, 100, 20, 100, 100, 20, 20],
        fill: '#000000',
      }
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

exports.G = G;
exports.Polygon = Polygon;
exports.Rect = Rect;
exports.Circle = Circle;
