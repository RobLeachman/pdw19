/* global Phaser */
import Constant from "../constants.js";
import FueledLocation from "./fueledLocation.js";
//import { assetsDPR, WIDTH, HEIGHT } from '../index.js';

export default class Laser extends FueledLocation {

    constructor (game,spriteName,spot) {
        super(game,spriteName,spot);
        this.built = true;

        this.isShooting = false;
        this.heat = 0;

    }



    shoot(x,y) {
        if (x>0) {
            if (this.heat > 50) {
                console.log("overheating!");
                this.isShooting = false;
            } else {
                if (!this.isShooting) {
                    console.log("start shooting ");
                    console.log("SHOOT IT " + x + "," + y);
                    this.isShooting = true;
                    this.line = this.game.add.line(0,0,683,450,x,y,0xff0000).setOrigin(0,0);
                }
            }
            this.heat++;
        } else if (this.isShooting) {
                console.log("stop shooting");
                this.isShooting = false;
                this.line.setAlpha(0);
                this.heat = 0;
        } else {
            this.heat = 0;
        }
    }

    chill() {
    }
}
