import Constant from "../constants.js";
import {getLocationX, getLocationY} from "./util.js";

const VACANT = 0;
const GENERATING = 1;
const READY = 2;
const EMPTY = 3;

//export default function Generator(game, spriteName, spot) {
export default class Generator {
    constructor (game,spriteName,spot) {
        this.game = game;
        this.spriteName = spriteName;
        this.spot = spot;

        this.sprite = game.add.sprite(getLocationX(spot), getLocationY(spot), spriteName, 0).setOrigin(0,0);
        this.state = VACANT;
        this.fuel = 0;

        this.fakeForAnim = this.game.add.sprite(-1000,-1000, "fakeForAnim", 0).setOrigin(0,0);
        this.game.anims.create({
          key: "fakeStuff",
              frames: this.game.anims.generateFrameNames("fakeForAnim", {start:0,end:10}),
              frameRate: 12,
              repeat: 0
          });
    }

    interact(theMan) {
        if (this.state == VACANT) {
           if (theMan.carrying == Constant.THING) {
              this.sprite = this.game.add.sprite(getLocationX(this.spot), getLocationY(this.spot), "generator", 0).setOrigin(0,0);
              //this.genSprite = this.game.add.sprite(getLocationX(this.spot)+5, getLocationY(this.spot)+15, "generated", 0).setOrigin(0,0);
                    //enviro.screen.blit(self.genImage[self.processCount-1], [coordX+5,coordY+15])

              theMan.sprite.setFrame(0);
              theMan.carrying = Constant.NOTHING;
              this.regenerate(true);

           }
        } else if (this.state == READY) {
            if (theMan.carrying == Constant.NOTHING) {
               theMan.carrying = Constant.THING;
               theMan.sprite.setFrame(1);
               this.genSprite.alpha = 0;
               this.regenerate(false);
            }
        } else {
            //console.log("you wait, either generating or empty");
        }
        if (theMan.carrying == Constant.GAS && this.fuel > 0 && this.state != GENERATING) {
            theMan.sprite.setFrame(0);
            theMan.carrying = Constant.NOTHING;
            var wasEmpty = (this.fuel > 3);

            this.fuel = 0;
            this.gauge = this.game.add.sprite(getLocationX(this.spot)+15, getLocationY(this.spot)+10, "gauges", this.fuel).setOrigin(0,0);
            if (wasEmpty)
                this.regenerate(false);
        }
    }

    regenerate(init) {
        if (init) {
              this.genSprite = this.game.add.sprite(getLocationX(this.spot)+5, getLocationY(this.spot)+15, "generated", 0).setOrigin(0,0);
              this.game.anims.create({
                  key: "generateStuff",
                      frames: this.game.anims.generateFrameNames('generated', {start:0,end:10}),
                      frameRate: 12,
                      repeat: 0
                  });
              this.makeStuff();
              this.gauge = this.game.add.sprite(getLocationX(this.spot)+15, getLocationY(this.spot)+10, "gauges", this.fuel).setOrigin(0,0);
              this.fuel = 0;
        } else if (this.fuel < 3) {
            this.makeStuff();

            this.fuel++;
            if (this.fuel > 2)
                this.state = EMPTY;
            this.gauge = this.game.add.sprite(getLocationX(this.spot)+15, getLocationY(this.spot)+10, "gauges", this.fuel).setOrigin(0,0);
        }
    }

    makeStuff() {
          this.state = GENERATING;
          this.genSprite.alpha = 1;
          this.genSprite.play("generateStuff");
          this.genSprite.on('animationcomplete', function() {
              this.state = READY;
          }, this);
    }
}