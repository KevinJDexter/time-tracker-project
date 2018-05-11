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

  self.newProject = {
    name: '',
    hours: 0
  }

  // Gets all entries from server
  self.getEntries = function () {
    $http({
      method: 'GET',
      url: '/entry'
    })
      .then(function (response) {
        self.entries.list = response.data;
        self.addProjectNamesToEntries();
        self.getHoursForProjects();
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
        self.getHoursForProjects();
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
    self.getHoursForEntry();
    $http({
      method: 'POST',
      url: '/entry',
      data: self.newEntry
    })
      .then(function (response) {
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

  self.addProject = function() {
    $http({
      method: 'POST',
      url: '/project',
      data: self.newProject
    })
      .then(function(response) {
        self.getProjects();
        $mdToast.show(
          $mdToast.simple()
            .textContent('New project added!')
        )
      })
      .catch(function(error) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('500 Error')
            .textContent('Something went wrong with our server. We are looking into it, and apologize for the inconvenience.')
            .of('ok')
        )
      })
  }

  //Removes entry from database
  self.deleteEntry = function(entry) {
    $mdDialog.show(
      $mdDialog.confirm()
        .title('Are you sure? You can\'t undo this delete.')
        .textContent(`You are deleting the entry: ${entry.name}`)
        .ok('Yes, Delete this entry')
        .cancel('nevermind, don\'t delete')
    )
      .then(function() {
        $http({
          method: 'DELETE',
          url: `/entry/${entry.id}`
        })
          .then(function(response) {
            self.getEntries();
            $mdToast.show(
              $mdToast.simple()
                .textContent('Entry deleted')
            )
          })
          .catch(function(error) {
            $mdDialog.show(
              $mdDialog.alert()
                .title('500 Error')
                .textContent('Something went wrong on our server. We are looking into it, and apologize for the inconvenience')
                .ok('ok')
            )
          })
      }, function() {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Canceled delete')
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
  self.getHoursForEntry = function () {
      let start = self.newEntry.start_time.split(':').map(x => Number(x));
      let end = self.newEntry.end_time.split(':').map(x => Number(x));
      let startHours = start[0] + start[1] / 60;
      let endHours = end[0] + end[1] / 60;
      let difference = Math.round((endHours - startHours) * 2) / 2;
      self.newEntry.hours = difference;
  }

  self.getHoursForProjects = function () {
    self.projects.list.forEach(project => {
      let projectEntries = self.entries.list.filter(entry => entry.project_id === project.id);
      project.hours = 0;
      projectEntries.forEach(entry => {
        project.hours += Number(entry.hours);
      });
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