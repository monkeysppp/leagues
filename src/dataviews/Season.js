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

import Competition from'./Competition.js'
import Colours from '../Colours.js'

const ExpansionPanel = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.competitions.border,
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
  expanded: {},
}))(MuiExpansionPanel)

const ExpansionPanelSummary = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.competitions.heading.background,
    background: Colours.competitions.heading.background,
    color: Colours.competitions.heading.text,
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
    color: Colours.competitions.heading.text
  }
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetails = withStyles(() => ({
  root: {
    background: Colours.competitions.body.background,
    display: 'block',
    padding: '6px'
  },
}))(MuiExpansionPanelDetails)

class Season extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      competitionEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('competitions')) ? this.props.editConfig.competitions : true,
      addCompetitionDialogOpen: false,
      addCompetitionDialogCompetitionName: '',
      editCompetitionDialogOpen: false,
      editCompetitionDialogCompetition: {},
      deleteCompetitionDialogOpen: false,
      deleteCompetitionDialogCompetition: {}
    }
    this.utils = props.utils
    this.leaguesAPIClient = props.utils.leaguesAPIClient
    this.enqueueSnackbar = props.utils.enqueueSnackbar
    this.refreshData = props.utils.refreshData

    this.addCompetitionDialogOpen = this.addCompetitionDialogOpen.bind(this)
    this.addCompetitionDialogClose = this.addCompetitionDialogClose.bind(this)
    this.addCompetitionDialogAdd = this.addCompetitionDialogAdd.bind(this)
    this.addCompetitionDialogCompetitionNameChange = this.addCompetitionDialogCompetitionNameChange.bind(this)
    this.editCompetitionDialogOpen = this.editCompetitionDialogOpen.bind(this)
    this.editCompetitionDialogClose = this.editCompetitionDialogClose.bind(this)
    this.editCompetitionDialogEdit = this.editCompetitionDialogEdit.bind(this)
    this.editCompetitionDialogCompetitionNameChange = this.editCompetitionDialogCompetitionNameChange.bind(this)
    this.deleteCompetitionDialogOpen = this.deleteCompetitionDialogOpen.bind(this)
    this.deleteCompetitionDialogClose = this.deleteCompetitionDialogClose.bind(this)
    this.deleteCompetitionDialogDelete = this.deleteCompetitionDialogDelete.bind(this)
  }

  addCompetitionDialogOpen () {
    this.setState({ addCompetitionDialogOpen: true })
  }

  addCompetitionDialogClose () {
    this.setState({ addCompetitionDialogOpen: false })
  }

  addCompetitionDialogAdd (e) {
    if (!this.state.addCompetitionDialogOpen ||
      this.state.addCompetitionDialogCompetitionName.length === 0 ||
      (e.keyCode !== 10 && e.keyCode !== 13)) {
      return
    }

    e.stopPropagation()
    this.addCompetitionDialogClose()
    const competitionName = this.state.addCompetitionDialogCompetitionName
    this.setState({ addCompetitionDialogCompetitionName: '' })
    this.leaguesAPIClient.seasonsSeasonIdCompetitionsPost(this.props.season.id, competitionName)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Competition ' + competitionName + ' added', { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar('Failed to add competition ' + competitionName, { variant: 'error' })
        })
  }

  addCompetitionDialogCompetitionNameChange (e) {
    this.setState({ addCompetitionDialogCompetitionName: e.target.value })
  }

  editCompetitionDialogOpen (competition) {
    this.setState({ editCompetitionDialogOpen: true, editCompetitionDialogCompetition: { id: competition.id, originalName: competition.name, name: competition.name } })
  }

  editCompetitionDialogClose () {
    this.setState({ editCompetitionDialogOpen: false })
  }

  editCompetitionDialogEdit (e) {
    if (!this.state.editCompetitionDialogOpen ||
      this.state.editCompetitionDialogCompetition.name === this.state.editCompetitionDialogCompetition.originalName ||
      (e.keyCode !== 10 && e.keyCode !== 13)) {
      return
    }

    e.stopPropagation()
    this.editCompetitionDialogClose()
    const competition = this.state.editCompetitionDialogCompetition
    this.setState({ editCompetitionDialogCompetition: {} })
    this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdPut(this.props.season.id, competition.id, competition.name)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Competition name updated to ' + competition.name, { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar('Failed to update competition from ' + competition.originalName + ' to ' + competition.name, { variant: 'error' })
        })
  }

  editCompetitionDialogCompetitionNameChange (e) {
    const name = e.target.value
    this.setState(state => {
      return { editCompetitionDialogCompetition: { id: state.editCompetitionDialogCompetition.id, originalName: state.editCompetitionDialogCompetition.originalName, name: name }}
    })
  }

  deleteCompetitionDialogOpen (competition) {
    this.setState({ deleteCompetitionDialogOpen: true, deleteCompetitionDialogCompetition: competition })
  }

  deleteCompetitionDialogClose () {
    this.setState({ deleteCompetitionDialogOpen: false })
  }

  deleteCompetitionDialogDelete (e) {
    if (e.keyCode !== 10 && e.keyCode !== 13) {
      return
    }
    this.deleteCompetitionDialogClose()
    const competition = this.state.deleteCompetitionDialogCompetition
    this.setState({ deleteCompetitionDialogCompetition: {} })
    this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdDelete(this.props.season.id, competition.id)
      .then(
        () => {
          this.enqueueSnackbar('Competition ' + competition.name + ' deleted', { variant: 'success' })
          this.refreshData()
        },
        (err) => {
          this.enqueueSnackbar('Failed to delete Competition ' + competition.name, { variant: 'error' })
        })
  }

  render () {
    const competitions = []

    this.props.season.competitions.forEach((competition) => {
      let body
      if (this.state.competitionEditable) {
        body = <div>
          <span>{competition.name}</span>
          <Tooltip disableFocusListener disableTouchListener title="Edit competition name"><IconButton disableFocusRipple aria-label="Edit competition name" component="span" style={Colours.competitions.iconStyle} onClick={(e) => {e.stopPropagation(); this.editCompetitionDialogOpen(competition)}} onFocus={(e) => e.stopPropagation()}><EditOutlined /></IconButton></Tooltip>
          <Tooltip disableFocusListener disableTouchListener title="Delete Competition"><IconButton disableFocusRipple aria-label="Delete competition" component="span" style={Colours.competitions.iconStyle} onClick={(e) => {e.stopPropagation(); this.deleteCompetitionDialogOpen(competition)}} onFocus={(e) => e.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
        </div>
      } else {
        body = <span>{competition.name}</span>
      }

      competitions.push(<ExpansionPanel key={competition.id}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header" >
          {body}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Competition editConfig={this.props.editConfig} drawConfig={this.props.drawConfig} season={this.props.season} competition={competition} utils={this.utils} key={competition.id}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>)
    })

    if (this.state.competitionEditable) {
      return (
        <div>
          <Tooltip disableFocusListener disableTouchListener title="Add new competition"><Button disableFocusRipple style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addCompetitionDialogOpen}>Add Competition</Button></Tooltip>
          <div>
            {competitions}
          </div>
          <Dialog open={this.state.addCompetitionDialogOpen} onClose={this.addCompetitionDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="add-competition-dialog-title">Add Competition</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the name for the new Competition</DialogContentText>
              <TextField autoFocus margin="dense" id="add-competition-seasonName" onChange={this.addCompetitionDialogCompetitionNameChange} onKeyUp={this.addCompetitionDialogAdd} label="Competition name" type="text" fullWidth/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.addCompetitionDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.addCompetitionDialogAdd} variant="contained" color="primary">Add</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.editCompetitionDialogOpen} onClose={this.editCompetitionDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="edit-competition-dialog-title">Edit Competition</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the name for the Competition</DialogContentText>
              <TextField autoFocus margin="dense" id="edit-competition-seasonName" onChange={this.editCompetitionDialogCompetitionNameChange} onKeyUp={this.editCompetitionDialogEdit} label="Competition name" type="text" fullWidth defaultValue={this.state.editCompetitionDialogCompetition.originalName}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.editCompetitionDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.editCompetitionDialogEdit} variant="contained" color="primary">Update</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.deleteCompetitionDialogOpen} onClose={this.deleteCompetitionDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="delete-competition-dialog-title">Delete Competition</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete the {this.state.deleteCompetitionDialogCompetition.name} competition from the {this.props.season.name} Season?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.deleteCompetitionDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.deleteCompetitionDialogDelete} autoFocus onKeyUp={this.deleteCompetitionDialogDelete} variant="contained" color="secondary">Delete</Button>
            </DialogActions>
          </Dialog>
        </div>
      )
    } else {
      return (
        <div>
        {competitions}
        </div>
      )
    }
  }
}

export default withSnackbar(Season)
