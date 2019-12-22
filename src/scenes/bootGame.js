/* global Phaser */
import { assetsDPR } from '../index.js';
export class BootGame extends Phaser.Scene{
    constructor(){
        super("BootGame");
    }
    preload(){

        this.load.multiatlas("bigBackground", `assets/graphics/pdw1A@${assetsDPR}.json`, "assets/graphics");

        this.load.bitmapFont('gameplay-black', 'assets/fonts/gameplay-1987-black.png', 'assets/fonts/gameplay-1987-bw.fnt');
        this.load.bitmapFont('gameplay-white', 'assets/fonts/gameplay-1987-white.png', 'assets/fonts/gameplay-1987-bw.fnt');

        this.load.audio('testNoise', 'assets/sound/41525__Jamius__BigLaser_trimmed.wav');
    }

    create() {
        this.scene.start("PlayGame");
        //this.scene.start("TestScene");
    }
}