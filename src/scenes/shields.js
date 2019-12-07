/* global Phaser */
import {getLocationX, getLocationY} from "./util.js";

const NOTHING = 0;
const THING = 1;
const GAS = 2;

const DO_RESTBOT = 1;
const DO_TAKESTUFF = 2;
const DO_UPGRADE = 3;

export default class Shields {

    constructor (game,spriteName,spot,graphics) {
        this.game = game;
        this.spot = spot;
        this.spriteName = spriteName;
        this.graphics = graphics;
        this.sprite = this.game.add.sprite(getLocationX(this.spot), getLocationY(this.spot), spriteName, 0).setOrigin(0,0);
        this.built = true;
        this.upgrades = 1;

        this.fuelStoreSprite = "fuelStore";
        this.fuelBay = [0,10,10];
        this.fuelSprite = [];
        this.fuelSprite[1] = game.add.sprite(this.sprite.x+6,this.sprite.y+44,this.fuelStoreSprite,this.fuelBay[1]).setOrigin(0,0);
        this.fuelSprite[0] = game.add.sprite(this.sprite.x+33,this.sprite.y+44,this.fuelStoreSprite,this.fuelBay[0]).setOrigin(0,0);
        this.fuelSprite[2] = game.add.sprite(this.sprite.x+60,this.sprite.y+44,this.fuelStoreSprite,this.fuelBay[2]).setOrigin(0,0);
        this.drawUpgrades();
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
               var empty = this.fuelBay.findIndex(function(t) {
                   console.log(t);
                   return (t == 0);
               });
               console.log(empty);
               if (0<=empty) {
                   this.fuelBay[empty] = 10;
                   this.fuelSprite[empty].setFrame(10);
                   theMan.sprite.setFrame(0);
                   theMan.carrying = NOTHING;
               }
           } else if (theMan.carrying == GAS && this.upgrades < 11) {
               this.upgrades++;
               this.drawUpgrades();
               theMan.sprite.setFrame(0);
               theMan.carrying = NOTHING;
           }
        }
    }

    doAction(affect) {
        if (affect == DO_UPGRADE) {
               this.upgrades++;
               this.drawUpgrades();
        }
    }

    paint() {
        /* HARD WAY:
        var rect = new Phaser.Geom.Rectangle(400, 380, 330, 60);
        var g = this.game.add.graphics({ fillStyle: { color: 0xff0000 } });
        g.fillRectShape(rect);
        */

        if (1) {
            this.shieldBlock = this.game.add.rectangle(400, 380, 330, 30, 0x006fff).setOrigin(0,0);
            this.shieldBlock.setAlpha(.5);
            this.game.physics.add.existing(this.shieldBlock, true);
        }
    }

    getBlock() {
           return this.shieldBlock;
    }

    drawUpgrades() {
        //for i in range(0, self.upgrades):
        //    pygame.draw.rect(enviro.screen, [130,202,253], [left+6+i*7,top+73,5,5], 0)

        var rect = new Phaser.Geom.Rectangle(this.sprite.x+4, this.sprite.y+71, 80, 9);
        var g = this.game.add.graphics({ fillStyle: { color: 0x0000ff } });
        g.fillRectShape(rect);
        for (var u=0;u<this.upgrades;u++) {
            rect = new Phaser.Geom.Rectangle(this.sprite.x+6+u*7, this.sprite.y+73, 5, 5);
            g = this.game.add.graphics({ fillStyle: { color: 0x82CAFD } });
            g.fillRectShape(rect);
        }
    }
}
