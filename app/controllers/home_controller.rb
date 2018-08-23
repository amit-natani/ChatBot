require "google/cloud/speech"

class HomeController < ApplicationController

  def get_text
    # speech = Google::Cloud::Speech.new
    # file_name = "app/assets/audio/audio.raw"
    # audio_file = File.binread file_name
    # config = { encoding:          :LINEAR16,
    #        sample_rate_hertz: 16000,
    #        language_code:     "en-US"   }
    # audio  = { content: audio_file }
    # response = speech.recognize config, audio
    # results = response.results
    # render json: results

    puts  "=================================="
    puts DIALOGFLOW_CLIENT_ACCESS_TOKEN
    puts Rails.application.credentials.dialogflow_client_access_token
    puts  "=================================="

    client = ApiAiRuby::Client.new(
      :client_access_token => "c2aaf9e884b54263b93540c3d0adb291"
    )

    if(params[:contexts].present?)
      response = client.text_request params[:value], :contexts => params[:contexts]
    else
      response = client.text_request params[:value]
    end

    render json: response
  end

  def process_audio
    audio = params[:audio] || params[:audio_data]
    # audio = audio.rewind
    save_path = Rails.root.join("app/assets/audio/#{audio.original_filename}")

    # # Open and write the file to file system.
    file = File.new(save_path, "w");

    File.open(file, 'wb') do |f|
      f.write audio.read
    end

    speech = Google::Cloud::Speech.new
    file_name = "app/assets/audio/#{audio.original_filename}"
    audio_file = File.binread file_name
    config = {
      encoding: :LINEAR16,
      sample_rate_hertz: 44100,
      language_code:     "en-IN"
    }

    request_body = {
      "audio": {
        "content": audio_file
      },
      "config": {
        "enableAutomaticPunctuation": true,
        "encoding": "LINEAR16",
        "sample_rate_hertz": 44100,
        "languageCode": "en-IN",
        "model": "default"
      }
    }

    # @result = HTTParty.post("https://speech.googleapis.com/v1/speech:recognize", :body => request_body)

    # puts @result

    audio  = { content: audio_file }
    File.delete(save_path) if File.exist?(save_path)
    response = speech.recognize config, audio
    results = response.results
    render json: results
  end

end
