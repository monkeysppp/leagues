import React from 'react'
import { AddCircleOutlined, DeleteOutlined, EditOutlined } from '@material-ui/icons'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'

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

import Team from'./Team.js'
import Colours from '../Colours.js'

const AccordionWrapper = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.teams.border,
    margin: '0px',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '15px 0',
    },
    '&$expanded:last-child': {
      margin: '0px 0px 6px',
    },
  },
  expanded: {}
}))(MuiAccordion)
const AccordionSummaryWrapper = withStyles(() => ({
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
}))(MuiAccordionSummary)
const AccordionDetailsWrapper = withStyles(() => ({
  root: {
    background: Colours.teams.body.background,
    display: 'block',
    padding: '6px'
  }
}))(MuiAccordionDetails)
const Accordion = withStyles(() => ({
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
}))(MuiAccordion)
const AccordionSummary = withStyles(() => ({
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
}))(MuiAccordionSummary)
const AccordionDetails = withStyles(() => ({
  root: {
    background: Colours.contacts.background,
    display: 'block',
    padding: '6px'
  }
}))(MuiAccordionDetails)

class Teams extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      teamEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('teams')) ? this.props.editConfig.teams : true,
      teamsDrawn: (this.props.drawConfig && this.props.drawConfig.competitions && this.props.drawConfig.competitions.hasOwnProperty('teams')) ? this.props.drawConfig.competitions.teams : true,
      addTeamDialogOpen: false,
      addTeamDialogTeamName: '',
      editTeamDialogOpen: false,
      editTeamDialogTeam: {},
      deleteTeamDialogOpen: false,
      deleteTeamDialogTeam: {},
      cannotDeleteTeamDialogOpen: false,
      cannotDeleteTeamDialogTeam: {}
    }
    this.utils = props.utils
    this.leaguesAPIClient = props.utils.leaguesAPIClient
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
    this.cannotDeleteTeamDialogOpen = this.cannotDeleteTeamDialogOpen.bind(this)
    this.cannotDeleteTeamDialogClose = this.cannotDeleteTeamDialogClose.bind(this)
  }

  addTeamDialogOpen () {
    this.setState({ addTeamDialogOpen: true })
  }

  addTeamDialogClose () {
    this.setState({ addTeamDialogOpen: false })
  }

  addTeamDialogAdd (e) {
    if (!this.state.addTeamDialogOpen ||
      this.state.addTeamDialogTeamName.length === 0 ||
      (e.keyCode && e.keyCode !== 10 && e.keyCode !== 13)) {
      return
    }

    e.stopPropagation()
    this.addTeamDialogClose()
    const teamName = this.state.addTeamDialogTeamName
    this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsPost(this.props.season.id, this.props.competition.id, teamName)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Team ' + teamName + ' added', { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar('Failed to add team ' + teamName, { variant: 'error' })
        })
      .then(() => {
        this.setState({ addTeamDialogTeamName: '' })
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

  editTeamDialogEdit (e) {
    if (!this.state.editTeamDialogOpen ||
      this.state.editTeamDialogTeam.name === this.state.editTeamDialogTeam.originalName ||
      (e.keyCode && e.keyCode !== 10 && e.keyCode !== 13)) {
      return
    }

    e.stopPropagation()
    this.editTeamDialogClose()
    const team = this.state.editTeamDialogTeam
    this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdPut(this.props.season.id, this.props.competition.id, team.id, team.name)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Team name updated to ' + team.name, { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar('Failed to update team from ' + team.originalName + ' to ' + team.name, { variant: 'error' })
        })
      .then(() => {
        this.setState({ editTeamDialogTeam: {} })
      })
  }

  editTeamDialogTeamNameChange (e) {
    const name = e.target.value
    this.setState(state => {
      return { editTeamDialogTeam: { id: state.editTeamDialogTeam.id, originalName: state.editTeamDialogTeam.originalName, name: name }}
    })
  }

  deleteTeamDialogOpen (team) {
    this.setState({ deleteTeamDialogOpen: true, deleteTeamDialogTeam: team })
  }

  deleteTeamDialogClose () {
    this.setState({ deleteTeamDialogOpen: false })
  }

  deleteTeamDialogDelete (e) {
    if (e.keyCode && e.keyCode !== 10 && e.keyCode !== 13) {
      return
    }
    this.deleteTeamDialogClose()
    const team = this.state.deleteTeamDialogTeam
    this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdDelete(this.props.season.id, this.props.competition.id, team.id)
      .then(
        () => {
          this.enqueueSnackbar('Team ' + team.name + ' deleted', { variant: 'success' })
          this.refreshData()
        },
        (err) => {
          this.enqueueSnackbar('Failed to delete Team ' + team.name, { variant: 'error' })
        })
      .then(() => {
        this.setState({ deleteTeamDialogTeam: {} })
      })
  }

  cannotDeleteTeamDialogOpen (team) {
    this.setState({ cannotDeleteTeamDialogOpen: true, cannotDeleteTeamDialogTeam: team })
  }

  cannotDeleteTeamDialogClose () {
    this.setState({ cannotDeleteTeamDialogOpen: false, cannotDeleteTeamDialogTeam: {} })
  }

  render () {
    const teams = []

    if (this.state.teamsDrawn) {
      this.props.competition.teams.forEach((team) => {
        let teamHasResponsibilities = false
        this.props.competition.fixtures.forEach(fixture => {
          if (fixture.adjudicator === team.id) {
            teamHasResponsibilities = true
          }
          fixture.matches.forEach(match => {
            if (match.homeTeam === team.id || match.awayTeam === team.id || match.refTeam === team.id) {
              teamHasResponsibilities = true
            }
          })
        })
        let deleteButton
        if (teamHasResponsibilities) {
          deleteButton = <Tooltip disableFocusListener disableTouchListener title="Delete Team"><IconButton disableFocusRipple aria-label="Delete team" component="span" style={Colours.teams.iconStyle} onClick={(e) => {e.stopPropagation(); this.cannotDeleteTeamDialogOpen(team)}} onFocus={(e) => e.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
        } else {
          deleteButton = <Tooltip disableFocusListener disableTouchListener title="Delete Team"><IconButton disableFocusRipple aria-label="Delete team" component="span" style={Colours.teams.iconStyle} onClick={(e) => {e.stopPropagation(); this.deleteTeamDialogOpen(team)}} onFocus={(e) => e.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
        }
        let body
        if (this.state.teamEditable) {
          body = <div>
            <span>{team.name}</span>
            <Tooltip disableFocusListener disableTouchListener title="Edit Team"><IconButton disableFocusRipple aria-label="Edit team" component="span" style={Colours.teams.iconStyle} onClick={(e) => {e.stopPropagation(); this.editTeamDialogOpen(team)}} onFocus={(e) => e.stopPropagation()}><EditOutlined /></IconButton></Tooltip>
            {deleteButton}
          </div>
        } else {
          body = <span>{team.name}</span>
        }
        teams.push(<Accordion key={team.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
            {body}
          </AccordionSummary>
          <AccordionDetails>
            <Team editConfig={this.props.editConfig} seasonId={this.props.season.id} competitionId={this.props.competition.id} team={team} utils={this.utils} key={team.id}/>
          </AccordionDetails>
        </Accordion>)
      })
    }

    let teamPanel
    if (!this.state.teamsDrawn) {
      teamPanel = <div></div>
    } else if (this.state.teamEditable) {
      teamPanel = <AccordionWrapper key='teams'>
        <AccordionSummaryWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          <span>Teams</span>
        </AccordionSummaryWrapper>
        <AccordionDetailsWrapper>
          <Tooltip disableFocusListener disableTouchListener title="Add new team"><Button disableFocusRipple style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addTeamDialogOpen}>Add Team</Button></Tooltip>
          <div>
            {teams}
          </div>
          <Dialog open={this.state.addTeamDialogOpen} onClose={this.addTeamDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="add-team-dialog-title">Add Team</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the name for the new Team</DialogContentText>
              <TextField autoFocus margin="dense" id="add-team-teamName" onChange={this.addTeamDialogTeamNameChange} onKeyUp={this.addTeamDialogAdd} label="Team name" type="text" fullWidth/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.addTeamDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.addTeamDialogAdd} variant="contained" color="primary">Add</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.editTeamDialogOpen} onClose={this.editTeamDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="edit-team-dialog-title">Edit Team</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the name for the Team</DialogContentText>
              <TextField autoFocus margin="dense" id="edit-team-teamName" onChange={this.editTeamDialogTeamNameChange} onKeyUp={this.editTeamDialogEdit} label="Team name" type="text" fullWidth defaultValue={this.state.editTeamDialogTeam.originalName}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.editTeamDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.editTeamDialogEdit} variant="contained" color="primary">Update</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.deleteTeamDialogOpen} onClose={this.deleteTeamDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="delete-team-dialog-title">Delete Team</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete the team "{this.state.deleteTeamDialogTeam.name}" from the "{this.props.competition.name}" Competition in the "{this.props.season.name}" Season?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.deleteTeamDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.deleteTeamDialogDelete} autoFocus onKeyUp={this.deleteTeamDialogDelete}variant="contained" color="secondary">Delete</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.cannotDeleteTeamDialogOpen} onClose={this.cannotDeleteTeamDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="cannot-delete-team-dialog-title">Cannot Delete Team</DialogTitle>
            <DialogContent>
              <DialogContentText>Can't delete the team "{this.state.cannotDeleteTeamDialogTeam.name}" as it still has matches or reffing responsibilities in the "{this.props.competition.name}" Competiton!</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.cannotDeleteTeamDialogClose} variant="contained" color="primary">OK</Button>
            </DialogActions>
          </Dialog>
        </AccordionDetailsWrapper>
      </AccordionWrapper>
    } else {
      teamPanel = <AccordionWrapper key='teams'>
        <AccordionSummaryWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          <span>Teams</span>
        </AccordionSummaryWrapper>
        <AccordionDetailsWrapper>
          <div>
            {teams}
          </div>
        </AccordionDetailsWrapper>
      </AccordionWrapper>
    }

    return (
      <div>
        {teamPanel}
      </div>
    )
  }
}

export default withSnackbar(Teams)
