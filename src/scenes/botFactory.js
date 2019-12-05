/* global Phaser */
import {getLocationX, getLocationY} from "./util.js";

const NOTHING = 0;
const THING = 1;
const GAS = 2;

export default class BotFactory {
    constructor (game,spriteName,spot) {
        this.game = game;
        this.spriteName = spriteName;
        this.spot = spot;

        this.sprite = this.game.add.sprite(getLocationX(this.spot), getLocationY(this.spot), spriteName, 0).setOrigin(0,0);
        this.built = false;
        this.botsAvailable = 10;
    }

    interact (theMan, bots) {
        if (theMan.carrying == THING) {
           if (!this.built) {
              this.sprite = this.game.add.sprite(getLocationX(this.spot), getLocationY(this.spot), "botFactory", 0).setOrigin(0,0);

              theMan.sprite.setFrame(0);
              theMan.carrying = NOTHING;
              this.built = true;

              for (var i=0;i<this.botsAvailable;i++) {
                  var rect = new Phaser.Geom.Rectangle((this.sprite.x+5)+(i+1)*7, this.sprite.y+20, 5, 2);
                  var g = this.game.add.graphics({ fillStyle: { color: 0xff0000 } });
                  g.fillRectShape(rect);
              }

           } else {
               this.botsAvailable--;
               bots.push(1);
               var rect2 = new Phaser.Geom.Rectangle((this.sprite.x+5)+(bots.length)*7, this.sprite.y+20, 5, 2);
               var g2 = this.game.add.graphics({ fillStyle: { color: 0xffffff } });
               g2.fillRectShape(rect2);

           }
        }
    }
}