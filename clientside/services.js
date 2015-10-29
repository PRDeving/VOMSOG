var Services = new function(){
    var SERVER = "http://strategy-server.localhost/"

    var _checkGame = function(UID,SID,callback){
        $.ajax({
            url: SERVER+"checkgame.php",
            type: "post",
            data: {
                uid: UID,
                sid: SID
            },
            "success": function(d){
                console.log("success",d);
            },
            "error": function(e){
                console.log("error",e);
            }
        })
    }

    this.CheckGame = _checkGame;
}
