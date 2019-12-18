/* global Phaser */

// A map of all the places the man and bot can go.
// Each location has pixel coordinates, and some places are spots we can interact with.
const map = [
          [[7,6,0],   [59,6],   [111,6,1],   [163,6],   [214,6,2],   [266,6]],
          [[7,111.5,3], [59,111.5], [111,111.5,4], [163,111.5], [214,111.5,5], [266,111.5]],
          [[7,217,6], [59,217], [111,217,7], [163,217], [214,217,8], [266,217]],
          [[-1,-1],   [-1,-1],  [-1,-1],     [-1,-1],   [-1,-1],     [266,366], [318,366,9], [431,366,10], [546,366,11]]
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

export {getLocationX, getLocationY, getMapCoords, getSpotAtLocation};