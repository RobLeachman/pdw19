/* global Phaser */

// A map of all the places the man and bot can go.
// Each location has pixel coordinates, and some places are spots we can interact with.
const map = [
          [[7,6,0],     [59,6],     [111,6,1],     [163,6],     [214,6,2],     [266,6]],
          [[7,111.5,3], [59,111.5], [111,111.5,4], [163,111.5], [214,111.5,5], [266,111.5]],
          [[7,217,6],   [59,217],   [111,217,7],   [163,217],   [214,217,8],   [266,217]],
          [[-1,-1],     [-1,-1],    [-1,-1],       [-1,-1],     [-1,-1],       [266,366], [318,366,9], [431,366,10], [546,366,11]]
            ];

// Return the screen coordinates of the indicated building spot.
//TODO: could search the map[], might be less hokey?
function getLocationX(location) {
    var coordX = 0;
    if (location == 0 || location == 3 || location == 6)
        coordX = 7;
    if (location == 1 || location == 4 || location == 7)
        coordX = 111;
    if (location == 2 || location == 5 || location == 8)
        coordX = 214;
    if (location == 9)
        coordX = 318;
    if (location == 10)
        coordX = 432;
    if (location == 11)
        coordX = 546;
    return coordX;
}
function getLocationY(location) {
    var coordY = 0;

    if (location == 0 || location == 1 || location == 2)
        coordY = 7;
    if (location == 3 || location == 4 || location == 5)
        coordY = 113;
    if (location == 6 || location == 7 || location == 8)
        coordY = 218;
    if (location == 9 || location == 10 || location == 11)
        coordY = 368;
    return coordY;
}

// Return the screen coordinates of the man at the indicated point.
// The map is relative to the building locations so we need to offset for the sprite.
function getMapCoords(goalPoint) {
    //console.log(`need coords for ${goalPoint.x},${goalPoint.y}`);
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

// Return the spot at the given location, or -1 if the man is between locations.
// When at a spot we can interact with the building there.
// Note X and Y are swapped here, that's just how the array is built.
function getSpotAtLocation(locationPoint) {
    //console.log(`location is ${locationPoint.x}, ${locationPoint.y}`);
    if (typeof map[locationPoint.y][locationPoint.x][2] == "undefined")
        return null;
    return map[locationPoint.y][locationPoint.x][2];
}

// POW!
var t=0;
var r=0;
var d = 200;
var red=true;
var craterX;
var craterY;
var theGame;

function deathCrater(game,x,y) {
    if (r==0) {
        craterX=x;craterY=y;
        theGame = game;
        deathCrater_create();
    } else {
        deathCrater_update();
    }
}

function deathCrater_create() {
    var craterGraphic = theGame.add.graphics({
      x: 0,
      y: 0
    });
    craterGraphic.clear();
    craterGraphic.beginPath();
    craterGraphic.setDepth(d);
    if (red) {
      red = false;
      craterGraphic.fillStyle(0xff0000,1-r/20);
    } else {
      red = true;
      craterGraphic.fillStyle(0xffffff,1-r/20);
    }
    craterGraphic.fillCircle(craterX, craterY,(200-d)*15);
    r=1;
}

function deathCrater_update() {
    if (r>100)
       return;
    t++;
    r++;
    if (t>2) {
        t=0;
        var craterGraphic = theGame.add.graphics({
          x: 0,
        y: 0
        });
        d--;
        var alpha = (1-r/100)*1;
        craterGraphic.clear();
        craterGraphic.beginPath();
        craterGraphic.setDepth(d);
        if (red) {
          red = false;
          craterGraphic.fillStyle(0xff0000,alpha);
        } else {
          red = true;
          craterGraphic.fillStyle(0xffffff,alpha);
        }
        craterGraphic.fillCircle(craterX, craterY,(200-d)*25*r/50);
        craterGraphic.closePath();

    }
}


function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}


export {getLocationX, getLocationY, getMapCoords, getSpotAtLocation, deathCrater, setCookie, getCookie, eraseCookie};