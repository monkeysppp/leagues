'use strict';

var rootDiv;
var allData;

function getCSRFCookie() {
  var index = document.cookie.indexOf('X-CSRF-Token') + 13;
  if (index < 0) {
    return '';
  }

  return document.cookie.substr(index, 36);
}

function clearAllChildren(div) {
  div.innerHTML = '';
}

function responseIsGood(res) {
  if (res.length === 0) {
    return true;
  }

  try {
    var resJSON = JSON.parse(res);
    if (resJSON.code === 500 || res.indexOf('Error') === 0) {
      drawError(res);
      return false;
    }
  } catch (ex) {
    // Probably not JSON?
    return true;
  }

  return true;
}

function drawError(err) {
  var errorDiv = document.createElement('div');
  errorDiv.className = 'errorBox';
  errorDiv.innerHTML = '<span>' + err + '</span>';
  if (rootDiv.firstChild) {
    rootDiv.insertBefore(errorDiv, rootDiv.firstChild);
  } else {
    rootDiv.appendChild(errorDiv);
  }
}

function drawTeams(competitionDiv, teams) {
  var teamCount = teams.length;
  for (var i = 0; i < teamCount; i++) {
    var teamDiv = document.createElement('div');
    teamDiv.className = 'teambox';
    competitionDiv.appendChild(teamDiv);

    var teamTag = document.createElement('span');
    teamTag.innerHTML = teams[i].name;
    teamDiv.appendChild(teamTag);
  }
}

function drawCompetitions(seasonDiv, competitions) {
  var competitionCount = competitions.length;
  for (var i = 0; i < competitionCount; i++) {
    var competitionDiv = document.createElement('div');
    competitionDiv.className = 'competitionbox';
    seasonDiv.appendChild(competitionDiv);

    var competitionTag = document.createElement('span');
    competitionTag.innerHTML = competitions[i].name;
    competitionDiv.appendChild(competitionTag);

    drawTeams(competitionDiv, competitions[i].teams);
  }
}

function drawSeasons(overviewBox, response) {
  try {
    var data = JSON.parse(response);
    clearAllChildren(overviewBox);

    var seasonCount = data.length;
    for (var i = 0; i < seasonCount; i++) {
      var seasonDiv = document.createElement('div');
      seasonDiv.className = 'seasonbox';
      overviewBox.appendChild(seasonDiv);

      var seasonTag = document.createElement('span');
      seasonTag.innerHTML = 'Season: ' + data[i].name;
      seasonDiv.appendChild(seasonTag);

      drawCompetitions(seasonDiv, data[i].competitions);
    }
  } catch (ex) {
    drawError(ex);
  }
}

function drawFixtures(competitionDiv, fixtures) {
  var fixtureCount = fixtures.length;
  for (var i = 0; i < fixtureCount; i++) {
    var fixture = fixtures[i];

    var fixtureDiv = document.createElement('div');
    fixtureDiv.className = 'teambox';
    competitionDiv.appendChild(fixtureDiv);

    var fixtureTag = document.createElement('span');
    fixtureTag.innerHTML = fixture.date + ' ' + fixture.venue;
    fixtureDiv.appendChild(fixtureTag);

    var matchCount = fixture.matches.length;
    for (var j = 0; j < matchCount; j++) {
      var nlTag = document.createElement('br');
      fixtureDiv.appendChild(nlTag);
      var matchTag = document.createElement('span');
      matchTag.innerHTML = fixture.matches[j].time + ' : ' + fixture.matches[j].homeTeam + ' v ' +
        fixture.matches[j].awayTeam + ' (' + fixture.matches[j].refTeam + ' ref)';
      fixtureDiv.appendChild(matchTag);
    }

    var nlTag2 = document.createElement('br');
    fixtureDiv.appendChild(nlTag2);
    if (fixture.adjudicator) {
      var adjudicatorTag = document.createElement('span');
      adjudicatorTag.innerHTML = 'Adjudicator: ' + fixture.adjudicator;
      fixtureDiv.appendChild(adjudicatorTag);
      var nlTag3 = document.createElement('br');
      fixtureDiv.appendChild(nlTag3);
    }
  }
}

function drawFixtureCompetitions(seasonDiv, competitions) {
  var competitionCount = competitions.length;
  for (var i = 0; i < competitionCount; i++) {
    var competitionDiv = document.createElement('div');
    competitionDiv.className = 'competitionbox';
    seasonDiv.appendChild(competitionDiv);

    var competitionTag = document.createElement('span');
    competitionTag.innerHTML = competitions[i].name;
    competitionDiv.appendChild(competitionTag);

    drawFixtures(competitionDiv, competitions[i].fixtures);
  }
}

