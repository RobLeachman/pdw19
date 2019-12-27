import { assetsDPR } from '../index.js';

export default class Simulator {
  constructor(game) {
    this.game = game;
    console.log("Memorex?");

    this.recordedActions = [];
  }

  begin() {

      this.fun = this.game.add.bitmapText(50*assetsDPR, 160*assetsDPR, 'xolonium-black', "You are awesome" ,8*assetsDPR);
      this.fun.setScale(2,2);

      this.game.input.on('pointerdown', function () {
          console.log("LOOP!");
      }, this);

  }

  record(time, code) {
    console.log(`${code} at ${time}`);
    var action = {
      time: time,
      code: code
    }
    this.recordedActions.push(action);
  }

  list() {
    for (var i=0;i<this.recordedActions.length;i++) {
      var action = this.recordedActions[i];
      console.log(`${action.code} at ${action.time}`);
    }
    var start = this.recordedActions[0].time;
    console.log(`start at ${start}`);
    for (var i=0;i<this.recordedActions.length;i++) {
      var action = this.recordedActions[i];
      console.log(`${action.code} at ${action.time-start}`);
    }
    this.recording = JSON.stringify(this.recordedActions);
    console.log(this.recording);
  }
}

