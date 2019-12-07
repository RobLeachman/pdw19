import 'phaser';
/* global Phaser */

import { BootGame } from './scenes/bootGame';
import { PlayGame } from './scenes/playGame';
//import { TestScene } from './scenes/testScene';

const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
  pixelArt:true,
         physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 15 },
                debug: false
            }
        },
  //scene: [BootGame, PlayGame, TestScene]
  scene: [BootGame, PlayGame]
};

//console.log("index.js init");
var game = new Phaser.Game(gameConfig);

window.onload = function() {
  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
};

function resizeGame(){
    console.log("resized it!");
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}