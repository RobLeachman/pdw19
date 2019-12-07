/* global Phaser */
import Constant from "../constants.js";
import {getLocationX, getLocationY} from "./util.js";

//TODO: this should be a class, duh
export default class Base {
    constructor(game, spriteName, spot, fuelStoreSprite) {
        this.game = game;
        this.spriteName = spriteName; // TODO: no
        this.spot = spot;
        this.fuelStoreSprite = fuelStoreSprite;

        this.sprite = game.add.sprite(getLocationX(spot), getLocationY(spot), spriteName, 0).setOrigin(0,0);
        this.fuelBay = [10,10,10];
        this.fuelSprite = [];
        this.fuelSprite[1] = game.add.sprite(this.sprite.x+6,this.sprite.y+35,this.fuelStoreSprite,this.fuelBay[1]).setOrigin(0,0);
        this.fuelSprite[0] = game.add.sprite(this.sprite.x+33,this.sprite.y+35,this.fuelStoreSprite,this.fuelBay[0]).setOrigin(0,0);
        this.fuelSprite[2] = game.add.sprite(this.sprite.x+60,this.sprite.y+35,this.fuelStoreSprite,this.fuelBay[2]).setOrigin(0,0);
        this.botCount = 0;
    }

    interact (theMan) {
        if (theMan.carrying == Constant.NOTHING) {
           if (this.takeStuff()) {
               theMan.sprite.setFrame(1);
               theMan.carrying = Constant.THING;
           }
        } else if (theMan.carrying == Constant.THING) {
           if (this.stashStuff()) {
              theMan.sprite.setFrame(0);
              theMan.carrying = Constant.NOTHING;
           }
        }
    }

    doAction (affect) {
        var rect, g;
        switch (affect) {
            case Constant.DO_RESTBOT:
                  this.botCount++;
                  rect = new Phaser.Geom.Rectangle((this.sprite.x+5)+(this.botCount)*7, this.sprite.y+20, 5, 2);
                  g = this.game.add.graphics({ fillStyle: { color: 0xff0000 } });
                  g.fillRectShape(rect);
                  break;
            case Constant.DO_TAKESTUFF:
                  this.takeStuff();
                  rect = new Phaser.Geom.Rectangle((this.sprite.x+5)+(this.botCount)*7, this.sprite.y+20, 5, 2);
                  g = this.game.add.graphics({ fillStyle: { color: 0xffffff } });
                  g.fillRectShape(rect);
                  this.botCount--;
                  break;

        }
    }

    takeStuff () {
        for (var x=0;x<3;x++) {
            if (this.fuelBay[x] > 0) {
               this.fuelBay[x] = 0;
               this.repaint();
               return true;
            }
        }
        return false;
    }

    stashStuff () {
        for (var x=0;x<3;x++) {
            if (this.fuelBay[x] == 0) {
               this.fuelBay[x] = 10;
               this.repaint();
               return true;
            }
        }
        return false;
    }

    repaint () {
           this.fuelSprite[0].setFrame(this.fuelBay[0]);
           this.fuelSprite[1].setFrame(this.fuelBay[1]);
           this.fuelSprite[2].setFrame(this.fuelBay[2]);
    }
}