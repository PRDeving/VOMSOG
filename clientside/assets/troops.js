var Troop = function(x,y){
    var pos = {x:x,y:y};
    var _pool = [];

    var _update = function(){
        if(_pool.length > 0){
            pos.x = _pool[0][0];
            pos.y = _pool[0][1];
            _pool.splice(0,1);
        }
    }

    var _draw = function(ctx, px, py, tileSize){
        ctx.fillRect(px,py,tileSize, tileSize);
    }

    var _goTo = function(x,y){
        _pool = Pathfinder(pos.x, pos.y, x, y);
    }

    this.Draw = _draw;
    this.pos = pos;
    this.goTo = _goTo;
    this.Update = _update;
}
