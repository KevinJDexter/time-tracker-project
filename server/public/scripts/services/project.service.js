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
        $mdDialog.show(
          $mdDialog.alert()
            .title('500 Error')
            .textContent('Something went wrong on our server. We are looking into it, and apologize for the inconvenience.')
            .ok('Ok')
        )
      })
  }

  // Adds new entry to database
  self.addEntry = function () {
    self.newEntry.start_time = document.getElementById('startTime').value;
    self.newEntry.end_time = document.getElementById('endTime').value;
    if (!self.entryReady()) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Must fill all fields to submit')
      )
      return false;
    }
    $http({
      method: 'POST',
      url: '/entry',
      data: self.newEntry
    })
      .then(function () {
        self.getEntries();
        self.clearNewEntry();
        $mdToast.show(
          $mdToast.simple()
            .textContent('New entry added!')
        )
      })
      .catch(function (error) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('500 Error')
            .textContent('Something went wrong on our server. We are looking into it, and apologize for the inconvenience.')
            .ok('ok')
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

  // Calculates difference between start and end times
  self.getHours = function () {
    self.entries.list.forEach(entry => {
      let start = entry.start_time.split(':').map(x => Number(x));
      let end = entry.end_time.split(':').map(x => Number(x));
      let startHours = start[0] + start[1] / 60;
      let endHours = end[0] + end[1] / 60;
      let difference = Math.round((endHours - startHours) * 2) / 2;
      entry.hours = difference;
    });
  }

  // Checks if entry is ready
  self.entryReady = function () {
    let isReady = self.newEntry;
    if (isReady.name == '') {
      return false;
    } else if (isReady.project_id == null) {
      return false;
    } else if (isReady.date == '') {
      return false;
    } else if (isReady.start_time == '') {
      return false;
    } else if (isReady.end_time == '') {
      return false;
    } else {
      return true;
    }
  }

  // resets input fields for new entries
  self.clearNewEntry = function () {
    self.newEntry.name = '';
    self.newEntry.project_id = null;
    self.newEntry.date = '';
    self.newEntry.start_time = '';
    self.newEntry.end_time = '';
  }

}])