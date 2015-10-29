module.exports = {
    Village: function(x,y,worldmap){
        var id = "v-"+rand(0,999999999);
        var type = "village";
        var pos = {x:x,y:y};
        var size = 1;
        var habs = rand(5,30);
        var gold = rand(2,10);
        var budget = 0;
        var resh = rand(100,1000);
        var res = resh*(Math.floor(habs/5)+1);
        var lord;
        var donators = {};

        var prodr = 5;
        var prod = [];

        var uc = 0;
        var _update = function(){

            if(uc % 2 == 0){
                var gc = Math.floor(rand(-1*(habs/4),habs));
                gold += gc;
                if(gold<0)gold=0;
                if(gold >= habs*3){
                    gold = habs;
                    habs += rand(2,8);
                }
                budget += Math.floor(gc/4);

                habs += Math.floor(rand(-2,5));
                if(habs <1)habs=1;

                res = resh*(Math.floor(habs/5)+1);

                // console.log(habs,gold,res);
                uc = 0;
            }
            uc++;
        }

        var _recuit = function(l){
            var r = rand(0,habs*0.3);
            if(lord == l){
                r++;
                r *= 1.5;
            }
            if(donators[l.faction] && donators[l.faction] < 0){
                r*=0.5;
            }
            
            habs -= r;
            return r;
        }

        var _Prod = function(){
            for(var y = 0; y < prodr*2 + 1; y++){
                for(var x = 0; x < prodr*2 + 1; x++){
                    var res = worldmap[y][x];
                    if(res == 2 || res == 3){
                        if(prod.indexOf(res) < 0){
                            prod.push(res);
                        }
                    }
                }
            }
        }

        var _draw = function(ctx, px, py, ts){
            ctx.save();
            ctx.fillStyle = "#532";
            ctx.fillRect(px,py,ts*size,ts*size);
            ctx.restore();
        }

        var _getpos = function(){
            return pos;
        }

        var _getDonation = function(d,c){
            if(!lord) budget = 0;
            if(!donators[d]) donators[d] = 0;
            donators[d] = parseInt(donators[d]) + parseInt(c);

            var l = [d,donators[d]];
            for(var i in donators)
                if(!l || donators[i] > l[1]) l = [i,parseInt(donators[i])];

            lord = l[0];
            gold += parseInt(c);
            console.log(donators, "__donation ", c, "new lord", lord);
            console.log("g ",gold);
        }

        var _tribute = function(){
            var give = budget;
            budget = 0;
            console.log("given ",give);
            return give;
        }

        var _looted = function(at){
            if(!donators[at.faction]) donators[at.faction] = 0;
            donators[at.faction] -= 100;

            return _tribute();
        }

        var _getDamage = function(d){
            var hp = rand(2,5);
            habs -= Math.round(d/hp);
            if(habs < 0) habs = 0;
            res = resh*(Math.floor(habs/5)+1);

            if(habs == 0) return true;
        }

        _Prod();


        this.id = id;
        this.habs = function(){return habs}
        this.pos = pos;
        this.getPos = _getpos;
        this.type = type;
        this.res = function(){return res};
        this.Looted = _looted;
        this.getDamage = _getDamage;
        this.lord = function(){return lord;};
        this.Produces = prod;
        this.getDonation = _getDonation;
        this.Tribute = _tribute;
        this.Update = _update;
        this.Draw = _draw;
        this.Recuit = _recuit;
    }
}

function rand(min,max){
    return Math.floor((Math.random()*max)+min);
}
