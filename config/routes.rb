require 'katello/api/mapper_extensions'

class ActionDispatch::Routing::Mapper
  include Katello::Routing::MapperExtensions
end

Integration::Engine.routes.draw do
  

  scope :integration, :path => '/integration' do
    
    namespace :api do
    
    api_resources :organizations, :only => [] do  
      api_resources :jobs do
        member do
          put :set_content_view
          put :set_hostgroup
          put :set_resource
          put :remove_tests
          get :available_tests
          put :add_tests
          get :available_resources
          put :set_jenkins
          put :set_environment
          get :run_job
          put :add_projects
          put :remove_projects
        end
      end

      api_resources :tests

      api_resources :jenkins_instances do
        member do
          get :check_jenkins
        end
      end

      api_resources :jenkins_projects, :only => [:show, :update]

      api_resources :jenkins_requests, :only => [] do
        collection do
          get :list
          get :get_build_params
        end
      end
      
    end

    end
    

  end  

end
