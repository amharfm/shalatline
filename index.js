function init(){
    var dayz = 365;
    var data, list, col;
    var line_wi = document.getElementById('poster').width;
    var line_hi = document.getElementById('poster').height;

    //loc
    var loc = window.location.hash.slice(1);
    switch (loc){
        case "": 
            var loc_ = "Turku"; 
            var loc = "turku"; 
            break;
        case "turku":
            var loc_ = "Turku";
            break;
        case "bdg":
            var loc_ = "Bandung";
            break;
        case "arica":
            var loc_ = "Arica";
            break;
        case "puntaarenas":
            var loc_ = "Punta Arenas";
            break;
    }
    
    document.getElementsByTagName('h2')[0].innerHTML = document.getElementsByTagName('h2')[0].innerText + " in " + loc_ + " <img height='24' src='locations/"+loc+".png'>" + "</a> (2018)";
    document.getElementsByTagName('title')[0].innerHTML = document.getElementsByTagName('title')[0].innerHTML + loc_
    
    //https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript#24378510
    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }
    function readTextFile_ (loc){
        readTextFile("locations/prayer18-"+loc+".json", function(text){
            data = JSON.parse(text);
            col = data.objects[0].columns;
            list = data.objects[0].rows;
            ok_draw(dayz);
        });
    }
    readTextFile_(loc);

    var hr,min;
    function set_hrmin(when,id){
        if (id){
            hr = parseFloat(when[id].slice(0,2));
            min = parseFloat(when[id].slice(3,5))/60;
        } else {
            hr = parseFloat(when.getHours());
            min = parseFloat((when.getMinutes()/60));
        }
    }
    function get_hi(prayer,when){
        switch (prayer){
            case "fajr": 
                set_hrmin(when,3);
                break;
            case "dhuhr": 
                set_hrmin(when,4);
                if (loc=='bdg'){
                
                } else {

                    if (hr<12){ 
                        hr = hr+12; }
                }
                break;
            case "ashr": 
                set_hrmin(when,5);
                hr = hr+12;
                // console.info(prayer,parseFloat(hr+min).toFixed(2),'x','const =',((hr+min)*(line_hi/24)).toFixed(2))
                break;
            case "maghrib": 
                set_hrmin(when,6);
                hr = hr+12;
                break;
            case "isha": 
                set_hrmin(when,7);
                if (when[7].slice(9,11)=='PM'){ hr = hr+12; } 
                    else { if (hr>=12) hr = hr-12; }
                break;
            default :
                set_hrmin(when);
                break;
        }
        return ((hr+min)*(line_hi/24))
    }

    var mon = {
        0:'jan',31:'feb',59:'mar',90:'apr',120:'may',151:'jun',181:'jul',212:'aug',243:'sep',273:'oct',304:'nov',334:'dec',
    }
    
    function ok_draw(days){
        var stage = new createjs.Stage("poster");
        var today = new Date();
        var leg_left = new createjs.Container();
        var now_ = new createjs.Text('>', "20px Arial", "#E4E4E4");
            // leg_left.addChild(now_);
        var x_mod = 0;
        var y_mod = 0;

        var bckg = new createjs.Shape();
        bckg.graphics.beginFill('#171717').drawRect(0, 0, line_wi, line_hi).endFill();
        stage.addChild(bckg);

        var line = new createjs.Shape();
            stage.addChild(line);
            for (var i=0; i<days; i++){
                x_mod = i*(line_hi/days);

                if (i==0 || i==31 || i==59 || i==90 || i==120 || i==151 || i==181 || i==212 || i==243 || i==273 || i==304 || i==334 ){
                    // console.log(list[i])
                    line.graphics.beginStroke("rgba(200,200,200,0.2)");
                    line.graphics.moveTo(x_mod, 0);
                    line.graphics.lineTo(x_mod, line_hi);
                    line.graphics.endStroke();

                    //text_mon
                    var text_mon = new createjs.Text(mon[i], "12px Arial", "#E4E4E4");
                        text_mon.x = x_mod;
                        text_mon.y = 242;
                        text_mon.alpha = 0.5;
                    stage.addChild(text_mon);
                }

                //today
                if (list[i][1]==(new Date()).getDate() && list[i][2]==(new Date()).getMonth()+1){
                    var line_today = new createjs.Shape();
                        stage.addChild(line_today);
                        line.graphics.beginStroke("rgba(255,255,255,0.75)");
                        line.graphics.moveTo(x_mod, 0);
                        line.graphics.lineTo(x_mod, line_hi);
                        line.graphics.endStroke();
                }

                rad = 365/1.5/days;

                var fajr = new createjs.Shape();
                    fajr.graphics.beginFill("#458BC9").drawCircle(0, 0, rad);
                    fajr.x = x_mod;
                    fajr.y = get_hi('fajr',list[i]);
                    stage.addChild(fajr);
                    if (today.getMonth()+1==list[i][2] && today.getDate()==list[i][1]){
                        var leg_fajr = new createjs.Text(list[i][3].slice(0,5), "12px Arial", "#E4E4E4");
                            leg_fajr.x = fajr.x;
                            leg_fajr.y = fajr.y - 7;
                            leg_left.addChild(leg_fajr);
                    }
                var dhuhr = new createjs.Shape();
                    dhuhr.graphics.beginFill("#BD8E00").drawCircle(0, 0, rad);
                    dhuhr.x = x_mod;
                    dhuhr.y = get_hi('dhuhr',list[i]);
                    
                    stage.addChild(dhuhr);
                    if (today.getMonth()+1==list[i][2] && today.getDate()==list[i][1]){
                        var leg_dhuhr = new createjs.Text(list[i][4].slice(0,5), "12px Arial", "#E4E4E4");
                            leg_dhuhr.x = dhuhr.x;
                            leg_dhuhr.y = dhuhr.y - 7;
                            leg_left.addChild(leg_dhuhr);
                    }
                var ashr = new createjs.Shape();
                    ashr.graphics.beginFill("#FF3900").drawCircle(0, 0, rad);
                    ashr.x = x_mod;
                    ashr.y = get_hi('ashr',list[i]);
                    stage.addChild(ashr);
                    if (today.getMonth()+1==list[i][2] && today.getDate()==list[i][1]){
                        var leg_ashr = new createjs.Text(list[i][5].slice(0,5), "12px Arial", "#E4E4E4");
                            leg_ashr.x = ashr.x;
                            leg_ashr.y = ashr.y - 7;
                            leg_left.addChild(leg_ashr);
                    }
                var maghrib = new createjs.Shape();
                    maghrib.graphics.beginFill("#CD307E").drawCircle(0, 0, rad);
                    maghrib.x = x_mod;
                    maghrib.y = get_hi('maghrib',list[i]);
                    stage.addChild(maghrib);
                    if (today.getMonth()+1==list[i][2] && today.getDate()==list[i][1]){
                        var leg_maghrib = new createjs.Text(list[i][6].slice(0,5), "12px Arial", "#E4E4E4");
                            leg_maghrib.x = maghrib.x;
                            leg_maghrib.y = maghrib.y - 7;
                            leg_left.addChild(leg_maghrib);
                    }
                var isha = new createjs.Shape();
                    isha.graphics.beginFill("#756291").drawCircle(0, 0, rad);
                    isha.x = x_mod;
                    isha.y = get_hi('isha',list[i]);
                    stage.addChild(isha);
                    if (today.getMonth()+1==list[i][2] && today.getDate()==list[i][1]){
                        var leg_isha = new createjs.Text(list[i][7].slice(0,5), "12px Arial", "#E4E4E4");
                            leg_isha.x = isha.x;
                            leg_isha.y = isha.y - 7;
                            leg_left.addChild(leg_isha);
                    } 
            }
        var timer_now = setInterval(function(){
            now_.y = get_hi('',new Date())-10.5;
            stage.update();
        }, 1000);
        leg_left.addChild(now_);
        stage.addChild(leg_left);

        var hline = new createjs.Shape();
            stage.addChild(hline);
            hline.alpha = 0.7;
            for (var j=0; j<24; j++){
                hline.graphics.beginStroke("rgba(179,179,179,0.25)");
                y_mod = j*(line_wi/24);
                hline.graphics.moveTo(0, y_mod);
                hline.graphics.lineTo(line_wi, y_mod);
                hline.graphics.endStroke();
            }

        //text_right
        for (var k=0; k<24; k++){
            var text_right = new createjs.Text(k, "12px Arial", "#E4E4E4");
                    text_right.x = line_wi-14;
                var y_mod = k*(line_wi/24);
                    text_right.y = y_mod-7;
            stage.addChild(text_right);
        }
    
        stage.update();
    }
    
    var list_a = document.getElementsByTagName('a');
    document.getElementById('loc_').onclick = function(){
        window.href = event.srcElement.href;
        for (var b=0; b<list_a.length; b++){
            if (list_a[b].href==event.srcElement.href){
                console.log(list_a[b].href,event.srcElement.href)
                event.srcElement.setAttribute('style',"text-decoration: underline;");
            } else event.srcElement.setAttribute('style',"text-decoration: none;");
        }
        window.location.reload(false);
    }

    for (var c=0; c<list_a.length; c++){
        if (list_a[c].href==window.location.href)
         list_a[c].setAttribute('style',"text-decoration: underline;");
          else list_a[c].setAttribute('style',"text-decoration: none;");
    }
}