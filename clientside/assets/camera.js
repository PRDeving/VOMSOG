var Camera = new function(){
    var pos = [0,0];
    var fov = 30;

    var _Move = function(x,y){
        (pos[0] + x >= 0 && pos[0] + x <= worldmap.size)? pos[0] += x: false;
        (pos[1] + y >= 0 && pos[1] + y <= worldmap.size)? pos[1] += y: false;
    }

    var _getPos = function(){
        return {x:pos[0],y:pos[1]};
    }

    this.x = pos[0];
    this.y = pos[1];
    this.fov = fov;
    this.Move = _Move;
    this.GetPos = _getPos;
}
