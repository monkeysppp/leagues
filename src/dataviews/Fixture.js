import React from 'react'
import { AddCircleOutlined, DeleteOutlined, EditOutlined } from '@material-ui/icons'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tooltip from '@material-ui/core/Tooltip'
import DateFnsUtils from '@date-io/date-fns'
import { format, parse } from 'date-fns'
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers'

import { withSnackbar  } from 'notistack'

import Colours from '../Colours.js'

class Fixture extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      matchEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('fixtures')) ? this.props.editConfig.fixtures : true,
      addMatchDialogOpen: false,
      addMatchDialogMatchTime: new Date('2000-01-01T19:00:00'),
      addMatchDialogMatchHome: 'None',
      addMatchDialogMatchAway: 'None',
      addMatchDialogMatchRef: 'None',
      editMatchDialogOpen: false,
      editMatchDialogMatch: {},
      deleteMatchDialogOpen: false,
      deleteMatchDialogMatch: {}
    }
    this.utils = props.utils
    this.seasonsClient = props.utils.seasonsClient
    this.enqueueSnackbar = props.utils.enqueueSnackbar
    this.refreshData = props.utils.refreshData

    this.addMatchDialogOpen = this.addMatchDialogOpen.bind(this)
    this.addMatchDialogClose = this.addMatchDialogClose.bind(this)
    this.addMatchDialogAdd = this.addMatchDialogAdd.bind(this)
    this.addMatchDialogMatchTimeChange = this.addMatchDialogMatchTimeChange.bind(this)
    this.addMatchDialogMatchHomeChange = this.addMatchDialogMatchHomeChange.bind(this)
    this.addMatchDialogMatchAwayChange = this.addMatchDialogMatchAwayChange.bind(this)
    this.addMatchDialogMatchRefChange = this.addMatchDialogMatchRefChange.bind(this)
    this.editMatchDialogOpen = this.editMatchDialogOpen.bind(this)
    this.editMatchDialogClose = this.editMatchDialogClose.bind(this)
    this.editMatchDialogEdit = this.editMatchDialogEdit.bind(this)
    this.editMatchDialogMatchTimeChange = this.editMatchDialogMatchTimeChange.bind(this)
    this.editMatchDialogMatchHomeChange = this.editMatchDialogMatchHomeChange.bind(this)
    this.editMatchDialogMatchAwayChange = this.editMatchDialogMatchAwayChange.bind(this)
    this.editMatchDialogMatchRefChange = this.editMatchDialogMatchRefChange.bind(this)
    this.deleteMatchDialogOpen = this.deleteMatchDialogOpen.bind(this)
    this.deleteMatchDialogClose = this.deleteMatchDialogClose.bind(this)
    this.deleteMatchDialogDelete = this.deleteMatchDialogDelete.bind(this)
  }

  addMatchDialogOpen () {
    this.setState({ addMatchDialogOpen: true })
  }

  addMatchDialogClose () {
    this.setState({ addMatchDialogOpen: false })
  }

  addMatchDialogAdd () {
    this.addMatchDialogClose()
    const match = {
      time: format(this.state.addMatchDialogMatchTime, 'HH:mm'),
      homeTeam: this.state.addMatchDialogMatchHome,
      awayTeam: this.state.addMatchDialogMatchAway,
    }
    if (this.state.addMatchDialogMatchRef !== 'None') {
      match.refTeam = this.state.addMatchDialogMatchRef
    }
    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesPost(this.props.seasonId, this.props.competition.id, this.props.fixture.id, match)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar(`Match between ${match.homeTeam} and ${match.awayTeam} added`, { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar(`Failed to add Match between ${match.homeTeam} and ${match.awayTeam}`, { variant: 'error' })
        })
      .then(() => {
        this.setState({
          addMatchDialogMatchTime: new Date('2000-01-01T19:00:00'),
          addMatchDialogMatchHome: 'None',
          addMatchDialogMatchAway: 'None',
          addMatchDialogMatchRef: 'None'
        })
      })
  }

  addMatchDialogMatchTimeChange (e) {
    if (e instanceof Date) {
      this.setState({ addMatchDialogMatchTime: e })
    }
  }

  addMatchDialogMatchHomeChange (e) {
    this.setState({ addMatchDialogMatchHome: e.target.value })
  }

  addMatchDialogMatchAwayChange (e) {
    this.setState({ addMatchDialogMatchAway: e.target.value })
  }

  addMatchDialogMatchRefChange (e) {
    this.setState({ addMatchDialogMatchRef: e.target.value })
  }

  editMatchDialogOpen(match) {
    const teamMap = {}
    this.props.competition.teams.forEach(team => {
      teamMap[`id-${team.id}`] = team
    })
    const time = parse(match.time, 'HH:mm', new Date('2000-01-01T19:00:00'))
    let refTeam = 'None'
    if (match.refTeam) {
      refTeam = teamMap[`id-${match.refTeam}`].name
    }
    this.setState({ editMatchDialogOpen: true, editMatchDialogMatch: { id: match.id, time: time, homeTeam: teamMap[`id-${match.homeTeam}`].name, awayTeam: teamMap[`id-${match.awayTeam}`].name, refTeam: refTeam, originalTime: match.time, originalHomeTeam: teamMap[`id-${match.homeTeam}`].name, originalAwayTeam: teamMap[`id-${match.awayTeam}`].name } })
  }

  editMatchDialogClose () {
    this.setState({ editMatchDialogOpen: false })
  }

  editMatchDialogEdit () {
    this.editMatchDialogClose()
    const match = {
      time: format(this.state.editMatchDialogMatch.time, 'HH:mm'),
      homeTeam: this.state.editMatchDialogMatch.homeTeam,
      awayTeam: this.state.editMatchDialogMatch.awayTeam,
    }
    if (this.state.editMatchDialogMatch.refTeam !== 'None') {
      match.refTeam = this.state.editMatchDialogMatch.refTeam
    }
    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdPut(this.props.seasonId, this.props.competition.id, this.props.fixture.id, this.state.editMatchDialogMatch.id, match)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar(`Match updated to ${match.time} between ${match.homeTeam} and ${match.awayTeam}`, { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar(`Failed to edit Match at ${this.state.editMatchDialogMatch.originalTime} between ${this.state.editMatchDialogMatch.originalHomeTeam} and ${this.state.editMatchDialogMatch.originalAwayTeam}`, { variant: 'error' })
        })
  }

  editMatchDialogMatchTimeChange (e) {
    if (e instanceof Date) {
      const time = e
      this.setState(state => {
        return { editMatchDialogMatch: { id: state.editMatchDialogMatch.id, time: time, homeTeam: state.editMatchDialogMatch.homeTeam, awayTeam: state.editMatchDialogMatch.awayTeam, refTeam: state.editMatchDialogMatch.refTeam, originalTime: state.editMatchDialogMatch.originalTime, originalHomeTeam: state.editMatchDialogMatch.originalHomeTeam, originalAwayTeam: state.editMatchDialogMatch.originalAwayTeam }}
      })
    }
  }

  editMatchDialogMatchHomeChange (e) {
    const homeTeam = e.target.value
    this.setState(state => {
      return { editMatchDialogMatch: { id: state.editMatchDialogMatch.id, time: state.editMatchDialogMatch.time, homeTeam: homeTeam, awayTeam: state.editMatchDialogMatch.awayTeam, refTeam: state.editMatchDialogMatch.refTeam, originalTime: state.editMatchDialogMatch.originalTime, originalHomeTeam: state.editMatchDialogMatch.originalHomeTeam, originalAwayTeam: state.editMatchDialogMatch.originalAwayTeam }}
    })
  }

  editMatchDialogMatchAwayChange (e) {
    const awayTeam = e.target.value
    this.setState(state => {
      return { editMatchDialogMatch: { id: state.editMatchDialogMatch.id, time: state.editMatchDialogMatch.time, homeTeam: state.editMatchDialogMatch.homeTeam, awayTeam: awayTeam, refTeam: state.editMatchDialogMatch.refTeam, originalTime: state.editMatchDialogMatch.originalTime, originalHomeTeam: state.editMatchDialogMatch.originalHomeTeam, originalAwayTeam: state.editMatchDialogMatch.originalAwayTeam }}
    })
  }

  editMatchDialogMatchRefChange (e) {
    const refTeam = e.target.value
    this.setState(state => {
      return { editMatchDialogMatch: { id: state.editMatchDialogMatch.id, time: state.editMatchDialogMatch.time, homeTeam: state.editMatchDialogMatch.homeTeam, awayTeam: state.editMatchDialogMatch.awayTeam, refTeam: refTeam, originalTime: state.editMatchDialogMatch.originalTime, originalHomeTeam: state.editMatchDialogMatch.originalHomeTeam, originalAwayTeam: state.editMatchDialogMatch.originalAwayTeam }}
    })
  }

  deleteMatchDialogOpen (match) {
    this.setState({ deleteMatchDialogOpen: true, deleteMatchDialogMatch: match })
  }

  deleteMatchDialogClose () {
    this.setState({ deleteMatchDialogOpen: false })
  }

  deleteMatchDialogDelete () {
    const teamMap = {}
    this.props.teams.forEach(team => {
      teamMap[`id-${team.id}`] = team
    })
    const homeTeam = teamMap[`id-${this.state.deleteMatchDialogMatch.homeTeam}`].name
    const awayTeam = teamMap[`id-${this.state.deleteMatchDialogMatch.awayTeam}`].name
    this.deleteMatchDialogClose()
    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdMatchesMatchIdDelete(this.props.seasonId, this.props.competition.id, this.props.fixture.id, this.state.deleteMatchDialogMatch.id)
      .then(
        () => {
          this.enqueueSnackbar(`Match between ${homeTeam} and ${awayTeam} deleted`, { variant: 'success' })
          this.refreshData()
        },
        (err) => {
          this.enqueueSnackbar(`Failed to delete Match between ${homeTeam} and ${awayTeam}`, { variant: 'error' })
        })
  }

  render () {
    const teamMap = {}
    this.props.teams.forEach(team => {
      teamMap[`id-${team.id}`] = team
    })

    const matches = []

    this.props.fixture.matches.forEach((match) => {
      let homeTeam = 'None'
      let awayTeam = 'None'
      let refTeam = 'None'

      try {
        homeTeam = teamMap[`id-${match.homeTeam}`].name
      } catch {}
      try {
        awayTeam = teamMap[`id-${match.awayTeam}`].name
      } catch {}
      try {
        refTeam = teamMap[`id-${match.refTeam}`].name
      } catch {}

      let matchString = <span style={Colours.matches.iconStyle}>{match.time} : {homeTeam} v {awayTeam}</span>
      if (match.refTeam) {
        matchString = <span style={Colours.matches.iconStyle}>{match.time} : {homeTeam} v {awayTeam} ({refTeam} ref)</span>
      }
      matches.push(<div key={match.id}>
        {matchString}
        <Tooltip title="Edit match"><IconButton aria-label="Edit match" component="span" style={Colours.matches.iconStyle} onClick={(e) => {e.stopPropagation(); this.editMatchDialogOpen(match)}} onFocus={(event) => event.stopPropagation()}><EditOutlined /></IconButton></Tooltip>
        <Tooltip title="Delete match"><IconButton aria-label="Delete match" component="span" style={Colours.matches.iconStyle} onClick={(e) => {e.stopPropagation(); this.deleteMatchDialogOpen(match)}} onFocus={(event) => event.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
      </div>)
    })

    const teamSelectorItems = [<MenuItem value='None' selected key={-1}>None</MenuItem>]
    this.props.competition.teams.forEach(team => {
      teamSelectorItems.push(
        <MenuItem value={team.name} key={team.id}>{team.name}</MenuItem>
      )
    })

    let deleteMessage = ''
    if (teamMap[`id-${this.state.deleteMatchDialogMatch.homeTeam}`]) {
      deleteMessage = 'Are you sure you want to delete the match between ' + teamMap[`id-${this.state.deleteMatchDialogMatch.homeTeam}`].name + ' and ' + teamMap[`id-${this.state.deleteMatchDialogMatch.awayTeam}`].name + '?'
    }
    const addMatch = <div>
      <Tooltip title="Add new match"><Button style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addMatchDialogOpen}>Add match</Button></Tooltip>
      <Dialog open={this.state.addMatchDialogOpen} onClose={this.addMatchDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="add-match-dialog-title">Add Match</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the details for the new Match</DialogContentText>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker format="HH:mm" margin="normal" id="time-picker-inline" label="Match time" value={this.state.addMatchDialogMatchTime} onChange={this.addMatchDialogMatchTimeChange} KeyboardButtonProps={{ 'aria-label': 'change time', }} />
            <br/>
            <FormControl>
              <InputLabel shrink id="home-team-label">Home&nbsp;Team</InputLabel>
              <Select labelId="home-team-select-label" label="Home Team" id="home-team-select" value={this.state.addMatchDialogMatchHome} onChange={this.addMatchDialogMatchHomeChange}>
                {teamSelectorItems}
              </Select>
            </FormControl>
            <br/>
            <br/>
            <FormControl>
              <InputLabel shrink id="away-team-label">Away&nbsp;Team</InputLabel>
              <Select labelId="away-team-select-label" label="Away Team" id="away-team-select" value={this.state.addMatchDialogMatchAway} onChange={this.addMatchDialogMatchAwayChange}>
                {teamSelectorItems}
              </Select>
            </FormControl>
            <br/>
            <br/>
            <FormControl>
              <InputLabel shrink id="ref-team-label">Reffing&nbsp;Team</InputLabel>
              <Select labelId="ref-team-select-label" label="Reffing Team" id="ref-team-select" value={this.state.addMatchDialogMatchRef} onChange={this.addMatchDialogMatchRefChange}>
                {teamSelectorItems}
              </Select>
            </FormControl>
            <br/>
            <br/>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.addMatchDialogClose} variant="outlined" color="primary">Cancel</Button>
          <Button onClick={this.addMatchDialogAdd} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={this.state.editMatchDialogOpen} onClose={this.editMatchDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="edit-match-dialog-title">Edit Match</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the new details for the Match</DialogContentText>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker format="HH:mm" margin="normal" id="time-picker-inline" label="Match time" value={this.state.editMatchDialogMatch.time} onChange={this.editMatchDialogMatchTimeChange} KeyboardButtonProps={{ 'aria-label': 'change time', }} />
            <br/>
            <FormControl>
              <InputLabel shrink id="home-team-label">Home&nbsp;Team</InputLabel>
              <Select labelId="home-team-select-label" label="Home Team" id="home-team-select" value={this.state.editMatchDialogMatch.homeTeam} onChange={this.editMatchDialogMatchHomeChange}>
                {teamSelectorItems}
              </Select>
            </FormControl>
            <br/>
            <br/>
            <FormControl>
              <InputLabel shrink id="away-team-label">Away&nbsp;Team</InputLabel>
              <Select labelId="away-team-select-label" label="Away Team" id="away-team-select" value={this.state.editMatchDialogMatch.awayTeam} onChange={this.editMatchDialogMatchAwayChange}>
                {teamSelectorItems}
              </Select>
            </FormControl>
            <br/>
            <br/>
            <FormControl>
              <InputLabel shrink id="reffing-team-label">Reffing&nbsp;Team</InputLabel>
              <Select labelId="ref-team-select-label" label="Reffing Team" id="ref-team-select" value={this.state.editMatchDialogMatch.refTeam} onChange={this.editMatchDialogMatchRefChange}>
                {teamSelectorItems}
              </Select>
            </FormControl>
            <br/><br/>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.editMatchDialogClose} variant="outlined" color="primary">Cancel</Button>
          <Button onClick={this.editMatchDialogEdit} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={this.state.deleteMatchDialogOpen} onClose={this.deleteMatchDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="delete-match-dialog-title">Delete Match</DialogTitle>
        <DialogContent>
          <DialogContentText onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.deleteMatchDialogDelete()}}>{deleteMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.deleteMatchDialogClose} variant="outlined" color="primary">Cancel</Button>
          <Button onClick={this.deleteMatchDialogDelete} variant="contained" color="secondary" disableElevation>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>

    return (
      <div>
        {addMatch}
        <div>
          {matches}
        </div>
      </div>
    )
  }
}

export default withSnackbar(Fixture)
