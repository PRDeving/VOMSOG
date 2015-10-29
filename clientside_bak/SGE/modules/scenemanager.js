
// MANAGER DE ESCENAS
var _Scene = function(){
    var scenes = {};
    var hasGameLoop = SGE.hasModule("gameloop");

    var _Add = function(name, callback){
        scenes[name] = {
            'callback': callback
        };
    };

    var _LoadScene = function(name,args){
        if(hasGameLoop){
            GameLoop.Clear();
        }
        scenes[name].callback(args);
    };

    this.Add = _Add;
    this.Load = _LoadScene;
};  // SCENE

SGE.Scene = new _Scene();
delete _Scene;
