app.controller('EntryController', ['ProjectService', function(ProjectService) {
  console.log('Entry Controller loaded');

  var self = this;

  self.entries = ProjectService.entries;
  self.projects = ProjectService.projects;

  self.newEntry = ProjectService.newEntry;

  self.addEntry = ProjectService.addEntry;
  self.deleteEntry = ProjectService.deleteEntry;
  self.getEntries = ProjectService.getEntries;
  self.getProjects = ProjectService.getProjects;

  self.init = function () {
    self.getEntries();
    self.getProjects();
  }

  self.init();
}])