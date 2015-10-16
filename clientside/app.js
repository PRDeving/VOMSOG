function Init(){
    console.log("init");

    SGE.Loader.Add([
        "assets/mapobject.js",
        "assets/camera.js",
        "assets/renderer.js",
        "assets/troops.js",
        "assets/terrain.js",
        "assets/pathfinder.js"
    ]);
}

function Main(){
    var canvas = document.getElementById("mycanvas");
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    var ctx = canvas.getContext("2d");

    Render.Init(canvas);

    console.log("main");

    SGE.GameLoop.Suscribe(function(){ctx.clearRect(0,0,canvas.width,canvas.height);});
    SGE.GameLoop.Suscribe(Render.MapRender);
    SGE.GameLoop.Run(1);

    // Render.MapRender();

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
