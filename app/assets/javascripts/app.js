(function () {

  'use strict'

  angular.module('MetacampusBot', [
    'ngRoute', 'ngResource'
  ])
  // .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
  //   var original = $location.path;
  //   $location.path = function (path, reload, params) {
  //     if (reload === false) {
  //       var lastRoute = $route.current;
  //       var un = $rootScope.$on('$locationChangeSuccess', function () {
  //         $route.current = lastRoute;
  //         un();
  //       });
  //     }
  //     if (params) {
  //       $rootScope.previousPathParams = params;
  //     }
  //     return original.apply($location, [path]);
  //   };
  // }])
  // .constant('defaultCountry', {
  //   country_name: "United States of America (the)",
  //   alpha_2_code: "US",
  //   alpha_3_code: "USA",
  //   dial_code: "+1"
  // })

  angular.module('MetacampusBot').factory('HomeService', ['$resource',
    function ($resource) {
      return $resource('/home.json', {}, {
        'update': {
          method: 'PUT'
        },
        'img_upload': {
          method: 'PUT',
          url: '/api/v1.0/community/user/img_upload.json'
        },
        'getText': {
          method: 'POST',
          url: '/home/get_text.json'
        }
      })
    }
  ])

  angular.module('MetacampusBot').controller('BaseCtrl', ['$compile', '$rootScope', '$scope', '$timeout', '$location', '$http', '$window', 'HomeService', '$sce',
    function ($compile, $rootScope, $scope, $timeout, $location, $http, $window, HomeService, $sce) {
      $scope.query = "";

      $scope.id = 1

      $scope.conversations = [];

      $scope.students = []

      $scope.contexts = [];

      $scope.parameters = {}

      $scope.conv = {}

      // var recorder = document.getElementById('recorder');
      // var player = document.getElementById('player');

      // recorder.addEventListener('change', function(e) {
      //   var file = e.target.files[0];
      //   alert("hi")
      //   // Do something with the audio file.
      //   player.src =  URL.createObjectURL(file);
      // });

      // var handleSuccess = function(stream) {
      //   console.log(stream)
      //   var context = new AudioContext();
      //   console.log(context)
      //   var source = context.createMediaStreamSource(stream);
      //   console.log(source)
      //   var processor = context.createScriptProcessor(1024, 1, 1);
      //   console.log(processor)
      //   source.connect(processor);
      //   processor.connect(context.destination);

      //   processor.onaudioprocess = function(e) {
      //     // Do something with the data, i.e Convert this to WAV
      //     // console.log(e.inputBuffer);
      //   };
      //   var audio = document.querySelector('audio');
      //   audio.srcObject = stream;
      //   audio.onloadedmetadata = function(e) {
      //     // audio.play();
      //     console.log(audio.srcObject)
      //   };
      //   player.src = stream;
      //   // if (window.URL) {
      //   //   player.src = window.URL.createObjectURL(stream);
      //   // } else {
      //   //   player.src = stream;
      //   // }
      // };

      // navigator.getUserMedia = navigator.getUserMedia ||
      //                    navigator.webkitGetUserMedia ||
      //                    navigator.mozGetUserMedia;

      // if (navigator.getUserMedia) {
      //    navigator.getUserMedia({ audio: true, video: { width: 100, height: 100 } },
      //       function(stream) {
      //          // var video = document.querySelector('video');
      //          // video.srcObject = stream;
      //          // video.onloadedmetadata = function(e) {
      //          //   video.play();
      //          // };
      //          var audio = document.querySelector('audio');
      //          audio.srcObject = stream;
      //          audio.onloadedmetadata = function(e) {
      //            audio.play();
      //          };
      //       },
      //       function(err) {
      //          console.log("The following error occurred: " + err.name);
      //       }
      //    );
      // } else {
      //    console.log("getUserMedia not supported");
      // }

      // navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      // .then(handleSuccess);

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      var setupStudentDummyData = function () {
        $scope.students = [{
          name: 'Amit Natani',
          rollNumber: 1,
          marks: null
        },{
          name: 'Amit Nathani',
          rollNumber: 2,
          marks: null
        },{
          name: 'Vishal Singh',
          rollNumber: 3,
          marks: null
        },{
          name: 'Samiksha Toshniwal',
          rollNumber: 4,
          marks: null
        },{
          name: 'Prakalpa Rathore',
          rollNumber: 5,
          marks: null
        },{
          name: 'Devendra Singh',
          rollNumber: 6,
          marks: null
        },{
          name: 'Ragini Kumari',
          rollNumber: 7,
          marks: null
        },{
          name: 'Rohit Sharma',
          rollNumber: 8,
          marks: null
        },{
          name: 'Lokesh Sharma',
          rollNumber: 9,
          marks: null
        },{
          name: 'Akshat Mathur',
          rollNumber: 10,
          marks: null
        },{
          name: 'Ashish Sharma',
          rollNumber: 11,
          marks: null
        },{
          name: 'Narendra Yadav',
          rollNumber: 12,
          marks: null
        },{
          name: 'Narendre Yadav',
          rollNumber: 13,
          marks: null
        },{
          name: 'Abhishek Mishra',
          rollNumber: 14,
          marks: null
        },{
          name: 'Gopal Krishna Dev',
          rollNumber: 15,
          marks: null
        }]
      }

      var getSoundexCodeOfCharacter = function (character) {
        if(character == 'B' || character == 'F' || character == 'P' || character == 'V') {
          return 1;
        } else if (character == 'C' || character == 'G' || character == 'J' || character == 'K' || character == 'Q' || character == 'S' || character == 'X' || character == 'Z') {
          return 2;
        } else if (character == 'D' || character == 'T') {
          return 3;
        } else if (character == 'L') {
          return 4;
        } else if (character == 'M' || character == 'N') {
          return 5;
        } else if (character == 'R') {
          return 6;
        } else {
          return 0;
        }
      }

      var generateSoundexCode = function (name) {
        var soundexCodes = [];
        var k = 0
        nameArray = name.split(" ");
        for (var i = 0; i < nameArray.length; i++ ) {
          var name = nameArray[i];
          anme = name.toUpperCase();
          for (var j = 0; j < name.length; j++) {
            getSoundexCodeOfCharacter(name[i])
          }
        }
      }

      var generateNameSoundex = function (name) {
        var arr = name.split(" ");
        var soundexCodes = [];
        angular.forEach(arr, function (n) {
          soundexCodes.push(soundex(n));
        })
        return soundexCodes;
      }

      var soundex = function (s) {
        var a = s.toLowerCase().split(''),
        f = a.shift(),
        r = '',
        codes = {
          a: '', e: '', i: '', o: '', u: '',
          b: 1, f: 1, p: 1, v: 1,
          c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
          d: 3, t: 3,
          l: 4,
          m: 5, n: 5,
          r: 6
        };

        r = f +
        a
        .map(function (v, i, a) { return codes[v] })
        .filter(function (v, i, a) {
        return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
        })
        .join('');

        return (r + '000').slice(0, 4).toUpperCase();
      };

      var generateSoundexCodesForDummyData = function () {
        angular.forEach($scope.students, function (student) {
          var arr = student.name.split(" ");
          var soundexCodes = [];
          angular.forEach(arr, function (n) {
            soundexCodes.push(soundex(n));
          })
          student.soundexCodes = soundexCodes;
        })
      }

      var objDiv = document.getElementById("mydiv");

      $scope.submitForm = function () {
        var query = $scope.query;
        $scope.conv[$scope.id] = {user: 'User', text: $sce.trustAsHtml("<p>"+query+"</p>")}
        // $scope.conversations.push(conv[id])
        $scope.query = "";
        $scope.id = $scope.id + 1
        objDiv.scrollTop = objDiv.scrollHeight;
        HomeService.getText({value: query, contexts: $scope.contexts}).$promise.then(function(response) {
          $scope.contexts = [];
          $scope.contexts = $scope.contexts.concat(response.result.contexts)
          $scope.contexts = $scope.contexts.filter(function( obj ) {
            return obj.name !== 'soundexmatch';
          });
          objDiv.scrollTop = objDiv.scrollHeight;
          if (response.result.metadata.intentName != 'SelectStudent_MarksSoundex') {
            $scope.conv[$scope.id] = {user: 'BOT', text: $sce.trustAsHtml("<p>"+response.result.fulfillment.speech+"</p>")}
            $scope.id = $scope.id + 1;
          }
          if (response.result.metadata.intentName == 'SelectStudent_MarksSoundex') {
            $scope.marksParameters.st_name = $scope.nameSuggestions[response.result.fulfillment.speech - 1];
            if($scope.marksParameters.st_name != null ) {
              $scope.filteredStudent = $scope.students.find(function(st) {
                return st.name.toLowerCase() == $scope.marksParameters.st_name.toLowerCase()
              })
              $scope.filteredStudent.marks = parseInt($scope.marksParameters.marks, 10);
            } else {
              $scope.conv[$scope.id] = {user: 'BOT', text: $sce.trustAsHtml("<p>Please select correct number</p>")}
              $scope.id = $scope.id + 1;
            }
          } else if(response.result.metadata.intentName == 'Enter Marks') {
            $scope.marksParameters = response.result.parameters
          } else if(response.result.metadata.intentName == 'Submit Marks' || response.result.metadata.intentName == 'Submit Marks - custom') {
            $scope.marksParameters.marks = response.result.parameters.marks
            $scope.marksParameters.st_name = response.result.parameters.st_name
            var nameSoundexCode = generateNameSoundex($scope.marksParameters.st_name);
            $scope.filteredStudent = $scope.students.find(function(st) {
              return st.name.toLowerCase() == $scope.marksParameters.st_name.toLowerCase()
            })
            if($scope.filteredStudent) {
              $scope.filteredStudent.marks = parseInt($scope.marksParameters.marks, 10)
            } else {
              $scope.nameSuggestions = [];
              // angular.forEach(nameSoundexCode, function(code) {
              //   angular.forEach($scope.students, function (student) {
              //     if (student.soundexCodes.includes(code)) {
              //       $scope.nameSuggestions.push(student.name);
              //     }
              //   })
              // })
              angular.forEach($scope.students, function (student) {
                var flag = false;
                if(student.soundexCodes.length == nameSoundexCode.length) {
                  for (var i = 0; i < nameSoundexCode.length; i++) {
                    if (nameSoundexCode[i] != student.soundexCodes[i]) {
                      flag = true;
                      break;
                    }
                  }
                  if (!flag) {
                    $scope.nameSuggestions.push(student.name);
                  }
                }
              })
              $scope.nameSuggestions = $scope.nameSuggestions.filter( onlyUnique );
              if($scope.nameSuggestions.length == 0) {
                $scope.conv[$scope.id] = {user: 'BOT', text: $sce.trustAsHtml("<p>I'm not able to find any exact or similar matching name with your query. Please try again with voice or text.</p>")}
                $scope.id = $scope.id + 1
              } else {
                $scope.conv[$scope.id] = {user: 'BOT', text: $sce.trustAsHtml("<p>I'm not able to find the exact name you want to submit marks for. Although I have suggestion based on your query:</p>")}
                $scope.id = $scope.id + 1;
                // $scope.list1 = "<select ng-model='name' ng-options='name for name in nameSuggestions'></select>";
                // var list1 = "<select ng-model='abcd' ng-options='name for name in nameSuggestions'><option value=''>Something</option></select>";
                // $scope.list1 = "<otc-dynamic></otc-dynamic>"
                // $compile(list1);
                // $scope.$digest();
                // angular.forEach($scope.nameSuggestions, function(name) {
                //   list1 += "<option ng-change=\"selectName(\""+name+"\")\">" + name + "</option>"
                // })
                // list1 += "</select>";
                var list = "<ul>"
                var i = 1;
                angular.forEach($scope.nameSuggestions, function (name) {
                  list += "<li>"+ i + ". " + name + "</li>"
                  i += 1;
                })
                list += "</ul>";
                $scope.conv[$scope.id] = {user: 'BOT', text: $sce.trustAsHtml(list)}
                $scope.id = $scope.id + 1;
                $scope.contexts = $scope.contexts.concat({name: 'soundexmatch'})
              }
            }
          } else if (response.result.metadata.intentName == 'DetailsCorrect-Yes') {
            // var student = {}
            // for(var i = 1; i <= 1; i++) {
            //   student.name = 'Rohit Sharma'
            //   student.rollNumber = i;
            //   student.marks = null;
            //   $scope.students.push(angular.copy(student))
            // }
            setupStudentDummyData();
            generateSoundexCodesForDummyData();
          } else if (response.result.metadata.intentName == 'UploadMarks') {
            // Upload marks data to server
          }
          // $scope.conversations.push(conv[id])
        })
      }


      // // Expose globally your audio_context, the recorder instance and audio_stream
      // var audio_context;
      // var recorder;
      // var audio_stream;

      // /**
      //  * Patch the APIs for every browser that supports them and check
      //  * if getUserMedia is supported on the browser.
      //  *
      //  */
      // function Initialize() {
      //     try {
      //         // Monkeypatch for AudioContext, getUserMedia and URL
      //         window.AudioContext = window.AudioContext || window.webkitAudioContext;
      //         navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      //         window.URL = window.URL || window.webkitURL;

      //         // Store the instance of AudioContext globally
      //         audio_context = new AudioContext;
      //         console.log('Audio context is ready !');
      //         console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
      //     } catch (e) {
      //         alert('No web audio support in this browser!');
      //     }
      // }

      // /**
      //  * Starts the recording process by requesting the access to the microphone.
      //  * Then, if granted proceed to initialize the library and store the stream.
      //  *
      //  * It only stops when the method stopRecording is triggered.
      //  */
      // function startRecording() {
      //     // Access the Microphone using the navigator.getUserMedia method to obtain a stream
      //     navigator.getUserMedia({ audio: true }, function (stream) {
      //         // Expose the stream to be accessible globally
      //         audio_stream = stream;
      //         // Create the MediaStreamSource for the Recorder library
      //         var input = audio_context.createMediaStreamSource(stream);
      //         console.log('Media stream succesfully created');

      //         // Initialize the Recorder Library
      //         recorder = new Recorder(input);
      //         console.log('Recorder initialised');

      //         // Start recording !
      //         recorder && recorder.record();
      //         console.log('Recording...');

      //         // Disable Record button and enable stop button !
      //         document.getElementById("start-btn").disabled = true;
      //         document.getElementById("stop-btn").disabled = false;
      //     }, function (e) {
      //         console.error('No live audio input: ' + e);
      //     });
      // }

      // /**
      //  * Stops the recording process. The method expects a callback as first
      //  * argument (function) executed once the AudioBlob is generated and it
      //  * receives the same Blob as first argument. The second argument is
      //  * optional and specifies the format to export the blob either wav or mp3
      //  */
      // function stopRecording(callback, AudioFormat) {
      //     // Stop the recorder instance
      //     recorder && recorder.stop();
      //     console.log('Stopped recording.');

      //     // Stop the getUserMedia Audio Stream !
      //     audio_stream.getAudioTracks()[0].stop();

      //     // Disable Stop button and enable Record button !
      //     document.getElementById("start-btn").disabled = false;
      //     document.getElementById("stop-btn").disabled = true;

      //     // Use the Recorder Library to export the recorder Audio as a .wav file
      //     // The callback providen in the stop recording method receives the blob
      //     if(typeof(callback) == "function"){

      //         /**
      //          * Export the AudioBLOB using the exportWAV method.
      //          * Note that this method exports too with mp3 if
      //          * you provide the second argument of the function
      //          */
      //         recorder && recorder.exportWAV(function (blob) {

      //             callback(blob);
      //             var data = new FormData();
      //             data.append("audio", blob, "myaudio.mp3");
      //             var oReq = new XMLHttpRequest();
      //             oReq.open("POST", "/home/process_audio");
      //             oReq.send(data);
      //             oReq.onload = function(oEvent) {
      //               if (oReq.status == 200) {
      //                 console.log("Uploaded");
      //               } else {
      //                 console.log("Error " + oReq.status + " occurred uploading your file.");
      //               }
      //             };

      //             // create WAV download link using audio data blob
      //             // createDownloadLink();

      //             // Clear the Recorder to start again !
      //             recorder.clear();
      //         }, (AudioFormat || "audio/mp3"));
      //     }
      // }

      // // Initialize everything once the window loads
      // window.onload = function(){
      //     // Prepare and check if requirements are filled
      //     Initialize();

      //     // Handle on start recording button
      //     document.getElementById("start-btn").addEventListener("click", function(){
      //         startRecording();
      //     }, false);

      //     // Handle on stop recording button
      //     document.getElementById("stop-btn").addEventListener("click", function(){
      //         // Use wav format
      //         var _AudioFormat = "audio/mp3";
      //         // You can use mp3 to using the correct mimetype
      //         //var AudioFormat = "audio/mpeg";

      //         stopRecording(function(AudioBLOB){
      //             // Note:
      //             // Use the AudioBLOB for whatever you need, to download
      //             // directly in the browser, to upload to the server, you name it !

      //             // In this case we are going to add an Audio item to the list so you
      //             // can play every stored Audio
      //             var url = URL.createObjectURL(AudioBLOB);
      //             var li = document.createElement('li');
      //             var au = document.createElement('audio');
      //             var hf = document.createElement('a');

      //             au.controls = true;
      //             au.src = url;
      //             hf.href = url;
      //             // Important:
      //             // Change the format of the file according to the mimetype
      //             // e.g for audio/wav the extension is .wav
      //             //     for audio/mpeg (mp3) the extension is .mp3
      //             hf.download = new Date().toISOString() + '.mp3';
      //             hf.innerHTML = hf.download;
      //             li.appendChild(au);
      //             li.appendChild(hf);
      //             recordingslist.appendChild(li);
      //         }, _AudioFormat);
      //     }, false);
      // };

      URL = window.URL || window.webkitURL;

      $scope.button = {
        showRecordButton: true,
        showStopButton: false
      }

      var gumStream; //stream from getUserMedia()
      var rec; //Recorder.js object
      var input; //MediaStreamAudioSourceNode we'll be recording

      // shim for AudioContext when it's not avb.
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var audioContext = new AudioContext; //new audio context to help us record

      var recordButton = document.getElementById("recordButton");
      var stopButton = document.getElementById("stopButton");
      var pauseButton = document.getElementById("pauseButton");

      //add events to those 3 buttons
      recordButton.addEventListener("click", startRecording);
      stopButton.addEventListener("click", stopRecording);
      pauseButton.addEventListener("click", pauseRecording);

      function startRecording() {
        console.log("recordButton clicked");

        $scope.button.showRecordButton = false;
        $scope.button.showStopButton = true;

        /*
        Simple constraints object, for more advanced audio features see
        <div class="video-container"><blockquote class="wp-embedded-content" data-secret="vNsz0nPBL4" style="display: none;"><a href="https://addpipe.com/blog/audio-constraints-getusermedia/">Supported Audio Constraints in getUserMedia()</a></blockquote><iframe class="wp-embedded-content" sandbox="allow-scripts" security="restricted" src="https://addpipe.com/blog/audio-constraints-getusermedia/embed/#?secret=vNsz0nPBL4" data-secret="vNsz0nPBL4" width="600" height="257" title="“Supported Audio Constraints in getUserMedia()” — Pipe Blog" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe></div>
        */

        var constraints = { audio: true, video:false }

        /*
        Disable the record button until we get a success or fail from getUserMedia()
        */

        recordButton.disabled = true;
        stopButton.disabled = false;
        pauseButton.disabled = false

        /*
        We're using the standard promise based getUserMedia()
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        */

        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
          console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

          /* assign to gumStream for later use */
          gumStream = stream;

          /* use the stream */
          input = audioContext.createMediaStreamSource(stream);

          /*
          Create the Recorder object and configure to record mono sound (1 channel)
          Recording 2 channels  will double the file size
          */
          rec = new Recorder(input,{numChannels:1})

          //start the recording process
          rec.record()

          console.log("Recording started");

        }).catch(function(err) {
            //enable the record button if getUserMedia() fails
            recordButton.disabled = false;
            stopButton.disabled = true;
            pauseButton.disabled = true
        });
      }

      function pauseRecording(){
        console.log("pauseButton clicked rec.recording=",rec.recording );
        if (rec.recording){
            //pause
            rec.stop();
            pauseButton.innerHTML="Resume";
        }else{
            //resume
            rec.record()
            pauseButton.innerHTML="Pause";
        }
      }

      function stopRecording() {
          console.log("stopButton clicked");

          //disable the stop button, enable the record too allow for new recordings
          stopButton.disabled = true;
          recordButton.disabled = false;
          pauseButton.disabled = true;


          $scope.button.showRecordButton = true;
          $scope.button.showStopButton = false;

          //reset button just in case the recording is stopped while paused
          pauseButton.innerHTML="Pause";

          //tell the recorder to stop the recording
          rec.stop();

          //stop microphone access
          gumStream.getAudioTracks()[0].stop();

          //create the wav blob and pass it on to createDownloadLink
          rec.exportWAV(createDownloadLink);
      }

      function createDownloadLink(blob) {

          var filename = new Date().toISOString(); //filename to send to server without extension
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 4) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/home/process_audio",true);
          xhr.send(fd);
          xhr.onload = function(oEvent) {
            if (xhr.status == 200) {
              var text = JSON.parse(oEvent.target.responseText)[0].alternatives[0].transcript;
              $scope.query = text;
              $scope.submitForm();
            } else {
              console.log("Error " + xhr.status + " occurred uploading your file.");
            }
          };
      }

      $scope.record = function () {
        startRecording();
      }

      $scope.stop = function () {
        stopRecording();
      }

  }])

})();
