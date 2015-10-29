var GUI = new function(){

    var obj;
    var options = {
        "tile" : [
            ["move","/sprites/ico-move.svg",function(obj){
                console.log("sid:",sid);
                PathTo(selected,obj[0],obj[1],function(path){
                    socket.emit("element-move",{
                        uid:uid,
                        sid:sid,
                        element:selected,
                        path: JSON.stringify(path)});
                });
            }],
            // ["build","",function(obj){
            //     console.log("build");
            // }]
        ],
        "enemy": [
            ["atack","/sprites/ico-attack.png",function(obj){
                PathTo(selected,obj[0],obj[1],function(path){
                    socket.emit("element-move",{
                        uid:uid,
                        sid:sid,
                        element:selected,
                        path: JSON.stringify(path)});
                });
            }]
        ],
        "army" : [
            ["reinforce","/sprites/ico-reinforce.png",function(obj){
                Modal("troops",function(tr){
                    PathTo(selected,obj[0],obj[1],function(path){
                        socket.emit("element-reinforce",{
                            uid:uid,
                            sid:sid,
                            element:selected,
                            path: JSON.stringify(path),
                            data: tr
                        });
                    });
                });
                Actions.Add("reinforce",selected,obj);
            }],
            // ["supply","",function(obj){
            //     console.log("supply");
            // }]
        ],
        "village" : [
            ["recuit","/sprites/ico-army.jpg",function(obj){
                PathTo(selected,obj[0],obj[1],function(path){
                    socket.emit("element-recuit",{
                        uid:uid,
                        sid:sid,
                        element:selected,
                        path:JSON.stringify(path)
                    });
                });
                // Actions.Add("recuit",selected,obj);
            }],
            ["donate","/sprites/ico-donate.png",function(obj){
                Modal("gold", function(g){
                    PathTo(selected,obj[0],obj[1],function(path){
                        socket.emit("element-donate",{
                            uid:uid,
                            sid:sid,
                            element:selected,
                            path:JSON.stringify(path),
                            gold: g
                        });
                    });
                });
                // Actions.Add("donate",selected,obj);
            }],
            ["attack","/sprites/ico-attack.png",function(obj){
                PathTo(selected,obj[0],obj[1],function(path){
                    socket.emit("element-loot",{
                        uid:uid,
                        sid:sid,
                        element:selected,
                        path:JSON.stringify(path)
                    });
                });
                // Actions.Add("loot",selected,obj);
            },false],
            ["tribute","/sprites/ico-coins.png",function(obj){
                PathTo(selected,obj[0],obj[1],function(path){
                    socket.emit("element-tribute",{
                        uid:uid,
                        sid:sid,
                        element:selected,
                        path:JSON.stringify(path)
                    });
                });
                // Actions.Add("tribute",selected,obj);
            },true],
        ],
        "same" : [
            ["divide","/sprites/ico-split.png",function(){
                Modal("troops",function(tr){
                    socket.emit("element-divide", {sid:sid,element:selected,troops:JSON.stringify(tr)});
                });
            }]
        ]
    }

    var s;
    var _draw = function(x,y,opt,obj){
        var unused = $(".gui-container");
        if(unused.length > 0) unused.remove();;
        var it = selected;
        s = false;
        obj = obj;
        var el = document.createElement("div");
        var $el = $(el);
        
        $el.addClass("gui-container");

        for(var i in options[opt]){
            var o = options[opt][i];
            var b = document.createElement("div");
            var $b = $(b);

            $b.addClass("gui-item").append($("<img>").attr("src",o[1]).attr("width","100%")).attr("onclick","GUI.setResponse('"+i+"')");
            $el.append(b);
        }

        $("body").append(el);
        $el.css({
            left: (x - $el.width()/2 > 0) ? x - $el.width()/2: 0,
            top: y
        });
        
        var timer = setInterval(function(){
            if(s){
                clearInterval(timer);
                $el.remove();

                selected = it;
                if(options[opt][s])
                    options[opt][s][2](obj);
            }
        },fps);
    }

    var _setResponse = function(res){
        s = res;
    }

    this.setResponse = _setResponse;
    this.Draw = _draw;
    this.O = options;
}
