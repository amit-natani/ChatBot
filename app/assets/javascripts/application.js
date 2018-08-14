// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require recorder
//= require speech
//= require_tree .


function onChangeHandler() {
  // $.ajax("/home/get_text.json", function( data ) {
  //   console.log(data);
  // })



  $.ajax({
    url: "/home/get_text.json",
    data: {
      value: $('#demo').val()
    },
    type: "GET",
    success: function(response) { console.log(response) }
  });

  // data = {
  //   queryInput: {
  //     text: {
  //       text: 'Enter Marks',
  //       languageCode: 'en'
  //     }
  //   },
  //   queryParams: {
  //     timeZone: 'Aisa/Calcutta'
  //   }
  // }

  // $.ajax({
  //   url: "https://dialogflow.googleapis.com/v2/projects/temperatureconvertersamp-6e9f6/agent/sessions/8d9ad98f-4e31-31c5-b3e4-665a5068145a:detectIntent",
  //   data: data,
  //   type: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     'Authorization': 'Bearer ya29.c.ElrzBdQWrMkUlxeSRFh2s86tKttM82PGsKr2MB_3LQB48UE3fB3bdQ4Ca88ykQMo_CQCQh_M8DHXlDZcFEk8oeKa6TpcE9HAfA_-lj07Cnez2gW-ZUAIXsxXfrE'
  //   },
  //   success: function(response) { console.log(response) }
  // });
}
