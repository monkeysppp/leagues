'use strict'

const logging = require('../../lib/logging.js')
const log = logging.getLogger('api/data')
const dataFile = require('./seasonsDataFile.js')

let seasonsData

function throwError (message, statusCode) {
  const error = new Error(message)
  error.status = statusCode
  throw error
}

/**
 * Get the list of seasons
 *
 * @returns {array} The known seasons
 **/
exports.seasonsGet = function () {
  log.debug('seasonsGet()')
  seasonsData = dataFile.readData()
  seasonsData.seasons.forEach(season => {
    season.competitions.forEach(competition => {
      competition.fixtures.sort((elem1, elem2) => {
        const date1 = new Date(elem1.date)
        const date2 = new Date(elem2.date)
        return date1 - date2
      })
    })
  })

  return seasonsData.seasons
}

/**
 * Create a new season.
 *
 * @param {string} seasonName The name for the new season
 *
 * @returns {number} The id of the new season.  If the season already exists, the id of the existing season is returned
 **/
exports.seasonsPost = function (seasonName) {
  log.debug(`seasonPost(seasonName) seasonName=<${seasonName}>`)

  if (!seasonName || seasonName.length === 0) {
    throwError('No seasonName', 400)
  }

  seasonsData = dataFile.readData()
  const seasonCount = seasonsData.seasons.length
  let nextSeasonId = 0
  for (let i = 0; i < seasonCount; i++) {
    // If we see a duplicate name, ignore this POST and return the existing record's id
    if (seasonsData.seasons[i].name === seasonName) {
      return { id: seasonsData.seasons[i].id }
    }

    // Remember the highest id we see
    if (seasonsData.seasons[i].id > nextSeasonId) {
      nextSeasonId = seasonsData.seasons[i].id
    }
  }

  var newSeason = {}
  newSeason.id = nextSeasonId + 1
  newSeason.name = seasonName
  newSeason.competitions = []
  seasonsData.seasons.push(newSeason)

  dataFile.writeData(seasonsData)

  return { id: newSeason.id }
}

/**
 * Get a specific season
 *
 * @param {number} seasonId The id of the season
 *
 * @returns {object} The requested season
 **/
exports.seasonsSeasonIdGet = function (seasonId) {
  log.debug(`seasonsSeasonIdGet(seasonId) seasonId=<${seasonId}>`)

  if (isNaN(seasonId)) {
    throwError('Invalid seasonId', 400)
  }

  exports.seasonsGet()
  const seasonCount = seasonsData.seasons.length
  log.debug(`Found ${seasonCount} seasons`)
  for (let i = 0; i < seasonCount; i++) {
    if (seasonsData.seasons[i].id === seasonId) {
      log.debug(`Season ${seasonId} found`)
      return seasonsData.seasons[i]
    }
  }

  throwError('Season not found', 404)
}

/**
 * Rename a season
 *
 * @param {number} seasonId The id of the season
 * @param {string} seasonName The new name for the season
 *
 * @returns
 **/
exports.seasonsSeasonIdPut = function (seasonId, seasonName) {
  log.debug(`seasonsSeasonIdPut(seasonId, seasonName) seasonId=<${seasonId}> seasonName=<${seasonName}>`)

  if (isNaN(seasonId)) {
    throwError('Invalid seasonId', 400)
  }

  if (!seasonName) {
    throwError('No seasonName', 400)
  }

  seasonsData = dataFile.readData()
  let season
  const seasonCount = seasonsData.seasons.length
  for (let i = 0; i < seasonCount; i++) {
    if (seasonsData.seasons[i].id === seasonId) {
      season = seasonsData.seasons[i]
      continue
    }

    if (seasonsData.seasons[i].name === seasonName) {
      throwError('seasonName already used', 409)
    }
  }

  if (season) {
    season.name = seasonName
    dataFile.writeData(seasonsData)
    return season
  }

  throwError('Season not found', 404)
}

/**
 * Delete a specific season
 *
 * @param {number} seasonId The id of the season
 **/
exports.seasonsSeasonIdDelete = function (seasonId) {
  log.debug(`seasonsSeasonIdDelete(seasonId) seasonId=<${seasonId}>`)

  if (isNaN(seasonId)) {
    throwError('Invalid seasonId', 400)
  }

  seasonsData = dataFile.readData()
  const seasonCount = seasonsData.seasons.length
  for (let i = 0; i < seasonCount; i++) {
    if (seasonsData.seasons[i].id === seasonId) {
      seasonsData.seasons.splice(i, 1)
      dataFile.writeData(seasonsData)
      return
    }
  }
}

