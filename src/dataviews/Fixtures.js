import React from 'react'
import { AddCircleOutlined, DeleteOutlined, EditOutlined } from '@material-ui/icons'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tooltip from '@material-ui/core/Tooltip'
import DateFnsUtils from '@date-io/date-fns'
import { format, parse } from 'date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

import { withStyles } from '@material-ui/styles'
import { withSnackbar  } from 'notistack'

import Fixture from'./Fixture.js'
import Colours from '../Colours.js'

const ExpansionPanelWrapper = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.fixtures.border,
    margin: '0px 0px 6px',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: '0px 0px 6px',
    },
    '&$expanded:last-child': {
      margin: '0px 0px 6px',
    },
  },
  expanded: {}
}))(MuiExpansionPanel)
const ExpansionPanelSummaryWrapper = withStyles(() => ({
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
const ExpansionPanelDetailsWrapper = withStyles(() => ({
  root: {
    background: Colours.fixtures.body.background,
    display: 'block',
    padding: '6px'
  }
}))(MuiExpansionPanelDetails)
const ExpansionPanel = withStyles(() => ({
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
const ExpansionPanelSummary = withStyles(() => ({
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
const ExpansionPanelDetails = withStyles(() => ({
  root: {
    background: Colours.matches.background,
    display: 'block',
    padding: '6px'
  }
}))(MuiExpansionPanelDetails)

class Fixtures extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fixtureEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('fixtures')) ? this.props.editConfig.fixtures : true,
      fixturesDrawn: (this.props.drawConfig && this.props.drawConfig.competitions && this.props.drawConfig.competitions.hasOwnProperty('fixtures')) ? this.props.drawConfig.competitions.fixtures : true,
      addFixtureDialogOpen: false,
      addFixtureDialogFixtureDate: new Date(),
      addFixtureDialogFixtureVenue: '',
      addFixtureDialogFixtureAdjudicator: 'None',
      editFixtureDialogOpen: false,
      editFixtureDialogFixture: {},
      deleteFixtureDialogOpen: false,
      deleteFixtureDialogFixture: {}
    }
    this.utils = props.utils
    this.seasonsClient = props.utils.seasonsClient
    this.enqueueSnackbar = props.utils.enqueueSnackbar
    this.refreshData = props.utils.refreshData

    this.addFixtureDialogClose = this.addFixtureDialogClose.bind(this)
    this.addFixtureDialogOpen = this.addFixtureDialogOpen.bind(this)
    this.addFixtureDialogAdd = this.addFixtureDialogAdd.bind(this)
    this.addFixtureDialogFixtureDateChange = this.addFixtureDialogFixtureDateChange.bind(this)
    this.addFixtureDialogFixtureVenueChange = this.addFixtureDialogFixtureVenueChange.bind(this)
    this.addFixtureDialogFixtureAdjudicatorChange = this.addFixtureDialogFixtureAdjudicatorChange.bind(this)
    this.editFixtureDialogOpen = this.editFixtureDialogOpen.bind(this)
    this.editFixtureDialogClose = this.editFixtureDialogClose.bind(this)
    this.editFixtureDialogEdit = this.editFixtureDialogEdit.bind(this)
    this.editFixtureDialogFixtureDateChange = this.editFixtureDialogFixtureDateChange.bind(this)
    this.editFixtureDialogFixtureVenueChange = this.editFixtureDialogFixtureVenueChange.bind(this)
    this.editFixtureDialogFixtureAdjudicatorChange = this.editFixtureDialogFixtureAdjudicatorChange.bind(this)
    this.deleteFixtureDialogOpen = this.deleteFixtureDialogOpen.bind(this)
    this.deleteFixtureDialogClose = this.deleteFixtureDialogClose.bind(this)
    this.deleteFixtureDialogDelete = this.deleteFixtureDialogDelete.bind(this)
  }

  addFixtureDialogOpen () {
    this.setState({ addFixtureDialogOpen: true })
  }

  addFixtureDialogClose () {
    this.setState({ addFixtureDialogOpen: false })
  }

  addFixtureDialogAdd () {
    this.addFixtureDialogClose()
    const fixture = {
      date: format(this.state.addFixtureDialogFixtureDate, 'eee dd-LLL-yy'),
      venue: this.state.addFixtureDialogFixtureVenue
    }
    if (this.state.addFixtureDialogFixtureAdjudicator !== 'None') {
      fixture.adjudicator = this.state.addFixtureDialogFixtureAdjudicator
    }

    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdFixturesPost(this.props.season.id, this.props.competition.id, fixture)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Fixture on ' + fixture.date + ' added', { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar('Failed to add fixture on ' + fixture.date, { variant: 'error' })
        })
      .then(() => {
        this.setState({
          addFixtureDialogFixtureDate: new Date(),
          addFixtureDialogFixtureVenue: '',
          addFixtureDialogFixtureAdjudicator: 'None'
        })
      })
  }

  addFixtureDialogFixtureDateChange (e) {
    if (e instanceof Date) {
      this.setState({ addFixtureDialogFixtureDate: e })
    }
  }

  addFixtureDialogFixtureVenueChange (e) {
    this.setState({ addFixtureDialogFixtureVenue: e.target.value })
  }

  addFixtureDialogFixtureAdjudicatorChange (e) {
    this.setState({ addFixtureDialogFixtureAdjudicator: e.target.value })
  }

  editFixtureDialogOpen(fixture) {
    const teamMap = {}
    this.props.competition.teams.forEach(team => {
      teamMap[`id-${team.id}`] = team
    })
    const date = parse(fixture.date.split(' ')[1], 'dd-LLL-yy', new Date())
    let adjudicator = 'None'
    if (fixture.adjudicator) {
      adjudicator = teamMap[`id-${fixture.adjudicator}`].name
    }
    this.setState({ editFixtureDialogOpen: true, editFixtureDialogFixture: { id: fixture.id, date: date, originalDate: date, venue: fixture.venue, adjudicator: adjudicator } })
  }

  editFixtureDialogClose () {
    this.setState({ editFixtureDialogOpen: false })
  }

  editFixtureDialogEdit () {
    this.editFixtureDialogClose()
    const fixture = {
      date: format(this.state.editFixtureDialogFixture.date, 'eee dd-LLL-yy'),
      venue: this.state.editFixtureDialogFixture.venue
    }
    if (this.state.editFixtureDialogFixture.adjudicator !== 'None') {
      fixture.adjudicator = this.state.editFixtureDialogFixture.adjudicator
    }

    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdPut(this.props.season.id, this.props.competition.id, this.state.editFixtureDialogFixture.id, fixture)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar(`Fixture updated to ${fixture.date} at ${fixture.venue}`, { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar(`Failed to edit fixture on ${this.state.editFixtureDialogFixture.originalDate}`, { variant: 'error' })
        })
  }

  editFixtureDialogFixtureDateChange (e) {
    if (e instanceof Date) {
      const date = e
      this.setState(state => {
        return { editFixtureDialogFixture: { id: state.editFixtureDialogFixture.id, date: date, originalDate: state.editFixtureDialogFixture.originalDate, venue: state.editFixtureDialogFixture.venue, adjudicator: state.editFixtureDialogFixture.adjudicator }}
      })
    }
  }

  editFixtureDialogFixtureVenueChange (e) {
    const venue = e.target.value
    this.setState(state => {
      return { editFixtureDialogFixture: { id: state.editFixtureDialogFixture.id, date: state.editFixtureDialogFixture.date, originalDate: state.editFixtureDialogFixture.originalDate, venue: venue, adjudicator: state.editFixtureDialogFixture.adjudicator }}
    })
  }

  editFixtureDialogFixtureAdjudicatorChange (e) {
    const adjudicator = e.target.value
    this.setState(state => {
      return { editFixtureDialogFixture: { id: state.editFixtureDialogFixture.id, date: state.editFixtureDialogFixture.date, originalDate: state.editFixtureDialogFixture.originalDate, venue: state.editFixtureDialogFixture.venue, adjudicator: adjudicator }}
    })
  }

  deleteFixtureDialogOpen (fixture) {
    this.setState({ deleteFixtureDialogOpen: true, deleteFixtureDialogFixture: fixture })
  }

  deleteFixtureDialogClose () {
    this.setState({ deleteFixtureDialogOpen: false })
  }

  deleteFixtureDialogDelete () {
    this.deleteFixtureDialogClose()
    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdFixturesFixtureIdDelete(this.props.season.id, this.props.competition.id, this.state.deleteFixtureDialogFixture.id)
      .then(
        () => {
          this.enqueueSnackbar('Fixture on ' + this.state.deleteFixtureDialogFixture.date + ' deleted', { variant: 'success' })
          this.refreshData()
        },
        (err) => {
          this.enqueueSnackbar('Failed to delete Fixture on ' + this.state.deleteFixtureDialogFixture.date, { variant: 'error' })
        })
  }


  render () {
    const fixtures = []

    if (this.state.fixturesDrawn) {
      this.props.competition.fixtures.forEach((fixture) => {
        let body
        if (this.state.fixtureEditable) {
          body = <div>
            <span>{fixture.date} at {fixture.venue}</span>
            <Tooltip title="Edit Fixture"><IconButton aria-label="Edit fixture" component="span" style={Colours.fixtures.iconStyle} onClick={(e) => {e.stopPropagation(); this.editFixtureDialogOpen(fixture)}} onFocus={(e) => e.stopPropagation()}><EditOutlined /></IconButton></Tooltip>
            <Tooltip title="Delete Fixture"><IconButton aria-label="Delete fixture" component="span" style={Colours.fixtures.iconStyle} onClick={(e) => {e.stopPropagation(); this.deleteFixtureDialogOpen(fixture)}} onFocus={(e) => e.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
          </div>
        } else {
          body = <span>{fixture.date} at {fixture.venue}</span>
        }

        fixtures.push(<ExpansionPanel key={fixture.id}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
            {body}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Fixture editConfig={this.props.editConfig} seasonId={this.props.season.id} competition={this.props.competition} fixture={fixture} teams={this.props.competition.teams} utils={this.utils} key={fixture.id}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>)
      })
    }

    const teamSelectorItems = [<MenuItem value='None' selected key={-1}>None</MenuItem>]
    this.props.competition.teams.forEach(team => {
      teamSelectorItems.push(
        <MenuItem value={team.name} key={team.id}>{team.name}</MenuItem>
      )
    })

    let fixturePanel
    if (!this.state.fixturesDrawn) {
      fixturePanel = <div></div>
    } else if (this.state.fixtureEditable) {
      fixturePanel = <ExpansionPanelWrapper key='fixtures'>
        <ExpansionPanelSummaryWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          <span>Fixtures</span>
        </ExpansionPanelSummaryWrapper>
        <ExpansionPanelDetailsWrapper>
          <Tooltip title="Add new fixture"><Button style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addFixtureDialogOpen}>Add Fixture</Button></Tooltip>
          <div>
            {fixtures}
          </div>
          <Dialog open={this.state.addFixtureDialogOpen} onClose={this.addFixtureDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="add-fixture-dialog-title">Add Fixture</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the details for the new Fixture</DialogContentText>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker format="yyyy/MM/dd" margin="normal" id="date-picker-inline" label="Fixture date" value={this.state.addFixtureDialogFixtureDate} onChange={this.addFixtureDialogFixtureDateChange} KeyboardButtonProps={{ 'aria-label': 'change date', }} />
                <br/>
                <TextField margin="dense" id="add-fixture-venue" onChange={this.addFixtureDialogFixtureVenueChange} label="Venue" type="text" />
                <br/>
                <br/>
                <FormControl>
                  <InputLabel shrink id="demo-simple-select-placeholder-label-label">Adjudicator</InputLabel>
                  <Select labelId="home-team-select-label" label="Adjudicators" id="home-team-select" value={this.state.addFixtureDialogFixtureAdjudicator} onChange={this.addFixtureDialogFixtureAdjudicatorChange}>
                    {teamSelectorItems}
                  </Select>
                </FormControl>
                <br/><br/>
              </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.addFixtureDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.addFixtureDialogAdd} variant="contained" color="primary">Add</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.editFixtureDialogOpen} onClose={this.editFixtureDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="edit-fixture-dialog-title">Edit Fixture</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter the new details for the Fixture</DialogContentText>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker format="yyyy/MM/dd" margin="normal" id="date-picker-inline" label="Fixture date" value={this.state.editFixtureDialogFixture.date} onChange={this.editFixtureDialogFixtureDateChange} KeyboardButtonProps={{ 'aria-label': 'change date', }} />
                <br/>
                <TextField margin="dense" id="edit-fixture-venue" value={this.state.editFixtureDialogFixture.venue} onChange={this.editFixtureDialogFixtureVenueChange} label="Venue" type="text" />
                <br/>
                <br/>
                <FormControl>
                  <InputLabel shrink id="demo-simple-select-placeholder-label-label">Adjudicator</InputLabel>
                  <Select labelId="home-team-select-label" label="Adjudicators" id="home-team-select" value={this.state.editFixtureDialogFixture.adjudicator} onChange={this.editFixtureDialogFixtureAdjudicatorChange}>
                    {teamSelectorItems}
                  </Select>
                </FormControl>
                <br/>
                <br/>
              </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.editFixtureDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.editFixtureDialogEdit} variant="contained" color="primary">Update</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.deleteFixtureDialogOpen} onClose={this.deleteFixtureDialogClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="delete-fixture-dialog-title">Delete Fixture</DialogTitle>
            <DialogContent>
              <DialogContentText onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.deleteFixtureDialogDelete()}}>Are you sure you want to delete the fixture on "{this.state.deleteFixtureDialogFixture.date}" from the {this.props.competition.name} Competition in the {this.props.season.name} Season?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.deleteFixtureDialogClose} variant="outlined" color="primary">Cancel</Button>
              <Button onClick={this.deleteFixtureDialogDelete} variant="contained" color="secondary" disableElevation>Delete</Button>
            </DialogActions>
          </Dialog>
        </ExpansionPanelDetailsWrapper>
      </ExpansionPanelWrapper>
    } else {
      fixturePanel = <ExpansionPanelWrapper>
      <ExpansionPanelSummaryWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
        <span>Fixtures</span>
      </ExpansionPanelSummaryWrapper>
      <ExpansionPanelDetailsWrapper>
        <div>
          {fixtures}
        </div>
      </ExpansionPanelDetailsWrapper>
    </ExpansionPanelWrapper>
    }

    return (
      <div>
        {fixturePanel}
      </div>
    )
  }
}

export default withSnackbar(Fixtures)