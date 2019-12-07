import Constant from "../constants.js";
import {getLocationX, getLocationY} from "./util.js";

export default class Market {

    constructor (game,spriteName,spot) {
        this.game = game;
        this.spot = spot;
        this.spriteName = spriteName;
        this.sprite = this.game.add.sprite(getLocationX(this.spot), getLocationY(this.spot), spriteName, 0).setOrigin(0,0);
        this.built = true;
    }

    interact (theMan) {
        if (!this.built) {
           if (theMan.carrying == Constant.THING) {
              this.sprite = this.game.add.sprite(getLocationX(this.spot), getLocationY(this.spot), "gasFactory", 0).setOrigin(0,0);

              theMan.sprite.setFrame(0);
              theMan.carrying = Constant.NOTHING;
              this.built = true;
           }
        } else {
           if (theMan.carrying == Constant.THING) {
              theMan.sprite.setFrame(0);
              theMan.carrying = Constant.NOTHING;
              console.log("MONEY");
           }
        }
    }
}
