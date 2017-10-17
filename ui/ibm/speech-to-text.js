
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
        Api.setWatsonPayload({output: {text: ['マイク利用を求めるプロンプトに答えて下さい。'], ref: 'STT'}}); // Dialog box output to let the user know we're recording
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
    mic.setAttribute('class', 'active-mic');  // Set CSS class of mic to indicate that we're currently listening to user input
    recording = true;                         // We'll be recording very shortly
    fetch('/api/speech-to-text/token')        // Fetch authorization token for Watson Speech-To-Text
      .then(function(response) {
        return response.text();
      })
      .then(function(token) {                 // Pass token to Watson Speech-To-Text service
        stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
          token: token,                       // Authorization token to use this service, configured from /speech/stt-token.js file
          outputElement: '#user-input',       // CSS selector or DOM Element
          inactivity_timeout: 3,              // Number of seconds to wait before closing input stream
          format: false,                      // Inhibits errors
          model: "ja-JP_BroadbandModel",
          keepMicrophone: true                // Avoids repeated permissions prompts in FireFox
        });

        stream.promise()                                // Once all data has been processed...
          .then(function(data) {                        // ...put all of it into a single array
            console.log(data);
            mic.setAttribute('class', 'inactive-mic');  // Reset our microphone button to visually indicate we aren't listening to user anymore
            recording = false;                          // We aren't recording anymore
            if (data.length !== 0) {                    // If data is not empty (the user said something)
              var dialogue = data.pop();                // Get the last data variable from the data array, which will be the finalized Speech-To-Text transcript
              if ((dialogue.alternatives[0].transcript !== '') && (dialogue.final === true)) { // Another check to verify that the transcript is not empty and that this is the final dialog
                Conversation.sendMessage();             // Send the message to Watson Conversation
              }
            } else { // If there isn't any data to be handled by the conversation, display a message to the user letting them know
              Api.setWatsonPayload({output: {text: ['マイク入力が取り消されました。もう一度マイク開始ボタンを押して下さい。']}}); // If the user clicked the microphone button again to cancel current input
            }
          })
          .catch(function(err) { // Catch any errors made during the promise
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
          });
      })
      .catch(function(error) { // Catch any other errors and log them
        console.log(error);
      });
  }
})();

STTModule.init(); // Runs Speech to Text Module
