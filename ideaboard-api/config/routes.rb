Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :ideas
    end
  end

  get '/api/v1/ideas_swapping', to: 'api/v1/ideas#position_swap'
end
