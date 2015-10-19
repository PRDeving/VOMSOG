var Trooper = function(x,y){
    var pos = {x:x,y:y};
    var _pool = [];
    var speed = 10;
    var sc = 0;

    var _update = function(){
        sc++;

        if(sc>= 20/speed && _pool.length > 0){
            if(Terrain.CanI(worldmap.getTile(_pool[0].x,_pool[0].y))){
                pos.x = _pool[0].x;
                pos.y = _pool[0].y;
                _pool.splice(0,1);
            }else{
                _goTo(_pool[_pool.length-1].x,_pool[_pool.length-1].y);
            }
            sc = 0;
        }
    }

    var _draw = function(ctx, px, py, tileSize){
        ctx.fillRect(px,py,tileSize, tileSize);
    }

    var _goTo = function(x,y){
        easystar.enableDiagonals();
        easystar.disableCornerCutting();
        easystar.findPath(pos.x, pos.y, x, y, function( path ) {
            if (path === null) {
                console.log("no path");
            } else {
                _pool = path;
            }
        });
        easystar.calculate();
    }

    this.Draw = _draw;
    this.pos = pos;
    this.goTo = _goTo;
    this.Update = _update;
}
