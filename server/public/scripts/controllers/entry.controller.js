app.controller('EntryController', ['ProjectService', function(ProjectService) {
  console.log('Entry Controller loaded');

  var self = this;

  self.entries = ProjectService.entries;
  self.projects = ProjectService.projects;

  self.editActive = ProjectService.editActive;

  self.newEntry = ProjectService.newEntry;

  self.addEntry = ProjectService.addEntry;
  self.deleteEntry = ProjectService.deleteEntry;
  self.getEntries = ProjectService.getEntries;
  self.getProjects = ProjectService.getProjects;
  
  self.editEntry = ProjectService.editEntry;
  self.cancelEdit = ProjectService.cancelEdit;

  self.updateEntry = ProjectService.updateEntry;

  self.sortTable = ProjectService.sortTable;

  self.init = function () {
    self.getEntries();
    self.getProjects();
    self.cancelEdit();
  }

  self.init();
}])