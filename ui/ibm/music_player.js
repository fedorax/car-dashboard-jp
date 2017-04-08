var audioObj = new Audio();

function start_music(type){
    var url = "audio/jazz.wav";
    if ( type == "ジャズ" ) {
       url = "audio/Take_Five.wav";
    }
    if ( type == "ロック" ) {
       url = "audio/Hotel_California.wav";
    }
    if ( type == "クラシック" ) {
       url = "audio/Morzart.wav";
    }
    if ( type == "ポップス" ) {
       url = "audio/Dragon_Night.wav";
    }
    if ( type == "演歌" ) {
       url = "audio/kawanonagare.wav";
    }
    audioObj.pause();
    audioObj = new Audio(url);
    audioObj.play();
}

function stop_music(){
    audioObj.pause();
    audioObj = new Audio();
}

