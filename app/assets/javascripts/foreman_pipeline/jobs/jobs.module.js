angular.module('ForemanPipeline.jobs', [
    'ngResource',
    'Bastion.components',
    'ui.router',
    'Bastion'
]);

angular.module('ForemanPipeline.jobs').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('jobs', {
        abstract: true,
        controller: 'JobsController',
        templateUrl: 'foreman_pipeline/jobs/views/jobs.html'    
    })
    .state('jobs.index', {
      url: '/jobs',
      permission: 'view_jobs',
      views: {
          'table': {
              templateUrl: 'foreman_pipeline/jobs/views/jobs-table-full.html'
              }
          }
    })
    .state('jobs.new', {
        url: '/jobs/new',
        permission: 'create_jobs',
        collapsed: true,
        views: {
            'table': {
                templateUrl: 'foreman_pipeline/jobs/views/jobs-table-collapsed.html'
            },
            'action-panel': {
                controller: 'NewJobController',
                templateUrl: 'foreman_pipeline/jobs/new/views/new-job.html'
            },
            'job-form@jobs.new': {
                controller: 'NewJobController',
                templateUrl: 'foreman_pipeline/jobs/new/views/new-job-form.html'
            }
        }
    })
    .state('jobs.details', {
        abstract: true,
        url: '/jobs/:jobId',
        permission: 'view_jobs',
        collapsed: true,
        views: {
            'table': {
                  templateUrl: 'foreman_pipeline/jobs/views/jobs-table-collapsed.html'
            },
            'action-panel': {
                  controller: 'JobDetailsController',
                  templateUrl: 'foreman_pipeline/jobs/details/views/job-details.html' 
            }
        }
    })
    .state('jobs.details.info', {
        url: '/info',
        permission: 'edit_jobs',
        collapsed: true,
        controller: 'JobDetailsInfoController',
        templateUrl: 'foreman_pipeline/jobs/details/views/job-details-info.html'
    })
    .state('jobs.details.content-views', {
        url: '/content_views',
        permission: 'edit_jobs',
        collapsed: true,
        controller: 'JobDetailsContentViewsController',
        templateUrl: 'foreman_pipeline/jobs/details/views/job-details-content-views.html'
    })
    
    .state('jobs.details.hostgroups', {
        url: '/hostgroups',
        permission: 'edit_jobs',
        collapsed: true,
        controller: 'JobDetailsHostgroupsController',
        templateUrl: 'foreman_pipeline/jobs/details/views/job-details-hostgroups.html'
    })

    .state('jobs.details.resources', {
        url: '/resources',
        collapsed: true,
        permission: 'edit_jobs',
        controller: 'JobDetailsResourcesController',
        templateUrl: 'foreman_pipeline/jobs/details/views/job-details-resources.html'
    })

    .state('jobs.details.to-environment', {
       abstract: true,
       collapsed: true,
       template: '<div ui-view></div>'
    })
    .state('jobs.details.to-environment.paths', {
        abstract: true,
        collapsed: true,
        templateUrl: 'foreman_pipeline/jobs/details/views/job-details-paths.html'
    })
    .state('jobs.details.to-environment.paths.list', {
        url: '/paths',
        collapsed: true,
        permission: 'edit_jobs',
        controller: 'JobDetailsPathsController',
        templateUrl: 'foreman_pipeline/jobs/details/views/job-details-paths-list.html'
    })
    .state('jobs.details.to-environment.paths.add', {
        url: '/paths/add',
        collapsed: true, 
        permission: 'edit_jobs',
        controller: 'JobDetailsAddPathsController',
        templateUrl: 'foreman_pipeline/jobs/details/views/job-details-paths-list.html'
    })

    .state('jobs.details.to-environment.environments', {
        url: '/paths/to_environment',
        collapsed: true,
        permission: 'edit_jobs',
        controller: 'JobDetailsToEnvironmentController',
        templateUrl: 'foreman_pipeline/jobs/details/views/job-details-to-environment.html' 
    })

    .state('jobs.details.jenkins-instances', {
        url: '/jenkins_instances',
        collapsed: true,
        permission: 'edit_jobs',
        controller: 'JobDetailsJenkinsController',
        templateUrl: 'foreman_pipeline/jobs/details/views/job-details-jenkins.html'
    })
    .state('jobs.details.jenkins-projects', {
        abstract: true,
        collapsed: true,
        templateUrl: 'foreman_pipeline/jobs/details/project-discovery/views/job-jenkins-projects.html'
    })

    .state('jobs.details.jenkins-projects.list', {
        url: '/jenkins_projects',
        collapsed: true,
        permission: 'edit_jobs',
        controller: 'JobDetailsJenkinsProjectsController',
        templateUrl: 'foreman_pipeline/jobs/details/views/job-details-jenkins-projects.html'
    })
    .state('jobs.details.jenkins-projects.discovery', {
        url: '/jenkins_projects/discovery',
        collapsed: true,
        permission: 'edit_jobs',
        controller: 'JobProjectsDiscoveryController',
        templateUrl: 'foreman_pipeline/jobs/details/project-discovery/views/job-projects-discovery.html'
    })
    .state('jobs.details.jenkins-projects.parameters', {
        url: '/jenkins_projects/:projectId',
        collapsed: true,
        permission: 'edit_jobs',
        controller: 'JobProjectsParametersController', 
        templateUrl: 'foreman_pipeline/jobs/details/project-discovery/views/job-projects-parameters.html'
    })
}]);