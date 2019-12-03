// "Translate screen locations into screen coordinates"
function getLocationX(location) {
    var coordX = 0;
    if (location == 0 || location == 3 || location == 6)
        coordX = 10;
    if (location == 1 || location == 4 || location == 7)
        coordX = 140;
    if (location == 2 || location == 5 || location == 8)
        coordX = 270;
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