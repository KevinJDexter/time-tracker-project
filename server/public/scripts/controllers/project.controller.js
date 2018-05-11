app.controller('ProjectController', ['ProjectService', function(ProjectService) {
  console.log('Project Controller loaded');

  var self = this;

  self.projects = ProjectService.projects;
  self.newProject = ProjectService.newProject;

  self.addProject = ProjectService.addProject;
  self.deleteProject = ProjectService.deleteProject;
  self.getProjects = ProjectService.getProjects;
  self.getEntries = ProjectService.getEntries;
  self.editProject = ProjectService.editProject;

  self.init = function() {
    self.getProjects();
    self.getEntries();
    self.newProject.name = '';
  }

  self.init();
}])