var audioObj = new Audio();

function start_music(type){
    var url = "audio/jazz.wav";
    if ( type == "ジャズ" ) {
       url = "audio/jazz.wav";
    }
    if ( type == "ロック" ) {
       url = "audio/rock.wav";
    }
    if ( type == "クラシック" ) {
       url = "audio/classic.wav";
    }
    if ( type == "ポップス" ) {
       url = "audio/pops.wav";
    }
    if ( type == "演歌" ) {
       url = "audio/enka.wav";
    }
    audioObj.pause();
    audioObj = new Audio(url);
    audioObj.play();
}

function stop_music(){
    audioObj.pause();
    audioObj = new Audio();
}

