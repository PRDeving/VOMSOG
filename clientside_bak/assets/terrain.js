var Terrain = new function(){
    var _terrains = [
        //Water - 0
        [
            function(ctx,px,py,ts){
                ctx.save();
                ctx.fillStyle = "blue";
                ctx.fillRect(px,py,ts,ts);
                ctx.restore();
            },
            //WALKABLE
            false,
            //RESOURCE
            false,
            //COST
            0
        ],
        // Field - 1
        [
            function(ctx,px,py,ts){
                ctx.save();
                ctx.fillStyle = "#01970F";
                ctx.fillRect(px,py,ts,ts);
                ctx.restore();
            },true,false,1
        ],
        // Forest - 2
        [
            function(ctx,px,py,ts,x,y){
                ctx.save();
                ctx.fillStyle = "#009623";
                ctx.fillRect(px,py,ts,ts);
                var img = Media.tree;

                var els = Elements.getElementsIn(x,y-1,x,y);
                if(els.length > 0)
                    ctx.globalAlpha = 0.6;
                ctx.drawImage(img,px,py-25,ts,ts+25);
                
                ctx.restore();
            },true,true,3
        ],
        // Stone - 3
        [
            function(ctx,px,py,ts){
                ctx.save();
                ctx.fillStyle = "grey";
                ctx.fillRect(px,py,ts,ts);
                ctx.restore();
            },false,true,0
        ],
        // Hill - 4
        [
            function(ctx,px,py,ts){
                ctx.save();
                ctx.fillStyle = "#007F0C";
                ctx.fillRect(px,py,ts,ts);
                ctx.restore();
            },true,false,2
        ],
        // Foundations - 5
        [
            function(ctx,px,py,ts){
                ctx.save();
                ctx.fillStyle = "brown";
                ctx.fillRect(px,py,ts,ts);
                ctx.restore();
            },true,false,10
        ]
    ]

    var _draw = function(x,y,ctx,px,py,ts){
        var id = worldmap.getTile(x,y);
        ctx.save();
        _terrains[id][0](ctx,px,py,ts,x,y);
        ctx.restore();
    }

    var _cani = function(id){
        return _terrains[id][1];
    }

    var _isResource = function(id){
        return _terrains[id][2];
    }

    var _cost = function(id){
        return _terrains[id][3];
    }

    this.len = _terrains.length;
    this.CanI = _cani;
    this.Draw = _draw;
    this.Cost = _cost;
    this.isResource = _isResource;
}
