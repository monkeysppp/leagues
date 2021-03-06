import React from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import { withStyles } from '@material-ui/styles'

import MatchList from'./MatchList.js'
import Colours from '../Colours.js'

const AccordionWrapper = withStyles(() => ({
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
}))(MuiAccordion)
const AccordionSummaryWrapper = withStyles(() => ({
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
}))(MuiAccordionSummary)
const AccordionDetailsWrapper = withStyles(() => ({
  root: {
    background: Colours.matches.body.background,
    display: 'block',
    padding: '6px'
  }
}))(MuiAccordionDetails)
const Accordion = withStyles(() => ({
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
}))(MuiAccordion)
const AccordionSummary = withStyles(() => ({
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
}))(MuiAccordionSummary)
const AccordionDetails = withStyles(() => ({
  root: {
    background: Colours.matches.background,
    display: 'block',
    padding: '6px'
  }
}))(MuiAccordionDetails)

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
        matches.push(<Accordion key={team.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
            <span>{team.name}</span>
          </AccordionSummary>
          <AccordionDetails>
            <MatchList team={team} teams={this.props.competition.teams} fixtures={this.props.competition.fixtures} key={team.id}/>
          </AccordionDetails>
        </Accordion>)
      })
    }

    let matchesPanel
    if (!this.state.matchesDrawn) {
      matchesPanel = <div></div>
    } else {
      matchesPanel = <AccordionWrapper key='matches'>
        <AccordionSummaryWrapper expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
          <span>Matches</span>
        </AccordionSummaryWrapper>
        <AccordionDetailsWrapper>
          <div>
            {matches}
          </div>
        </AccordionDetailsWrapper>
      </AccordionWrapper>
    }

    return (
      <div>
        {matchesPanel}
      </div>
    )
  }
}

export default Matches
