import Sprite from "../sprite.js";
import {getLocationX, getLocationY} from "./util.js";
import Robot from "./robot.js";

/**
 * Once built, keep a list of available bots and spawn as required.
 */
export default class BotFactory {
    constructor (game,spot) {
        this.game = game;
        this.spot = spot;

        this.sprite = new Sprite(this.game, getLocationX(this.spot), getLocationY(this.spot), "bigBackground", "botFactoryPad").setOrigin(0,0);
        this.built = false;
        this.botsAvailable = 10;
        this.botList = [];

        // two rows, lazy way
        for (var i=0;i<this.botsAvailable/2;i++) {
            var botCounter = {
                x: getLocationX(this.spot)+4+(i*12.5),
                y: getLocationY(this.spot)+53,
                sprite: new Sprite(this.game, getLocationX(this.spot)+4+(i*12.5), getLocationY(this.spot)+53, "bigBackground", "botCounter").setOrigin(0,0),
            };
            botCounter.sprite.setAlpha(0);
            this.botList.push(botCounter);
        }
        for (var i=0;i<this.botsAvailable/2;i++) {
            botCounter = {
                x: getLocationX(this.spot)+4+(i*12.5),
                y: getLocationY(this.spot)+56,
                sprite: new Sprite(this.game, getLocationX(this.spot)+4+(i*12.5), getLocationY(this.spot)+56, "bigBackground", "botCounter").setOrigin(0,0)
            };
            botCounter.sprite.setAlpha(0);
            this.botList.push(botCounter);
        }
    }

    interact (theMan, bots) {
        if (theMan.hasThing()) {
           if (!this.built) {
               this.build();
               theMan.nowHasNothing();
           } else if (bots.length < 10) {
               theMan.nowHasNothing();
               this.botsAvailable--;
               this.botList[bots.length].sprite.setAlpha(0);

               var newBot = new Robot(this.game);
               bots.push(newBot);
           }
        }
    }
    build() {
        this.sprite.setFrame("botFactory").setOrigin(0,0);
        for (var i=0;i<this.botList.length;i++) {
          this.botList[i].sprite.setAlpha(1);
        }
        this.built = true;
    }
}
