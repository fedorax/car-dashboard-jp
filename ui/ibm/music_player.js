var audioObj = new Audio();

function start_music(type){
    var url = "audio/jazz.wav";
    if ( type == "ジャズ" ) {
       url = "audio/m_jazz.wav";
    }
    if ( type == "ロック" ) {
       url = "audio/m_rock.wav";
    }
    if ( type == "クラシック" ) {
       url = "audio/m_classic.wav";
    }
    if ( type == "ポップス" ) {
       url = "audio/m_drive_sound.wav";
    }
    if ( type == "演歌" ) {
       url = "audio/m_enka.wav";
    }
    audioObj.pause();
    audioObj = new Audio(url);
    audioObj.play();
}

function stop_music(){
    audioObj.pause();
    audioObj = new Audio();
}

// yanagi
