app.service('ProjectService', ['$http', '$mdDialog', '$mdToast', function ($http, $mdDialog, $mdToast) {
  console.log('Project Service loaded');

  var self = this;

  self.entries = { list: [] };
  self.projects = { list: [] };

  self.editActive = { active: false };

  self.newEntry = {
    name: '',
    project_id: null,
    date: '',
    start_time: '',
    end_time: '',
    hours: 0,
    project_name: ''
  }

  self.newProject = {
    name: '',
    hours: 0
  }

  self.updateEntry = { id: 0 };

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

  // Adds a new project to the database
  self.addProject = function () {
    $http({
      method: 'POST',
      url: '/project',
      data: self.newProject
    })
      .then(function (response) {
        self.getProjects();
        $mdToast.show(
          $mdToast.simple()
            .textContent('New project added!')
        )
        self.newProject.name = '';
      })
      .catch(function (error) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('500 Error')
            .textContent('Something went wrong with our server. We are looking into it, and apologize for the inconvenience.')
            .of('ok')
        )
      })
  }

  //Removes entry from database
  self.deleteEntry = function (entry) {
    $mdDialog.show(
      $mdDialog.confirm()
        .title('Are you sure? You can\'t undo this delete.')
        .textContent(`You are deleting the entry: ${entry.name}`)
        .ok('Yes, Delete this entry')
        .cancel('Nevermind, don\'t delete')
    )
      .then(function () {
        $http({
          method: 'DELETE',
          url: `/entry/${entry.id}`
        })
          .then(function (response) {
            self.getEntries();
            $mdToast.show(
              $mdToast.simple()
                .textContent('Entry deleted')
            )
          })
          .catch(function (error) {
            $mdDialog.show(
              $mdDialog.alert()
                .title('500 Error')
                .textContent('Something went wrong on our server. We are looking into it, and apologize for the inconvenience')
                .ok('ok')
            )
          })
      }, function () {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Canceled delete')
        )
      })
  }

  // Removes project from database (all related entries as well)
  self.deleteProject = function (project) {
    $mdDialog.show(
      $mdDialog.confirm()
        .title('Are you sure? you can\'t undo this delete.')
        .textContent(`You are deleting the project and all it's entries: ${project.name}`)
        .ok('Yes, Delete this project')
        .cancel('Nevermind, don\'t delete')
    )
      .then(function () {
        $http({
          method: 'DELETE',
          url: `/project/${project.id}`
        })
          .then(function (response) {
            self.getEntries();
            self.getProjects();
            $mdToast.show(
              $mdToast.simple()
                .textContent('Project deleted')
            )
          })
          .catch(function (error) {
            $mdDialog.show(
              $mdDialog.alert()
                .title('500 Error')
                .textContent('Something went wrong on our server. We are looking into it, and apologize for the inconvenience')
                .ok('Ok')
            )
          })
      }, function () {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Canceled delete')
        )
      })
  }

  // Updates project name
  self.editProject = function (project) {
    $mdDialog.show(
      $mdDialog.confirm()
        .title('Are you sure?')
        .textContent('You are changing a project name.')
        .ok('Yes')
        .cancel('No')
    )
      .then(function () {
        $http({
          method: 'PUT',
          url: `/project/${project.id}`,
          data: project
        })
          .then(function (response) {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Project name updated')
            )
          })
          .catch(function (error) {
            $mdDialog.show(
              $mdDialog.alert()
                .title('500 Error')
                .textContent('Something went wrong on our server. We are looking into it, and apologize for the inconvenience')
                .ok('ok')
            )
          })
      }, function () {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Canceled update')
        )
      })
  }

  // Updates entry with new info
  self.updateEntry = function () {
    self.newEntry.start_time = document.getElementById('startTime').value;
    self.newEntry.end_time = document.getElementById('endTime').value;
    if (!self.entryReady()) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('All fields must be populated to update')
      )
      return false;
    }
    self.getHoursForEntry();
    $http({
      method: 'PUT',
      url: `/entry/${self.updateEntry.id}`,
      data: self.newEntry
    })
      .then(function (response) {
        self.getEntries();
        self.cancelEdit();
        $mdToast.show(
          $mdToast.simple()
            .textContent('Updated entry')
        )
      })
      .catch(function (error) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('500 Error')
            .textContent('Something went wrong on our server. We are looking into it, and apologize for the inconvenience')
            .ok('Ok')
        )
      })
  }

  //Allows user to edit posted time entry
  self.editEntry = function (entry) {
    self.editActive.active = true;
    self.newEntry.name = entry.name;
    self.newEntry.project_id = entry.project_id;
    document.getElementById('startTime').value = entry.start_time;
    document.getElementById('endTime').value = entry.end_time;
    self.newEntry.date = entry.date;
    self.updateEntry.id = entry.id;
  }

  // cancels edit and returns to blank entry field
  self.cancelEdit = function () {
    self.editActive.active = false;
    self.updateEntry.id = 0;
    self.clearNewEntry();
  }

  // If there are entries, waits until projects are loaded
  // Pairs each entry up with whatever project id it connects to
  self.addProjectNamesToEntries = function () {
    if (self.projects.list.length != 0 && self.entries.list.length != 0) {
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

  // Popoulates Hours field of the projects using Entry hours
  self.getHoursForProjects = function () {
    self.projects.list.forEach(project => {
      project.hours = 0;
      if (self.entries.list.length > 0) {
        let projectEntries = self.entries.list.filter(entry => entry.project_id === project.id);
        projectEntries.forEach(entry => {
          project.hours += Number(entry.hours);
        });
      }
    });
  }

  // Checks if entry is ready
  self.entryReady = function () {
    console.log(self.newEntry);
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
    document.getElementById('startTime').value = '06:00:00';
    document.getElementById('endTime').value = '08:00:00';
  }

  // Sorts the table based on selected column
  self.sortTable = function (sortRule) {
    let entries;
    let oldEntries = self.entries.list.map(x => x);
    let newEntries = [];
    if (sortRule == 0) {
      entries = self.entries.list.map(x => x.name);
    } else if (sortRule == 1) {
      entries = self.entries.list.map(x => x.project_name);
    } else if (sortRule == 2) {
      entries = self.entries.list.map(x => x.date);
    } else if (sortRule == 3) {
      entries = self.entries.list.map(x => x.hours);
    }
    while (entries.length > 0) {
      let min = entries[0];
      let index = 0;
      for (let i = 1; i < entries.length; i++) {
        if (min > entries[i]) {
          min = entries[i];
          index = i;
        }
      }
      newEntries.push(oldEntries.splice(index, 1)[0]);
      entries.splice(index, 1);
    }
    self.entries.list = newEntries;
  }

}])