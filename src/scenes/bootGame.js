export class BootGame extends Phaser.Scene{
    constructor(){
        super("BootGame");
    }
    preload(){
        this.load.image("road", "assets/graphics/road3.png");
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

        this.load.spritesheet("manWithThing", "assets/graphics/manWithThing.png", {
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