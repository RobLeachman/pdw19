import 'phaser';
/* global Phaser */

import { SimpleScene } from './scenes/simple-scene';
import { BootGame } from './scenes/bootGame';
import { PlayGame } from './scenes/playGame';

const gameConfig = {
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
  pixelArt:true,
  scene: [BootGame, PlayGame]
};

var game = new Phaser.Game(gameConfig);

window.onload = function() {
  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
};

function resizeGame(){
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