import {getLocationX, getLocationY} from "./util.js";

const NOTHING = 0;
const THING = 1;
const GAS = 2;

export default function Base(game, spriteName, spot, fuelStoreSprite) {
//function Base(game, spriteName, spot, fuelStoreSprite) {
    this.spot = spot;
    this.sprite = game.add.sprite(getLocationX(spot), getLocationY(spot), spriteName, 0).setOrigin(0,0);
    this.fuelStoreSprite = fuelStoreSprite;
    this.fuelBay = [10,10,10];
    this.fuelSprite = [];
    this.fuelSprite[1] = game.add.sprite(this.sprite.x+6,this.sprite.y+35,this.fuelStoreSprite,this.fuelBay[1]).setOrigin(0,0);
    this.fuelSprite[0] = game.add.sprite(this.sprite.x+33,this.sprite.y+35,this.fuelStoreSprite,this.fuelBay[0]).setOrigin(0,0);
    this.fuelSprite[2] = game.add.sprite(this.sprite.x+60,this.sprite.y+35,this.fuelStoreSprite,this.fuelBay[2]).setOrigin(0,0);

    this.interact = function (theMan) {
        if (theMan.carrying == NOTHING) {
           if (this.takeStuff()) {
               theMan.sprite.setFrame(1);
               theMan.carrying = THING;
           }
        } else if (theMan.carrying == THING) {
           if (this.stashStuff()) {
              theMan.sprite.setFrame(0);
              theMan.carrying = NOTHING;
           }
        }
    };

    this.takeStuff = function () {
        for (var x=0;x<3;x++) {
            if (this.fuelBay[x] > 0) {
               this.fuelBay[x] = 0;
               this.repaint();
               return true;
            }
        }
        return false;
    };

    this.stashStuff = function () {
        for (var x=0;x<3;x++) {
            if (this.fuelBay[x] == 0) {
               this.fuelBay[x] = 10;
               this.repaint();
               return true;
            }
        }
        return false;
    };

    this.repaint = function() {
           this.fuelSprite[0].setFrame(this.fuelBay[0]);
           this.fuelSprite[1].setFrame(this.fuelBay[1]);
           this.fuelSprite[2].setFrame(this.fuelBay[2]);
    };
}