app.controller('ReportController', ['ProjectService', function(ProjectService) {
  console.log('Report Controller loaded');

  var self = this;

  self.populateCanvas = ProjectService.populateCanvas;
  self.getProjects = ProjectService.getProjects;
  self.getEntries = ProjectService.getEntries;

  self.init = function () {
    self.getProjects();
    self.getEntries();
    self.populateCanvas();
  }

  self.init();
}])