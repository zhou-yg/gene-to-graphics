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

export class Polygon extends G {
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

export function categoryGraphics (graphicsList) {
  var r = {};
  const categoryMap = {
    other: '其它',
    eye: '眼',
    head: '头',
    horn: '角',
  };
  graphicsList.map(obj => {
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

  return r;
}
export function normalizeGraphics (graphicsData, genes) {


  function initShowData (d) {
    return d.map(originData => {
      originData = {
        ...originData,
        genes: Object.keys(originData.genes).map(prop => {
          const geneName = originData.genes[prop]

          if (!geneName) {
            return {};
          }
          return {
            [prop]: genes.filter(gen => gen.name === prop)[0],
          }
        }).reduce((p, c) => Object.assign(p, c), {}),
      }

      switch (originData.type) {
        case Rect.name:
          return new Rect(originData);
        case Circle.name:
          return new Circle(originData);
        case Polygon.name:
          return new Polygon(originData);
      }
    }).filter(_ => _);
  }

  const graphicsList = [].concat(graphicsData).map(obj => ({
    ...obj,
    id: obj._id,
    nameText: decodeURIComponent(obj.name),
    showData: initShowData(obj.showData || []),
  }));

  return graphicsList;
}
//
// module.exports = {
//   normalizeGraphics,
//   G,
//   Polygon,
//   Rect,
//   Circle,
// };
