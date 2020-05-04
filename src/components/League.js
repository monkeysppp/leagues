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

import Season from'./Season.js'

// TODO:
// Delete confirmation - started
// Matches to have match view and not teams/fixtures - got a plan
// API date-orders the array of fixtures on save
// Edit entry
// form for fixtures
// build system
// import and emails

const ExpansionPanel = withStyles(() => ({
  root: {
    border: '1px solid rgba(0, 0, 120, .125)',
    background: 'rgba(200, 200, 250, .125)',
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

const ExpansionPanelSummary = withStyles(() => ({
  root: {
    border: '1px solid rgba(0, 0, 120, .125)',
    background: 'rgba(120, 120, 255, .05)',
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

const ExpansionPanelDetails = withStyles(() => ({
  root: {
    background: 'rgba(220, 220, 255, .01)',
    display: 'block',
  }
}))(MuiExpansionPanelDetails)

class League extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      seasonEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('seasons')) ? this.props.editConfig.seasons : true,
      seasons: [],
      addSeasonDialogOpen: false,
      addSeasonDialogSeasonName: '',
      deleteSeasonDialogOpen: false,
      deleteSeasonDialogSeason: {}
    }
    this.seasonsClient = props.utils.seasonsClient
    this.enqueueSnackbar = props.enqueueSnackbar

    this.refreshData = this.refreshData.bind(this)
    this.addSeasonDialogClose = this.addSeasonDialogClose.bind(this)
    this.addSeasonDialogOpen = this.addSeasonDialogOpen.bind(this)
    this.addSeasonDialogAdd = this.addSeasonDialogAdd.bind(this)
    this.addSeasonDialogSeasonNameChange = this.addSeasonDialogSeasonNameChange.bind(this)
    this.deleteSeasonDialogClose = this.deleteSeasonDialogClose.bind(this)
    this.deleteSeasonDialogOpen = this.deleteSeasonDialogOpen.bind(this)
    this.deleteSeasonDialogDelete = this.deleteSeasonDialogDelete.bind(this)

    this.utils = {
      seasonsClient: this.seasonsClient,
      enqueueSnackbar: this.enqueueSnackbar,
      refreshData: this.refreshData
    }
  }

  componentDidMount () {
    this.refreshData()
  }

  addSeasonDialogAdd () {
    this.addSeasonDialogClose()
    const seasonName = this.state.addSeasonDialogSeasonName
    this.seasonsClient.seasonsPost(seasonName)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Season ' + seasonName + ' added', { variant: 'success' });
        },
        (err) => {
          this.enqueueSnackbar('Failed to add Season ' + seasonName, { variant: 'error' });
        })
  }

  addSeasonDialogOpen () {
    this.setState({ addSeasonDialogOpen: true })
  }

  addSeasonDialogClose () {
    this.setState({ addSeasonDialogOpen: false })
  }

  addSeasonDialogSeasonNameChange (e) {
    this.setState({ addSeasonDialogSeasonName: e.target.value })
  }

  deleteSeasonDialogClose () {
    this.setState({ deleteSeasonDialogOpen: false })
  }

  deleteSeasonDialogOpen (season) {
    this.setState({ deleteSeasonDialogOpen: true, deleteSeasonDialogSeason: season })
  }

  deleteSeasonDialogDelete () {
    this.deleteSeasonDialogClose()
    this.seasonsClient.seasonsSeasonIdDelete(this.state.deleteSeasonDialogSeason.id)
      .then(
        () => {
          this.enqueueSnackbar('Season ' + this.state.deleteSeasonDialogSeason.name + ' deleted', { variant: 'success' })
          this.refreshData()
        },
        (err) => {
          this.enqueueSnackbar('Failed to delete season ' + this.state.deleteSeasonDialogSeason.name, { variant: 'error' })
        })
  }

  refreshData () {
    this.seasonsClient.seasonsGet()
      .then(seasons => {
        this.setState({
          seasons: seasons
        })
      })
  }

  render () {
    const seasons = []
    this.state.seasons.forEach((season) => {
      let body
      if (this.state.seasonEditable) {
        body = <div>
          <span>{season.name}</span>
          <Tooltip title="Edit Season"><IconButton aria-label="Edit season name" component="span"><EditOutlined /></IconButton></Tooltip>
          <Tooltip title="Delete Season"><IconButton aria-label="Delete season" component="span" onClick={(e) => {e.stopPropagation(); this.deleteSeasonDialogOpen(season)}} onFocus={(e) => e.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
        </div>
      } else {
        body = <span>{season.name}</span>
      }

      seasons.push(<ExpansionPanel key={season.id}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          {body}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Season editConfig={this.props.editConfig} season={season} utils={this.utils} key={season.id}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>)
    })

    if (this.state.seasonEditable) {
      return (
        <div>
          <Tooltip title="Add new season"><Button style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addSeasonDialogOpen}>Add Season</Button></Tooltip>
          {seasons}
          <Dialog open={this.state.addSeasonDialogOpen} onClose={this.addSeasonDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="add-season-dialog-title">Add Season</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the name for the new Season</DialogContentText>
              <TextField autoFocus margin="dense" id="add-season-seasonName" onChange={this.addSeasonDialogSeasonNameChange} onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.addSeasonDialogAdd()}} label="Season name" type="text" fullWidth/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.addSeasonDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.addSeasonDialogAdd} variant="contained" color="primary">Add</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.deleteSeasonDialogOpen} onClose={this.deleteSeasonDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="delete-season-dialog-title">Delete Season</DialogTitle>
            <DialogContent>
              <DialogContentText onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.deleteSeasonDialogDelete()}}>Are you sure you want to delete the {this.state.deleteSeasonDialogSeason.name} season?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.deleteSeasonDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.deleteSeasonDialogDelete} variant="contained" color="secondary">Delete</Button>
            </DialogActions>
          </Dialog>
        </div>
      )
    } else {
      return (
        <div>
          {seasons}
        </div>
      )
    }
  }
}

export default withSnackbar(League)
