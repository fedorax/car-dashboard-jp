
/*
 * Copyright © 2016 I.B.M. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global WatsonSpeech: true, Conversation: true, Api: true Common: true*/

var STTModule = (function() {
  'use strict';
  var mic        = document.getElementById('input-mic');
  var recording  = false;
  var stream;
  var records    = 0;

  return {
    micON: micON,
    speechToText: speechToText,
    init: init
  };

  function init() {
    checkBrowsers();
  }

  function checkBrowsers() {
    // Check if browser supports speech
    if (!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
      Common.hide(mic);
    }
  }

  function micON() { // When the microphone button is clicked
    if (recording === false) {
      if (records === 0) { // The first time the mic is clicked - inform user
        Api.setWatsonPayload({output: {text: ['マイク利用を求めるプロンプトに答えて下さい。'], ref: 'STT'}});
        records++;
      } else {
        Api.setWatsonPayload({output: {ref: 'STT'}}); // Let the user record right away
      }
    } else {
      recording = false;
      try {
        stream.stop();
      } catch(e){
        console.log(e);
      }
    }
  }

  function speechToText() {
    mic.setAttribute('class', 'active-mic');
    recording = true;
    fetch('/api/speech-to-text/token')
      .then(function(response) {
        return response.text();
      })
      .then(function(token) {
        stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
          token: token,
          outputElement: '#user-input',
          inactivity_timeout: 3,
          format: false,
          model: "ja-JP_BroadbandModel",
          keepMicrophone: true
        });

        stream.promise() 
          .then(function(data) {
            console.log(data);
            mic.setAttribute('class', 'inactive-mic');
            recording = false;
            if (data.length !== 0) {
              var dialogue = data.pop();
              if ((dialogue.alternatives[0].transcript !== '') && (dialogue.final === true)) {
                Conversation.sendMessage();
              }
            } else {
              Api.setWatsonPayload({output: {text: ['マイク入力が取り消されました。もう一度マイク開始ボタンを押して下さい。']}});
            }
            try { stream.stop();} catch(e) { console.log(e); }
          })
          .catch(function(err) {
            console.log(err);
            if (err.message !== 'No speech detected for 3s.' ) {
              console.log(err.message);
            }
            var elem = document.getElementById('user-input');
            var sst_text = elem.value;
            var reg = / /g;
            var sst_text2 = sst_text.replace( reg , "" ) ;
            console.log( sst_text2 );
            mic.setAttribute('class', 'inactive-mic');
            if ( sst_text2 == '' ) {
                Api.setWatsonPayload({output: {text: ['音声認識のタイムアウトになりました。マイク開始ボタンをもう一度押して下さい。']}});
            } else {
                Conversation.sendMessage();
            }
            try { stream.stop();} catch(e) { console.log(e); }
          });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
})();

STTModule.init(); // Runs Speech to Text Module
