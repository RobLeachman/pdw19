/* Produce, Defend, Win!
 *
 * A man walks a road...
 *    BUG: ... and if he's moving he can fly
 */

/* global Phaser */
var game;
var gameOptions = { // will want these soon
    difficulty: 0,
    testing: 1
};

const map = [
          [[35,100,1], [100,100], [165,100,2], [230,100], [295,100,3], [360,100]],
          [[35,230,4], [100,230], [165,230,5], [230,230], [295,230,6], [360,230]],
          [[35,360,7], [100,360], [165,360,8], [230,360], [295,360,9], [360,360]],
          [[-1,-1],  [-1,-1],   [-1,-1],   [-1,-1],   [-1,-1],   [360,540], [425,540,10], [545,540,11], [665,540,12]]
            ];

const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

function getMapCoords(goalPoint) {
    try {
        if (goalPoint.x < 0 || goalPoint.y < 0)
            return null;
        if (map[goalPoint.y][goalPoint.x][0] < 0)
            return null;
        if (map[goalPoint.y][goalPoint.x][1] < 0)
            return null;
        return new Phaser.Geom.Point(map[goalPoint.y][goalPoint.x][0], map[goalPoint.y][goalPoint.x][1]);
    } catch (err) { // array out of bounds
        return null;
    }
}

/**************************************
 * INIT
 **************************************/
window.onload = function() {
    var gameConfig = {
        width: 800,
        height: 600,
        backgroundColor: 0x333333,
        scene: [bootGame, playGame]
    };
    game = new Phaser.Game(gameConfig);
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);
};

class bootGame extends Phaser.Scene{
    constructor(){
        super("BootGame");
    }
    preload(){
        this.load.image("road", "assets/graphics/road3.png");
        this.load.spritesheet("man", "assets/graphics/man.png", {
            frameWidth: 40,
            frameHeight: 40
        });
    }
    create(){
        this.scene.start("PlayGame");
    }
}
class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    create(){
        this.add.image(0, 0, "road").setOrigin(0, 0);

        this.manLoc = new Phaser.Geom.Point(2,1);

        var manCoords = getMapCoords(this.manLoc);

        this.man = this.add.sprite(manCoords.x, manCoords.y, "man", 0).setOrigin(0,0);

        this.input.keyboard.on("keyup", this.handleKey, this);
    }
    update () {
        // no loop needed, the keyboard handler is sufficient for now
    }

    handleKey(e){
        if(1) {
            switch(e.code){
                case "KeyA":
                case "ArrowLeft":
                    this.makeMove(LEFT);
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.makeMove(RIGHT);
                    break;
                case "KeyW":
                case "ArrowUp":
                    this.makeMove(UP);
                    break;
                case "KeyS":
                case "ArrowDown":
                    this.makeMove(DOWN);
                    break;
            }
        }
    }

    makeMove(dir) {
        var oldLocX = this.manLoc.x; // copying these 2 attributes only... love JS
        var oldLocY = this.manLoc.y;
        var manAt = map[this.manLoc.y][this.manLoc.x][2];
        switch (dir) {
            case LEFT:
                this.manLoc.x--;
                break;
            case RIGHT:
                this.manLoc.x++;
                break;
            case UP:
                this.manLoc.y--;
                if (manAt > 0)
                   this.manLoc.y = -1;
                break;
            case DOWN:
                this.manLoc.y++;
                if (manAt > 0)
                   this.manLoc.y = -1;
                break;
        }
        var newCoords = getMapCoords(this.manLoc);
        if (!newCoords) {
            this.manLoc.x = oldLocX;
            this.manLoc.y = oldLocY;
        }
        else {
            var manCoords = getMapCoords(this.manLoc);
            this.tweens.add({
                targets: [this.man],
                duration: 500,
                x:manCoords.x,
                y:manCoords.y,
                callbackScope: this,
                onComplete: function() {
                    //console.log("DONE");
                }
            });
        }
    }
}

function resizeGame(){
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
