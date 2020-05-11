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

import Fixtures from'./Fixtures.js'
import Teams from'./Teams.js'
import Matches from'./Matches.js'
import Colours from '../Colours.js'

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
      matchesDrawn: (this.props.drawConfig && this.props.drawConfig.competitions && this.props.drawConfig.competitions.hasOwnProperty('matches')) ? this.props.drawConfig.competitions.matches : false,
    }
    this.utils = props.utils
    this.seasonsClient = props.utils.seasonsClient
    this.enqueueSnackbar = props.utils.enqueueSnackbar
    this.refreshData = props.utils.refreshData
  }

  render () {
    const teams = []
    const matches = []

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

    let matchesPanel
    if (!this.state.matchesDrawn) {
      matchesPanel = <div></div>
    } else {
      this.props.competition.teams.forEach((team) => {
        matchesPanel = <ExpansionPanelMatchWrapper key='matches'>
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
          <Fixtures editConfig={this.props.editConfig} drawConfig={this.props.drawConfig} season={this.props.season} competition={this.props.competition} utils={this.utils}/>
        </div>
        <div>
          <Teams editConfig={this.props.editConfig} drawConfig={this.props.drawConfig} season={this.props.season} competition={this.props.competition} utils={this.utils}/>
        </div>
        <div>
          {matchesPanel}
        </div>
      </div>
    )
  }
}

export default withSnackbar(Competition)
