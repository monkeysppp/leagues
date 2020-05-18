import axios from 'axios'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

class SeasonsClient {
async seasonsGet () {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token')
    }
    return axios.get('/api/v1/seasons', { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsPost (seasonName) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.post('/api/v1/seasons', { name: seasonName }, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdPut (seasonId, seasonName) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.put(`/api/v1/seasons/${seasonId}`, { name: seasonName }, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdDelete (seasonId) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token')
    }
    return axios.delete(`/api/v1/seasons/${seasonId}`, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsPost (seasonId, competitionName) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.post(`/api/v1/seasons/${seasonId}/competitions`, { name: competitionName }, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdPut (seasonId, competitionId, competitionName) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.put(`/api/v1/seasons/${seasonId}/competitions/${competitionId}`, { name: competitionName }, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdDelete (seasonId, competitionId) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token')
    }
    return axios.delete(`/api/v1/seasons/${seasonId}/competitions/${competitionId}`, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdTeamsPost (seasonId, competitionId, teamName) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.post(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/teams`, { name: teamName }, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdPut (seasonId, competitionId, teamId, teamName) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.put(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/teams/${teamId}`, { name: teamName }, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdDelete (seasonId, competitionId, teamId) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token')
    }
    return axios.delete(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/teams/${teamId}`, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsPost (seasonId, competitionId, teamId, contactAddress) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.post(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/teams/${teamId}/contacts`, { email: contactAddress }, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdPut (seasonId, competitionId, teamId, contactId, contactAddress) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.put(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/teams/${teamId}/contacts/${contactId}`, { email: contactAddress }, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdDelete (seasonId, competitionId, teamId, contactId) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token')
    }
    return axios.delete(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/teams/${teamId}/contacts/${contactId}`, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdFixturesPost (seasonId, competitionId, fixture) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.post(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/fixtures`, fixture, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdPut (seasonId, competitionId, fixtureId, fixture) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.put(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/fixtures/${fixtureId}`, fixture, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdDelete (seasonId, competitionId, fixtureId) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token')
    }
    return axios.delete(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/fixtures/${fixtureId}`, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesPost (seasonId, competitionId, fixtureId, match) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.post(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/fixtures/${fixtureId}/matches`, match, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdPut (seasonId, competitionId, fixtureId, matchId, match) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token'),
      'content-type': 'application/json'
    }
    return axios.put(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/fixtures/${fixtureId}/matches/${matchId}`, match, { headers: headers })
      .then(res => {
        return res.data
      })
  }

async seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdDelete (seasonId, competitionId, fixtureId, matchId) {
    const headers = {
      'x-csrf-token': cookies.get('X-CSRF-Token')
    }
    return axios.delete(`/api/v1/seasons/${seasonId}/competitions/${competitionId}/fixtures/${fixtureId}/matches/${matchId}`, { headers: headers })
      .then(res => {
        return res.data
      })
  }
}

export default SeasonsClient
