// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({1:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.normalizeGraphics = normalizeGraphics;
class G {
  constructor(initial) {
    this.type = initial.type || '';
    this.attrs = initial.attrs || {};
    this.genes = initial.genes || {};
  }
  getAttrs() {
    const attrKeys = Object.keys(this.attrs);
    return attrKeys.map(k => {
      const gene = this.genes[k];

      if (Array.isArray(this.attrs[k])) {
        let geneArr = gene || [];
        return {
          [k]: this.attrs[k].map((v, i) => {
            return geneArr[i] ? geneArr[i].express || 0 : v;
          })
        };
      }
      return {
        [k]: gene ? gene.express ? gene.express : 0 : this.attrs[k]
      };
    }).reduce((p, c) => Object.assign(p, c), {});
  }
  output() {
    return _extends({
      type: this.type
    }, this.getAttrs());
  }
}

exports.G = G;
class Polygon extends G {
  constructor(initial = {}) {
    super(initial);
    this.type = Polygon.name;
    if (!initial.attrs) {
      this.attrs = {
        pointers: [20, 20, 100, 20, 100, 100, 20, 20],
        fill: '#000000'
      };
    }
  }
}

exports.Polygon = Polygon;
class Rect extends G {
  constructor(initial = {}) {
    super(initial);
    this.type = Rect.name;
    if (!initial.attrs) {
      this.attrs = {
        x: 20,
        y: 20,
        w: 80,
        h: 50,
        fill: '#000000'
      };
    }
  }
}

exports.Rect = Rect;
class Circle extends G {
  constructor(initial = {}) {
    super(initial);
    this.type = Circle.name;
    if (!initial.attrs) {
      this.attrs = {
        x: 100,
        y: 100,
        r: 30,
        fill: '#000000'
      };
    }
  }
}

exports.Circle = Circle;
function normalizeGraphics(graphicsData, genes) {

  function initShowData(d) {
    return d.map(originData => {
      originData = _extends({}, originData, {
        genes: Object.keys(originData.genes).map(prop => {
          const geneName = originData.genes[prop];

          if (!geneName) {
            return {};
          }
          return {
            [prop]: genes.filter(gen => gen.name === prop)[0]
          };
        }).reduce((p, c) => Object.assign(p, c), {})
      });

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

  const graphicsList = [].concat(graphicsData).map(obj => _extends({}, obj, {
    id: obj._id,
    nameText: decodeURIComponent(obj.name),
    showData: initShowData(obj.showData || [])
  }));

  var r = {};
  const categoryMap = {
    other: '其它',
    eye: '眼',
    head: '头',
    horn: '角'
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
        graphicsList: []
      };
    }
    var list = r[category];
    list.graphicsList.push(obj);
  });
  r = Object.values(r);

  return r;
}
//
// module.exports = {
//   normalizeGraphics,
//   G,
//   Polygon,
//   Rect,
//   Circle,
// };
},{}]},{},[1], null)
//# sourceMappingURL=/G.map