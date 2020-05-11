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
import Colours from '../Colours.js'

const ExpansionPanelWrapper = withStyles(() => ({
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
  }
}))(MuiExpansionPanelDetails)

class Fixtures extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fixtureEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('fixtures')) ? this.props.editConfig.fixtures : true,
      fixturesDrawn: (this.props.drawConfig && this.props.drawConfig.competitions && this.props.drawConfig.competitions.hasOwnProperty('fixtures')) ? this.props.drawConfig.competitions.fixtures : true,
      addFixtureDialogOpen: false,
      addFixtureDialogFixture: {},
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
    this.addFixtureDialogFixtureNameChange = this.addFixtureDialogFixtureNameChange.bind(this)
    this.editFixtureDialogOpen = this.editFixtureDialogOpen.bind(this)
    this.editFixtureDialogClose = this.editFixtureDialogClose.bind(this)
    this.editFixtureDialogEdit = this.editFixtureDialogEdit.bind(this)
    this.editFixtureDialogFixtureChange = this.editFixtureDialogFixtureChange.bind(this)
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

  addFixtureDialogFixtureNameChange (e) {
    // this.setState({ addFixtureDialogFixtureName: e.target.value })
  }

  editFixtureDialogOpen(fixture) {

  }

  editFixtureDialogClose () {

  }

  editFixtureDialogEdit () {

  }

  editFixtureDialogFixtureChange (e) {

  }

  deleteFixtureDialogClose () {
    this.setState({ deleteFixtureDialogOpen: false })
  }

  deleteFixtureDialogOpen (fixture) {
    this.setState({ deleteFixtureDialogOpen: true, deleteFixtureDialogFixture: fixture })
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
            <span>{fixture.date}</span>
            <Tooltip title="Edit Fixture"><IconButton aria-label="Edit fixture" component="span" style={Colours.fixtures.iconStyle}><EditOutlined /></IconButton></Tooltip>
            <Tooltip title="Delete Fixture"><IconButton aria-label="Delete fixture" component="span" style={Colours.fixtures.iconStyle} onClick={(e) => {e.stopPropagation(); this.deleteFixtureDialogOpen(fixture)}} onFocus={(e) => e.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
          </div>
        } else {
          body = <span>{fixture.date}</span>
        }

        fixtures.push(<ExpansionPanel key={fixture.id}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
            {body}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Fixture editConfig={this.props.editConfig} seasonId={this.props.season.id} competitionId={this.props.competition.id} fixture={fixture} teams={this.props.competition.teams} utils={this.utils} key={fixture.id}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>)
      })
    }

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
