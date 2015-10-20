var Village = function(x,y){
    var type = "village";
    var pos = {x:x,y,y};
    var size = 1;
    var habs = rand(5,30);
    var gold = rand(2,10);
    var budget = 0;
    var resh = rand(100,1000);
    var res = resh*(Math.floor(habs/5)+1);
    var lord;

    var prodr = 5;
    var prod = [];

    var uc = 0;
    var _update = function(){
        if(uc >= 100){
            var gc = Math.floor(rand(-1*(habs/3),habs));
            gold += gc;
            if(gold<0)gold=0;
            if(gold >= habs*3){
                gold = habs;
                habs += rand(2,8);
            }
            if(lord)
                budget += Math.floor(gc/4);

            habs += Math.floor(rand(-2,5));
            if(habs <1)habs=1;

            res = resh*(Math.floor(habs/5)+1);

            console.log(habs,gold,res);
            uc = 0;
        }
        uc++;
    }

    var _reclute = function(l){
        var r = rand(0,habs*0.3);
        if(lord == l){
            r++;
            r *= 1.5;
        }
        
        l.reclute(Math.floor(r));
    }

    var _Prod = function(){
        for(var y = 0; y < prodr*2 + 1; y++){
            for(var x = 0; x < prodr*2 + 1; x++){
                var res = worldmap.getTile(x,y);
                if(Terrain.isResource(res))
                    if(prod.indexOf(res) < 0)
                        prod.push(res);
            }
        }
    }

    var _draw = function(ctx, px, py, ts){
        ctx.save();
        ctx.fillStyle = "#532";
        ctx.fillRect(px,py,ts*size,ts*size);
        ctx.restore();
    }

    _Prod();


    this.pos = pos;
    this.type = type;
    this.Produces = prod;
    this.Update = _update;
    this.Draw = _draw;
    this.Reclute = _reclute;
}
