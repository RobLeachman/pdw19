/* global Phaser */
export class BootGame extends Phaser.Scene{
    constructor(){
        super("BootGame");
    }
    preload(){
        this.load.image("road", "assets/graphics/road3.png");
        this.load.spritesheet("bomb", "assets/graphics/aBomb.png", {
            frameWidth: 15,
            frameHeight: 15
        });
        this.load.spritesheet("fighter", "assets/graphics/aFighter.png", {
            frameWidth: 30,
            frameHeight: 17
        });
        this.load.spritesheet("mother", "assets/graphics/aMother.png", {
            frameWidth: 100,
            frameHeight: 40
        });
        this.load.spritesheet("robot", "assets/graphics/aBot.png", {
            frameWidth: 40,
            frameHeight: 40
        });
        this.load.spritesheet("man", "assets/graphics/aMan.png", {
            frameWidth: 40,
            frameHeight: 40
        });
        this.load.spritesheet("generated", "assets/graphics/newGenerating.png", {
            frameWidth: 80,
            frameHeight: 50
        });
        this.load.spritesheet("gauges", "assets/graphics/newGas.png", {
            frameWidth: 60,
            frameHeight: 5
        });
        this.load.spritesheet("market", "assets/graphics/market.png", {
            frameWidth: 90,
            frameHeight: 90
        });
        this.load.spritesheet("shields", "assets/graphics/shields.png", {
            frameWidth: 90,
            frameHeight: 90
        });
        this.load.spritesheet("laser", "assets/graphics/laser.png", {
            frameWidth: 90,
            frameHeight: 90
        });


        this.load.spritesheet("manWithThing", "assets/graphics/manWithThing.png", { //???
            frameWidth: 40,
            frameHeight: 40
        });

        this.load.spritesheet("base", "assets/graphics/base.png", {
            frameWidth:90,
            frameHeight:90
        });
        this.load.spritesheet("fuelStore", "assets/graphics/fuelStore1C.png", {
            frameWidth:25,
            frameHeight:25
        });
        this.load.spritesheet("botFactoryPad", "assets/graphics/botFactoryPad.png", {
            frameWidth:90,
            frameHeight:90
        });
        this.load.spritesheet("botFactory", "assets/graphics/botFactory.png", {
            frameWidth:90,
            frameHeight:90
        });
        this.load.spritesheet("gasFactoryPad", "assets/graphics/gasFactoryPad.png", {
            frameWidth:90,
            frameHeight:90
        });
        this.load.spritesheet("gasFactory", "assets/graphics/gasFactory.png", {
            frameWidth:90,
            frameHeight:90
        });
        this.load.spritesheet("generator", "assets/graphics/generator0.png", {
            frameWidth:90,
            frameHeight:90
        });
        this.load.spritesheet("pad", "assets/graphics/pad1.png", {
            frameWidth:90,
            frameHeight:90
        });
    }

    create() {
        this.scene.start("PlayGame");
    }
}