export class G {
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

export class Polygon extends G {
  constructor (initial = {}) {
    super(initial);
    if (!initial.attrs) {
      this.attrs = {
        pointers: [],
        fill: '#000000',
      }
    }
  }
}

export class Rect extends G {
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

export class Circle extends G {
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
