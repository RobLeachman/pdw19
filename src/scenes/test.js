/* global Phaser */
import Simulator from "../objects/simulator.js";

export class TestScene extends Phaser.Scene {
  constructor() {
    super("TestScene");
    console.log("SHALL WE PLAY A GAME?");
  }

  create() {
    //this.add.image(0, 0, "bossScreen").setOrigin(0, 0).setScale(2,2);

    this.startTime = Date.now(); //record the snapshot of the time when game starts

    this.simulator = new Simulator(this);

    this.input.keyboard.on("keyup", this.handleKey, this);

    //this.recordingRaw = getCookie("test1");
    //console.log(`raw cookie ${this.recordingRaw}`);
    //this.simulator.load(this.recordingRaw);
    this.recording = this.simulator.getRecording();
  }

    handleKey(e){
        console.log(e.code);
        var timeKey = Math.round(this.time.now);
        if (e.code == "KeyX") {
            console.log("STOP RECORD");
            //var recording = this.simulator.save();
            //setCookie("test1",recording,7);
            this.simulator.putRecording();
        } else if (e.code == "Backslash") {
            console.log("RESET");
            this.simulator.reset();
        } else
            this.simulator.record(timeKey, e.code);

    }
}

