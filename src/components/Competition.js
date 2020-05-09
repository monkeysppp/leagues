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
import Matches from'./Matches.js'
import Colours from '../Colours.js'

const ExpansionPanelFixtureWrapper = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.fixtures.border,
    margin: '15px 0',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '15px 0',
    },
  },
  expanded: {}
}))(MuiExpansionPanel)

const ExpansionPanelSummaryFixtureWrapper = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.fixtures.heading.border,
    background: Colours.fixtures.heading.background,
    color: Colours.fixtures.heading.text,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  content: {
    margin: '0',
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {
    margin: '2px',
  },
  expandIcon: {
    color: Colours.fixtures.heading.text
  }
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetailsFixtureWrapper = withStyles(() => ({
  root: {
    background: Colours.fixtures.body.background,
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

const ExpansionPanelFixture = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.fixtures.border,
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
    border: '1px solid ' + Colours.fixtures.heading.border,
    background: Colours.fixtures.heading.background,
    color: Colours.fixtures.heading.text,
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
  content: {
    margin: '0',
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {
    margin: '2px',
  },
  expandIcon: {
    color: Colours.fixtures.heading.text
  }
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetailsFixture = withStyles(() => ({
  root: {
    background: Colours.matches.background,
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

const ExpansionPanelTeamWrapper = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.teams.border,
    margin: '15px 0',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '15px 0',
    },
  },
  expanded: {}
}))(MuiExpansionPanel)

const ExpansionPanelSummaryTeamWrapper = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.teams.heading.border,
    background: Colours.teams.heading.background,
    color: Colours.teams.heading.text,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  content: {
    margin: '0',
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {
    margin: '2px',
  },
  expandIcon: {
    color: Colours.teams.heading.text
  }
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetailsTeamWrapper = withStyles(() => ({
  root: {
    background: Colours.teams.body.background,
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

const ExpansionPanelTeam = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.teams.border,
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
    border: '1px solid ' + Colours.teams.heading.border,
    background: Colours.teams.heading.background,
    color: Colours.teams.heading.text,
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
  content: {
    margin: '0',
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {
    margin: '2px',
  },
  expandIcon: {
    color: Colours.teams.heading.text
  }
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetailsTeam = withStyles(() => ({
  root: {
    background: Colours.contacts.background,
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

const ExpansionPanelMatchWrapper = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.matches.border,
    margin: '15px 0',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '15px 0',
    },
  },
  expanded: {}
}))(MuiExpansionPanel)

const ExpansionPanelSummaryMatchWrapper = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.matches.heading.border,
    background: Colours.matches.heading.background,
    color: Colours.matches.heading.text,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  content: {
    margin: '0',
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {
    margin: '2px',
  },
  expandIcon: {
    color: Colours.matches.heading.text
  }
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetailsMatchWrapper = withStyles(() => ({
  root: {
    background: Colours.matches.body.background,
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

const ExpansionPanelMatch = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.matches.border,
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

const ExpansionPanelSummaryMatch = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.matches.heading.border,
    background: Colours.matches.heading.background,
    color: Colours.matches.heading.text,
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
  content: {
    margin: '0',
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {
    margin: '2px',
  },
  expandIcon: {
    color: Colours.matches.heading.text
  }
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetailsMatch = withStyles(() => ({
  root: {
    background: Colours.matches.background,
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

class Competition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fixtureEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('fixtures')) ? this.props.editConfig.fixtures : true,
      teamEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('teams')) ? this.props.editConfig.teams : true,
      fixturesDrawn: (this.props.drawConfig && this.props.drawConfig.competitions && this.props.drawConfig.competitions.hasOwnProperty('fixtures')) ? this.props.drawConfig.competitions.fixtures : true,
      teamsDrawn: (this.props.drawConfig && this.props.drawConfig.competitions && this.props.drawConfig.competitions.hasOwnProperty('teams')) ? this.props.drawConfig.competitions.teams : true,
      matchesDrawn: (this.props.drawConfig && this.props.drawConfig.competitions && this.props.drawConfig.competitions.hasOwnProperty('matches')) ? this.props.drawConfig.competitions.matches : false,
      addTeamDialogOpen: false,
      addTeamDialogTeamName: '',
      editTeamDialogOpen: false,
      editTeamDialogTeam: {},
      deleteTeamDialogOpen: false,
      deleteTeamDialogTeam: {},
      addFixtureDialogOpen: false,
      addFixtureDialogFixture: {}
    }
    this.utils = props.utils
    this.seasonsClient = props.utils.seasonsClient
    this.enqueueSnackbar = props.utils.enqueueSnackbar
    this.refreshData = props.utils.refreshData

    this.addTeamDialogOpen = this.addTeamDialogOpen.bind(this)
    this.addTeamDialogClose = this.addTeamDialogClose.bind(this)
    this.addTeamDialogAdd = this.addTeamDialogAdd.bind(this)
    this.addTeamDialogTeamNameChange = this.addTeamDialogTeamNameChange.bind(this)
    this.editTeamDialogOpen = this.editTeamDialogOpen.bind(this)
    this.editTeamDialogClose = this.editTeamDialogClose.bind(this)
    this.editTeamDialogEdit = this.editTeamDialogEdit.bind(this)
    this.editTeamDialogTeamNameChange = this.editTeamDialogTeamNameChange.bind(this)
    this.deleteTeamDialogOpen = this.deleteTeamDialogOpen.bind(this)
    this.deleteTeamDialogClose = this.deleteTeamDialogClose.bind(this)
    this.deleteTeamDialogDelete = this.deleteTeamDialogDelete.bind(this)

    this.addFixtureDialogClose = this.addFixtureDialogClose.bind(this)
    this.addFixtureDialogOpen = this.addFixtureDialogOpen.bind(this)
    this.addFixtureDialogAdd = this.addFixtureDialogAdd.bind(this)
    this.addFixtureDialogFixtureNameChange = this.addFixtureDialogFixtureNameChange.bind(this)
    this.deleteFixture = this.deleteFixture.bind(this)
  }

  addTeamDialogOpen () {
    this.setState({ addTeamDialogOpen: true })
  }

  addTeamDialogClose () {
    this.setState({ addTeamDialogOpen: false })
  }

  addTeamDialogAdd () {
    this.addTeamDialogClose()
    const teamName = this.state.addTeamDialogTeamName
    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsPost(this.props.season.id, this.props.competition.id, teamName)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Team ' + teamName + ' added', { variant: 'success' });
        },
        (err) => {
          this.enqueueSnackbar('Failed to add team ' + teamName, { variant: 'error' });
        })
  }

  addTeamDialogTeamNameChange (e) {
    this.setState({ addTeamDialogTeamName: e.target.value })
  }

  editTeamDialogOpen (team) {
    this.setState({ editTeamDialogOpen: true, editTeamDialogTeam: { id: team.id, originalName: team.name, name: team.name } })
  }

  editTeamDialogClose () {
    this.setState({ editTeamDialogOpen: false })
  }

  editTeamDialogEdit () {
    this.editTeamDialogClose()
    const team = this.state.editTeamDialogTeam
    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdPut(this.props.season.id, this.props.competition.id, team.id, team.name)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Team name updated to ' + team.name, { variant: 'success' });
        },
        (err) => {
          this.enqueueSnackbar('Failed to update team from ' + team.originalName + ' to ' + team.name, { variant: 'error' });
        })
  }

  editTeamDialogTeamNameChange (e) {
    const name = e.target.value
    this.setState(state => {
      return { editTeamDialogTeam: { id: state.editTeamDialogTeam.id, originalName: state.editTeamDialogTeam.originalName, name: name }}
    })
  }

  deleteTeamDialogClose () {
    this.setState({ deleteTeamDialogOpen: false })
  }

  deleteTeamDialogOpen (team) {
    this.setState({ deleteTeamDialogOpen: true, deleteTeamDialogTeam: team })
  }

  deleteTeamDialogDelete () {
    this.deleteTeamDialogClose()
    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdDelete(this.props.season.id, this.props.competition.id, this.state.deleteTeamDialogTeam.id)
      .then(
        () => {
          this.enqueueSnackbar('Team ' + this.state.deleteTeamDialogTeam.name + ' deleted', { variant: 'success' })
          this.refreshData()
        },
        (err) => {
          this.enqueueSnackbar('Failed to delete Team ' + this.state.deleteTeamDialogTeam.name, { variant: 'error' })
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
    const matches = []

    if (this.state.fixturesDrawn) {
      this.props.competition.fixtures.forEach((fixture) => {
        let body
        if (this.state.fixtureEditable) {
          body = <div>
            <span>{fixture.date}</span>
            <Tooltip title="Edit Fixture"><IconButton aria-label="Edit fixture" component="span" style={Colours.fixtures.iconStyle}><EditOutlined /></IconButton></Tooltip>
            <Tooltip title="Delete Fixture"><IconButton aria-label="Delete fixture" component="span" style={Colours.fixtures.iconStyle}><DeleteOutlined /></IconButton></Tooltip>
          </div>
        } else {
          body = <span>{fixture.date}</span>
        }

        fixtures.push(<ExpansionPanelFixture key={fixture.id}>
          <ExpansionPanelSummaryFixture expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
            {body}
          </ExpansionPanelSummaryFixture>
          <ExpansionPanelDetailsFixture>
            <Fixture editConfig={this.props.editConfig} seasonId={this.props.season.id} competitionId={this.props.competition.id} fixture={fixture} teams={this.props.competition.teams} utils={this.utils} key={fixture.id}/>
          </ExpansionPanelDetailsFixture>
        </ExpansionPanelFixture>)
      })
    }

    if (this.state.teamsDrawn) {
      this.props.competition.teams.forEach((team) => {
        let body
        if (this.state.teamEditable) {
          body = <div>
            <span>{team.name}</span>
            <Tooltip title="Edit Team"><IconButton aria-label="Edit team" component="span" style={Colours.teams.iconStyle} onClick={(e) => {e.stopPropagation(); this.editTeamDialogOpen(team)}} onFocus={(e) => e.stopPropagation()}><EditOutlined /></IconButton></Tooltip>
            <Tooltip title="Delete Team"><IconButton aria-label="Delete team" component="span" style={Colours.teams.iconStyle} onClick={(e) => {e.stopPropagation(); this.deleteTeamDialogOpen(team)}} onFocus={(e) => e.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
          </div>
        } else {
          body = <span>{team.name}</span>
        }
        teams.push(<ExpansionPanelTeam key={team.id}>
          <ExpansionPanelSummaryTeam expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
            {body}
          </ExpansionPanelSummaryTeam>
          <ExpansionPanelDetailsTeam>
            <Team editConfig={this.props.editConfig} seasonId={this.props.season.id} competitionId={this.props.competition.id} team={team} utils={this.utils} key={team.id}/>
          </ExpansionPanelDetailsTeam>
        </ExpansionPanelTeam>)
      })
    }

    if (this.state.matchesDrawn) {
      this.props.competition.teams.forEach((team) => {
        matches.push(<ExpansionPanelMatch key={team.id}>
          <ExpansionPanelSummaryMatch expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
            <span>{team.name}</span>
          </ExpansionPanelSummaryMatch>
          <ExpansionPanelDetailsMatch>
            <Matches team={team} teams={this.props.competition.teams} fixtures={this.props.competition.fixtures} key={team.id}/>
          </ExpansionPanelDetailsMatch>
        </ExpansionPanelMatch>)
      })
    }

    let fixturePanel
    if (!this.state.fixturesDrawn) {
      fixturePanel = <div></div>
    } else if (this.state.fixtureEditable) {
      fixturePanel = <ExpansionPanelFixtureWrapper key='fixtures'>
        <ExpansionPanelSummaryFixtureWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          <span>Fixtures</span>
        </ExpansionPanelSummaryFixtureWrapper>
        <ExpansionPanelDetailsFixtureWrapper>
          <Tooltip title="Add new fixture"><Button style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addFixtureDialogOpen}>Add Fixture</Button></Tooltip>
          <div>
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
    if (!this.state.teamsDrawn) {
      teamPanel = <div></div>
    } else if (this.state.teamEditable) {
      teamPanel = <ExpansionPanelTeamWrapper key='teams'>
        <ExpansionPanelSummaryTeamWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          <span>Teams</span>
        </ExpansionPanelSummaryTeamWrapper>
        <ExpansionPanelDetailsTeamWrapper>
          <Tooltip title="Add new team"><Button style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addTeamDialogOpen}>Add Team</Button></Tooltip>
          <div>
            {teams}
          </div>
          <Dialog open={this.state.addTeamDialogOpen} onClose={this.addTeamDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="add-team-dialog-title">Add Team</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the name for the new Team</DialogContentText>
              <TextField autoFocus margin="dense" id="add-team-teamName" onChange={this.addTeamDialogTeamNameChange} onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.addTeamDialogAdd()}} label="Team name" type="text" fullWidth/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.addTeamDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.addTeamDialogAdd} variant="contained" color="primary">Add</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.editTeamDialogOpen} onClose={this.editTeamDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="edit-season-dialog-title">Edit Team</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the name for the Team</DialogContentText>
              <TextField autoFocus margin="dense" id="edit-team-seasonName" onChange={this.editTeamDialogTeamNameChange} onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.editTeamDialogEdit()}} label="Team name" type="text" fullWidth defaultValue={this.state.editTeamDialogTeam.originalName}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.editTeamDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.editTeamDialogAdd} variant="contained" color="primary">Edit</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.deleteTeamDialogOpen} onClose={this.deleteTeamDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="delete-team-dialog-title">Delete Team</DialogTitle>
            <DialogContent>
              <DialogContentText onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.deleteTeamDialogDelete()}}>Are you sure you want to delete the team "{this.state.deleteTeamDialogTeam.name}" from the {this.props.competition.name} Competition in the {this.props.season.name} Season?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.deleteTeamDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.deleteTeamDialogDelete} variant="contained" color="secondary" disableElevation>Delete</Button>
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

    let matchesPanel
    if (!this.state.matchesDrawn) {
      matchesPanel = <div></div>
    } else {
      this.props.competition.teams.forEach((team) => {
        teamPanel = <ExpansionPanelMatchWrapper key='matches'>
          <ExpansionPanelSummaryMatchWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
            <span>Matches</span>
          </ExpansionPanelSummaryMatchWrapper>
          <ExpansionPanelDetailsMatchWrapper>
            <div>
              {matches}
            </div>
          </ExpansionPanelDetailsMatchWrapper>
        </ExpansionPanelMatchWrapper>
      })
    }

    return (
      <div>
        <div>
          {fixturePanel}
        </div>
        <div>
          {teamPanel}
        </div>
        <div>
          {matchesPanel}
        </div>
      </div>
    )
  }
}

export default withSnackbar(Competition)
