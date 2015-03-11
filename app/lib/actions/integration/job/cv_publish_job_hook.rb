module Actions
  module Integration
    module Job
      class CvPublishJobHook < CvHook

        def self.subscribe
          Katello::ContentView::Publish
        end

        def plan(content_view, descripton)
          valid_jobs = content_view.jobs.select { |job| job.is_valid? }
          jobs_to_run = valid_jobs.select { |job| job.environment.library? }
          allowed_jobs = jobs_to_run.select { |job| job.levelup_trigger && !job.version_already_promoted? }

          plan_self(:trigger => trigger.output,
                    :job_ids => allowed_jobs.map(&:id),
                    :job_names => allowed_jobs.map(&:name))
        end        
      end
    end
  end
end