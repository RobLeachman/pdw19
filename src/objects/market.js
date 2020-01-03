import Location from "./location.js";
import { assetsDPR } from '../index.js';

export default class Market extends Location {

    constructor (game,spriteName,spot) {
        super(game,spriteName,spot);
        this.score = 0;
        this.displayScore = this.game.add.bitmapText(325*assetsDPR, 416*assetsDPR, 'gameplay-black', "$0",10*assetsDPR);
        this.displayScore.setAlpha(0);
        this.name = "Market";

        this.saveState = ["score"]
    }

    interact (theMan) {
        if (theMan.hasThing()) {
            theMan.nowHasNothing();
            this.score += 1000;
            this.displayScore.setAlpha(1);
            this.displayScore.setText(`\$${this.score}`);
        }
    }
    getScore() {
        return this.score;
    }
}