/**
 * Get the competitions for a given season
 *
 * @param {number} seasonId id for the season
 *
 * @returns {array} the competitions for that season
 **/
exports.seasonsSeasonIdCompetitionsGet = function (seasonId) {
  log.debug(`seasonsSeasonIdCompetitionsGet(seasonId) seasonId=<${seasonId}>`)
  return exports.seasonsSeasonIdGet(seasonId).competitions
}

/**
 * Create a new competition
 *
 * @param {number} seasonId id for the season
 * @param {string} competitionName name for the competition
 *
 * @returns {number} id for the competition. If the competition already exists, the id of the existing competition is returned
 **/
exports.seasonsSeasonIdCompetitionsPost = function (seasonId, competitionName) {
  log.debug(`seasonsSeasonIdCompetitionsPost(seasonId, competitionName) seasonId=<${seasonId}> competitionName=<${competitionName}>`)

  if (!competitionName || competitionName.length === 0) {
    throwError('No competitionName', 400)
  }

  const season = exports.seasonsSeasonIdGet(seasonId)
  const competitionCount = season.competitions.length
  let nextCompetitionId = 0
  for (let i = 0; i < competitionCount; i++) {
    // If we see a duplicate name, ignore this POST and return the existing record's id
    if (season.competitions[i].name === competitionName) {
      return { id: season.competitions[i].id }
    }

    // Remember the highest id we see
    if (season.competitions[i].id > nextCompetitionId) {
      nextCompetitionId = season.competitions[i].id
    }
  }

  var newCompetition = {}
  newCompetition.id = nextCompetitionId + 1
  newCompetition.name = competitionName
  newCompetition.fixtures = []
  newCompetition.teams = []
  season.competitions.push(newCompetition)

  dataFile.writeData(seasonsData)
  return { id: newCompetition.id }
}

