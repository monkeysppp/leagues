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
import Colours from '../Colours.js'

const ExpansionPanel = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.seasons.border,
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
    border: '1px solid ' + Colours.seasons.heading.background,
    background: Colours.seasons.heading.background,
    color: Colours.seasons.heading.text,
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
    color: Colours.seasons.heading.text
  }
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetails = withStyles(() => ({
  root: {
    background: Colours.seasons.body.background,
    display: 'block',
    padding: '6px'
  }
}))(MuiExpansionPanelDetails)

class League extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initialising: true,
      seasonEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('seasons')) ? this.props.editConfig.seasons : true,
      seasons: [],
      addSeasonDialogOpen: false,
      addSeasonDialogSeasonName: '',
      editSeasonDialogOpen: false,
      editSeasonDialogSeason: {},
      deleteSeasonDialogOpen: false,
      deleteSeasonDialogSeason: {}
    }
    this.leaguesAPIClient = props.utils.leaguesAPIClient
    this.enqueueSnackbar = props.enqueueSnackbar

    this.refreshData = this.refreshData.bind(this)
    this.addSeasonDialogOpen = this.addSeasonDialogOpen.bind(this)
    this.addSeasonDialogClose = this.addSeasonDialogClose.bind(this)
    this.addSeasonDialogAdd = this.addSeasonDialogAdd.bind(this)
    this.addSeasonDialogSeasonNameChange = this.addSeasonDialogSeasonNameChange.bind(this)
    this.editSeasonDialogOpen = this.editSeasonDialogOpen.bind(this)
    this.editSeasonDialogClose = this.editSeasonDialogClose.bind(this)
    this.editSeasonDialogEdit = this.editSeasonDialogEdit.bind(this)
    this.editSeasonDialogSeasonNameChange = this.editSeasonDialogSeasonNameChange.bind(this)
    this.deleteSeasonDialogOpen = this.deleteSeasonDialogOpen.bind(this)
    this.deleteSeasonDialogClose = this.deleteSeasonDialogClose.bind(this)
    this.deleteSeasonDialogDelete = this.deleteSeasonDialogDelete.bind(this)

    this.utils = {
      leaguesAPIClient: this.leaguesAPIClient,
      enqueueSnackbar: this.enqueueSnackbar,
      refreshData: this.refreshData
    }
  }

  componentDidMount () {
    this.refreshData()
  }

  addSeasonDialogOpen () {
    this.setState({ addSeasonDialogOpen: true })
  }

  addSeasonDialogClose () {
    this.setState({ addSeasonDialogOpen: false })
  }

  addSeasonDialogAdd () {
    this.addSeasonDialogClose()
    const seasonName = this.state.addSeasonDialogSeasonName
    this.leaguesAPIClient.seasonsPost(seasonName)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Season ' + seasonName + ' added', { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar('Failed to add season ' + seasonName, { variant: 'error' })
        })
  }

  addSeasonDialogSeasonNameChange (e) {
    this.setState({ addSeasonDialogSeasonName: e.target.value })
  }

  editSeasonDialogOpen (season) {
    this.setState({ editSeasonDialogOpen: true, editSeasonDialogSeason: { id: season.id, originalName: season.name, name: season.name } })
  }

  editSeasonDialogClose () {
    this.setState({ editSeasonDialogOpen: false })
  }

  editSeasonDialogEdit () {
    this.editSeasonDialogClose()
    const season = this.state.editSeasonDialogSeason
    this.leaguesAPIClient.seasonsSeasonIdPut(season.id, season.name)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Season name updated to ' + season.name, { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar('Failed to update season from ' + season.originalName + ' to ' + season.name, { variant: 'error' })
        })
  }

  editSeasonDialogSeasonNameChange (e) {
    const name = e.target.value
    this.setState(state => {
      return { editSeasonDialogSeason: { id: state.editSeasonDialogSeason.id, originalName: state.editSeasonDialogSeason.originalName, name: name }}
    })
  }

  deleteSeasonDialogOpen (season) {
    this.setState({ deleteSeasonDialogOpen: true, deleteSeasonDialogSeason: season })
  }

  deleteSeasonDialogClose () {
    this.setState({ deleteSeasonDialogOpen: false })
  }

  deleteSeasonDialogDelete () {
    this.deleteSeasonDialogClose()
    this.leaguesAPIClient.seasonsSeasonIdDelete(this.state.deleteSeasonDialogSeason.id)
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
    this.leaguesAPIClient.seasonsGet()
      .then(seasons => {
        this.setState({
          seasons: seasons,
          initialising: false
        })
      }).catch(() => {
        this.enqueueSnackbar('Failed to fetch season data', { variant: 'error' })
      })
  }

  render () {
    if (this.state.initialising) {
      return (
        <center>
          <br/><br/><br/><br/><br/><br/>
          <span>Loading...</span>
        </center>
      )
    }
    const seasons = []
    this.state.seasons.forEach((season) => {
      let body
      if (this.state.seasonEditable) {
        body = <div>
          <span>{season.name}</span>
          <Tooltip title="Edit Season"><IconButton aria-label="Edit season name" component="span" style={Colours.seasons.iconStyle} onClick={(e) => {e.stopPropagation(); this.editSeasonDialogOpen(season)}} onFocus={(e) => e.stopPropagation()}><EditOutlined /></IconButton></Tooltip>
          <Tooltip title="Delete Season"><IconButton aria-label="Delete season" component="span" style={Colours.seasons.iconStyle} onClick={(e) => {e.stopPropagation(); this.deleteSeasonDialogOpen(season)}} onFocus={(e) => e.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
        </div>
      } else {
        body = <span>{season.name}</span>
      }

      seasons.push(<ExpansionPanel key={season.id}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          {body}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Season editConfig={this.props.editConfig} drawConfig={this.props.drawConfig} season={season} utils={this.utils} key={season.id}/>
        </ExpansionPanelDetails>
      </ExpansionPanel>)
    })

    if (this.state.seasonEditable) {
      return (
        <div>
          <Tooltip title="Add new season"><Button style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addSeasonDialogOpen}>Add Season</Button></Tooltip>
          <div>
            {seasons}
          </div>
          <br/>
          <br/>
          <br/>
          <br/>
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
          <Dialog open={this.state.editSeasonDialogOpen} onClose={this.editSeasonDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="edit-season-dialog-title">Edit Season</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the name for the Season</DialogContentText>
              <TextField autoFocus margin="dense" id="edit-season-seasonName" onChange={this.editSeasonDialogSeasonNameChange} onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.editSeasonDialogEdit()}} label="Season name" type="text" fullWidth defaultValue={this.state.editSeasonDialogSeason.originalName} />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.editSeasonDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.editSeasonDialogEdit} variant="contained" color="primary">Update</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.deleteSeasonDialogOpen} onClose={this.deleteSeasonDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="delete-season-dialog-title">Delete Season</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete the {this.state.deleteSeasonDialogSeason.name} season?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.deleteSeasonDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.deleteSeasonDialogDelete} autoFocus onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.deleteSeasonDialogDelete()}} variant="contained" color="secondary">Delete</Button>
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
