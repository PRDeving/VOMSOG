var Terrain = new function(){
    var _terrains = [
        //Water - 0
        [
            function(ctx,px,py,ts){
                ctx.save();
                ctx.fillStyle = "blue";
                ctx.fillRect(px,py,ts,ts);
                ctx.restore();
            },false
        ],
        // Field - 1
        [
            function(ctx,px,py,ts){
                ctx.save();
                ctx.fillStyle = "green";
                ctx.fillRect(px,py,ts,ts);
                ctx.restore();
            },true
        ]
    ]

    var _draw = function(id,ctx,px,py,ts){
        _terrains[id][0](ctx,px,py,ts);
    }

    var _cani = function(id){
        return _terrains[id][1];
    }

    this.CanI = _cani;
    this.Draw = _draw;
}