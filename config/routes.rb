Rails.application.routes.draw do
  root 'home#index'

  resources :home do
    collection do
      post :get_text
      post :process_audio
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
