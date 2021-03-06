var Army = function(x,y,f){
    var type = "army";
    var _faction = f;

    var _food = rand(20,100);

    var _pay = 1;
    var _eat = 1;

    var _moral = rand(20,100);
    var _renown = rand(0,5);
    var _heroes = rand(1,5);

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

    this.P = function(){return _pool}

    var _calculateSpeed = function(){
        if(_troops.c > _troops.i + _troops.a){
            speed = 2;
        }else{
            speed = 1;
        }
    }
    _calculateSpeed();

    var _update = function(){
        sc++;

        if(_pool.length > 0 && sc % ((timescale/speed)*Terrain.Cost(worldmap.getTile(_pool[0].x,_pool[0].y))) == 0 ){
            var elit = Elements.getElementsIn(_pool[0].x,_pool[0].y);
            var cont = true;
            if(elit.length > 0){
                if(elit[0].hasOwnProperty("faction") && elit[0].faction != _faction){
                    console.log("ouch");
                    _pool.length = 0;
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
                }else if(elit[0].type == "village"){
                    _pool.length = 0;
                    cont = false;
                    _takeaction = elit[0];
                    _action = "visit";
                }
            }
            if(cont){
                if(_pool.length > 0 &&
                Terrain.CanI(worldmap.getTile(_pool[0].x,_pool[0].y))){
                    pos.x = _pool[0].x;
                    pos.y = _pool[0].y;
                    _pool.splice(0,1);
                }else{
                    _goTo(_pool[_pool.length-1].x,_pool[_pool.length-1].y);
                }
            }
        }

        if(sc % (fps*30) == 0){
            var eln = Elements.getElementsIn(pos.x-1,pos.y-1,pos.x+1,pos.y+1);
            var an = false;
            for(var i in eln)
                if(eln[i].type == "village"){
                    an = true;
                    break;
                }
            if(an){
                _food += rand(1,10);
                console.log(_food);
            }
        }

        if(sc % (fps*60*5) == 0){
            _salary();
            _lunch();
        }

        if(_takeaction){
            console.log("action "+_action+" in ",_takeaction.type, _takeaction);

            Actions.Add(_action, this, _takeaction);

            switch(_action){
                case "fight":
                    console.log("fighting");
                break;
                case "visit":
                    console.log("visit");
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
        easystar.setGrid(worldmap.map);
        easystar.enableDiagonals();
        easystar.disableCornerCutting();

        easystar.findPath(pos.x, pos.y, x, y, function( path ) {
            if (path === null) {
                console.log("no path");
            } else {
                // var el = Elements.getElementsIn(path[path.length-1].x,path[path.length-1].y);
                // path.splice(0,1);
                // _pool = path;
                socket.emit("element-move",{
                    uid:uid,
                    sid:sid,
                    id:id,
                    path:JSON.stringify(path)
                });
            }
        });
        easystar.calculate();
    }

    var _updateTroops = function(t){
        var hm = {
            i: (Math.abs(t.i)<_troops.i)?Math.abs(t.i):_troops.i,
            a: (Math.abs(t.a)<_troops.a)?Math.abs(t.a):_troops.a,
            c: (Math.abs(t.c)<_troops.c)?Math.abs(t.c):_troops.c,
        }
        _troops.i += t.i
        _troops.a += t.a
        _troops.c += t.c

        if(_troops.i < 0) _troops.i = 0;
        if(_troops.a < 0) _troops.a = 0;
        if(_troops.c < 0) _troops.c = 0;

        if(_troops.i == 0 && _troops.a == 0 && _troops.c == 0)
            Elements.Remove(this);
        _calculateSpeed();
        return hm;
    }

    var _setTroops = function(t){
        _troops.i = t.i;
        _troops.a = t.a;
        _troops.c = t.c;

        if(_troops.i < 0) _troops.i = 0;
        if(_troops.a < 0) _troops.a = 0;
        if(_troops.c < 0) _troops.c = 0;
        _calculateSpeed();
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

    var _lunch = function(){
        var nb = Elements.getElementsIn(pos.x-1,pos.y-1,pos.x+1,pos.y+1);
        var nearvillage = false;

        for(var i in nb)
            if(nb[i].type == "village" ||
            nb[i].type == "caravan")
                nearvillage = true;

        if(!nearvillage){
            _food -= Math.round(_eat * ((_troops.i + _troops.a + _troops.c)/50));
            if(_food < 0){
                var ed = Math.round(Math.abs(_food) / 3);
                _troops.i -= ed;
                _troops.a -= ed;
                _troops.c -= ed;

                _moral -= rand(0,10);

                _food = 0;
            }
        }else{
            _food += rand(1,6);
        }
    }

    var _salary = function(){
        var fg = Factions[_faction].Pays(Math.round(_pay * ((_troops.i + _troops.a + _troops.c)/100)));
        if(fg < 0){
            var ed = Math.round(Math.abs(fg) / 3);
            _troops.i -= ed;
            _troops.a -= ed;
            _troops.c -= ed;

            _moral -= rand(0,10);
        }
    }

    var _divide = function(tr){
        console.log(tr);
        if(_heroes < 1) return false;
        if(tr.i + tr.a + tr.c < 1) return false;

        var nb = worldmap.getNeighbors(x,y);
        var i;
        for(var n in nb){
            if(Terrain.CanI(worldmap.getTile(nb[n][0],nb[n][1]))){
                if(Elements.getElementsIn(nb[n][0],nb[n][1]).length == 0){
                    i = nb[n];
                    break;
                }
            }
        }
        var ch = Elements.Add(new Army(nb[n][0],nb[n][1],_faction))
        _heroes--;
        _updateTroops({i:-1*tr.i,a:-1*tr.a,c:-1*tr.c});
        ch.setTroops(tr);
    }

    var _consumes = function(){
        return Math.round(_eat * ((_troops.i + _troops.a + _troops.c)/50));
    }
    var _costs = function(){
        return Math.round(_pay* ((_troops.i + _troops.a + _troops.c)/100));
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
    this.setTroops = _setTroops;
    this.faction = _faction;

    this.retire = _retire;
    this.win = _win;
    this.Divide = _divide;

    this.moral = _getmoral;
    this.renown = _getrenown;
    this.pay = _getpay;
    this.heroes = function(){return _heroes;}
    this.updatePayment = _updatePayment;

    this.Salary = _salary;
    this.Costs = _costs;
    this.Lunch = _lunch;
    this.Eats = _consumes;
    
    this.pos = pos;
    this.getPos = _pos;
    this.goTo = _goTo;
    this.Update = _update;
}
