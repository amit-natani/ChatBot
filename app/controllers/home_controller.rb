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

    client = ApiAiRuby::Client.new(
      :client_access_token => '09ac3abe02704f519ebc96bf07d23be1'
    )

    if(params[:contexts].present?)
      # contexts = []
      # params[:contexts].each do |context|
      #   contexts.push(context['name'])
      # end
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


    puts save_path

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
    audio  = { content: audio_file }
    response = speech.recognize config, audio
    results = response.results
    render json: results
  end

end
