function rand(min,max){
    return Math.floor((Math.random()*max)+min);
}
module.exports = function(s){
    var map = [];
    var _mapsize = s;

    for(var y = 0; y < _mapsize; y++) {
        var row = [];
        for(var x = 0; x < _mapsize; x++){
            row.push(1);
        }
        map.push(row);
    }
    var sm = _mapsize / 255;

    var ws = Math.round(40*sm);
    var fs = Math.round(40*sm);
    var ss = Math.round(40*sm);
    var hs = Math.round(100*sm);
    
    //HILLS
    for(var x = 0; x < hs; x++){
        var s = rand(10,1500);
        var coor = [rand(0,_mapsize-1),rand(0,_mapsize-1)];
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
                map[coor[0]][coor[1]] = 4;
        }
    }

    //WATTER
    for(var x = 0; x < ws; x++){
        var s = rand(10,1000);
        var coor = [rand(0,_mapsize-1),rand(0,_mapsize-1)];
        if(map[coor[0]][coor[1]] == 4 ){
            x--;
            continue;
        }
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
            if(map.length > coor[0] && map[0].length > coor[1] && coor[0] > 0 && coor[1] > 0){
                map[coor[0]][coor[1]] = 0;
            }
        }
    }

    for(var x = 0; x < fs; x++){
        var s = rand(10,1000);
        var coor = [rand(0,_mapsize-1),rand(0,_mapsize-1)];
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
        var coor = [rand(0,_mapsize-1),rand(0,_mapsize-1)];
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


    //FILL 1x1 ORPHANS
    function fillorphans(){
        for(var y = 1; y < _mapsize-1; y++){
            for(var x = 1; x < _mapsize-1; x++){
                // if(y-1 < 0 || x-1 < 0 && y > _mapsize && x > _mapsize)continue;

                var ncu = map[y-1][x];
                var ncd = map[y+1][x];
                var ncl = map[y][x-1];
                var ncr = map[y][x+1];

                if(ncu + ncd + ncl + ncr <= 1){
                    map[y][x] = 0;
                }
                if(ncu == 2 && ncd == 2 && ncl == 2 && ncr == 2 &&
                ncu + ncd + ncl + ncr >= 6){
                    map[y][x] = 2;
                }
                if(ncu == 4 && ncd == 4 && ncl == 4 && ncr == 4 &&
                ncu + ncd + ncl + ncr >= 12){
                    map[y][x] = 4;
                }

            }
        }
    }

    fillloops = 10;
    for(var i = 0; i < fillloops; i++){
        fillorphans();
    }


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
