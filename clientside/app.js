function Init(){
    console.log("init");

    SGE.Loader.Add([
        "assets/media.js",
        "assets/mapobject.js",
        "assets/camera.js",
        "assets/renderer.js",
        "assets/troops.js",
        "assets/terrain.js",
        "assets/easystar.min.js",
    ]);
}


function Main(){
    easystar = new EasyStar.js();
    easystar.setGrid(worldmap.map);
    easystar.setAcceptableTiles([1]);

    var canvas = document.getElementById("mycanvas");
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    var ctx = canvas.getContext("2d");


    Render.Init(canvas);

    console.log("main");

    var troop = new Trooper(2,2);
    Render.Add(troop);

    SGE.GameLoop.Suscribe(function(){ctx.clearRect(0,0,canvas.width,canvas.height);});
    SGE.GameLoop.Suscribe(Render.MapRender);
    SGE.GameLoop.Run(30);

    // Render.MapRender();
    
    $("body").on("click", function(e){
        e.preventDefault();
        var clickin = [e.clientX,e.clientY];
        var ts = canvas.width / Camera.fov;
        var cell = [Math.floor(clickin[0]/ts), Math.floor(clickin[1]/ts)];
        console.log(cell);

        var _camera = Camera.GetPos();
        worldmap.setTile(_camera.x + cell[0],_camera.y + cell[1],0);
    });
    $("body").on("contextmenu", function(e){
        e.preventDefault();
        var clickin = [e.clientX,e.clientY];
        var ts = canvas.width / Camera.fov;
        var cell = [Math.floor(clickin[0]/ts), Math.floor(clickin[1]/ts)];

        console.log("going to: ",cell);

        var _camera = Camera.GetPos();
        troop.goTo(_camera.x + cell[0],_camera.y + cell[1]);
    });

    $("body").on("keypress", function(e){
        switch(e.keyCode){
            case 119:
                Camera.Move(0,-1);
            break;
            case 100:
                Camera.Move(1,0);
            break;
            case 115:
                Camera.Move(0,1);
            break;
            case 97:
                Camera.Move(-1,0);
            break;
        }
    });
}

function rand(min,max){
    return Math.floor(Math.random()*max)+min;
}
