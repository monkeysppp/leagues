import React from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import { withStyles } from '@material-ui/styles'

import MatchList from'./MatchList.js'
import Colours from '../Colours.js'

const ExpansionPanelWrapper = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.matches.border,
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
}))(MuiExpansionPanel)
const ExpansionPanelSummaryWrapper = withStyles(() => ({
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
const ExpansionPanelDetailsWrapper = withStyles(() => ({
  root: {
    background: Colours.matches.body.background,
    display: 'block',
    padding: '6px'
  }
}))(MuiExpansionPanelDetails)
const ExpansionPanel = withStyles(() => ({
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
const ExpansionPanelSummary = withStyles(() => ({
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
const ExpansionPanelDetails = withStyles(() => ({
  root: {
    background: Colours.matches.background,
    display: 'block',
    padding: '6px'
  }
}))(MuiExpansionPanelDetails)

class Matches extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      matchesDrawn: (this.props.drawConfig && this.props.drawConfig.competitions && this.props.drawConfig.competitions.hasOwnProperty('matches')) ? this.props.drawConfig.competitions.matches : false,
    }
  }

  render () {
    const matches = []

    if (this.state.matchesDrawn) {
      this.props.competition.teams.forEach((team) => {
        matches.push(<ExpansionPanel key={team.id}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
            <span>{team.name}</span>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <MatchList team={team} teams={this.props.competition.teams} fixtures={this.props.competition.fixtures} key={team.id}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>)
      })
    }

    let matchesPanel
    if (!this.state.matchesDrawn) {
      matchesPanel = <div></div>
    } else {
      matchesPanel = <ExpansionPanelWrapper key='matches'>
        <ExpansionPanelSummaryWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          <span>Matches</span>
        </ExpansionPanelSummaryWrapper>
        <ExpansionPanelDetailsWrapper>
          <div>
            {matches}
          </div>
        </ExpansionPanelDetailsWrapper>
      </ExpansionPanelWrapper>
    }

    return (
      <div>
        {matchesPanel}
      </div>
    )
  }
}

export default Matches
