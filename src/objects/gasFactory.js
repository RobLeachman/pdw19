import Constant from "../constants.js";
import Sprite from "../sprite.js";
import {getLocationX, getLocationY} from "../util.js";

export default class GasFactory {

    constructor (game,spriteName,spot) {
        this.game = game;
        this.spot = spot;
        this.spriteName = spriteName;
        this.sprite = new Sprite(this.game, getLocationX(this.spot), getLocationY(this.spot), "bigBackground", spriteName).setOrigin(0,0);

        this.name = "GasFactory";
        this.built = false;
        this.saveState = ["built"];
    }

    interact (theMan) {
        if (theMan.isCarrying(Constant.THING)) {
           if (!this.built) {
              this.build();
              theMan.isNowCarrying(Constant.NOTHING);
           } else {
              theMan.isNowCarrying(Constant.GAS);
           }
        }
    }

    build() {
        this.sprite.setFrame("gasFactory").setOrigin(0,0);
        this.built = true;
    }
}
