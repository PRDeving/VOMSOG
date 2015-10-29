var _FullScreen = function(callback){
    var el = document.documentElement;
    var rfs = el.requestFullScreen ||
              el.webkitRequestFullScreen ||
              el.mozRequestFullScreen;

    rfs.call(el);
    if(callback){
        callback();
    }
};

SGE.FullScreen = _FullScreen;
delete _FullScreen;
