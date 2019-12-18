import Constant from "../constants.js";
import { assetsDPR, WIDTH, HEIGHT } from '../index.js';
import Sprite from "../sprite.js";
import {getLocationX, getLocationY} from "./util.js";

export default class GasFactory {

    constructor (game,spriteName,spot) {
        this.game = game;
        this.spot = spot;
        this.spriteName = spriteName;
        this.sprite = new Sprite(this.game, getLocationX(this.spot), getLocationY(this.spot), "bigBackground", spriteName).setOrigin(0,0);
    }

    interact (theMan) {
        if (theMan.isCarrying(Constant.THING)) {
           if (!this.built) {
              this.sprite.setFrame("gasFactory").setOrigin(0,0);
              this.built = true;
              theMan.isNowCarrying(Constant.NOTHING);
           } else {
              theMan.isNowCarrying(Constant.GAS);
           }
        }
    };
}
