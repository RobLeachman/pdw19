/* global Phaser */
const map = [
          [[35,100,0], [100,100], [165,100,1], [230,100], [295,100,2], [360,100]],
          [[35,230,3], [100,230], [165,230,4], [230,230], [295,230,5], [360,230]],
          [[35,360,6], [100,360], [165,360,7], [230,360], [295,360,8], [360,360]],
          [[-1,-1], [-1,-1], [-1,-1], [-1,-1], [-1,-1],                [360,540], [425,540,9], [545,540,10], [665,540,11]]
            ];

// "Translate screen locations into screen coordinates"
function getLocationX(location) {
    var coordX = 0;
    if (location == 0 || location == 3 || location == 6)
        coordX = 10;
    if (location == 1 || location == 4 || location == 7)
        coordX = 140;
    if (location == 2 || location == 5 || location == 8)
        coordX = 270;
    if (location == 9)
        coordX = 400;
    if (location == 10)
        coordX = 520;
    if (location == 11)
        coordX = 640;
    return coordX;
}
function getLocationY(location) {
    var coordY = 0;

    if (location == 0 || location == 1 || location == 2)
        coordY = 10;
    if (location == 3 || location == 4 || location == 5)
        coordY = 140;
    if (location == 6 || location == 7 || location == 8)
        coordY = 270;
    if (location == 9 || location == 10 || location == 11)
        coordY = 450;
    return coordY;
}

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

export {getLocationX, getLocationY, getMapCoords}