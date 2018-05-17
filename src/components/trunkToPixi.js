import {Circle, Rect} from './G';
import * as PIXI from 'pixi.js';

export default function trunkToPixi(data) {
  const graphics = [].concat(data).map(({g}) => {
    return g.map(g => {
      console.log('g:', g);
      switch(g.type) {
        case Rect.name:
          return new Rect({
            type: g.type,
            attrs: {
              ...g,
            },
          });
        case Circle.name:
          return new Circle({
            type: g.type,
            attrs: {
              ...g,
            },
          });
      }
    });
  });
  const g = new PIXI.Graphics();
  graphics.forEach(arr => {
    arr.forEach(obj => {
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
    })
  });
  return g;
}
