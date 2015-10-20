var Army = function(x,y,f){
    var type = "army";
    var _faction = f;

    var _pay = 1;

    var _moral = rand(20,100);
    var _renown = rand(0,5);
    var _heroes = rand(0,3);

    var _troops = {
        c: 1123,
        i: 2420,
        a: 1230
    }

    var pos = {x:x,y:y};
    var _pool = [];
    var speed = 1;
    var sc = 0;

    var _action;
    var _takeaction = false;
    var _update = function(){
        sc++;

        if(_pool.length > 0 && sc >= (timescale/speed)*Terrain.Cost(worldmap.getTile(_pool[0].x,_pool[0].y))){
            var elit = Elements.getElementsIn(_pool[0].x,_pool[0].y);
            var cont = true;
            if(elit.length > 0){
                _pool.length = 0;
                if(elit[0].faction != _faction){
                    switch(elit[0].type){
                        case "army":
                            _action = "fight";
                        break;
                        case "village":
                            _action = "assault";
                        break;
                    }
                    _takeaction = elit[0];
                    cont = false;
                }
            }

            if(cont){
                if(_pool.length > 1 && Terrain.CanI(worldmap.getTile(_pool[0].x,_pool[0].y))){
                    pos.x = _pool[0].x;
                    pos.y = _pool[0].y;
                    _pool.splice(0,1);
                }else{
                    if(_pool.lenght > 1)
                        _goTo(_pool[_pool.length-1].x,_pool[_pool.length-1].y);
                }
            }
            sc = 0;
        }
        

        if(_takeaction){
            console.log("action "+_action+" in ",_takeaction.type, _takeaction);

            Actions.Add(_action, this, _takeaction);

            switch(_action){
                case "fight":
                    console.log("fighting");
                break;
            }

            _action = false;
            _takeaction = false;
        }
    
    }

    var _draw = function(ctx, px, py, tileSize){
        ctx.save();
        var color = Factions[_faction].color;
        ctx.beginPath();
        ctx.arc(px + tileSize/2, py + tileSize/2, tileSize/2 - 1.5, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba("+color+",0.7)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px + tileSize/2, py + tileSize/2, tileSize/2 - 1.5, 0, 2 * Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba('+color+')';
        ctx.stroke();

        ctx.restore();
    }

    var _goTo = function(x,y){
        easystar.enableDiagonals();
        easystar.disableCornerCutting();
        easystar.findPath(pos.x, pos.y, x, y, function( path ) {
            if (path === null) {
                console.log("no path");
            } else {
                var el = Elements.getElementsIn(path[path.length-1].x,path[path.length-1].y);
                path.splice(0,1);
                _pool = path;
            }
        });
        easystar.calculate();
    }

    var _updateTroops = function(t){
        if(t.i > 0)
            _troops.i -= t.i
        if(t.a > 0)
            _troops.a -= t.a
        if(t.c > 0)
            _troops.c -= t.c

        if(_troops.i < 0) _troops.i = 0;
        if(_troops.a < 0) _troops.a = 0;
        if(_troops.c < 0) _troops.c = 0;

        if(_troops.i == 0 && _troops.a == 0 && _troops.c == 0)
            Elements.Remove(this);
    }

    var _Troops = function(){
        return _troops;
    }

    var _updatePayment = function(m){
        _pay += m;
        if(_pay < 1) _pay = 1;

        _moral += m*rand(1,5);
    }

    var _retire = function(){
        busy = false;
        _moral -= rand(2,20);
        console.log("retire  ",_faction);
    }

    var _win = function(){
        busy = false;
        _moral += rand(3,20);
        _renown += rand(0,2);

        if(rand(0,6) > 5)
            _heroes += rand(0,2);

        console.log("win ",_faction);
    }

    var _getmoral = function(){
        return _moral;
    }
    var _getrenown = function(){
        return _renown;
    }
    var _getpay = function(){
        return _pay;
    }
    var _pos = function(){
        return pos;
    }

    this.Draw = _draw;
    this.type = type;
    this.troops = _Troops;
    this.updateTroops = _updateTroops;
    this.faction = _faction;

    this.retire = _retire;
    this.win = _win;

    this.moral = _getmoral;
    this.renown = _getrenown;
    this.pay = _getpay;
    this.updatePayment = _updatePayment;
    
    this.pos = pos;
    this.getPos = _pos;
    this.goTo = _goTo;
    this.Update = _update;
}


var Trooptypes = {
    c: 20,
    a: 12,
    i: 10
}
