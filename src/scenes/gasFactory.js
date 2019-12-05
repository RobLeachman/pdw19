import {getLocationX, getLocationY} from "./util.js";

const NOTHING = 0;
const THING = 1;
const GAS = 2;

export default class GasFactory {

    constructor (game,spriteName,spot) {
        this.game = game;
        this.spot = spot;
        this.spriteName = spriteName;
        this.sprite = this.game.add.sprite(getLocationX(this.spot), getLocationY(this.spot), spriteName, 0).setOrigin(0,0);
    }

    interact (theMan) {
        if (!this.built) {
           if (theMan.carrying == THING) {
              this.sprite = this.game.add.sprite(getLocationX(this.spot), getLocationY(this.spot), "gasFactory", 0).setOrigin(0,0);

              theMan.sprite.setFrame(0);
              theMan.carrying = NOTHING;
              this.built = true;
           }
        } else {
           if (theMan.carrying == THING) {
              theMan.sprite.setFrame(2);
              theMan.carrying = GAS;
           }
        }
    };
}
