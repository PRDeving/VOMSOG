var Render = new function(){
    var canvas;
    var ctx;

    var _pool = [];

    var _init = function(c){
        canvas = c;
        ctx = c.getContext("2d");
    }

    var _add = function(item){
        _pool.push(item);
    }

    // var _remove = function(item){
    //     for(var x = 0; x < _pool.length){
    //         if(_pool[x].id && _pool[x].id == item){
    //             _pool.splice(x,1);
    //             break;
    //         }
    //     }
    // }

    var _maprender = function(){
        var tileSize = canvas.width / Camera.fov;
        var _camera = Camera.GetPos();
        var tiles = [Camera.fov, Math.floor(canvas.height/tileSize)];

        for(var i in _pool){
            if(_pool[i].hasOwnProperty("Update"))
                _pool[i].Update();
        }

        var _drawItems = function(x,y,px,py){
            for(var i in _pool){
                if(_pool[i].pos.x == x && _pool[i].pos.y == y && _pool[i].hasOwnProperty("Draw"))
                    _pool[i].Draw(ctx,px,py,tileSize);
            }
        }

        var _drawTile = function(x,y,px,py){
            if(!worldmap.getTile(x,y)) {
                ctx.save();
                ctx.fillStyle = "red";
                ctx.fillRect(px,py,tileSize+1,tileSize+1);
                ctx.restore();
            }else{
                ctx.strokeRect(px,py,tileSize,tileSize);
                // ctx.fillText(worldmap.getTile(x,y)[0],px+tileSize/2-5,py+tileSize/2+5);
                ctx.fillText(x+"-"+y,px+tileSize/2-5,py+tileSize/2+5);

                // Terrain.Draw(worldmap.getTile(x,y)[0],ctx,px,py,tileSize);
                
                _drawItems(_camera.x + x,_camera.y + y, x*tileSize, y*tileSize);
            }
        }

        for(var y = 0; y <= tiles[1]; y++){
            for(var x = 0; x <= tiles[0]; x++){
                _drawTile(_camera.x + x, _camera.y+y, x*tileSize, y*tileSize);
            }
        }

    }

    this.Init = _init;
    this.Add = _add;
    // this.Remove = _remove;
    this.MapRender = _maprender;
    this.Pool = _pool;
}
