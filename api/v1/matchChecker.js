'use strict'

const logging = require('../../lib/logging.js')
const log = logging.getLogger('matchChecker')
const seasonsData = require('./seasonsData.js')

/**
 * anonymous function - description
 *
 * @param  {type} fromDate description
 * @return {type}          description
 */
exports.findNextFixtureAfterDate = function (fromDate) {
  log.info(`Checking for the first match after ${fromDate}`)
  const seasons = seasonsData.seasonsGet()
  let bestFixtureBundleSoFar
  let bestDateSoFar
  seasons.forEach(season => {
    season.competitions.forEach(competition => {
      competition.fixtures.forEach(fixture => {
        const fixtureDate = new Date(fixture.date + ' 4:01')
        if (fixtureDate > fromDate && (!bestDateSoFar || fixtureDate < bestDateSoFar)) {
          bestDateSoFar = fixtureDate
          bestFixtureBundleSoFar = {
            seasonName: season.name,
            teams: competition.teams,
            fixture: fixture
          }
        }
      })
    })
  })

  if (!bestFixtureBundleSoFar) {
    return
  }

  const fixtureBundle = {
    seasonName: bestFixtureBundleSoFar.seasonName,
    contacts: getContacts(bestFixtureBundleSoFar.fixture, bestFixtureBundleSoFar.teams),
    matches: getMatchSummary(bestFixtureBundleSoFar.fixture, bestFixtureBundleSoFar.teams),
    fixture: bestFixtureBundleSoFar.fixture
  }

  return fixtureBundle
}

/**
 * Return a list of contact emails for a set of matches
 *
 * @param {Array} fixture a fixture containing an array of matches
 * @param {Array} teams an array of teams
 *
 * @returns {String} a string containing a list of email addresses
 **/
function getContacts (fixture, teams) {
  var contactList = {}
  var returnList = ''

  fixture.matches.forEach(match => {
    getTeamFromId(teams, match.homeTeam).contacts.forEach(contact => {
      contactList[contact.email] = true
    })

    getTeamFromId(teams, match.awayTeam).contacts.forEach(contact => {
      contactList[contact.email] = true
    })

    if (match.refTeam) {
      getTeamFromId(teams, match.refTeam).contacts.forEach(contact => {
        contactList[contact.email] = true
      })
    }
  })

  Object.keys(contactList).forEach(email => {
    returnList = returnList + email + ','
  })

  return returnList.substring(0, returnList.length - 1)
}

/**
 * Returns a summary text for the match schedule
 *
 * @param {Array} fixture a fixture containing an array of matches
 * @param {Array} teams an array of teams
 *
 * @returns {String} a string containing a summary of the match schedule
 **/
function getMatchSummary (fixture, teams) {
  var textSummary = fixture.date + ' at ' + fixture.venue + '\n'
  fixture.matches.forEach(match => {
    const homeTeam = getTeamFromId(teams, match.homeTeam)
    const awayTeam = getTeamFromId(teams, match.awayTeam)
    textSummary += match.time + ' '
    textSummary += homeTeam.name
    textSummary += ' v '
    textSummary += awayTeam.name

    let refTeam
    if (match.refTeam) {
      refTeam = getTeamFromId(teams, match.refTeam)
      textSummary += ' ('
      textSummary += refTeam.name
      textSummary += ' ref)'
    }
    textSummary += '\n'
  })

  if (fixture.adjudicator) {
    textSummary += 'Match Adjudicator: ' + fixture.adjudicator + '\n'
  }

  return textSummary
}

/**
 * Scans a list of teams and returns the first team that matches the requested id.
 *
 * @param {Array} teams the team data
 * @param {number} id the team id to scan for
 *
 * @returns {Object} the first team with the requested id
 **/
function getTeamFromId (teams, id) {
  return teams.filter(team => team.id === id)[0]
}
