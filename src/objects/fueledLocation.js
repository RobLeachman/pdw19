import Location from "./location.js";
import Sprite from "../sprite.js";
import {getLocationX, getLocationY} from "../util.js";

export default class FueledLocation extends Location {
    constructor (game,spriteName,spot) {
        super(game,spriteName,spot); // paint the thing at the spot

        this.fuelStoreSprite = "fuelStore/fuel";
        this.fuelBay = [10,10,10]; // hardcode they all start full, not great for base...
        this.fuelSprite = [];
        this.fuelSprite[0] = new Sprite(this.game, getLocationX(this.spot)+25, getLocationY(this.spot)+30, "bigBackground", `fuelStore/fuel${this.fuelBay[0]}`).setOrigin(0,0);
        this.fuelSprite[1] = new Sprite(this.game, getLocationX(this.spot)+4, getLocationY(this.spot)+30, "bigBackground", `fuelStore/fuel${this.fuelBay[1]}`).setOrigin(0,0);
        this.fuelSprite[2] = new Sprite(this.game, getLocationX(this.spot)+46, getLocationY(this.spot)+30, "bigBackground", `fuelStore/fuel${this.fuelBay[2]}`).setOrigin(0,0);

        this.upgrades = 1;
        if (spriteName != "base") {
            this.drawUpgrades();
        }
    }

    drawFuelBays() {
        for(let i = 0; i < 3; i++) {
           this.fuelSprite[i].setFrame(this.fuelStoreSprite+this.fuelBay[i]).setOrigin(0,0);
        }
    }

    drawUpgrades() {
        this.upgradeSprite = new Sprite(this.game, getLocationX(this.spot), getLocationY(this.spot), "bigBackground", "upgrades/1").setOrigin(0,0);
    }

    upgrade() {
        this.upgrades++;
        this.upgradeSprite.setFrame(`upgrades/${this.upgrades}`).setOrigin(0,0);
    }
    interact (theMan) {
       if (theMan.hasGas() && this.upgrades < 10) {
           this.upgrade();
           theMan.nowHasNothing();
       } else if (theMan.hasNothing()) {
           var full = this.fuelBay.findIndex(function(t) {
               return (t==10);
           });
           if (0<=full) {
               this.fuelBay[full] = 0;
               this.drawFuelBays();
               theMan.nowHasThing();
           }
       } else if (theMan.hasThing()) {
           var empty = this.fuelBay.findIndex(function(t) {
               return (t==0);
           });
           if (0<=empty) {
               this.fuelBay[empty] = 10;
               this.drawFuelBays();
               theMan.nowHasNothing();
           }
       }
    }
}
