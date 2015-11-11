var Camera = new function(){
    var pos = [0,0];
    var fov = 80;

    var _Move = function(x,y){
        var canvas = document.getElementById("mycanvas");
        (pos[0] + x >= 0 && pos[0] + x <= worldmap.size-fov-1)? pos[0] += x: false;
        (pos[1] + y >= 0 && pos[1] + y <= worldmap.size-Math.round(canvas.height/(canvas.width/fov)) - 1)? pos[1] += y: false;
    }

    var _Focus = function(x,y){
        var canvas = document.getElementById("mycanvas");
        xpoint = x-(fov/2);
        ypoint = y-Math.round(canvas.height/(canvas.width/fov));

        pos = [xpoint,ypoint];
    }

    var _getPos = function(){
        return {x:pos[0],y:pos[1]};
    }

    this.x = pos[0];
    this.y = pos[1];
    this.fov = fov;
    this.Move = _Move;
    this.GetPos = _getPos;
    this.Focus = _Focus;
}
