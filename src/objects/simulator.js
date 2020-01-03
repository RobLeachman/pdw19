import { assetsDPR } from '../index.js';
import { stringify, parse } from 'zipson';
import { getCookie, setCookie } from '../util';


//TODO: fix the horror that is scoping in this object
export default class Simulator {
  constructor(game) {
    this.game = game;

    this.recordedActions = [];
    this.mode = getCookie("mode");
    if (typeof this.mode == "undefined" || !this.mode) {
      this.mode = "idle";
      setCookie("mode", this.mode, 7);
    }
    console.log(`Simulator mode: ${this.mode}`);
  }

  getMode() {
    return this.mode;
  }
  setMode(newMode) {
    setCookie("mode", newMode, 7);
  }

  record(time, code) {
    console.log(`simulator recorded ${code} at ${time}`);
    var action = {
      time: time,
      code: code
    }
    this.recordedActions.push(action);
  }

  reset() {
    this.recordedActions = [];
    this.save();
    this.setMode("idle");
  }

  save() {
    for (var i=0;i<this.recordedActions.length;i++) {
      var action = this.recordedActions[i];
      console.log(`save: ${action.code} at ${action.time}`);
    }
    //this.list();

    // zipson fallback
    //this.recording = stringify(this.recordedActions);
    this.recording = JSON.stringify(this.recordedActions);

    //console.log(this.recording);
    return this.recording;
  }

  load(recording) {
    //console.log("recording:");
    //console.log(recording);
    try {
      //this.recordedActions = parse(recording);
      this.recordedActions = JSON.parse(recording);
    } catch (err) {
      console.log("invalid recording!");
      this.recordedActions = null;
    }
    //this.list();
    return this.recordedActions;
  }

  list() {
    //console.log("sim current recording:");
    //console.log(this.recordedActions);
    if (this.recordedActions.length < 1) {
      console.log("no recording");
      return;
    }

    var start = this.recordedActions[0].time;
    console.log(`start at ${start}`);
    for (var i=0;i<this.recordedActions.length;i++) {
      var action = this.recordedActions[i];
      console.log(`${action.code} at ${action.time-start}`);
    }
  }

  getRecording(skipToZero) {
    this.load(getCookie("test1"));
    if (this.recordedActions.length < 1)
        return this.recordedActions;

    if (skipToZero) {
      var zeroRecordedActions = [];
      var start = this.recordedActions[0].time;
      //console.log(`zero start at ${start}`);
      for (var i=0;i<this.recordedActions.length;i++) {
        var action = this.recordedActions[i];
        //console.log(`${action.code} at ${action.time-start}`);
        var zeroAction = {
            code: action.code,
            time: action.time - start
        }
        zeroRecordedActions.push(zeroAction);
      }
      this.recordedActions = zeroRecordedActions;
      return this.recordedActions;
    } else {
      return this.recordedActions;
    }
  }

  putRecording() {
    setCookie("test1",this.save(),7);
  }

  stuff(gameState) {
      //TODO this crashes, maybe can be fixed....
      //return stringify(gameState);

      console.log("STUFF IT");
      console.log(gameState);
      //const stuffState = stringify(gameState);
      const stuffState = JSON.stringify(gameState);

      console.log("STUFFED");
      console.log(stuffState);
      return (stuffState);
  }
}
