var ModalAns = false;
var ModalRun = false;
var ModalKind;

function Modal(kind,callback){
    ModalAns = false;
    ModalKind = kind;
    ModalInit();

    var timer = setInterval(function(){
        if(ModalAns){
            clearInterval(timer);
            callback(ModalAns);
            ModalAns = false;
        }
    },fps);
}

function ModalInit(){
    ModalAns = false;
    var $el;
    switch(ModalKind){
        case "troops":
            $el = $(".modal.troops");

            $el.find("input").val("");
            $el.show();
        break;
        case "gold":
            $el = $(".modal.gold");

            $el.find("input").val("");
            $el.show();
        break;
    }

    var timer = setInterval(function(){
        if(ModalRun){
            clearInterval(timer);
            ModalFired($el);
        }
    },fps)
}

function ModalFired($el){
    ModalRun = false;
    var kind = ModalKind;

    var data;
    switch(kind){
        case "troops":
            ModalAns = {i:$el.find("#i").val(),
                    a:$el.find("#a").val(),
                    c:$el.find("#c").val()
            }
        break;
        case "gold":
            ModalAns = $el.find("#g").val();
        break;
    }
    ModalKind = false;
    $el.hide();

}
