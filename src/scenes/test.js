/* global Phaser */
import { assetsDPR } from '../index.js';
import Sprite from "../sprite.js";
import {deathCrater} from "./util.js"

var t=0;
var r=0;
var d = 200;
var red=true;

export class TestScene extends Phaser.Scene {
  constructor() {
    super("TestScene");
    console.log("SHALL WE PLAY A GAME?");
  }

  create() {
    deathCrater(this,150,150);
    /*
        var thisGame = this;

        var myDebug = thisGame.add.graphics({
          x: 0,
        y: 0
        });
        myDebug.clear();
        myDebug.beginPath();
        myDebug.setDepth(d);
        if (red) {
          red = false;
          myDebug.fillStyle(0xff0000,1-r/20);
        } else {
          red = true;
          myDebug.fillStyle(0xffffff,1-r/20);
        }
        myDebug.fillCircle(200, 200,(200-d)*15);
        */

  }

  update() {
    if (r>100)
       return;
    t++;
    r++;
    if (t>2) {
        t=0;
        var myDebug = this.add.graphics({
          x: 0,
        y: 0
        });
        d--;
        var alpha = (1-r/100)*1;
        console.log(`r ${r} alpha ${alpha}`);
        myDebug.clear();
        myDebug.beginPath();
        myDebug.setDepth(d);
        if (red) {
          red = false;
          myDebug.fillStyle(0xff0000,alpha);
        } else {
          red = true;
          myDebug.fillStyle(0xffffff,alpha);
        }
        myDebug.fillCircle(200, 200,(200-d)*25*r/50);
        myDebug.closePath();

    }
  }
}