import React from 'react'
import { AddCircleOutlined, DeleteOutlined, EditOutlined } from '@material-ui/icons'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/styles'
import { withSnackbar  } from 'notistack'

import Fixture from'./Fixture.js'
import Team from'./Team.js'

const ExpansionPanelFixtureWrapper = withStyles(() => ({
  root: {
    border: '1px solid rgba(120, 0, 0, .125)',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {}
}))(MuiExpansionPanel)

const ExpansionPanelSummaryFixtureWrapper = withStyles(() => ({
  root: {
    border: '1px solid rgba(120, 0, 0, .125)',
    background: 'rgba(255, 101, 180, 0.05)',
    color: '#4b4b4b',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {}
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetailsFixtureWrapper = withStyles(() => ({
  root: {
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

const ExpansionPanelFixture = withStyles(() => ({
  root: {
    border: '1px solid rgba(120, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {}
}))(MuiExpansionPanel)

const ExpansionPanelSummaryFixture = withStyles(() => ({
  root: {
    border: '1px solid rgba(120, 0, 0, .125)',
    background: 'rgba(255, 101, 180, 0.05)',
    color: '#4b4b4b',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {}
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetailsFixture = withStyles(() => ({
  root: {
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

const ExpansionPanelTeamWrapper = withStyles(() => ({
  root: {
    border: '1px solid rgba(120, 0, 0, .125)',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {}
}))(MuiExpansionPanel)

const ExpansionPanelSummaryTeamWrapper = withStyles(() => ({
  root: {
    border: '1px solid rgba(120, 0, 0, .125)',
    background: 'rgba(137, 255, 244, 0.05)',
    color: '#4b4b4b',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {}
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetailsTeamWrapper = withStyles(() => ({
  root: {
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

const ExpansionPanelTeam = withStyles(() => ({
  root: {
    border: '1px solid rgba(120, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {}
}))(MuiExpansionPanel)

const ExpansionPanelSummaryTeam = withStyles(() => ({
  root: {
    border: '1px solid rgba(120, 0, 0, .125)',
    background: 'rgba(137, 255, 244, 0.05)',
    color: '#4b4b4b',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {}
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetailsTeam = withStyles(() => ({
  root: {
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

class Competition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fixtureEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('fixtures')) ? this.props.editConfig.fixtures : true,
      teamEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('teams')) ? this.props.editConfig.teams : true,
      addFixtureDialogOpen: false,
      addFixtureDialogFixture: {},
      addTeamDialogOpen: false,
      addTeamDialogTeamName: ''
    }
    this.utils = props.utils
    this.seasonsClient = props.utils.seasonsClient
    this.enqueueSnackbar = props.utils.enqueueSnackbar
    this.refreshData = props.utils.refreshData

    this.addTeamDialogClose = this.addTeamDialogClose.bind(this)
    this.addTeamDialogOpen = this.addTeamDialogOpen.bind(this)
    this.addTeamDialogAdd = this.addTeamDialogAdd.bind(this)
    this.addTeamDialogTeamNameChange = this.addTeamDialogTeamNameChange.bind(this)
    this.deleteTeam = this.deleteTeam.bind(this)

    this.addFixtureDialogClose = this.addFixtureDialogClose.bind(this)
    this.addFixtureDialogOpen = this.addFixtureDialogOpen.bind(this)
    this.addFixtureDialogAdd = this.addFixtureDialogAdd.bind(this)
    this.addFixtureDialogFixtureNameChange = this.addFixtureDialogFixtureNameChange.bind(this)
    this.deleteFixture = this.deleteFixture.bind(this)
  }

  addTeamDialogAdd () {
    this.addTeamDialogClose()
    const teamName = this.state.addTeamDialogTeamName
    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsPost(this.props.seasonId, this.props.competition.id, teamName)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Team ' + teamName + ' added', { variant: 'success' });
        },
        (err) => {
          this.enqueueSnackbar('Failed to add Team ' + teamName, { variant: 'error' });
        })
  }

  addTeamDialogOpen () {
    this.setState({ addTeamDialogOpen: true })
  }

  addTeamDialogClose () {
    this.setState({ addTeamDialogOpen: false })
  }

  addTeamDialogTeamNameChange (e) {
    this.setState({ addTeamDialogTeamName: e.target.value })
  }

  deleteTeam (team) {
    this.seasonsClient.seasonsSeasonIdTeamsTeamIdDelete(this.props.seasonId, this.props.competition.id, team.id)
      .then(
        () => {
          this.enqueueSnackbar('Team ' + team.name + ' deleted', { variant: 'success' })
          this.refreshData()
        },
        (err) => {
          this.enqueueSnackbar('Failed to delete Season ' + team.name, { variant: 'error' })
        })
  }

  addFixtureDialogAdd () {
    // this.addFixtureDialogClose()
    // const fixtureName = this.state.addFixtureDialogFixtureName
    // this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdFixturesPost(this.props.seasonId, this.props.competition.id, fixtureName)
    //   .then(
    //     () => {
    //       this.refreshData()
    //       this.enqueueSnackbar('Fixture ' + fixtureName + ' added', { variant: 'success' });
    //     },
    //     (err) => {
    //       this.enqueueSnackbar('Failed to add Fixture ' + fixtureName, { variant: 'error' });
    //     })
  }

  addFixtureDialogOpen () {
    this.setState({ addFixtureDialogOpen: true })
  }

  addFixtureDialogClose () {
    this.setState({ addFixtureDialogOpen: false })
  }

  addFixtureDialogFixtureNameChange (e) {
    // this.setState({ addFixtureDialogFixtureName: e.target.value })
  }

  deleteFixture (fixture) {
    // this.seasonsClient.seasonsSeasonIdFixturesFixtureIdDelete(this.props.seasonId, this.props.competition.id, fixture.id)
    //   .then(
    //     () => {
    //       this.enqueueSnackbar('Fixture ' + fixture.name + ' deleted', { variant: 'success' })
    //       this.refreshData()
    //     },
    //     (err) => {
    //       this.enqueueSnackbar('Failed to delete Season ' + fixture.name, { variant: 'error' })
    //     })
  }

  render () {
    const fixtures = []
    const teams = []

    this.props.competition.fixtures.forEach((fixture) => {
      let body
      if (this.state.fixtureEditable) {
        body = <div>
          <span>{fixture.date}</span>
          <Tooltip title="Edit Fixture"><IconButton aria-label="Edit fixture" component="span"><EditOutlined /></IconButton></Tooltip>
          <Tooltip title="Delete Fixture"><IconButton aria-label="Delete fixture" component="span"><DeleteOutlined /></IconButton></Tooltip>
        </div>
      } else {
        body = <span>{fixture.date}</span>
      }

      fixtures.push(<ExpansionPanelFixture key={fixture.id}>
        <ExpansionPanelSummaryFixture expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          {body}
        </ExpansionPanelSummaryFixture>
        <ExpansionPanelDetailsFixture>
          <Fixture editConfig={this.props.editConfig} seasonId={this.props.seasonId} competitionId={this.props.competition.id} fixture={fixture} teams={this.props.competition.teams} utils={this.utils} key={fixture.id}/>
        </ExpansionPanelDetailsFixture>
      </ExpansionPanelFixture>)
    })

    this.props.competition.teams.forEach((team) => {
      let body
      if (this.state.teamEditable) {
        body = <div>
          <span>{team.name}</span>
          <Tooltip title="Edit Team"><IconButton aria-label="Edit team" component="span"><EditOutlined /></IconButton></Tooltip>
          <Tooltip title="Delete Team"><IconButton aria-label="Delete team" component="span"><DeleteOutlined /></IconButton></Tooltip>
        </div>
      } else {
        body = <span>{team.name}</span>
      }
      teams.push(<ExpansionPanelTeam key={team.id}>
        <ExpansionPanelSummaryTeam expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          {body}
        </ExpansionPanelSummaryTeam>
        <ExpansionPanelDetailsTeam>
          <Team editConfig={this.props.editConfig} seasonId={this.props.seasonId} competitionId={this.props.competition.id} team={team} utils={this.utils} key={team.id}/>
        </ExpansionPanelDetailsTeam>
      </ExpansionPanelTeam>)
    })

    let fixturePanel
    if (this.state.fixtureEditable) {
      fixturePanel = <ExpansionPanelFixtureWrapper key='fixtures'>
        <ExpansionPanelSummaryFixtureWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          <span>Fixtures</span>
        </ExpansionPanelSummaryFixtureWrapper>
        <ExpansionPanelDetailsFixtureWrapper>
          <div>
          <Tooltip title="Add new fixture"><Button style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addFixtureDialogOpen}>Add Fixture</Button></Tooltip>
            {fixtures}
          </div>
          <Dialog open={this.state.addFixtureDialogOpen} onClose={this.addFixtureDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="add-season-dialog-title">Add Fixture</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the name for the new Fixture</DialogContentText>
              <TextField autoFocus margin="dense" id="add-season-seasonName" onChange={this.addFixtureDialogFixtureNameChange} onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.addFixtureDialogAdd()}} label="Fixture name" type="text" fullWidth/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.addFixtureDialogClose} color="primary">Cancel</Button>
              <Button onClick={this.addFixtureDialogAdd} color="primary">Add</Button>
            </DialogActions>
          </Dialog>
        </ExpansionPanelDetailsFixtureWrapper>
      </ExpansionPanelFixtureWrapper>
    } else {
      fixturePanel = <ExpansionPanelFixtureWrapper>
      <ExpansionPanelSummaryFixtureWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
        <span>Fixtures</span>
      </ExpansionPanelSummaryFixtureWrapper>
      <ExpansionPanelDetailsFixtureWrapper>
        <div>
          {fixtures}
        </div>
      </ExpansionPanelDetailsFixtureWrapper>
    </ExpansionPanelFixtureWrapper>
    }

    let teamPanel
    if (this.state.teamEditable) {
      teamPanel = <ExpansionPanelTeamWrapper key='teams'>
        <ExpansionPanelSummaryTeamWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          <span>Teams</span>
        </ExpansionPanelSummaryTeamWrapper>
        <ExpansionPanelDetailsTeamWrapper>
          <div>
          <Tooltip title="Add new team"><Button style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addTeamDialogOpen}>Add Team</Button></Tooltip>
            {teams}
          </div>
          <Dialog open={this.state.addTeamDialogOpen} onClose={this.addTeamDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="add-season-dialog-title">Add Team</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the name for the new Team</DialogContentText>
              <TextField autoFocus margin="dense" id="add-season-seasonName" onChange={this.addTeamDialogTeamNameChange} onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.addTeamDialogAdd()}} label="Team name" type="text" fullWidth/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.addTeamDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.addTeamDialogAdd} variant="contained" color="primary">Add</Button>
            </DialogActions>
          </Dialog>
        </ExpansionPanelDetailsTeamWrapper>
      </ExpansionPanelTeamWrapper>
    } else {
      teamPanel = <ExpansionPanelTeamWrapper key='teams'>
        <ExpansionPanelSummaryTeamWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          <span>Teams</span>
        </ExpansionPanelSummaryTeamWrapper>
        <ExpansionPanelDetailsTeamWrapper>
          <div>
            {teams}
          </div>
        </ExpansionPanelDetailsTeamWrapper>
      </ExpansionPanelTeamWrapper>
    }

    return (
      <div>
        {fixturePanel}
        <br/>
        {teamPanel}
      </div>
    )
  }
}

export default withSnackbar(Competition)
