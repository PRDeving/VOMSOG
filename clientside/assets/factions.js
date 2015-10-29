var Faction = function(uid,color,name){
    var _uid = uid;
    var _color = color;
    var _name = name;

    var _renown = 0;
    var _gold = rand(30,130);

    var _pays = function(am){
        _gold -= am;
        if(_gold < 0){
            var rest = _gold;
            _gold = 0;
            return rest;
        }
        return _gold;
    }

    var _getTribute = function(am){
        _gold += am;
    }

    this.uid = _uid;
    this.color = _color;
    this.Pays = _pays;
    this.getTribute = _getTribute;
}
