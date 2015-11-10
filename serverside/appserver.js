var Map = require("./map.js");
var Elements = require("./elements.js");
var Settlements = require("./settlements.js");
var Army = require("./army.js");
var Faction = require("./factions.js");
var Actions = require("./actions.js");

var Games = new function(){
    var _games = {};

    var _new = function(sid, players){
        _games[sid] = new Game(sid,players);
        console.log("partida");
        return _games[sid];
    }

    var _findPlayersGame = function(uid){
        for(var i in _games)
            for(var p in _games[i].players)
                if(_games[i].players[p] == uid) return _games[i];
    }

    var _get = function(sid){
        return _games[sid];
    }

    var Game = function(sid,players){
        var _sid = sid;
        var _players = players;
        // var _playersocket = false;

        var _playersocket = (function(){
            var temp = {};
            for(var i = 0; i < _players.length; i++){
                temp[_players[i]] = clients[_players[i]];
            }

            return temp;
        })();

        var _factions = []
        _factions.push(new Faction(_players[0],"206,102,0","faccion 1"));
        _factions.push(new Faction(_players[1],"199,229,0","faccion 2"));

        var _map = new Map(255);
        var _elements = new Elements();
        var _actions = new Actions();


        var vd = Math.round(255/4);

        for(var i = 0; i<vd; i++){
            var pos = [rand(0,254),rand(0,254)]

            if(_map.map[pos[0]][pos[1]] != 0 && _map.map[pos[0]][pos[1]] != 3){
                _map.map[pos[0]][pos[1]] = 5;
                _elements.Add(new Settlements.Village(pos[0],pos[1],_map.map));
            }
        }

        _elements.Add(new Settlements.Village(8,0,_map.map));
        _elements.Add(new Army(1,1,0));
        _elements.Add(new Army(4,1,1));


        var _Update = function(){
            _actions.Update(_elements,_factions,_map);
            _elements.Update(_elements, _factions, _map, _actions, _playersocket);
        }

        var _Turn = function(){
            _Update();
            var els = _elements.pool();
            var data = {elements:[]};
            for(var e in els){
                data.elements.push([els[e].id,els[e].type,els[e].pos,els[e].faction]);
            }

            // console.log(data);
            for(var i in _players)
                if(clients[_players[i]])
                    clients[_players[i]].emit('game-update',JSON.stringify(data));
        }

        var _CreateGame = function(){
            console.log("Created: ",_sid,"Games:",count(_games));

            for(var i in _players)
                clients[_players[i]].emit('game-propagation',{
                    sid: _sid,
                    map: JSON.stringify(_map.map),
                    factions: [
                        [_players[0],"206,102,0","faction 1"],
                        [_players[1],"199,229,0","faction 2"],
                    ],
                });
                _Turn();
        }

        var _Remove = function(){
            delete _games[_sid];
            console.log("Deleted: ",_sid,"Games:",count(_games));
        }

        _CreateGame();

        this.Elements = function(){return _elements};
        this.Actions = function(){return _actions};
        this.Remove = _Remove;
        this.Update = _Update;
        this.Turn = _Turn;
        this.players = _players;
    }

    this.Each = function(){ return _games};
    this.New = _new;
    this.Get = _get;
    this.FindPlayersGame = _findPlayersGame;
}


var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(1111);

var clients = {};
var c_waiting = [];
var games = {};


function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading index.html');
                }

                res.writeHead(200);
                res.end(data);
            });
}

io.on('connection', function(socket){
    socket.on('uid-handshake',function(d){
        var uid;
        if(d.uid){
            uid = d.uid;
        }else{
            var uid = Math.floor(Math.random()*9999999999+1);
        }
        UserIdentify(uid,socket);
    });

    socket.on('game-created', function(data){
        var sid = data.sid;

        Games.Get(sid).Init(data);
    });

    socket.on('disconnect', function(){
        var u = FindClient(socket);
        delete clients[u];
        console.log("disconnected",u,"clients: ",count(clients));
        
        var g = Games.FindPlayersGame(u);
        var active = false;
        for(var i in g.players)
            if(clients[g.players[i]]) active = true;

        if(!active)
            g.Remove();
    });


    socket.on('element-move', function(d){
        var g = Games.Get(d.sid);
        g.Elements().getElement(d.element).goTo(JSON.parse(d.path));
    });
    socket.on('element-divide',function(d){
        var g = Games.Get(d.sid);
        g.Elements().getElement(d.element).Divide(d.troops);
    });
    socket.on('element-recuit', function(d){
        var g = Games.Get(d.sid);
        g.Actions().Add("recuit",g.Elements().getElement(d.element),JSON.parse(d.path));
    });
    socket.on('element-donate', function(d){
        var g = Games.Get(d.sid);
        g.Actions().Add("donate",g.Elements().getElement(d.element),JSON.parse(d.path),d.gold);
    });
    socket.on('element-loot', function(d){
        var g = Games.Get(d.sid);
        g.Actions().Add("loot",g.Elements().getElement(d.element),JSON.parse(d.path));
    });
    socket.on('element-reinforce', function(d){
        var g = Games.Get(d.sid);
        g.Actions().Add("reinforce",g.Elements().getElement(d.element),JSON.parse(d.path),d.data);
    });
});

var loop = setInterval(function(){
    var gm = Games.Each();
    if(count(gm) > 0){
        for(var g in gm);
            gm[g].Turn();
    }
},1000);



function count(o){
    var _c = 0;
    for(var i in o)
        _c++;
    return _c;
}

function FindClient(sk){
    for(var i in clients)
        if(clients[i] == sk) return i;
    return false;
}
// function FindSocket(uid){
//     return 
// }

function UserIdentify(uid,socket){
    clients[uid] = socket;
    socket.emit('uid-set',uid);

    console.log("cliente",uid,"conectado #",count(clients));

    if(c_waiting.length > 0){
        var sid = Math.floor(Math.random()*9999999999+1);
        console.log(uid+" and "+c_waiting[0]+" in lobby.");
        console.log("creating "+sid+" ...");
        Games.New(sid,[uid,c_waiting[0]]);
        c_waiting.splice(0,1);
    }else{
        c_waiting.push(uid);
    }
}

function rand(min,max){
    return Math.floor((Math.random()*max)+min);
}
