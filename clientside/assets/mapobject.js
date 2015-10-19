var worldmap = new function(){
    var _mapsize = 255;
    var tiles = [];
    var map =[];


    for(var y = 0; y < _mapsize; y++) {
        var row = [];
        for(var x = 0; x < _mapsize; x++){
            row.push(1);
        }
        map.push(row);
    }


    var _generate = function(){
        var ws = 40;
        var fs = 40;
        var ss = 40;
        
        //WATTER
        for(var x = 0; x < ws; x++){
            var s = rand(10,1500);
            var coor = [rand(0,254),rand(0,254)];
            map[coor[0]][coor[1]] = 0;

            for(var c = 0; c < s; c++){
                var dir = rand(0,4);
                switch(dir){
                    case 0:
                        coor[1]--;
                    break;
                    case 1:
                        coor[0]++;
                    break;
                    case 2:
                        coor[1]++;
                    break;
                    case 3:
                        coor[0]--;
                    break;
                }
                if(map.length > coor[0] && map[0].length > coor[1] && coor[0] > 0 && coor[1] > 0)
                    map[coor[0]][coor[1]] = 0;
            }
        }

        //FOREST
        for(var x = 0; x < fs; x++){
            var s = rand(10,1000);
            var coor = [rand(0,254),rand(0,254)];
            map[coor[0]][coor[1]] = 2;

            for(var c = 0; c < s; c++){
                var dir = rand(0,4);
                switch(dir){
                    case 0:
                        coor[1]--;
                    break;
                    case 1:
                        coor[0]++;
                    break;
                    case 2:
                        coor[1]++;
                    break;
                    case 3:
                        coor[0]--;
                    break;
                }
                if(map.length > coor[0] && map[0].length > coor[1] && coor[0] > 0 && coor[1] > 0 && map[coor[0]][coor[1]] != 0)
                    map[coor[0]][coor[1]] = 2;
            }
        }

        //STONE
        for(var x = 0; x < ss; x++){
            var s = rand(10,50);
            var coor = [rand(0,254),rand(0,254)];
            map[coor[0]][coor[1]] = 3;

            for(var c = 0; c < s; c++){
                var dir = rand(0,4);
                switch(dir){
                    case 0:
                        coor[1]--;
                    break;
                    case 1:
                        coor[0]++;
                    break;
                    case 2:
                        coor[1]++;
                    break;
                    case 3:
                        coor[0]--;
                    break;
                }
                if(map.length > coor[0] && map[0].length > coor[1] && coor[0] > 0 && coor[1] > 0 && map[coor[0]][coor[1]] < 3)
                    map[coor[0]][coor[1]] = 3;
            }
        }

    }

    _generate();

    var _getTile = function(x,y){
        return (y >= 0 && x >= 0 && map.length >= y && map[y].length >= x) ? map[y][x] : "void";
    }

    var _setTile = function(x,y,v){
        (y >= 0 && x >= 0 && map.length >= y && map[y].length >= x) ? map[y][x] = v : false;
    }

    this.tiles = tiles;
    this.tiles = tiles;
    this.tiles = tiles;
    this.tiles = tiles;
    this.tiles = tiles;
    this.tiles = tiles;
    this.tiles = tiles;
    this.size = _mapsize;
    this.getTile = _getTile;
    this.setTile = _setTile;
    this.map = map;
}
