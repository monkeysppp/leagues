import React from 'react'
import { Undo, HourglassEmpty, SaveAlt } from '@material-ui/icons'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { withSnackbar  } from 'notistack'

import League from'./dataviews/League.js'
import ProcessCSV from './populate/ProcessCSV.js'
import Colours from './Colours.js'

const editConfig = {
  seasons: false,
  competitions: false,
  fixtures: false,
  teams: false,
  contacts: false
}

class PopulateLeagues extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataProcessed: false,
      season: []
    }

    this.leaguesAPIClient = props.utils.leaguesAPIClient
    this.enqueueSnackbar = props.enqueueSnackbar
    this.utils = {
      leaguesAPIClient: {
        seasonsGet: () => {
          return Promise.resolve(this.state.season)
        }
      },
      enqueueSnackbar: () => {},
      refreshData: () => {}
    }

    this.analyseData = this.analyseData.bind(this)
    this.reset = this.reset.bind(this)
    this.uploadData = this.uploadData.bind(this)
  }

  reset () {
    document.getElementById('season-csv').value = ''
    document.getElementById('season-name').value = ''
    this.setState({ dataProcessed: false })
  }

  analyseData () {
    const csvData = ProcessCSV.cleanCSV(document.getElementById('season-csv').value)
    const seasonName = document.getElementById('season-name').value
    let season = [
      {
        id: 1,
        name: seasonName,
        competitions: ProcessCSV.getCompetitions(csvData)
      }
    ]

    season[0].competitions.forEach(competition => {
      competition.teams = ProcessCSV.getTeams(csvData, competition)
      competition.fixtures = ProcessCSV.getFixtures(csvData, competition)
    })

    this.setState({ dataProcessed: true, season: season })
  }

  async uploadData () {
    try {
      const seasonRes = await this.leaguesAPIClient.seasonsPost(this.state.season[0].name)
      for (let i = 0; i < this.state.season[0].competitions.length; i++) {
        const competition = this.state.season[0].competitions
        const teamMap = {}
        const competitionRes = await this.leaguesAPIClient.seasonsSeasonIdCompetitionsPost(seasonRes.id, competition.name)
        for (let i = 0; i < competition.teams.length; i++) {
          const team = competition.teams[i]
          teamMap[`id-${team.id}`] = team
          await this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsPost(seasonRes.id, competitionRes.id, team.name)
        }
        for (let i = 0; i < competition.fixtures.length; i++) {
          const fixture = competition.fixtures[i]
          const postFixture = {
            date: fixture.date,
            venue: fixture.venue,
            adjudicator: fixture.adjudicator,
          }
          const fixtureRes = await this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdFixturesPost(seasonRes.id, competitionRes.id, postFixture)
          for (let i = 0; i < fixture.matches.length; i++) {
            const match = fixture.matches[i]
            const postMatch = {
              time: match.time,
              homeTeam: teamMap[`id-${match.homeTeam}`].name,
              awayTeam: teamMap[`id-${match.awayTeam}`].name,
              refTeam: teamMap[`id-${match.refTeam}`].name
            }
            await this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesPost(seasonRes.id, competitionRes.id, fixtureRes.id, postMatch)
          }
        }
      }
      this.enqueueSnackbar(`Season ${this.state.season[0].name} saved`, { variant: 'success' })
      document.getElementById('season-csv').value = ''
      document.getElementById('season-name').value = ''
      this.setState({ dataProcessed: false, season: [] })
    } catch (e) {
      this.enqueueSnackbar('Failed to save season data', { variant: 'error' })
    }
  }

  render () {
    let analyseButton = <Tooltip title="Analyse csv data"><Button variant="contained" style={Colours.populateLeague.iconStyle} startIcon={<HourglassEmpty />} onClick={this.analyseData}>Analyse</Button></Tooltip>
    let processedData = <div></div>
    if (this.state.dataProcessed) {
      analyseButton = <Tooltip title="Clear processed data"><Button variant="contained" color="secondary" startIcon={<Undo />} onClick={this.reset}>Clear</Button></Tooltip>
      processedData = <div>
        <League editConfig={editConfig} utils={this.utils} />
        <br/>
        <Tooltip title="Commit season data"><Button variant="contained" style={Colours.populateLeague.iconStyle} startIcon={<SaveAlt />} onClick={this.uploadData}>Commit</Button></Tooltip>
      </div>
    }
    return (
      <div className='mainBody'>
        <center>
          <h1>Populate Leagues</h1>
        </center>
        <p>Paste the CSV for your season here:</p>
        <br/>
        <TextField id="season-csv" label="Season CSV" multiline rows={15} fullWidth variant="outlined" />
        <br/><br/>
        <TextField id="season-name" label="Season Name" variant="outlined" />
        <br/><br/>
        {analyseButton}
        <br/><br/>
        {processedData}
        <br/><br/>
      </div>
    )
  }

}

export default withSnackbar(PopulateLeagues)
