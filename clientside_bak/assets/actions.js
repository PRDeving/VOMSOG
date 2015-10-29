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

        var looting;
        var modalans;
        console.log("enel: ",en,el);

        if(_act == "fight"){
            place.push({x:el.pos.x,y:el.pos.y});
            place.push({x:en.pos.x,y:en.pos.y});
        }

        var _update = function(){

            switch(_act){
                case "fight":

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

                        var elad = -1*(Math.round(_en.moral()/100 * (Math.floor(rand(0,enta/10+(en.c*0.05)))+bonus_en)));
                        var elid = -1*(Math.round(_en.moral()/100 * (Math.floor(rand(0,enta/10+(en.a*0.05)))+bonus_en)));
                        var elcd = -1*(Math.round(_en.moral()/100 * (Math.floor(rand(0,enta/10+(en.i*0.05)))+bonus_en)));

                        var enad = -1*(Math.round(_el.moral()/100 * (Math.floor(rand(0,elta/10+(el.c*0.05)))+bonus_el)));
                        var enid = -1*(Math.round(_el.moral()/100 * (Math.floor(rand(0,elta/10+(el.a*0.05)))+bonus_el)));
                        var encd = -1*(Math.round(_el.moral()/100 * (Math.floor(rand(0,elta/10+(el.i*0.05)))+bonus_el)));


                        _el.updateTroops({i:elid, a: elad, c: elcd});
                        _en.updateTroops({i:enid, a: enad, c: encd});
                        // console.log("fight", _el.troops(), _en.troops());
                break;
                case "reinforce":
                    console.log("reinforce");

                    if(!ModalKind && !modalans){
                        Modal("troops",function(tr){
                            modalans = {i:-1*(tr.i),a:-1*(tr.a),c:-1*(tr.c)};
                        });
                    }

                    if((_el && _en) && (_el.getPos().x > _en.getPos().x + 1 ||
                      _el.getPos().x < _en.getPos().x - 1 ||
                      _el.getPos().y > _en.getPos().y + 1 ||
                      _el.getPos().y < _en.getPos().y -1)){
                        if(_el.P().length == 0){
                            var nb = worldmap.getNeighbors(_en.pos.x,_en.pos.y);
                            var nearest;
                            for(var c in nb){
                                if(!nearest || Math.abs((nb[c][0] - _el.pos.x) + (nb[c][1] - _el.pos.y)) < Math.abs((nearest[0] - nb[c][0])+(nearest[1] - nb[c][1])))
                                    nearest = nb[c];
                            }
                            _el.goTo(nearest[0],nearest[1]);
                        }
                    }else{
                        if(modalans){
                            var given = _el.updateTroops(modalans);
                            _en.updateTroops(given);
                            modalans = false;
                            _self.RemoveAction(this);
                        }
                    }

                break;
                case "recuit":
                    if((_el && _en) && (_el.getPos().x > _en.getPos().x + 1 ||
                      _el.getPos().x < _en.getPos().x - 1 ||
                      _el.getPos().y > _en.getPos().y + 1 ||
                      _el.getPos().y < _en.getPos().y -1)){
                        if(_el.P().length == 0){
                            var nb = worldmap.getNeighbors(_en.pos.x,_en.pos.y);
                            var nearest;
                            for(var c in nb){
                                if(!nearest || Math.abs((nb[c][0] - _el.pos.x) + (nb[c][1] - _el.pos.y)) < Math.abs((nearest[0] - nb[c][0])+(nearest[1] - nb[c][1])))
                                    nearest = nb[c];
                            }
                            _el.goTo(nearest[0],nearest[1]);
                        }
                    }else{
                        var men = _en.Recuit(_el);

                        var c = rand(0,men);
                        var a = rand(0,men-c);
                        var i = men - c - a;

                        _el.updateTroops({i:i,a:a,c:c});
                        console.log("recuited ", men, " men", {i:i,a:a,c:c});
                        _self.RemoveAction(this);
                    }
                break;
                case "donate":
                    if(!ModalKind && !modalans){
                        Modal("gold",function(tr){
                            modalans = tr;
                        });
                    }

                    if((_el && _en) && (_el.getPos().x > _en.getPos().x + 1 ||
                      _el.getPos().x < _en.getPos().x - 1 ||
                      _el.getPos().y > _en.getPos().y + 1 ||
                      _el.getPos().y < _en.getPos().y -1)){
                        if(_el.P().length == 0){
                            var nb = worldmap.getNeighbors(_en.pos.x,_en.pos.y);
                            var nearest;
                            for(var c in nb){
                                if(!nearest || Math.abs((nb[c][0] - _el.pos.x) + (nb[c][1] - _el.pos.y)) < Math.abs((nearest[0] - nb[c][0])+(nearest[1] - nb[c][1])))
                                    nearest = nb[c];
                            }
                            _el.goTo(nearest[0],nearest[1]);
                        }
                    }else{
                        if(modalans){
                            var given = modalans;
                            var rest = Factions[_el.faction].Pays(modalans);
                            if(rest < 0) given += rest;
                            _en.getDonation(_el.faction,given);
                            modalans = false;
                            _self.RemoveAction(this);
                        }
                    }
                break;
                case "tribute":
                    if((_el && _en) && (_el.getPos().x > _en.getPos().x + 1 ||
                      _el.getPos().x < _en.getPos().x - 1 ||
                      _el.getPos().y > _en.getPos().y + 1 ||
                      _el.getPos().y < _en.getPos().y -1)){
                        if(_el.P().length == 0){
                            var nb = worldmap.getNeighbors(_en.pos.x,_en.pos.y);
                            var nearest;
                            for(var c in nb){
                                if(!nearest || Math.abs((nb[c][0] - _el.pos.x) + (nb[c][1] - _el.pos.y)) < Math.abs((nearest[0] - nb[c][0])+(nearest[1] - nb[c][1])))
                                    nearest = nb[c];
                            }
                            _el.goTo(nearest[0],nearest[1]);
                        }
                    }else{
                        if(_el.faction == _en.lord()){
                            Factions[_el.faction].getTribute(_en.Tribute());
                        }
                        _self.RemoveAction(this);
                    }
                break;
                case "loot":
                    if((_el && _en) && (_el.getPos().x > _en.getPos().x + 1 ||
                      _el.getPos().x < _en.getPos().x - 1 ||
                      _el.getPos().y > _en.getPos().y + 1 ||
                      _el.getPos().y < _en.getPos().y -1)){
                        if(!looting && _el.P().length == 0){
                            var nb = worldmap.getNeighbors(_en.pos.x,_en.pos.y);
                            var nearest;
                            for(var c in nb){
                                if(!nearest || Math.abs((nb[c][0] - _el.pos.x) + (nb[c][1] - _el.pos.y)) < Math.abs((nearest[0] - nb[c][0])+(nearest[1] - nb[c][1])))
                                    nearest = nb[c];
                            }
                            looting = true;
                            _el.goTo(nearest[0],nearest[1]);
                        }
                    }else {
                        if(looting && _el.getPos().x > _en.getPos().x + 1 ||
                          _el.getPos().x < _en.getPos().x - 1 ||
                          _el.getPos().y > _en.getPos().y + 1 ||
                          _el.getPos().y < _en.getPos().y -1){
                            looting = false;
                            _self.RemoveAction(this);
                        } 
                        var elta = _el.troops().i + _el.troops().a + _el.troops().c;
                        console.log("force: ",elta,_en.res());
                        if(elta == 0){_self.RemoveAction(this);}

                        var vd = Math.floor(Math.round(rand(0,_en.res())/10)+1);
                        var ad = Math.floor(Math.round(rand(0,elta)/100)+1);
                        var elwin = _en.getDamage(ad);
                        if(elwin){ _en.Looted(_el); _el.win(); _self.RemoveAction(this);}

                        var elcd = Math.round(rand(0,vd));
                        var elid = vd - elcd;
                        var elad = vd - elcd - elid;
                        console.log("D: ",vd,ad);
                        console.log("deads: ",elid,elad,elcd);
                        _el.updateTroops({i:-1*(elid), a: -1*(elad), c: -1*(elcd)});

                    }
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

