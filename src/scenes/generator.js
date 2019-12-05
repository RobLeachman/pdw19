import {getLocationX, getLocationY} from "./util.js";

const NOTHING = 0;
const THING = 1;
const GAS = 2;

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
           if (theMan.carrying == THING) {
              this.sprite = this.game.add.sprite(getLocationX(this.spot), getLocationY(this.spot), "generator", 0).setOrigin(0,0);
              //this.genSprite = this.game.add.sprite(getLocationX(this.spot)+5, getLocationY(this.spot)+15, "generated", 0).setOrigin(0,0);
                    //enviro.screen.blit(self.genImage[self.processCount-1], [coordX+5,coordY+15])

              theMan.sprite.setFrame(0);
              theMan.carrying = NOTHING;
              this.state = GENERATING;
              this.regenerate(true);

           }
        } else if (this.state == READY) {
            if (theMan.carrying == NOTHING) {
               theMan.carrying = THING;
               theMan.sprite.setFrame(1);
               this.genSprite.alpha = 0;
               this.regenerate(false);
            }
        } else {
            //console.log("you wait");
        }
        if (theMan.carrying == GAS && this.fuel > 0) {
            this.fuel = 0;
            this.gauge = this.game.add.sprite(getLocationX(this.spot)+15, getLocationY(this.spot)+10, "gauges", this.fuel).setOrigin(0,0);
            if (this.state == EMPTY) {
               this.regenerate(false);
            }
            theMan.sprite.setFrame(0);
            theMan.carrying = NOTHING;
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
            this.fuel++;
            this.gauge = this.game.add.sprite(getLocationX(this.spot)+15, getLocationY(this.spot)+10, "gauges", this.fuel).setOrigin(0,0);
            if (this.fuel < 3) {
                this.makeStuff();
            } else
                this.state = EMPTY;
        }
    }

    makeStuff() {
          this.genSprite.alpha = 1;
          this.genSprite.play("generateStuff");
          this.genSprite.on('animationcomplete', function() {
              this.state = READY;
          }, this);
    }
}