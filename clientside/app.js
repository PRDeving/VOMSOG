function Init(){

    isMobile = false;
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

    SGE.Loader.Add([
        "assets/socket.io.js",
        "assets/media.js",
        "assets/mapobject.js",
        "assets/elements.js",
        "assets/camera.js",
        "assets/renderer.js",
        "assets/troops.js",
        "assets/settlements.js",
        "assets/terrain.js",
        "assets/easystar.min.js",
        "assets/factions.js",
        "assets/actions.js",
        "assets/gui.js",
        "assets/modals.js",
        "services.js"
    ]);
}

var uid = false; // = (sessionStorage.getItem("uid")) ? sessionStorage.getItem("uid"): false;
var sid;

var worldmap;
var elements = {};
var faction;
function Main(){
    socket = io('http://localhost:1111');
    
    socket.emit('uid-handshake',{uid:uid});

    socket.on('uid-set', function (data) {
        sessionStorage.setItem("uid",data);
        uid = data;
        console.log("uid:",uid);

        socket.emit('game-request',uid);
    });

    socket.on('disconnect', function(){
        if(history.length > 0)
            history.back();
    });

    socket.on('game-propagation', function(data){
        console.log("propagated");
        sid = data.sid;
        worldmap = new WorldMap(JSON.parse(data.map));

        easystar = new EasyStar.js();
        easystar.setAcceptableTiles((function(){
            var _temp = [];
            for(var i = 0; i < Terrain.len; i++){
                if(Terrain.CanI(i))
                    _temp.push(i);
            }
            return _temp;
        })());

        for(var i = 0; i < Terrain.len; i++){
            if(Terrain.Cost(i) > 0)
                easystar.setTileCost(i,Terrain.Cost(i));
        }

        Factions = [];
        var df = data.factions;
        for(var i in df){
            Factions.push(new Faction(df[i][0],df[i][1],df[i][2]));
            if(df[i][0] == uid) faction = Factions.length-1;
        }

        console.log(Factions,"mine:",faction);

        // var els = JSON.parse(data.elements);
        // console.log(els);
        // for(var i in els)
        //     if(els[i][0] == "village")
        //         Elements.Add(new Village(els[i][1][0],els[i][1][1]));

        
        SGE.GameLoop.Run(fps);
    });

    socket.on('game-update', function(data){
        console.log("turn");
        var data = JSON.parse(data);
        if(data.elements){
            elements = {};
            for(var i in data.elements){
                var el = data.elements[i];
                elements[el[0]] = [el[0],el[1],el[2],el[3]];
            }
        }
    });


    selected = false;
    timescale = 60;
    fps = 30;

    var canvas = document.getElementById("mycanvas");
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    var ctx = canvas.getContext("2d");


    Render.Init(canvas);

    console.log("main");

    // var troop = Elements.Add(new Army(2,2,0));
    // var troop2 = Elements.Add(new Army(4,3,1));
    // selected = troop2;


    SGE.GameLoop.Suscribe(function(){ctx.clearRect(0,0,canvas.width,canvas.height);});
    SGE.GameLoop.Suscribe(Elements.Update);
    SGE.GameLoop.Suscribe(Actions.Update);
    SGE.GameLoop.Suscribe(Render.MapRender);
    // SGE.GameLoop.Suscribe(GUI.Draw);
    


    if(!isMobile){
        $("body").on({
            // "mousemove": function(e){
            //     if(
            // },
            "click": function(e){
                if(!ModalKind){
                    e.preventDefault();
                    ClickAction(e);
                }
            },
            "contextmenu": function(e){
                if(!ModalKind){
                    e.preventDefault();
                    SecondaryClickAction(e);
                }
            },
            "keypress": function(e){
                if(!ModalKind){
                    e.preventDefault();
                    UserOptions(e);
                }
            }
        });
    }else{

        var tapped = false;
        var moving = false;
        var itap;
        $("body").on({
            "touchstart": function(e){
                var ts = canvas.width / Camera.fov;
                itap = [e.originalEvent.changedTouches[0].clientX,e.originalEvent.changedTouches[0].clientY];

                e.preventDefault()
            },
            "touchmove": function(e){
                moving = true;
                var _camera = Camera.GetPos();
                var ts = canvas.width / Camera.fov;
                var etap = [e.originalEvent.targetTouches[0].clientX,e.originalEvent.targetTouches[0].clientY];
                var _cmx = 0;
                var _cmy = 0;
                if(etap[0] > itap[0]){
                    _cmx = -1;
                }else if(etap[0] < itap[0]){
                    _cmx = 1;
                }
                
                if(etap[1] < itap[1]){
                    _cmy = 1;
                }else if(etap[1] > itap[1]){
                    _cmy = -1;
                }
                tapped = null;
                Camera.Move(_cmx,_cmy);
            },
            "touchend": function(e){
                if(!moving){
                    if(!tapped){
                        tapped=setTimeout(function(){
                            tapped=null
                            ClickAction(e.originalEvent.changedTouches[0]);
                        },100);
                    } else {
                        clearTimeout(tapped);
                        tapped=null
                        SecondaryClickAction(e.originalEvent.changedTouches[0]);
                    }
                }
                moving = false;

                e.preventDefault();
            }
        });
    }

    function ClickAction(e){
        var guic = $(".gui-container");
        if(guic.length > 0) guic.remove();
        var clickin = [e.clientX,e.clientY];
        var ts = canvas.width / Camera.fov;
        var cell = [Math.floor(clickin[0]/ts), Math.floor(clickin[1]/ts)];

        var el = GetElementsIn(cell[0],cell[1]);

        if(el.length > 0 && el[0][3] == faction){
            selected = el[0][0];
            console.log(selected);
        }else{
            selected = false;
        }
    }

    function SecondaryClickAction(e){
        var clickin = [e.clientX,e.clientY];
        var ts = canvas.width / Camera.fov;
        var cell = [Math.floor(clickin[0]/ts), Math.floor(clickin[1]/ts)];
        var _camera = Camera.GetPos();

        var fp = GetElementsIn(cell[0],cell[1]);
        console.log(fp);
        if(selected && fp.length == 0){
            GUI.Draw(clickin[0],clickin[1],"tile",[_camera.x + cell[0], _camera.y + cell[1]])
        }else if(selected && fp[0].length > 0 && fp[0][1] == "army" && fp[0][3] != "undefined" && fp[0][3] != faction){
            GUI.Draw(clickin[0],clickin[1],"enemy",[_camera.x + cell[0], _camera.y + cell[1]])
        }else if(selected && fp[0].length > 0 && fp[0][1] == "army" && fp[0][0] != selected && fp[0][3] != "undefined" && fp[0][3] == faction){
            // GUI.Draw(clickin[0],clickin[1],"army",fp[0][0]);
            GUI.Draw(clickin[0],clickin[1],"army",[_camera.x + cell[0], _camera.y + cell[1]])
        }else if(selected && fp[0].length > 0 && fp[0][0] == selected){
            GUI.Draw(clickin[0],clickin[1],"same");
        }else if(selected && fp[0].length > 0 && fp[0][1] == "village"){
            console.log("vill");
            GUI.Draw(clickin[0],clickin[1],"village",[_camera.x + cell[0], _camera.y + cell[1]])
        }
    }

    function UserOptions(e){
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
    };

}

function GetElement(id){
    for(var i in elements)
        if(elements[i][0] == id) return elements[i];
}

function GetElementsIn(x,y,x2,y2){
    var el = [];
    if(!x2){
        for(var i in elements){
            var e = elements[i];
            if(e[2].x == x && e[2].y == y) el.push(e);
        }
    }else{
        for(var i in elements){
            var e = elements[i];
            if(e[2].x >= x && e[2].y >= y && e[2].x <= x2 && e[2].y <= y2) el.push(e);
        }
    }
    return el;
}

function PathTo(selected,dx,dy,cb){
    var el = GetElement(selected);
    easystar.setGrid(worldmap.map);
    easystar.enableDiagonals();
    easystar.disableCornerCutting();

    easystar.findPath(el[2].x, el[2].y, dx, dy, function( path ) {
        if (path === null) {
            console.log("no path");
        } else {
            cb(path);
        }
    });
    easystar.calculate();
}

function rand(min,max){
    return Math.floor((Math.random()*max)+min);
}
