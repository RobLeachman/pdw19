/* global Phaser */
import { assetsDPR } from '../index.js';
import Sprite from "../sprite.js";

export class TestScene extends Phaser.Scene {
  constructor() {
    super("TestScene");
    console.log("WOULD YOU CARE TO PLAY A GAME?");
  }

  create() {

    var blockTop = 350;
    var blockBottom = 20;

    this.box = this.add.rectangle(318*assetsDPR, blockTop*assetsDPR, 270*assetsDPR, blockBottom*assetsDPR, 0x808080).setOrigin(0,0);
    this.physics.add.existing(this.box, false);
    this.box.body.immovable = true;

    this.theseSprites = [];
    for (var i=0;i<3;i++) {
      this.theseSprites[i] = this.physics.add.sprite((500+i*20)*assetsDPR, (blockTop-i*50-50)*assetsDPR, "bigBackground", "bomb/0", 0);
      this.theseSprites[i].setAcceleration(0,100);
      this.physics.add.overlap(this.theseSprites[i], this.box, this.absorbed, null, this);
    }

  }

  update() {
    this.box.y = this.box.y - 5;
  }

  absorbed (sprite){
    console.log("absorbed!");
    new Sprite(this, sprite.x/assetsDPR, sprite.y/assetsDPR, "bigBackground", "bomb/0");
    sprite.disableBody(true,true); // get rid of the physical one

  }
}