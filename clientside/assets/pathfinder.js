var Pathfinder = function(ox, oy, dx, dy){
    var steps = [];
    var inDestiny = false;

    while(!inDestiny){
        var cx;
        var cy;

        if(steps.length > 0){
            cx = steps[steps.length-1][0];
            cy = steps[steps.length-1][1];
        }else{
            cx = ox;
            cy = oy;
        }

        var options = [];

        options.push([cx - 1,cy]);
        options.push([cx + 1,cy]);
        options.push([cx,cy - 1]);
        options.push([cx,cy + 1]);
        options.push([cx - 1,cy - 1]);
        options.push([cx + 1,cy + 1]);
        options.push([cx + 1,cy - 1]);
        options.push([cx - 1,cy + 1]);

        var bestl;
        var beststep = [];
        for(var x = 0; x < options.length; x++){
            if(options[x][0] < 0 ||
               options[x][0] > worldmap.size ||
               options[x][1] < 0 ||
               options[x][1] > worldmap.size) continue;

            if(options[x][0] == dx && options[x][1] == dy){
                bestl = 0;
                beststep = options[x];
                break;
            }

            var pathl = Math.abs(options[x][0] - dx) + Math.abs(options[x][1] - dy);

            if(!bestl || pathl < bestl){
                if(Terrain.CanI(worldmap.getTile(options[x][0],options[x][1])[0])){
                    bestl = pathl;
                    beststep = options[x];
                }
            }else{
                continue;
            }
        }

        steps.push(beststep);
        if(beststep[0] == dx && beststep[1] == dy) inDestiny = true;
    }

    return steps;
}
