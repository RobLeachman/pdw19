/* global Phaser */
import Simulator from "../objects/simulator.js";

export class TestScene extends Phaser.Scene {
  constructor() {
    super("TestScene");
    console.log("SHALL WE PLAY A GAME?");
  }

  create() {
    this.add.image(0, 0, "bossScreen").setOrigin(0, 0).setScale(2,2);

    this.startTime = Date.now(); //record the snapshot of the time when game starts

    this.simulator = new Simulator(this);
    this.simulator.begin();

    this.input.keyboard.on("keyup", this.handleKey, this);

    this.recording = getCookie("test1");
    console.log(`raw cookie ${this.recording}`);
  }

  update() {
    //console.log("tested");
  }

    handleKey(e){
        var timeKey = Math.round(this.time.now);
        if (e.code == "KeyX") {
            console.log("STOP RECORD");
            setCookie("test1","strinnnnnnnnnnng",7);
            this.simulator.list();
        } else
            this.simulator.record(timeKey, e.code);
    }
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}