function drawFixtureSeasons(fixturesBox, response) {
  try {
    var data = JSON.parse(response);
    clearAllChildren(fixturesBox);

    var seasonCount = data.length;
    for (var i = 0; i < seasonCount; i++) {
      var seasonDiv = document.createElement('div');
      seasonDiv.className = 'seasonbox';
      fixturesBox.appendChild(seasonDiv);

      var seasonTag = document.createElement('span');
      seasonTag.innerHTML = 'Season: ' + data[i].name;
      seasonDiv.appendChild(seasonTag);

      drawFixtureCompetitions(seasonDiv, data[i].competitions);
    }
  } catch (ex) {
    drawError(ex);
  }
}

function processTeams() {
  var seasonNameBox = document.getElementById('seasonlabel');
  var csvBox = document.getElementById('csvraw');
  var csv = seasonNameBox.value + '\n' + csvBox.value;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      /* Check response */
      var response = xhr.responseText;
      if (responseIsGood(response)) {
        var doneBox = document.getElementById('teamsDone');
        doneBox.innerHTML = '<span>DONE!</span>';
        var processButton = document.getElementById('processFixtures');
        processButton.style.display = 'inline';
      }
    }
  };

  xhr.open('POST', '/api/processTeams', true);
  xhr.setRequestHeader('X-CSRF-Token', getCSRFCookie());
  xhr.send(csv);
}

function processFixtures() {
  var seasonNameBox = document.getElementById('seasonlabel');
  var csvBox = document.getElementById('csvraw');
  var csv = seasonNameBox.value + '\n' + csvBox.value;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      /* Check response */
      var response = xhr.responseText;
      if (responseIsGood(response)) {
        var doneBox = document.getElementById('fixturesDone');
        doneBox.innerHTML = '<span>DONE!</span>';
      }
    }
  };

  xhr.open('POST', '/api/processFixtures', true);
  xhr.setRequestHeader('X-CSRF-Token', getCSRFCookie());
  xhr.send(csv);
}

function getOverview() {
  var seasonNameBox = document.getElementById('seasonlabel');
  var csvBox = document.getElementById('csvraw');
  var csv = seasonNameBox.value + '\n' + csvBox.value;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      /* Check response */
      var response = xhr.responseText;
      if (responseIsGood(response)) {
        var overviewBox = document.getElementById('overview');
        drawSeasons(overviewBox, response);
        var processButton = document.getElementById('processTeams');
        processButton.style.display = 'inline';
      }
    }
  };

  xhr.open('POST', '/api/getOverview', true);
  xhr.setRequestHeader('X-CSRF-Token', getCSRFCookie());
  xhr.send(csv);

  var xhr2 = new XMLHttpRequest();
  xhr2.onreadystatechange = function() {
    if (xhr2.readyState === 4 && xhr2.status === 200) {
      /* Check response */
      var response = xhr2.responseText;
      if (responseIsGood(response)) {
        var fixturesBox = document.getElementById('fixtures');
        drawFixtureSeasons(fixturesBox, response);
      }
    }
  };

  xhr2.open('POST', '/api/getFixtures', true);
  xhr2.setRequestHeader('X-CSRF-Token', getCSRFCookie());
  xhr2.send(csv);
}

function getCSV() {
  var urlBox = document.getElementById('csvurl');
  var url = urlBox.value;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      /* Check response */
      var response = xhr.responseText;
      if (responseIsGood(response)) {
        var csvBox = document.getElementById('csvraw');
        csvBox.value = response;
        var getOverview = document.getElementById('getOverview');
        getOverview.style.display = 'inline';
      }
    }
  };

  xhr.open('POST', '/api/getCSV', true);
  xhr.setRequestHeader('X-CSRF-Token', getCSRFCookie());
  xhr.send(url);
}

function getInfo() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      /* Check response */
      var response = xhr.responseText;
      if (responseIsGood(response)) {
        var urlBox = document.getElementById('csvurl');
        urlBox.value = response;
      }
    }
  };

  xhr.open('GET', '/api/getDefaultUrl', true);
  xhr.setRequestHeader('X-CSRF-Token', getCSRFCookie());
  xhr.send();
}

function apisAttachEvents() {
  rootDiv = document.getElementById('root');

  var getCSVButton = document.getElementById('getCSV');
  var getOverviewButton = document.getElementById('getOverview');
  var processTeamsButton = document.getElementById('processTeams');
  var processFixturesButton = document.getElementById('processFixtures');

  getCSVButton.addEventListener('click', getCSV);
  getOverviewButton.addEventListener('click', getOverview);
  processTeamsButton.addEventListener('click', processTeams);
  processFixturesButton.addEventListener('click', processFixtures);

  getInfo();
}
