module Integration
  class Api::JobsController < Katello::Api::V2::ApiController
    respond_to :json

    include Api::Rendering

    before_filter :find_organization, :only => [:create, :index, :available_tests]

    before_filter :find_job, :only => [:update, :show, :destroy, :set_content_view, :set_hostgroup, :available_tests,
                  :add_tests, :remove_tests, :set_resource, :available_resources, :set_jenkins, :set_environment, :run_job]

    before_filter :load_search_service, :only => [:index, :available_tests]

    def index
       ids = Job.readable.where(:organization_id => @organization.id).pluck(:id)
       filters = [:terms => {:id => ids}]       

      options = {
         :filters => filters,
         :load_records? => true
      }
       
      respond_for_index(:collection => item_search(Job, params, options))
    end

    def show
      respond_for_show(:resource => @job)
    end

    def create
      @job = Job.new(job_params)
      @job.organization = @organization
      @job.save!

      respond_for_show(:resource => @job)
    end

    def update
      @job.update_attributes!(job_params)
      @job.save!
      respond_for_show(:resource => @job)
    end

    def destroy
      @job.destroy
      respond_for_show(:resource => @job)
    end

    # TODO: refactor and remove repetitive methods -> map all set actions onto update
    def set_content_view
      @job.content_view = Katello::ContentView.find(params[:content_view_id])
      @job.save!
      respond_for_show
    end

    def set_hostgroup
      @job.hostgroup = Hostgroup.find(params[:hostgroup_id])
      @job.compute_resource = nil
      @job.save!
      respond_for_show
    end

    def set_jenkins
      @job.jenkins_instance = JenkinsInstance.find(params[:jenkins_instance_id])
      @job.save!
      respond_for_show
    end
    
    def remove_tests
      ids = params[:test_ids]
      @tests = Test.where(:id => ids)
      @job.test_ids = (@job.test_ids - @tests.map {|t| t.id}).uniq
      @job.save!
      respond_for_show
    end

    def set_environment
      @job.environment = Katello::KTEnvironment.find(params[:environment_id])
      @job.save!
      respond_for_show
    end

    def available_tests
      ids = ::Integration::Test.where(:organization_id => @organization).readable.map(&:id)

      filters = [:terms => {:id => ids - @job.test_ids}]
      filters << {:term => {:name => params[:name]}} if params[:name]

      options = {
        :filters => filters,
        :load_records? => true 
      }

      tests = item_search(Test, params, options)
      respond_for_index(:collection => tests)
    end

    def add_tests
      ids = params[:test_ids]
      @tests = Test.where(:id => ids)
      @job.test_ids = (@job.test_ids + @tests.map {|t| t.id}).uniq
      @job.save!
      respond_for_show
    end

    def set_resource
      @job.compute_resource = ComputeResource.find(params[:resource_id])
      @job.save!
      respond_for_show
    end

    def available_resources
      @compute_resources = @job.hostgroup.compute_profile.compute_attributes.map(&:compute_resource) rescue []
      render "api/v2/compute_resources/index"
    end

    def run_job      
      
      if @job.manual_trigger
        package_names = @job.target_cv_version.packages.map(&:name)
        task = async_task(::Actions::Integration::Job::RunJobManually, @job, package_names)
        render :nothing => true            
      else
        fail ::Katello::HttpErrors::Forbidden, "Running manually not allowed for Job: #{@job.name}. Try setting it's :manual_trigger property."
      end
    end

    protected

    def find_job
      @job = Job.find_by_id(params[:id])
      fail ::Katello::HttpErrors::NotFound, "Could not find job with id #{params[:id]}" if @job.nil?
      @job 
    end

    def job_params
      params.require(:job).permit(:name, :manual_trigger, :sync_trigger, :levelup_trigger)
    end
  end
end