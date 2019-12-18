/* global Phaser */
import {getLocationX, getLocationY} from "./util.js";
//import { assetsDPR, WIDTH, HEIGHT } from '../index.js';
import Sprite from "../sprite.js";

export default class Location {
    constructor (game,spriteName,spot) {
        this.game = game;
        this.spot = spot;
        this.spriteName = spriteName; //TODO: don't need to save it?
        this.sprite = new Sprite(this.game, getLocationX(this.spot), getLocationY(this.spot), "bigBackground", spriteName).setOrigin(0,0);
    }
}