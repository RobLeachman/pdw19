import 'phaser';
/* global Phaser */

import { BootGame } from './scenes/bootGame';
import { PlayGame } from './scenes/playGame';
import { TestScene } from './scenes/test';

/* yannick's https://github.com/yandeu/phaser3-optimal-resolution */
const roundHalf = num => Math.round(num * 2) / 2;

const graphicsSettings = { best: 1, medium: 0.75, low: 0.5 };

// we want to scale our window according to the device capabilities...
//const DPR = window.devicePixelRatio * graphicsSettings.best;

// but, for now let's be sure it looks nice while testing!
const DPR = 4; // so it looks nice while testing?




//const { width, height } = window.screen;
//const width = window.innerWidth;
//const height = window.innerHeight;


// base resolution is 640x480 @4
//export const WIDTH = Math.round(Math.max(width, height) * DPR);
//export const HEIGHT = Math.round(Math.min(width, height) * DPR);
export const WIDTH = 640 * DPR;
export const HEIGHT = 480 * DPR;

// will be 1, 1.5, 2, 2.5, 3, 3.5 or 4
export const assetsDPR = roundHalf(Math.min(Math.max(HEIGHT / 480, 1), 4));


console.log('DPR = ', DPR);
console.log('assetsDPR = ', assetsDPR);
console.log('WIDTH = ', WIDTH);
console.log('HEIGHT = ', HEIGHT);

const gameConfig = {
  backgroundColor: 0x000000,

  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT
  },

  pixelArt:true,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 15 },
          debug: false
      }
  },
  //scene: [BootGame, PlayGame, TestScene]
  scene: [BootGame, PlayGame]
};


window.addEventListener('load', () => {
  new Phaser.Game(gameConfig);
});