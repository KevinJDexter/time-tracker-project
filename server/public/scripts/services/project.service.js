app.service('ProjectService', ['$http', '$mdDialog', '$mdToast', function ($http, $mdDialog, $mdToast) {
  console.log('Project Service loaded');

  var self = this;

  self.entries = { list: [] };
  self.projects = { list: [] };

  self.newEntry = {
    name: '',
    project_id: null,
    date: '',
    start_time: '',
    end_time: ''
  }

  // Gets all entries from server
  self.getEntries = function () {
    console.log('get entries');
    $http({
      method: 'GET',
      url: '/entry'
    })
      .then(function (response) {
        self.entries.list = response.data;
        self.addProjectNamesToEntries();
        self.getHours();
      })
      .catch(function (error) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('500 Error')
            .textContent('Something went wrong on our server. We are looking into it, and apologize for the inconvenience.')
            .ok('Ok')
        )
      })
  }

  // Gets all projects from server
  self.getProjects = function () {
    $http({
      method: 'GET',
      url: '/project'
    })
      .then(function (response) {
        self.projects.list = response.data;
        self.addProjectNamesToEntries();
      })
      .catch(function (error) {
        $mdDialos.show(
          $mdDialog.alert()
            .title('500 Error')
            .textContent('Something went wrong on our server. We are looking into it, and apologize for the inconvenience.')
            .ok('Ok')
        )
      })
  }

  // If there are entries, waits until projects are loaded
  // Pairs each entry up with whatever project id it connects to
  self.addProjectNamesToEntries = function () {
    if (self.projects.list.length != 0) {
      self.entries.list.forEach(entry => {
        let project = self.projects.list.find(project => project.id === entry.project_id);
        entry.project_name = project.name;
      });
    }
  }

  self.getHours = function () {
    self.entries.list.forEach(entry => {
      let start = entry.start_time.split(':').map(x => Number(x));
      let end = entry.end_time.split(':').map(x => Number(x));
      let startHours = start[0] + start[1] / 60;
      let endHours = end[0] + end[1] / 60;
      let difference = Math.round((endHours - startHours) * 2) / 2;
      entry.hours = difference;
      console.log(difference);
    });
  }

}])