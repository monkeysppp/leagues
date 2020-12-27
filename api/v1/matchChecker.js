/** @module api/v1/matchChecker */

'use strict'

const logging = require('../../lib/logging.js')
const log = logging.getLogger('matchChecker')
const seasonsData = require('./seasonsData.js')

/**
 * findNextFixtureAfterDate - Find the next fixture after a given date and return an object ontaining the
 * fixture, the season name, the contacts for the teams with responsibilities at that fixture and a
 * summary of the match schedule.
 *
 * @param  {Date} fromDate The date to search for fistures after

 * @return {object} The fixture information
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
  const contactList = {}
  let returnList = ''

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
  let textSummary = fixture.date + ' at ' + fixture.venue + '\n'
  fixture.matches.forEach(match => {
    textSummary += `${match.time} ${getTeamFromId(teams, match.homeTeam).name} v ${getTeamFromId(teams, match.awayTeam).name}`

    if (match.refTeam) {
      textSummary += ` (${getTeamFromId(teams, match.refTeam).name} ref)`
    }
    textSummary += '\n'
  })

  if (fixture.adjudicator) {
    textSummary += `Match Adjudicator: ${getTeamFromId(teams, fixture.adjudicator).name}\n`
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
