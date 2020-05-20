import React from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/styles'

import Colours from './Colours.js'

const ExpansionPanel = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.emailReminders.border,
    boxShadow: 'none',
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
    border: '1px solid ' + Colours.emailReminders.heading.background,
    background: Colours.emailReminders.heading.background,
    color: Colours.emailReminders.heading.text,
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
    color: Colours.emailReminders.heading.text
  }
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetails = withStyles(() => ({
  root: {
    background: Colours.emailReminders.body.background,
    display: 'block',
    padding: '6px'
  }
}))(MuiExpansionPanelDetails)

class EmailReminders extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      emailRemindersEnabled: true
    }

    this.enableEmailReminters = this.enableEmailReminters.bind(this)
  }

  enableEmailReminters () {
    this.setState(state => {
      return { emailRemindersEnabled: ! state.emailRemindersEnabled }
    })
  }

  render () {
    return (
      <div className='mainBody'>
        <center>
          <h1>Email Reminders</h1>
        </center>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
            Config
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <p>Expanding config that is open if the config is not set, and closed otherwise.  This contains the settings needed for the app to email, so maybe...</p>
            <ul>
              <li>smtp address</li>
              <li>smtp credentials</li>
              <li>time to send email</li>
            </ul>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <br/><br/>
        <FormControlLabel value="start" control={<Switch checked={this.state.emailRemindersEnabled} onChange={this.enableEmailReminters} color="primary" name="emailRemindersEnabled" inputProps={{ 'aria-label': 'primary checkbox' }} />} label="Enable Email Reminders" labelPlacement="start" />
        <br/><br/>
        <TextField id="email.leader" label="Email Leader" multiline rows={4} fullWidth variant="outlined" />
        <br/><br/>
        <TextField id="email.tailer" label="Email Tailer" multiline rows={4} fullWidth variant="outlined" />
        <br/><br/>
        <p>Next Reminder time, content and recipients</p>
      </div>
    )
  }

}

export default EmailReminders
