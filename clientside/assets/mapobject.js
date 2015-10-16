var worldmap = new function(){
    var _mapsize = 255;
    var tiles = [];


    for(var x = 0; x < _mapsize*_mapsize; x++) 
        tiles.push([1]);

    var _getTile = function(x,y){
        return (x+(y*_mapsize) < _mapsize*_mapsize && x+(y*_mapsize) >= 0) ? tiles[(y*_mapsize) + x] : false;
    }

    _getTile(1,2)[0] = 0;
    _getTile(1,3)[0] = 0;
    _getTile(1,4)[0] = 0;
    _getTile(2,4)[0] = 0;
    _getTile(2,3)[0] = 0;
    this.tiles = tiles;
    this.size = _mapsize;
    this.getTile = _getTile;
}
