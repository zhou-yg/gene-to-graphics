import pick from 'lodash/pick';

const calMap = ['加法', '减法'];
const outputMap = ['数字', '颜色'];

function numToHex(num) {
    var hex = num.toString(16);
    while(hex.length < 6) {
        hex = '0' + hex;
    }
    return hex;
}
function combineColors (hex1, hex2) {
    const hexArr = hex1.split('');
    const hexArr2 = hex2.split('');

    const r1 = parseInt(`0x${hexArr[0]}${hexArr[1]}`);
    const g1 = parseInt(`0x${hexArr[2]}${hexArr[3]}`);
    const b1 = parseInt(`0x${hexArr[4]}${hexArr[5]}`);

    const r2 = parseInt(`0x${hexArr2[0]}${hexArr2[1]}`);
    const g2 = parseInt(`0x${hexArr2[2]}${hexArr2[3]}`);
    const b2 = parseInt(`0x${hexArr2[4]}${hexArr2[5]}`);

    return ((r1 + r2)/2).toString(16) + ((g1 + g2)/2).toString(16) + ((b1 + b2)/2).toString(16);
}

export default class Gene {
  constructor (obj) {
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
      rightGeneValue: Number(obj.rightGeneValue),
    };

    Object.assign(this, obj, this.setting);
  }
  clone (absoluteValue) {
    return new Gene({
      absolute: absoluteValue,
      ...pick(this, Object.keys(this.setting)),
    });
  }
  getRandomValue () {
    const g1 = Math.abs(this.leftGeneValueMax - this.leftGeneValue);
    const g2 = Math.abs(this.rightGeneValueMax - this.rightGeneValue);

    return [
      parseInt(g1 * Math.random() + this.leftGeneValue),
      parseInt(g2 * Math.random() + this.rightGeneValue)
    ];
  }
  clearAbsolute () {
    this.absolute = null;
  }
  get express () {
    if (this.absolute !== null) {
      return this.absolute;
    }
    if (this.resultCache && this.resultCache !== 0) {
      return this.resultCache;
    }
    var result = 0;
    const [l, r] = this.getRandomValue();
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
    },0);
    return result;
  }
}
