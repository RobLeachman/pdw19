/* global Phaser */
import { assetsDPR } from '../index.js';
import Sprite from "../sprite.js";
import Constant from "../constants.js";

import Robot from "./robot.js";
import Human from "../objects/human.js";

export class TestScene extends Phaser.Scene {
  constructor() {
    super("TestScene");
    console.log("SHALL WE PLAY A GAME?");
  }

  create() {
    this.testBot = new Robot(this,1,0,false);
    this.testBot.path = 16;
    this.testBot.state = 8;
    this.testBot.step = 0;
    this.testBot.initStep();

    this.gameTime = 60; //total game time in seconds
    this.startTime = Date.now(); //record the snapshot of the time when game starts

    this.input.keyboard.on("keyup", this.handleKey, this);

    this.loopCount = 0;

    this.add.text(50, 150, "Test runs for 10 seconds", { font: '72px Arial', fill: '#ffffff', align: 'left' });
    this.gameTimeText = this.add.text(50, 220, "Seconds:" + this.currentGameTime, { font: '72px Arial', fill: '#ffffff', align: 'left' });
    this.testLoops = this.add.text(450, 220, "Loops:", { font: '72px Arial', fill: '#ffffff', align: 'left' });




    var manStart = { x: 0, y: 0};
    var start = new Phaser.Geom.Point(manStart.x,manStart.y); //TODO: a little clumbsy, but nice for testing vs having to edit the class
    this.man = new Human(this,start);
  }

  update(time, delta) {
    if (currentGameTime > -12)
        return;
    this.loopCount++;
    var currentGameTime = Math.floor((this.gameTime - ( Date.now() - this.startTime )) / 1000);

    if (currentGameTime > -11){
         this.gameTimeText.text = "Seconds " + currentGameTime*-1;
         this.testBot.act(null, this.loopCount, delta, this.testLoops);
    } else {
         this.add.text(50, 290, `End: ${this.testBot.sprite.x},${this.testBot.sprite.y}` , { font: '72px Arial', fill: '#ffffff', align: 'left' });
    }

/*
    if (!this.man.isMoving() && this.man.getBuffer() > -1) {
        this.makeMove(this.man.getBuffer());
        this.man.clearBuffer();
    }
    */
    if (this.man.isMoving()) {
        console.log("HE MOVES!");
        this.man.doMove(this.loopCount,delta);
    } else if (this.man.getBuffer() > -1) {
        this.makeMove(this.man.getBuffer());
        this.man.clearBuffer();
    }

  }

    makeMove(dir) {

        if (this.man.moveBuffer > -1)
            this.man.tryMove();
    }


    handleKey(e){
        //console.log(`start: ${timeKey}`);

        switch(e.code){
            case "KeyA":
            case "ArrowLeft":
                this.man.setBuffer(Constant.LEFT);
                break;
            case "KeyD":
            case "ArrowRight":
                this.man.setBuffer(Constant.RIGHT);
                break;
            case "KeyW":
            case "ArrowUp":
                this.man.setBuffer(Constant.UP);
                break;
            case "KeyS":
            case "ArrowDown":
                this.man.setBuffer(Constant.DOWN);
                break;
        }
    }


}