/**
 * Get the requested competition
 *
 * @param {number} seasonId id for the season
 * @param {string} competitionName name for the competition
 *
 * @returns {Object} the requested competition
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdGet = function (seasonId, competitionId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId) seasonId=<${seasonId}> competitionId=<${competitionId}>`)

  if (isNaN(competitionId)) {
    throwError('Invalid competitionId', 400)
  }

  const season = exports.seasonsSeasonIdGet(seasonId)
  const competitionCount = season.competitions.length
  log.debug(`Found ${competitionCount} competitions`)
  for (let i = 0; i < competitionCount; i++) {
    if (season.competitions[i].id === competitionId) {
      log.debug(`Competition ${competitionId} found`)
      return season.competitions[i]
    }
  }

  throwError('Competition not found', 404)
}

/**
 * Rename a competition
 *
 * @param {number} seasonId The id of the season
 * @param {number} competitionId The id of the competition
 * @param {string} competitionName The new name for the competition
 *
 * @returns
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdPut = function (seasonId, competitionId, competitionName) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdPut(seasonId, competitionId, seasonName) seasonId=<${seasonId}> competitionId=<${competitionId}> competitionName=<${competitionName}>`)

  if (isNaN(competitionId)) {
    throwError('Invalid competitionId', 400)
  }

  if (!competitionName) {
    throwError('No competitionName', 400)
  }

  const season = exports.seasonsSeasonIdGet(seasonId)
  const competitionCount = season.competitions.length
  let competition
  for (let i = 0; i < competitionCount; i++) {
    if (season.competitions[i].id === competitionId) {
      competition = season.competitions[i]
      continue
    }

    if (season.competitions[i].name === competitionName) {
      throwError('competitionName already used', 409)
    }
  }

  if (competition) {
    competition.name = competitionName
    dataFile.writeData(seasonsData)
    return competition
  }

  throwError('Competition not found', 404)
}

/**
 * Delete a specific competition
 *
 * @param {number} seasonId The id of the season
 * @param {number} competitionId The id of the competition
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdDelete = function (seasonId, competitionId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdDelete(seasonId, competitionId) seasonId=<${seasonId}> competitionId=<${competitionId}>`)

  if (isNaN(competitionId)) {
    throwError('Invalid competitionId', 400)
  }

  const competitions = exports.seasonsSeasonIdCompetitionsGet(seasonId)
  const competitionCount = competitions.length
  for (let i = 0; i < competitionCount; i++) {
    if (competitions[i].id === competitionId) {
      competitions.splice(i, 1)
      dataFile.writeData(seasonsData)
      return
    }
  }
}

/**
 * Get the teams for a given competition
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 *
 * @returns {array} the teams for the requested competition
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsGet = function (seasonId, competitionId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdTeamsGet(seasonId, competitionId) seasonId=<${seasonId}> competitionId=<${competitionId}>`)
  return exports.seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId).teams
}

/**
 * Create a new team
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 * @param {string} teamName name for the team
 *
 * @returns {number} id for the team. If the team already exists, the id of the existing team is returned
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsPost = function (seasonId, competitionId, teamName) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdTeamsPost(seasonId, competitionId, teamName) seasonId=<${seasonId}> competitionId=<${competitionId}> , teamName=<${teamName}>`)

  if (!teamName || teamName.length === 0) {
    throwError('No teamName', 400)
  }

  const competition = exports.seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId)
  const teamCount = competition.teams.length
  let nextTeamId = 0
  for (let i = 0; i < teamCount; i++) {
    // If we see a duplicate name, ignore this POST and return the existing record's id
    if (competition.teams[i].name === teamName) {
      return { id: competition.teams[i].id }
    }

    // Remember the highest id we see
    if (competition.teams[i].id > nextTeamId) {
      nextTeamId = competition.teams[i].id
    }
  }

  var newTeam = {}
  newTeam.id = nextTeamId + 1
  newTeam.name = teamName
  newTeam.contacts = []
  competition.teams.push(newTeam)

  dataFile.writeData(seasonsData)
  return { id: newTeam.id }
}

/**
 * Get the team
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 * @param {number} teamId id for the team
 *
 * @returns {array} the requested team
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdGet = function (seasonId, competitionId, teamId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdGet(seasonId, competitionId, teamId) seasonId=<${seasonId}> competitionId=<${competitionId}> teamId=<${teamId}>`)

  if (isNaN(teamId)) {
    throwError('Ivalid teamId', 400)
  }

  const competition = exports.seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId)
  const teamCount = competition.teams.length
  log.debug(`Found ${teamCount} teams`)
  for (let i = 0; i < teamCount; i++) {
    if (competition.teams[i].id === teamId) {
      log.debug(`Team ${teamId} found`)
      return competition.teams[i]
    }
  }

  throwError('Team not found', 404)
}

/**
 * Rename a team
 *
 * @param {number} seasonId The id of the season
 * @param {number} competitionId The id of the competition
 * @param {number} teamId id for the team
 * @param {string} teamName The new name for the team
 *
 * @returns
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdPut = function (seasonId, competitionId, teamId, teamName) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdPut(seasonId, competitionId, teamId, seasonName) seasonId=<${seasonId}> competitionId=<${competitionId}> teamId=<${teamId}> teamName=<${teamName}>`)

  if (isNaN(teamId)) {
    throwError('Invalid teamId', 400)
  }

  if (!teamName) {
    throwError('No teamName', 400)
  }

  const competition = exports.seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId)
  const teamCount = competition.teams.length
  let team
  for (let i = 0; i < teamCount; i++) {
    if (competition.teams[i].id === teamId) {
      team = competition.teams[i]
      continue
    }

    if (competition.teams[i].name === teamName) {
      throwError('teamName already used', 409)
    }
  }

  if (team) {
    team.name = teamName
    dataFile.writeData(seasonsData)
    return team
  }
  throwError('Team not found', 404)
}

/**
 * Delete a specific competition
 *
 * @param {number} seasonId The id of the season
 * @param {number} competitionId The id of the competition
 * @param {number} teamId The id of the team
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdDelete = function (seasonId, competitionId, teamId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdDelete(seasonId, competitionId, teamId) seasonId=<${seasonId}> competitionId=<${competitionId}> teamId=<${teamId}>`)

  if (isNaN(teamId)) {
    throwError('Invalid teamId', 400)
  }

  const teams = exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsGet(seasonId, competitionId)
  const teamCount = teams.length
  for (let i = 0; i < teamCount; i++) {
    if (teams[i].id === teamId) {
      teams.splice(i, 1)
      dataFile.writeData(seasonsData)
      return
    }
  }
}

/**
 * Get the contacts for a given team
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 * @param {number} teamId id for the team
 *
 * @returns {array} the contacts for the requested team
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsGet = function (seasonId, competitionId, teamId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsGet(seasonId, competitionId, teamId) seasonId=<${seasonId}> competitionId=<${competitionId}> teamId=<${teamId}>`)
  return exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdGet(seasonId, competitionId, teamId).contacts
}

/**
 * Create a new contact
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 * @param {number} teamId id for the team
 * @param {string} contactAddress email address for the contact
 *
 * @returns {number} id for the contact. If the contact already exists, the id of the existing contact is returned
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsPost = function (seasonId, competitionId, teamId, contactAddress) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsPost(seasonId, competitionId, teamId, contactAddress) seasonId=<${seasonId}> competitionId=<${competitionId}> , teamId=<${teamId}> contactAddress=<${contactAddress}>`)

  if (!contactAddress || contactAddress.length === 0) {
    throwError('No contactAddress', 400)
  }

  const team = exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdGet(seasonId, competitionId, teamId)
  const contactCount = team.contacts.length
  let nextContactId = 0
  for (let i = 0; i < contactCount; i++) {
    // If we see a duplicate name, ignore this POST and return the existing record's id
    if (team.contacts[i].email === contactAddress) {
      return { id: team.contacts[i].id }
    }

    // Remember the highest id we see
    if (team.contacts[i].id > nextContactId) {
      nextContactId = team.contacts[i].id
    }
  }

  var newContact = {}
  newContact.id = nextContactId + 1
  newContact.email = contactAddress
  team.contacts.push(newContact)

  dataFile.writeData(seasonsData)
  return { id: newContact.id }
}

/**
 * Get the contact
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 * @param {number} teamId id for the team
 * @param {number} contactId id for the contact
 *
 * @returns {array} the requested contact
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdGet = function (seasonId, competitionId, teamId, contactId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdGet(seasonId, competitionId, teamId, contactId) seasonId=<${seasonId}> competitionId=<${competitionId}> teamId=<${teamId}> contactId=<${contactId}>`)

  if (isNaN(contactId)) {
    throwError('Invalid contactId', 400)
  }

  const team = exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdGet(seasonId, competitionId, teamId)
  const contactCount = team.contacts.length
  log.debug(`Found ${contactCount} contacts`)
  for (let i = 0; i < contactCount; i++) {
    if (team.contacts[i].id === contactId) {
      log.debug(`Contact ${contactId} found`)
      return team.contacts[i]
    }
  }

  throwError('Contact not found', 404)
}

/**
 * Update the email address for a contact
 *
 * @param {number} seasonId The id of the season
 * @param {number} competitionId The id of the competition
 * @param {number} teamId id for the team
 * @param {number} contactId id for the contact
 * @param {string} contactAddress The new email address for the contact
 *
 * @returns
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdPut = function (seasonId, competitionId, teamId, contactId, contactAddress) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdPut(seasonId, competitionId, teamId, contactId, contactAddress) seasonId=<${seasonId}> competitionId=<${competitionId}> teamId=<${teamId}> contactId=<${contactId}> contactAddress=<${contactAddress}>`)

  if (isNaN(contactId)) {
    throwError('Invalid contactId', 400)
  }

  if (!contactAddress) {
    throwError('No contactAddress', 400)
  }

  const team = exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdGet(seasonId, competitionId, teamId)
  const contactCount = team.contacts.length
  let contact
  for (let i = 0; i < contactCount; i++) {
    if (team.contacts[i].id === contactId) {
      contact = team.contacts[i]
      continue
    }

    if (team.contacts[i].email === contactAddress) {
      throwError('contactAddress already used', 409)
    }
  }

  if (contact) {
    contact.email = contactAddress

    dataFile.writeData(seasonsData)

    return contact
  } else {
    throwError('Contact not found', 404)
  }
}

/**
 * Delete a specific competition
 *
 * @param {number} seasonId The id of the season
 * @param {number} competitionId The id of the competition
 * @param {number} teamId The id of the team
 * @param {number} contactId id for the contact
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdDelete = function (seasonId, competitionId, teamId, contactId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdDelete(seasonId, competitionId, teamId, contactId) seasonId=<${seasonId}> competitionId=<${competitionId}> teamId=<${teamId}> contactId=<${contactId}>`)

  if (isNaN(contactId)) {
    throwError('Invalid contactId', 400)
  }

  const contacts = exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsGet(seasonId, competitionId, teamId)
  const contactCount = contacts.length
  log.debug(`Found ${contactCount} contacts`)
  for (let i = 0; i < contactCount; i++) {
    if (contacts[i].id === contactId) {
      contacts.splice(i, 1)
      dataFile.writeData(seasonsData)
      return
    }
  }
}

function getTeamIdFromName (competition, teamName) {
  const teams = competition.teams
  for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
    if (teams[teamIndex].name === teamName) {
      return teams[teamIndex].id
    }
  }

  throw new Error()
}

/**
 * Get the fixtures for a given competition
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 *
 * @returns {array} the fixtures for the requested competition
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesGet = function (seasonId, competitionId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdFixturesGet(seasonId, competitionId) seasonId=<${seasonId}> competitionId=<${competitionId}>`)
  return exports.seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId).fixtures
}

/**
 * Create a new fixture
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 * @param {object} fixture to add
 *
 * @returns {number} id for the fixture.
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesPost = function (seasonId, competitionId, fixture) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdFixturesPost(seasonId, competitionId, fixture) seasonId=<${seasonId}> competitionId=<${competitionId}> , fixture=<${JSON.stringify(fixture)}>`)

  if (!fixture.date) {
    throwError('No date found', 400)
  }

  if (!fixture.venue) {
    throwError('No venue found', 400)
  }

  const competition = exports.seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId)

  const fixtureCount = competition.fixtures.length
  let nextFixtureId = 0
  for (let i = 0; i < fixtureCount; i++) {
    // Remember the highest id we see
    if (competition.fixtures[i].id > nextFixtureId) {
      nextFixtureId = competition.fixtures[i].id
    }
  }

  const newFixture = {}
  newFixture.id = nextFixtureId + 1
  newFixture.date = fixture.date
  newFixture.venue = fixture.venue
  newFixture.matches = []
  if (typeof fixture.adjudicator === 'string' && fixture.adjudicator.length > 0) {
    try {
      newFixture.adjudicator = getTeamIdFromName(competition, fixture.adjudicator)
    } catch (err) {
      throwError('Adjuducator team doesn\'t exist: ' + fixture.adjudicator, 400)
    }
  }
  competition.fixtures.push(newFixture)

  dataFile.writeData(seasonsData)
  return { id: newFixture.id }
}

/**
 * Get the fixture
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 * @param {number} fixtureId id for the fixture
 *
 * @returns {array} the requested fixture
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdGet = function (seasonId, competitionId, fixtureId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdGet(seasonId, competitionId, fixtureId) seasonId=<${seasonId}> competitionId=<${competitionId}> fixtureId=<${fixtureId}>`)

  if (isNaN(fixtureId)) {
    throwError('Ivalid fixtureId', 400)
  }

  const competition = exports.seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId)
  const fixtureCount = competition.fixtures.length
  log.debug(`Found ${fixtureCount} fixtures`)
  for (let i = 0; i < fixtureCount; i++) {
    if (competition.fixtures[i].id === fixtureId) {
      log.debug(`Fixture ${fixtureId} found`)
      return competition.fixtures[i]
    }
  }

  throwError('Fixture not found', 404)
}

/**
 * Update the fixture
 *
 * @param {number} seasonId The id of the season
 * @param {number} competitionId The id of the competition
 * @param {number} fixtureId The id of the fixture
 * @param {object} fixture the new details for the fixture
 *
 * @returns
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdPut = function (seasonId, competitionId, fixtureId, fixture) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdPut(seasonId, competitionId, fixture) seasonId=<${seasonId}> competitionId=<${competitionId}> fixtureId=<${fixtureId}> fixture=<${JSON.stringify(fixture)}>`)

  if (isNaN(fixtureId)) {
    throwError('Invalid fixtureId', 400)
  }

  if (!fixture.date) {
    throwError('No date found', 400)
  }

  if (!fixture.venue) {
    throwError('No venue found', 400)
  }

  const competition = exports.seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId)
  let fixtureToReplace
  const fixtureCount = competition.fixtures.length
  for (let i = 0; i < fixtureCount; i++) {
    if (competition.fixtures[i].id === fixtureId) {
      fixtureToReplace = competition.fixtures[i]
      break
    }
  }

  if (fixtureToReplace) {
    fixtureToReplace.date = fixture.date
    fixtureToReplace.venue = fixture.venue
    if (typeof fixture.adjudicator === 'string' && fixture.adjudicator.length > 0) {
      try {
        fixtureToReplace.adjudicator = getTeamIdFromName(competition, fixture.adjudicator)
      } catch (err) {
        throwError('Adjuducator team doesn\'t exist: ' + fixture.adjudicator, 400)
      }
    } else {
      delete fixtureToReplace.adjudicator
    }

    dataFile.writeData(seasonsData)
    return fixtureToReplace
  }
  throwError('Fixture not found', 404)
}

/**
 * Delete a specific fixture
 *
 * @param {number} seasonId The id of the season
 * @param {number} competitionId The id of the competition
 * @param {number} fixtureId The id of the fixture
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdDelete = function (seasonId, competitionId, fixtureId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdDelete(seasonId, competitionId, fixtureId) seasonId=<${seasonId}> competitionId=<${competitionId}> fixtureId=<${fixtureId}>`)

  if (isNaN(fixtureId)) {
    throwError('Invalid fixtureId', 400)
  }

  const fixtures = exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesGet(seasonId, competitionId)
  const fixtureCount = fixtures.length
  for (let i = 0; i < fixtureCount; i++) {
    if (fixtures[i].id === fixtureId) {
      fixtures.splice(i, 1)
      dataFile.writeData(seasonsData)
      return
    }
  }
}

/**
 * Get the matches for a given fixture
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 * @param {number} fixtureId id for the fixture
 *
 * @returns {array} the fixtures for the requested competition
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesGet = function (seasonId, competitionId, fixtureId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesGet(seasonId, competitionId, fixtureId) seasonId=<${seasonId}> competitionId=<${competitionId} fixtureId=<${fixtureId}>`)
  return exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdGet(seasonId, competitionId, fixtureId).matches
}

/**
 * Create a new match
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 * @param {number} fixtureId id for the fixture
 * @param {object} match to add
 *
 * @returns {number} id for the match.
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesPost = function (seasonId, competitionId, fixtureId, match) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesPost(seasonId, competitionId, fixture) seasonId=<${seasonId}> competitionId=<${competitionId}> fixtureId=<${fixtureId}>, match=<${JSON.stringify(match)}>`)

  if (!match.time) {
    throwError('No time found', 400)
  }

  if (!match.homeTeam) {
    throwError('No homeTeam found', 400)
  }

  if (!match.awayTeam) {
    throwError('No awayTeam found', 400)
  }

  const competition = exports.seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId)
  const homeTeam = match.homeTeam
  const awayTeam = match.awayTeam
  const refTeam = match.refTeam

  let homeTeamId
  let awayTeamId
  let refTeamId

  try {
    homeTeamId = getTeamIdFromName(competition, homeTeam)
  } catch (err) {
    throwError('Home team doesn\'t exist: ' + homeTeam, 400)
  }

  try {
    awayTeamId = getTeamIdFromName(competition, awayTeam)
  } catch (err) {
    throwError('Away team doesn\'t exist: ' + awayTeam, 400)
  }

  if (refTeam) {
    try {
      refTeamId = getTeamIdFromName(competition, refTeam)
    } catch (err) {
      throwError('Reffing team doesn\'t exist: ' + awayTeam, 400)
    }
  }

  const fixture = exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdGet(seasonId, competitionId, fixtureId)
  const matchCount = fixture.matches.length
  let nextMatchId = 0
  for (let i = 0; i < matchCount; i++) {
    // Remember the highest id we see
    if (fixture.matches[i].id > nextMatchId) {
      nextMatchId = fixture.matches[i].id
    }
  }

  const newMatch = {}
  newMatch.id = nextMatchId + 1
  newMatch.time = match.time
  newMatch.homeTeam = homeTeamId
  newMatch.awayTeam = awayTeamId
  if (refTeamId) {
    newMatch.refTeam = refTeamId
  }
  fixture.matches.push(newMatch)

  dataFile.writeData(seasonsData)
  return { id: newMatch.id }
}

/**
 * Get the match
 *
 * @param {number} seasonId id for the season
 * @param {number} competitionId id for the competition
 * @param {number} fixtureId id for the fixture
 * @param {number} matchId id for the match
 *
 * @returns {array} the requested match
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdGet = function (seasonId, competitionId, fixtureId, matchId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdGet(seasonId, competitionId, fixtureId, matchId) seasonId=<${seasonId}> competitionId=<${competitionId}> fixtureId=<${fixtureId}> matchId=<${matchId}>`)

  if (isNaN(matchId)) {
    throwError('Ivalid matchId', 400)
  }

  const fixture = exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdGet(seasonId, competitionId, fixtureId)
  const matchCount = fixture.matches.length
  log.debug(`Found ${matchCount} matches`)
  for (let i = 0; i < matchCount; i++) {
    if (fixture.matches[i].id === matchId) {
      log.debug(`Match ${matchId} found`)
      return fixture.matches[i]
    }
  }

  throwError('Match not found', 404)
}

/**
 * Update the match
 *
 * @param {number} seasonId The id of the season
 * @param {number} competitionId The id of the competition
 * @param {number} fixtureId The id of the fixture
 * @param {number} matchId id for the match
 * @param {object} match the new details for the match
 *
 * @returns
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdPut = function (seasonId, competitionId, fixtureId, matchId, match) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdPut(seasonId, competitionId, fixture) seasonId=<${seasonId}> competitionId=<${competitionId}> fixtureId=<${fixtureId}> matchId=<${matchId}> match=<${JSON.stringify(match)}>`)

  if (isNaN(matchId)) {
    throwError('Invalid matchId', 400)
  }

  if (!match.time) {
    throwError('No time found', 400)
  }

  if (!match.homeTeam) {
    throwError('No homeTeam found', 400)
  }

  if (!match.awayTeam) {
    throwError('No awayTeam found', 400)
  }

  const competition = exports.seasonsSeasonIdCompetitionsCompetitionIdGet(seasonId, competitionId)
  const homeTeam = match.homeTeam
  const awayTeam = match.awayTeam
  const refTeam = match.refTeam

  let homeTeamId
  let awayTeamId
  let refTeamId

  try {
    homeTeamId = getTeamIdFromName(competition, homeTeam)
  } catch (err) {
    throwError('Home team doesn\'t exist: ' + homeTeam, 400)
  }

  try {
    awayTeamId = getTeamIdFromName(competition, awayTeam)
  } catch (err) {
    throwError('Away team doesn\'t exist: ' + awayTeam, 400)
  }

  if (refTeam) {
    try {
      refTeamId = getTeamIdFromName(competition, refTeam)
    } catch (err) {
      throwError('Reffing team doesn\'t exist: ' + awayTeam, 400)
    }
  }

  let matchToReplace
  const fixture = exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdGet(seasonId, competitionId, fixtureId)
  const matchCount = fixture.matches.length
  for (let i = 0; i < matchCount; i++) {
    // Remember the highest id we see
    if (fixture.matches[i].id === matchId) {
      matchToReplace = fixture.matches[i]
      break
    }
  }

  if (matchToReplace) {
    matchToReplace.time = match.time
    matchToReplace.homeTeam = homeTeamId
    matchToReplace.awayTeam = awayTeamId
    if (refTeamId) {
      matchToReplace.refTeam = refTeamId
    } else {
      delete matchToReplace.refTeam
    }

    dataFile.writeData(seasonsData)
    return matchToReplace
  }
  throwError('Match not found', 404)
}

/**
 * Delete a specific match
 *
 * @param {number} seasonId The id of the season
 * @param {number} competitionId The id of the competition
 * @param {number} fixtureId The id of the fixture
 * @param {number} matchId id for the match
 **/
exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdDelete = function (seasonId, competitionId, fixtureId, matchId) {
  log.debug(`seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdDelete(seasonId, competitionId, fixtureId, matchId) seasonId=<${seasonId}> competitionId=<${competitionId}> fixtureId=<${fixtureId}> matchId=<${matchId}>`)

  if (isNaN(matchId)) {
    throwError('Invalid matchId', 400)
  }

  const matches = exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesGet(seasonId, competitionId, fixtureId)
  const matchCount = matches.length
  for (let i = 0; i < matchCount; i++) {
    if (matches[i].id === matchId) {
      matches.splice(i, 1)
      dataFile.writeData(seasonsData)
      return
    }
  }
}
