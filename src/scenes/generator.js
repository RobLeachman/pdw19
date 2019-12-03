import {getLocationX, getLocationY} from "./util.js";

const NOTHING = 0;
const THING = 1;
const GAS = 2;

export default function Generator(game, spriteName, spot) {
    this.spot = spot;
    this.sprite = game.add.sprite(getLocationX(spot), getLocationY(spot), spriteName, 0).setOrigin(0,0);
    this.built = false;

    this.interact = function (theMan) {
        if (!this.built) {
           if (theMan.carrying == THING) {
              this.sprite = game.add.sprite(getLocationX(spot), getLocationY(spot), "generator", 0).setOrigin(0,0);

              theMan.sprite.setFrame(0);
              theMan.carrying = NOTHING;
              this.built = true;
           }
        }
    };
}