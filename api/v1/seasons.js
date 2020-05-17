'use strict'

const logging = require('../../lib/logging.js')
const log = logging.getLogger('api/seasons')
const data = require('./data.js')

exports.seasonsGet = function (req, res, next) {
  log.info('GET /v1/seasons')

  try {
    res.setHeader('Content-Type', 'application/json')
    res.json(data.seasonsGet())
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsPost = function (req, res, next) {
  log.info(`POST /v1/seasons ${req.body.name}`)

  try {
    const seasonId = data.seasonsPost(req.body.name)
    res.setHeader('Content-Type', 'application/json')
    res.json(seasonId)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}`)

  try {
    const season = data.seasonsSeasonIdGet(parseInt(req.params.seasonId))
    res.setHeader('Content-Type', 'application/json')
    res.json(season)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdPut = function (req, res, next) {
  log.info(`PUT /v1/seasons/${parseInt(req.params.seasonId)} ${req.body.name}`)

  try {
    const season = data.seasonsSeasonIdPut(parseInt(req.params.seasonId), req.body.name)
    res.setHeader('Content-Type', 'application/json')
    res.json(season)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdDelete = function (req, res, next) {
  log.info(`DELETE /v1/seasons/${parseInt(req.params.seasonId)}`)

  try {
    data.seasonsSeasonIdDelete(parseInt(req.params.seasonId))
    res.end()
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}/competitions`)

  try {
    const competitions = data.seasonsSeasonIdCompetitionsGet(parseInt(req.params.seasonId))
    res.setHeader('Content-Type', 'application/json')
    res.json(competitions)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsPost = function (req, res, next) {
  log.info(`POST /v1/seasons/${parseInt(req.params.seasonId)}/competitions ${req.body.name}`)

  try {
    const competitionId = data.seasonsSeasonIdCompetitionsPost(parseInt(req.params.seasonId), req.body.name)
    res.setHeader('Content-Type', 'application/json')
    res.json(competitionId)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}`)

  try {
    const competition = data.seasonsSeasonIdCompetitionsCompetitionIdGet(parseInt(req.params.seasonId), parseInt(req.params.competitionId))
    res.setHeader('Content-Type', 'application/json')
    res.json(competition)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdPut = function (req, res, next) {
  log.info(`PUT /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)} ${req.body.name}`)

  try {
    const competition = data.seasonsSeasonIdCompetitionsCompetitionIdPut(parseInt(req.params.seasonId), parseInt(req.params.competitionId), req.body.name)
    res.setHeader('Content-Type', 'application/json')
    res.json(competition)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdDelete = function (req, res, next) {
  log.info(`DELETE /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}`)

  try {
    data.seasonsSeasonIdCompetitionsCompetitionIdDelete(parseInt(req.params.seasonId), parseInt(req.params.competitionId))
    res.end()
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/teams`)

  try {
    const teams = data.seasonsSeasonIdCompetitionsCompetitionIdTeamsGet(parseInt(req.params.seasonId), parseInt(req.params.competitionId))
    res.setHeader('Content-Type', 'application/json')
    res.json(teams)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsPost = function (req, res, next) {
  log.info(`POST /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/teams ${req.body.name}`)

  try {
    const teamId = data.seasonsSeasonIdCompetitionsCompetitionIdTeamsPost(parseInt(req.params.seasonId), parseInt(req.params.competitionId), req.body.name)
    res.setHeader('Content-Type', 'application/json')
    res.json(teamId)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/teams/${parseInt(req.params.teamId)}`)

  try {
    const team = data.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdGet(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.teamId))
    res.setHeader('Content-Type', 'application/json')
    res.json(team)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdPut = function (req, res, next) {
  log.info(`PUT /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/teams/${parseInt(req.params.teamId)} ${req.body.name}`)

  try {
    const team = data.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdPut(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.teamId), req.body.name)
    res.setHeader('Content-Type', 'application/json')
    res.json(team)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdDelete = function (req, res, next) {
  log.info(`DELETE /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/teams/${parseInt(req.params.teamId)}`)

  try {
    data.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdDelete(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.teamId))
    res.end()
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/teams/${parseInt(req.params.teamId)}/contacts`)

  try {
    const contacts = data.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsGet(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.teamId))
    res.setHeader('Content-Type', 'application/json')
    res.json(contacts)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsPost = function (req, res, next) {
  log.info(`POST /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/teams/${parseInt(req.params.teamId)}/contacts ${req.body.email}`)

  try {
    const contactId = data.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsPost(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.teamId), req.body.email)
    res.setHeader('Content-Type', 'application/json')
    res.json(contactId)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/teams/${parseInt(req.params.teamId)}/contacts/${parseInt(req.params.contactId)}`)

  try {
    const contact = data.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdGet(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.teamId), parseInt(req.params.contactId))
    res.setHeader('Content-Type', 'application/json')
    res.json(contact)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdPut = function (req, res, next) {
  log.info(`PUT /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/teams/${parseInt(req.params.teamId)}/contacts/${parseInt(req.params.contactId)} ${req.body.email}`)

  try {
    const contact = data.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdPut(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.teamId), parseInt(req.params.contactId), req.body.email)
    res.setHeader('Content-Type', 'application/json')
    res.json(contact)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdDelete = function (req, res, next) {
  log.info(`DELETE /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/teams/${parseInt(req.params.teamId)}/contacts/${parseInt(req.params.contactId)}`)

  try {
    data.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdDelete(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.teamId), parseInt(req.params.contactId))
    res.end()
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/fixtures`)

  try {
    const fixtures = data.seasonsSeasonIdCompetitionsCompetitionIdFixturesGet(parseInt(req.params.seasonId), parseInt(req.params.competitionId))
    res.setHeader('Content-Type', 'application/json')
    res.json(fixtures)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesPost = function (req, res, next) {
  log.info(`POST /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/fixtures ${JSON.stringify(req.body)}`)

  res.setHeader('Content-Type', 'application/json')
  try {
    const fixtureId = data.seasonsSeasonIdCompetitionsCompetitionIdFixturesPost(parseInt(req.params.seasonId), parseInt(req.params.competitionId), req.body)
    res.json(fixtureId)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/fixtures/${parseInt(req.params.fixtureId)}`)

  try {
    const fixture = data.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdGet(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.fixtureId))
    res.setHeader('Content-Type', 'application/json')
    res.json(fixture)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdPut = function (req, res, next) {
  log.info(`PUT /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/fixtures/${parseInt(req.params.fixtureId)} ${JSON.stringify(req.body)}`)

  try {
    const fixture = data.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdPut(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.fixtureId), req.body)
    res.setHeader('Content-Type', 'application/json')
    res.json(fixture)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdDelete = function (req, res, next) {
  log.info(`DELETE /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/fixtures/${parseInt(req.params.fixtureId)}`)

  try {
    data.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdDelete(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.fixtureId))
    res.end()
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/fixtures/${parseInt(req.params.fixtureId)}/matches`)

  try {
    const matches = data.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesGet(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.fixtureId))
    res.setHeader('Content-Type', 'application/json')
    res.json(matches)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesPost = function (req, res, next) {
  log.info(`POST /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/fixtures/${parseInt(req.params.fixtureId)}/matches ${JSON.stringify(req.body)}`)

  try {
    const matchId = data.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesPost(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.fixtureId), req.body)
    res.setHeader('Content-Type', 'application/json')
    res.json(matchId)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdGet = function (req, res, next) {
  log.info(`GET /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/fixtures/${parseInt(req.params.fixtureId)}/matches/${parseInt(req.params.matchId)}`)

  try {
    const match = data.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdGet(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.fixtureId), parseInt(req.params.matchId))
    res.setHeader('Content-Type', 'application/json')
    res.json(match)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdPut = function (req, res, next) {
  log.info(`PUT /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/fixtures/${parseInt(req.params.fixtureId)}/matches/${parseInt(req.params.matchId)} ${JSON.stringify(req.body)}`)

  try {
    const match = data.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdPut(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.fixtureId), parseInt(req.params.matchId), req.body)
    res.setHeader('Content-Type', 'application/json')
    res.json(match)
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}

exports.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdDelete = function (req, res, next) {
  log.info(`DELETE /v1/seasons/${parseInt(req.params.seasonId)}/competitions/${parseInt(req.params.competitionId)}/fixtures/${parseInt(req.params.fixtureId)}/matches/${parseInt(req.params.matchId)}`)

  try {
    data.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdDelete(parseInt(req.params.seasonId), parseInt(req.params.competitionId), parseInt(req.params.fixtureId), parseInt(req.params.matchId))
    res.end()
  } catch (err) {
    log.warn(err.message)
    res.status(err.status).end()
  }
}
