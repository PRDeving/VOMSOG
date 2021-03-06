module.exports =  function(){
        var _pool = [];

        var _add = function(el){
            _pool.push(el);
            return _pool[_pool.length-1]
        }

        var _update = function(el,fac,map,act,ps){
            for(var i in _pool)
                if(_pool[i].hasOwnProperty("Update"))
                    _pool[i].Update(el,fac,map,act,ps);
        }

        var _remove = function(el){
            for(var i in _pool)
                if(_pool[i] == el) _pool.splice(i,1);
        }

        var _getElement = function(id){
            for(var i in _pool)
                if(_pool[i].id == id) return _pool[i];
        }

        var _getElementsIn = function(x,y,x2,y2){
            var _elems = [];
            if(!x2){
                for(var i in _pool){
                    if(_pool[i].pos.x == x && _pool[i].pos.y == y)
                        _elems.push(_pool[i]);
                }
            }else{
                for(var i in _pool){
                    if(_pool[i].pos.x >= x && _pool[i].pos.x <= x2 &&
                       _pool[i].pos.y >= y && _pool[i].pos.y <= y2)
                        _elems.push(_pool[i]);
                }
            }
            return _elems;
        }

        var _setElements = function(els){
            _pool = JSON.parse(els);
        }

        this.Add = _add;
        this.Update = _update;
        this.getElementsIn = _getElementsIn;
        this.getElement = _getElement;
        this.setElements = _setElements;
        this.pool = function(){return _pool};
        this.Remove = _remove;
}
