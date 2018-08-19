require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module GoogleSpeechToTextDemo
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    # Set Default Encoding
    config.encoding = 'utf-8'

    # Enable the asset pipeline
    config.assets.enabled = true

    # config.assets.paths += %w(/app/assets /vendor/assets, /public/assets)

    # config.assets.precompile += %w(recorder.js speech.js chatbox.css speech.css)

    config.assets.digest = true

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # For Heroku deployments.
    config.assets.initialize_on_precompile = true
  end
end
