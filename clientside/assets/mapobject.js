var WorldMap = function(map){
    var map = map;
    var _mapsize = map.length;



    var _setMap = function(map){
        map = JSON.parse(map);
        console.log("map setted");
    }

    var _getTile = function(x,y){
        return (y >= 0 && x >= 0 && map.length >= y && map[y].length >= x) ? map[y][x] : "void";
    }

    var _getNeighbors = function(x,y){
        var _n = [];

        if(x - 1 >= 0)
            _n.push([x-1,y]);

        if(y - 1 >= 0)
            _n.push([x,y-1]);

        if(y + 1 < _mapsize)
            _n.push([x,y+1]);

        if(x + 1 < _mapsize)
            _n.push([x+1,y]);


        if(y - 1 >= 0 && x - 1 >= 0)
            _n.push([x-1,y-1]);

        if(y + 1 < _mapsize && x + 1 < _mapsize)
            _n.push([x+1,y+1]);

        if(y + 1 < _mapsize && x - 1 >= 0)
            _n.push([x-1,y+1]);

        if(y - 1 >= 0 && x + 1 < _mapsize)
            _n.push([x+1,y-1]);

        return _n;

    }

    this.size = _mapsize;
    this.getTile = _getTile;
    this.getNeighbors = _getNeighbors;
    this.map = map;
    this.setMap = _setMap;
}
