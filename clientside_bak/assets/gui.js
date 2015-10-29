var GUI = new function(){

    var obj;
    var options = {
        "tile" : [
            ["move","",function(obj){
                selected.goTo(obj[0],obj[1]);
            }],
            ["build","",function(obj){
                console.log("build");
            }]
        ],
        "enemy": [
            ["atack","",function(obj){
                selected.goTo(obj.pos.x,obj.pos.y);
            }]
        ],
        "army" : [
            ["reinforce","",function(obj){
                Actions.Add("reinforce",selected,obj);
            }],
            ["supply","",function(obj){
                console.log("supply");
            }]
        ],
        "village" : [
            ["recuit","",function(obj){
                Actions.Add("recuit",selected,obj);
            }],
            ["donate","",function(obj){
                Actions.Add("donate",selected,obj);
            }],
            ["attack","",function(obj){
                Actions.Add("loot",selected,obj);
            },false],
            ["tribute","",function(obj){
                Actions.Add("tribute",selected,obj);
            },true],
        ],
        "same" : [
            ["divide","",function(){
                Modal("troops",function(tr){
                    selected.Divide(tr);
                });
            }]
        ]
            //Enemy
            // {}
        // "village":
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

            if(o.length < 4){
                $b.addClass("gui-item").html(o[0][0]).attr("onclick","GUI.setResponse('"+i+"')");
                $el.append(b);
            }else if(obj.type == "village"){
                var f = (selected.faction == obj.lord())?true: false;
                if(o[3] == f){
                    $b.addClass("gui-item").html(o[0][0]).attr("onclick","GUI.setResponse('"+i+"')");
                    $el.append(b);
                }
            }
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
