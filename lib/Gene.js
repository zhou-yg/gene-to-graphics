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
})({2:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const calMap = ['加法', '减法'];
const outputMap = ['数字', '颜色'];

function numToHex(num) {
  var hex = num.toString(16);
  while (hex.length < 6) {
    hex = '0' + hex;
  }
  return hex;
}
function combineColors(hex1, hex2) {
  const hexArr = hex1.split('');
  const hexArr2 = hex2.split('');

  const r1 = parseInt(`0x${hexArr[0]}${hexArr[1]}`);
  const g1 = parseInt(`0x${hexArr[2]}${hexArr[3]}`);
  const b1 = parseInt(`0x${hexArr[4]}${hexArr[5]}`);

  const r2 = parseInt(`0x${hexArr2[0]}${hexArr2[1]}`);
  const g2 = parseInt(`0x${hexArr2[2]}${hexArr2[3]}`);
  const b2 = parseInt(`0x${hexArr2[4]}${hexArr2[5]}`);

  return ((r1 + r2) / 2).toString(16) + ((g1 + g2) / 2).toString(16) + ((b1 + b2) / 2).toString(16);
}

class Gene {
  constructor(obj) {
    var name;
    try {
      name = decodeURIComponent(obj.name);
    } catch (e) {
      name = obj.name;
    }

    this.setting = {
      absolute: obj.absolute || null,
      name,
      id: obj._id,
      calTypeText: calMap[obj.calType],
      outputTypeText: outputMap[obj.outputType],
      leftGeneValue: Number(obj.leftGeneValue),
      rightGeneValue: Number(obj.rightGeneValue)
    };

    Object.assign(this, obj, this.setting);
  }
  clone(absoluteValue) {
    return new Gene(_extends({
      absolute: absoluteValue
    }, (0, _pick2.default)(this, Object.keys(this.setting))));
  }
  getRandomValue() {
    const g1 = Math.abs(this.leftGeneValueMax - this.leftGeneValue);
    const g2 = Math.abs(this.rightGeneValueMax - this.rightGeneValue);

    return [parseInt(g1 * Math.random() + this.leftGeneValue), parseInt(g2 * Math.random() + this.rightGeneValue)];
  }
  clearAbsolute() {
    this.absolute = null;
  }
  get express() {
    if (this.absolute !== null) {
      return this.absolute;
    }
    if (this.resultCache && this.resultCache !== 0) {
      return this.resultCache;
    }
    var result = 0;

    var _getRandomValue = this.getRandomValue(),
        _getRandomValue2 = _slicedToArray(_getRandomValue, 2);

    const l = _getRandomValue2[0],
          r = _getRandomValue2[1];

    switch (this.outputType) {
      case 1:
        return combineColors(numToHex(l), numToHex(r));
    }

    switch (this.calType) {
      case 0:
        result = l + r;
        break;
      case 1:
        result = l - r;
        break;
    }
    this.resultCache = result;
    setTimeout(() => {
      this.resultCache = null;
    }, 0);
    return result;
  }
}
exports.default = Gene;
},{}]},{},[2], null)
//# sourceMappingURL=/Gene.map