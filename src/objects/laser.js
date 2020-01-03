/* global Phaser */
import FueledLocation from "./fueledLocation.js";
import { assetsDPR } from '../index.js';
//import { assetsDPR, WIDTH, HEIGHT } from '../index.js';

export default class Laser extends FueledLocation {

    constructor (game,spriteName,spot) {
        super(game,spriteName,spot);
        this.built = true;

        this.isShooting = false;
        this.heat = 0;
        this.name = "Laser";
        this.saveState = ["fuelBay", "upgrades"];
    }

    shoot(x,y) {
        //console.log(`SHOOT ${x},${y}`);
        if (x>0) {
            if (this.heat > 50) {
                //console.log("overheating!");
                this.isShooting = false;
            } else {
                if (!this.isShooting) {
                    //console.log("start shooting ");
                    //console.log("SHOOT IT " + x + "," + y);
                    this.isShooting = true;
                    this.targetX = x; this.targetY = y;
                    this.line = this.game.add.line(0,0,580*assetsDPR,367*assetsDPR,x,y,0xff0000).setOrigin(0,0);
                    this.hitCircle = new Phaser.Geom.Circle(x,y,100);
                    this.testCircle = this.game.add.graphics({
                      x:0,
                      y:0
                    });
                    this.testCircle.lineStyle(5,0xff0000);
                    this.testCircle.strokeCircleShape(this.hitCircle);
                    this.testCircle.closePath();
                    // ultimately we won't draw it at all, for now hide it
                    this.testCircle.setAlpha(0);
                }
            }
            this.heat++;
        } else if (this.isShooting) {
                //console.log("stop shooting");
                this.isShooting = false;
                this.line.setAlpha(0);
                this.testCircle.setAlpha(0);
                this.heat = 0;
        } else {
            this.heat = 0;
        }
    }

    isShooting() {
        //console.log(`IsShooting? ${this.isShooting}`);
        return this.isShooting;
    }

    // will need an array of fighters but otherwise this is mostly decent?
    lockTarget(mother, fighter, bombList) {
        var victim = null;
        if (typeof mother != "undefined" && Phaser.Geom.Circle.ContainsPoint(this.hitCircle, mother.sprite)) {
            victim = mother;
        }
        if (typeof fighter != "undefined" && Phaser.Geom.Circle.ContainsPoint(this.hitCircle, fighter.sprite)) {
            victim = fighter;
        }
        for (var b=0;b<bombList.length;b++) {
            if (Phaser.Geom.Circle.ContainsPoint(this.hitCircle, bombList[b].sprite)) {
                victim=bombList[b];
                break;
            }
        }
        if (victim != null) {
            this.shoot(-1,-1);
        }
        return victim;
    }

    victory() {
        this.line.setAlpha(0);
        this.testCircle.setAlpha(0);
    }
}