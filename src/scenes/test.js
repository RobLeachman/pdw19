export class TestScene extends Phaser.Scene {
  constructor() {
    super("TestScene");
    console.log("constructed TestScene");
  }

  create() {
    var segTop = 300;
    var segBottom;
    console.log("start" + segTop);
    var fun = [2,4,5,6,7,7,7,7,7,8];
    var fun = [20,20,20,20,20,20,20,20,20,20];
    for (var i=fun.length;i>0;i--) {
      segBottom = segTop;
      segTop = segTop - fun[i-1];
      console.log(fun[i-1] + " " + segTop + " " + segBottom);
      var blue = 255 * (i/10);
      console.log(i + " BLUE " +blue );
      var notBlue = i*25;
      //console.log("blue:"+blue + "notBlue:" + notBlue);
      //this.add.rectangle(0, segTop, 800, segBottom-segTop, blue + (notBlue/250)*0x00ff00).setOrigin(0,0);
      //this.add.rectangle(0, segTop, 800, 20, blue + (notBlue/300)*0x00ff00).setOrigin(0,0);
      this.add.rectangle(0, segTop, 800, 20, blue).setOrigin(0,0);

    }
    //this.cameras.main.setZoom(1.55);
    //this.cameras.main.setScroll(-200,-95);
        //this.shieldBlock = this.add.rectangle(0, 100, 800, 50, 0x006fff).setOrigin(0,0);
        //this.shieldBlock.setAlpha(.5);
  }
}