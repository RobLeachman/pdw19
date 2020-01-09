import Constant from "../constants.js";
import { assetsDPR } from '../index.js';
import Sprite from "../sprite.js";
import {getLocationX, getLocationY} from "../util.js";

const VACANT = 0;
const GENERATING = 1;
const READY = 2;
const EMPTY = 3;

const GENERATOR_SPEED=30;

/**
 * Construct a new generator at the given spot and with the indicated sprite,
 * vacant state, and with an animation ready to play when transitioning to
 * state ready, or empty when we're out of fuel. The first generator is pre-built
 * using a different sprite, and we call regen to set the state for that one.
 */
export default class Generator {
    constructor (game,spriteName,spot) {
        this.game = game;
        this.spot = spot;
        this.name = "Generator";
        this.fuel = 0;

        this.sprite = new Sprite(this.game, getLocationX(this.spot), getLocationY(this.spot), "bigBackground", spriteName).setOrigin(0,0);
        this.state = VACANT;
        this.collectPending = false;

        this.saveState = ["spot", "fuel", "state"];
        this.idle = true; //TODO: unused, perhaps not needed?


        this.genSprite = new Sprite(this.game, this.sprite.x/assetsDPR+36,this.sprite.y/assetsDPR+40, "bigBackground", "generating/1");
        this.genSprite.alpha = 0;
        var frameNames = this.game.anims.generateFrameNames('bigBackground', {
                         start: 14, end: 1,
                         prefix: 'generating/'
                     });
        this.game.anims.create({key:'generateStuff', frames:frameNames, frameRate:GENERATOR_SPEED});
    }

    interact(theMan) {
        if (this.state == VACANT) {
           if (theMan.isCarrying() == Constant.THING) {
              this.sprite.setFrame("generator").setOrigin(0,0);

              theMan.isNowCarrying(Constant.NOTHING);
              this.regenerate(true);
           }
        } else if (this.state == READY) {
            if (theMan.isCarrying() == Constant.NOTHING) {
               theMan.isNowCarrying(Constant.THING);
               //this.genSprite.alpha = 0;
               this.regenerate(false);
            }
        } else {
            //console.log("you wait, either generating or empty");
        }
        if (theMan.isCarrying() == Constant.GAS && this.fuel < 3) {
            theMan.isNowCarrying(Constant.NOTHING);
            this.fuel = 3;
            if (this.state == EMPTY) {
                this.regenerate(false);
            } else {
                this.gauge = new Sprite(this.game, this.sprite.x/assetsDPR+36,this.sprite.y/assetsDPR+22, "bigBackground", "gauge/gauge" + this.fuel);
            }
        }
    }
    doAction (affect) {
        switch (affect) {
            case Constant.DO_TAKESTUFF:
                this.collectionCompleted();
                this.regenerate(false);
                break;
        }
    }

    // init with full tank and a thing, then make more if fueled, set state empty when no more fuel
    regenerate(init) {
        this.genSprite.alpha = 0;
        if (init) {
            this.makeThing();
            this.fuel = 3;
            this.gauge = new Sprite(this.game, this.sprite.x/assetsDPR+36,this.sprite.y/assetsDPR+22, "bigBackground", "gauge/gauge" + this.fuel);
        } else if (this.fuel > 0) {
            this.makeThing();
            this.fuel--;
        } else {
            this.state = EMPTY;
        }
        this.gauge.setFrame("gauge/gauge" + this.fuel);
    }

    makeThing() {
          this.state = GENERATING;
          this.idle = false;
          this.genSprite.alpha = 1;
          this.genSprite.anims.setTimeScale(.2);
          this.genSprite.anims.play('generateStuff');
          this.genSprite.on('animationcomplete', function() {
              this.state = READY;
              this.idle = true;
          }, this);
    }

    isReadyToCollect() {
        return this.state == READY && (!this.collectPending);
    }
    collectionPending() {
        this.collectPending = true;
    }
    collectionCompleted() {
        this.collectPending = false;
    }
    needsGas() {
        return this.state == EMPTY;
    }
    isIdle() {
        return this.idle;
    }
}