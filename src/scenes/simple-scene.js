export class SimpleScene extends Phaser.Scene {
  constructor() {
    console.log("constructed simple");
    super("SimpleScene");
  }
  preload() {
    //this.load.image('cokecan', 'assets/cokecan.png');
  }

  create() {
    this.cameras.main.setZoom(1.55);
    this.cameras.main.setScroll(-200,-95);
    this.add.image(0, 0, "road").setOrigin(0, 0);
  }
}