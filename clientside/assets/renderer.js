var Render = new function(){
    var _debug = {
        grid: false,
        tileValue: false,
        tileCoors: false
    }

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


    var firstloop = true;
    var _maprender = function(){
        var tileSize = canvas.width / Camera.fov;
        var _camera = Camera.GetPos();
        var tiles = [Camera.fov, Math.floor(canvas.height/tileSize)];
        _pool.length = 0;
        _pool = [];
        _pool = GetElementsIn(_camera.x,_camera.y,_camera.x+tiles[0],_camera.y+tiles[1]);
        // _pool = Elements.getElementsIn(_camera.x,_camera.y,_camera.x+tiles[0],_camera.y+tiles[1]);

        var _drawItems = function(x,y,px,py){
            for(var i in _pool){
                if(_pool[i][2].x == x && _pool[i][2].y == y){
                    if(_pool[i][1] == "army" && _pool[i][3] == faction){
                        ctx.save();
                        ctx.fillStyle = "violet";
                        ctx.fillRect(px,py, tileSize, tileSize);
                        ctx.restore();
                    }else if(_pool[i][1] == "army" && _pool[i][3] != faction){
                        ctx.save();
                        ctx.fillStyle = "red";
                        ctx.fillRect(px,py, tileSize, tileSize);
                        ctx.restore();
                    }else if(_pool[i][1] == "village"){
                        ctx.save();
                        ctx.fillStyle = "grey";
                        ctx.fillRect(px,py, tileSize, tileSize);
                        ctx.restore();
                    }
                }
            }
            // for(var i in _pool){
            //     if(_pool[i].pos.x == x && _pool[i].pos.y == y && _pool[i].hasOwnProperty("Draw")){
            //         if(_pool[i] == selected){
            //             ctx.save();
            //             ctx.fillStyle = "rgba(255,255,255,0.4)";
            //             ctx.fillRect(px,py,tileSize-1,tileSize-1);
            //             ctx.restore();
            //         }
            //         _pool[i].Draw(ctx,px,py,tileSize);
            //     }
            // }
        }

        var _drawTile = function(x,y,px,py){
            if(worldmap.getTile(x,y) === "void") {
                ctx.save();
                ctx.fillStyle = "red";
                ctx.fillRect(px,py,tileSize+1,tileSize+1);
                ctx.restore();
            }else{

                Terrain.Draw(x,y,ctx,px,py,tileSize+1);
                if(worldmap.getTile(x,y-1) == 4 && (worldmap.getTile(x,y) == 1 || worldmap.getTile(x,y) == 3)){
                    ctx.save();
                    ctx.fillStyle = "#024700";
                    ctx.fillRect(px,py - tileSize/5, tileSize, tileSize/5);
                    ctx.restore();
                }
                
                _drawItems( x, y, px, py);

                if(_debug.grid)
                    ctx.strokeRect(px,py,tileSize,tileSize);
                if(_debug.tileValue)
                    ctx.fillText(worldmap.getTile(x,y)[0],px+tileSize/2-5,py+tileSize/2+5);
                if(_debug.tileCoors)
                    ctx.fillText(x+"-"+y,px+tileSize/2-5,py+tileSize/2+5);
            }
        }

        for(var y = 0; y <= tiles[1]; y++){
            for(var x = 0; x <= tiles[0]; x++){
                _drawTile(_camera.x + x, _camera.y+y, x*tileSize, y*tileSize);
            }
        }

    }

    var _clearPool = function(){
        _pool.length = 0;
        _pool = [];
    }

    this.Init = _init;
    this.Add = _add;
    // this.Remove = _remove;
    this.MapRender = _maprender;
    this.Pool = _pool;
    this.ClearPool = _clearPool;
}
