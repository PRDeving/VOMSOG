var csstitle = "color: #333; font-size: 18px";
var csssubtitle = "color: #555; font-size: 14px";
var csssuccess = "color: #0f0; font-size: 14px";
var csswarning = "color: #f00; font-size: 14px";

var ENGINE_PATH = "SGE/";
var SGE = {};

(function(){
    window.load = (function() {

        // Load the script
        var script = document.createElement("SCRIPT");
        script.src = ENGINE_PATH+'/lib/jquery.js';
        script.type = 'text/javascript';
        document.getElementsByTagName("head")[0].appendChild(script);

        var checkReady = function(callback) {
            if (window.jQuery) {
                callback(jQuery);
            }else {
                setTimeout(function() { checkReady(callback); }, 100);
            }
        };

        checkReady(function($) {
            SGE.Loader = new _Loader();

            //// Get packages Recipes from packages.json and store them in Packages
            $.ajax({
                url: ENGINE_PATH+"packages.json",
                async: false,
                success: function(data){
                    Packages = data;
                },
                error: function(xhr, ajaxOptions, thrownError){
                    if(xhr.status==404){
                        console.log("%c no existe archivo de configuracion "+ENGINE_PATH+"packages.json", csswarning);
                    }else if(xhr.status==200){
                        console.log("%c Error en archivo de configuracion "+ENGINE_PATH+"packages.json", csswarning);
                        console.log(thrownError);
                    }

                }
            });

            $.ajax({
                url: 'config.json',
                dataType: 'json',
                async: false,
                success: function(data){
                    Config = data;
                    SGE.Config = Config;
                    noDebug();

                    console.log("%c Archivo de configuracion config.json cargado", csssuccess);

                    for(var x in Config.modules){
                        SGE.Loader.Add(ENGINE_PATH+"modules/" + Config.modules[x] + ".js");
                    }
                    for(var x in Config.packages){
                        for(var y in Packages[Config.packages[x]]){
                            SGE.Loader.Add(ENGINE_PATH+"modules/" + Packages[Config.packages[x]][y] + ".js");
                        }
                    }

                    var applicationjs;

                    $("script").each(function(){
                        if($(this).attr("app")){
                            applicationjs = $(this).attr("app");
                        }
                    });


                    console.log("%c Main app: ", csstitle ,applicationjs);

                    SGE.Loader.Add(applicationjs);
                    SGE.Loader.Run(function(){ 
                        Init();
                        SGE.Loader.Run([function(){
                            delete SGE.Loader;
                            console.log("%c Iniciando aplicacion",csstitle)
                        },Main]);
                    });
                },
                error: function(xhr, ajaxOptions, thrownError){

                    if(xhr.status==404){
                        console.log("%c no existe archivo de configuracion config.json", csswarning);
                    }else if(xhr.status==200){
                        console.log("%c Error en archivo de configuracion config.json", csswarning);
                        console.log(thrownError);
                    }
                }
            });
        });





    })();




    // MODULO CARGADOR
    //
    // CARGA TODOS LOS ARCHIVOS PASADOS Y EJECUTA CALLBACK AL TERMINAR
    var _Loader = function(){
        var loadertimeri;
        var loaderror = false;
        var engineLoad = true;
        var modules = [];
        var m = [];
        var modulesLoaded = 0;
        var done = false;
        
        var _AddModule = function(url){
            if(typeof url === 'object'){
                for(var x in url){
                    modules.push(url[x]);
                }
            }else{
                modules.push(url);
            }
        };

        var _LoadModule = function(i){
            $.ajax({
                url: m[i],
                dataType: 'script',
                cache: false,
                success: function(){
                    modulesLoaded++;
                    console.log('%c Cargado: ' + this.url,
                                csssuccess,modulesLoaded,"/",m.length);
                    if(modulesLoaded === m.length){
                        done = true;
                    }
                },
                error: function(xhr, ajaxOptions, thrownError){
                    if(engineLoad){
                        console.log('%c Error cargando Modulos de sistema',
                                    csswarning);
                    }else{
                        console.log('%c Error cargando dependencias de aplicacion \n',
                                     csswarning);
                    }

                    if(xhr.status==404){
                        console.log(this.url + " %c no existe", csswarning);
                    }else if(xhr.status==200){
                        console.log("%c Error en "+ this.url, csswarning);
                        console.log(thrownError);
                    }

                    engineLoad = false;
                    clearInterval(loadertimer);
                    loadertimer = false;
                }
            });
        };

        var _Run = function(callback){
            if(modules.length > 0){
                for(var x in modules){
                    m.push(modules[x]);
                }
                modules = [];
                modules.length = 0;
                modulesLoaded = 0;
                done = false;
                
                for(var x = 0; x < m.length; x++){
                    _LoadModule(x);
                }

                if(engineLoad){
                    console.log("%c Carga modulos de sistema \n", csstitle, m);
                }else{
                    console.log("%c Carga dependencias de aplicacion \n", csstitle, m);
                }

                loadertimer = setInterval(function(){
                    if(done){
                        clearInterval(loadertimer);
                        loadertimer = false;
                        m = [];
                        m.length = 0;
                        if(engineLoad){
                            console.log('%c Modulos de sistema cargados.', csssuccess);
                        }else{
                            console.log('%c Dependencias de aplicacion cargadas', csssuccess);
                        }
                        engineLoad = false;
                        if(callback){
                            if(typeof callback == "function"){
                                callback();
                            }else{
                                for(var fn in callback){
                                    callback[fn]();
                                }
                            }
                        }
                    }
                   
                });
            }else{
                if(callback){
                    if(typeof callback == "function"){
                        callback();
                    }else{
                        for(var fn in callback){
                            callback[fn]();
                        }
                    }
                }
            }
        };

        var _Done = function(){
            return done;
        };

        this.Add = _AddModule;
        this.Run = _Run;
        this.Done = _Done;
    };  // LOADER










    //// CORE TOOLS

    function noDebug(msg){
        if(!Config.Debug ||  !console || !console.log){
            if(SGE.Debugger){
                delete SGE.Debugger;
            }
            oldConsoleLog = console.log;
            window['console']['log'] = function() {};
        }
    }

    function hasModule(module){
        if(SGE.Config.modules.indexOf(module) >= 0){
            return true;
        }else{
            return false;
        }
    }
    function hasPackage(package){
        if(Packages[package]){
            return true;
        }else{
            return false;
        }
    }

    SGE.hasModule = hasModule;
})();
