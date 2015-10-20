var Actions = new function(){
    var _self = this;
    var _actions = [];
    var _add = function(act, el, en){
        _actions.push(new _action(act,el,en));
    }

    var uc = 0;
    var _update = function(){
        uc++;

        if(uc % timescale == 0){
            if(_actions.length > 0){
                for(var i in _actions)
                    _actions[i].Update();
            };
        }
    }

    var _removeAction = function(act){
        for(var i in _actions)
            if(_actions[i] == act) _actions.splice(i,1);
    }


    function _action(act,el,en){
        var _act = act;
        var _el = el;
        var _en = en;
        var place = [];

        if(_act == "fight"){
            place.push({x:el.pos.x,y:el.pos.y});
            place.push({x:en.pos.x,y:en.pos.y});
        }

        var _update = function(){
            if((_el && _en) && (_el.getPos().x > _en.getPos().x + 1 ||
              _el.getPos().x < _en.getPos().x - 1 ||
              _el.getPos().y > _en.getPos().y + 1 ||
              _el.getPos().y < _en.getPos().y -1)){

                if(place.length > 0){
                    if(_el && _el.getPos().x != place[0].x && _el.getPos().y != place[0].y){
                        _el.retire();
                    }else if(_en && _en.getPos().x != place[1].x && _en.getPos().y != place[1].y){
                        _en.retire()
                    }else if(!_el){
                        _en.win();
                    }else if(!_en){
                        _el.win();
                    }
                }
                _self.RemoveAction(this);
            }

            switch(_act){
                case "fight":

                    var el = _el.troops();
                    var en = _en.troops();

                    var bonus_el = (function(){
                        var _b = 0;

                        var _nb = worldmap.getNeighbors(_el.getPos().x, _el.getPos().y);
                        for(var i in _nb){
                            if(worldmap.getTile(_nb[i][0],_nb[i][1]) == 2){
                                _b += Math.round(el.a * 0.02);
                            }
                            break;
                        }

                        if(worldmap.getTile(_el.getPos().x,_el.getPos().y) == 4 && worldmap.getTile(_en.getPos().x,_en.getPos().y) != 4){
                            _b += Math.round(el.a * 0.1);
                        }

                        return _b;
                    })()

                    var bonus_en = (function(){
                        var _b = 0;

                        var _nb = worldmap.getNeighbors(_en.getPos().x, _en.getPos().y);
                        for(var i in _nb){
                            if(worldmap.getTile(_nb[i][0],_nb[i][1]) == 2){
                                _b += Math.round(en.a * 0.02);
                            }
                            break;
                        }

                        if(worldmap.getTile(_en.getPos().x,_en.getPos().y) == 4 && worldmap.getTile(_el.getPos().x,_el.getPos().y) != 4){
                            _b += Math.round(en.a * 0.1);
                        }

                        return _b;
                    })()

                    var elta = el.i + el.a + el.c;
                    var enta = en.i + en.a + en.c;

                    if(elta == 0){ _en.win(); _self.RemoveAction(this);}
                    if(enta == 0){ _el.win(); _self.RemoveAction(this);}

                        var elad = Math.round(_en.moral()/100 * (Math.floor(rand(0,enta/10+(en.c*0.05)))+bonus_en));
                        var elid = Math.round(_en.moral()/100 * (Math.floor(rand(0,enta/10+(en.a*0.05)))+bonus_en));
                        var elcd = Math.round(_en.moral()/100 * (Math.floor(rand(0,enta/10+(en.i*0.05)))+bonus_en));

                        var enad = Math.round(_el.moral()/100 * (Math.floor(rand(0,elta/10+(el.c*0.05)))+bonus_el));
                        var enid = Math.round(_el.moral()/100 * (Math.floor(rand(0,elta/10+(el.a*0.05)))+bonus_el));
                        var encd = Math.round(_el.moral()/100 * (Math.floor(rand(0,elta/10+(el.i*0.05)))+bonus_el));


                        _el.updateTroops({i:elid, a: elad, c: elcd});
                        _en.updateTroops({i:enid, a: enad, c: encd});
                        // console.log("fight", _el.troops(), _en.troops());
                break;
                case "assault":
                    console.log("assault")
                break;
            }
        }

        this.Update = _update;
    }

    this.Add = _add;
    this.List = _actions;
    this.Update = _update;
    this.RemoveAction = _removeAction;
}

