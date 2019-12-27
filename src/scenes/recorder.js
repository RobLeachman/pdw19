/* global Phaser */
import { assetsDPR } from '../index.js';
export class Recorder extends Phaser.Scene {
  constructor() {
    super("Recorder");
    console.log("Memorex?");
  }

  create() {
      var fontSize = 16*assetsDPR;
      this.add.text(10, 10, "Recorder BOJ", { font: `${fontSize}px Verdana`, fill: '#00ff00' });

      this.input.on('pointerdown', function () {
          this.scene.setVisible(false);
          this.scene.pause();
          this.scene.run("PlayGame");
          console.log("LOOP!");
      }, this);

  }
}
