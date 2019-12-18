/* global Phaser */
import { assetsDPR } from '../index.js';
export class BootGame extends Phaser.Scene{
    constructor(){
        super("BootGame");
    }
    preload(){

        //this.load.image("roadtest", "assets/graphics/road4locations.png");
        this.load.multiatlas("bigBackground", `assets/graphics/pdw1A@${assetsDPR}.json`, "assets/graphics");

        this.load.bitmapFont('gameplay-black', 'assets/fonts/gameplay-1987-black.png', 'assets/fonts/gameplay-1987-bw.fnt');
        this.load.bitmapFont('gameplay-white', 'assets/fonts/gameplay-1987-white.png', 'assets/fonts/gameplay-1987-bw.fnt');
    }

    create() {
        this.scene.start("PlayGame");
    }
}