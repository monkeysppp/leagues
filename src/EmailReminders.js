import React from 'react'
import { CloudUpload } from '@material-ui/icons'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DateFnsUtils from '@date-io/date-fns'
import { format, parse } from 'date-fns'
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers'
import { withStyles } from '@material-ui/styles'
import { withSnackbar  } from 'notistack'

import Colours from './Colours.js'

const ExpansionPanel = withStyles(() => ({
  root: {
    border: '1px solid ' + Colours.emailReminders.border,
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
    border: '1px solid ' + Colours.emailReminders.heading.background,
    background: Colours.emailReminders.heading.background,
    color: Colours.emailReminders.heading.text,
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
    color: Colours.emailReminders.heading.text
  }
}))(MuiExpansionPanelSummary)

const ExpansionPanelDetails = withStyles(() => ({
  root: {
    background: Colours.emailReminders.body.background,
    display: 'block',
    padding: '20px'
  }
}))(MuiExpansionPanelDetails)

class EmailReminders extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      smtpHost: ' ',
      smtpPort: 1,
      smtpUser: ' ',
      smtpPass: 'xxxxxxxx',
      smtpPassChanged: false,
      emailRemindersEnabled: true,
      emailFrom: '',
      emailReminderTime: new Date(),
      emailReminderDays: 0,
      emailBodyLeader: '',
      emailBodyTailer: '',
      nextReminder: {
        time: new Date()
      }
    }

    this.leaguesAPIClient = props.utils.leaguesAPIClient
    this.enqueueSnackbar = props.enqueueSnackbar

    this.refreshData = this.refreshData.bind(this)
    this.toggleEmailRemindersEnabled = this.toggleEmailRemindersEnabled.bind(this)
    this.handleSMTPHostChange = this.handleSMTPHostChange.bind(this)
    this.handleSMTPPortChange = this.handleSMTPPortChange.bind(this)
    this.handleSMTPUserChange = this.handleSMTPUserChange.bind(this)
    this.handleSMTPPassChange = this.handleSMTPPassChange.bind(this)
    this.handleEmailFromChange = this.handleEmailFromChange.bind(this)
    this.handleEmailLeaderChange = this.handleEmailLeaderChange.bind(this)
    this.handleEmailTailerChange = this.handleEmailTailerChange.bind(this)
    this.handleEmailTimeChange = this.handleEmailTimeChange.bind(this)
    this.handleEmailDaysChange = this.handleEmailDaysChange.bind(this)
    this.saveSMTPSettings = this.saveSMTPSettings.bind(this)
    this.saveEmailSettings = this.saveEmailSettings.bind(this)
  }

  componentDidMount () {
    this.refreshData()
  }

  async refreshData () {
    try {
      let [emailConfig, emailBody, smtpConfig, nextReminder] = await Promise.all([
        this.leaguesAPIClient.remindersEmailGet(),
        this.leaguesAPIClient.remindersEmailBodyGet(),
        this.leaguesAPIClient.remindersEmailSMTPGet(),
        this.leaguesAPIClient.remindersEmailNextGet()
      ])
      this.setState({
        emailRemindersEnabled: emailConfig.enabled,
        emailFrom: emailConfig.from,
        emailReminderDays: emailConfig.reminderDays,
        emailReminderTime: parse(emailConfig.reminderTime, 'HH:mm', new Date('2000-01-01T19:00:00')),
        emailBodyLeader: emailBody.leader,
        emailBodyTailer: emailBody.tailer,
        smtpHost: smtpConfig.host,
        smtpPort: smtpConfig.port,
        smtpUser: smtpConfig.user,
        nextReminder: nextReminder
      })
    } catch (e) {
      this.enqueueSnackbar('Failed to fetch email reminder data', { variant: 'error' })
    }
  }

  async toggleEmailRemindersEnabled () {
    await this.leaguesAPIClient.remindersEmailPut(
      !this.state.emailRemindersEnabled,
      this.state.emailReminderDays,
      format(this.state.emailReminderTime, 'HH:mm')
    )
    this.refreshData()
  }

  handleEmailFromChange (e) {
    this.setState({ emailFrom: e.target.value })
  }

  handleEmailTimeChange (e) {
    if (e instanceof Date) {
      this.setState({ emailReminderTime: e })
    }
  }

  handleEmailDaysChange (e) {
    if (!isNaN(e.target.value) && e.target.value < 32) {
      this.setState({ emailReminderDays: e.target.value })
    }
  }

  handleSMTPHostChange (e) {
    this.setState({ smtpHost: e.target.value })
  }

  handleSMTPPortChange (e) {
    if (!isNaN(e.target.value) && e.target.value < 65536) {
      this.setState({ smtpPort: e.target.value })
    }
  }

  handleSMTPUserChange (e) {
    this.setState({ smtpUser: e.target.value })
  }

  handleSMTPPassChange (e) {
    this.setState({ smtpPass: e.target.value, smtpPassChanged: true })
  }

  handleEmailLeaderChange (e) {
    this.setState({ emailBodyLeader: e.target.value })
  }

  handleEmailTailerChange (e) {
    this.setState({ emailBodyTailer: e.target.value })
  }

  async saveSMTPSettings () {
    try {
      await this.leaguesAPIClient.remindersEmailSMTPPut(
        this.state.smtpHost,
        parseInt(this.state.smtpPort),
        this.state.smtpUser,
        this.state.smtpPassChanged ? this.state.smtpPass : undefined
      )
      this.enqueueSnackbar(`SMTP Settings applied`, { variant: 'success' })
    } catch (e) {
      this.enqueueSnackbar('Failed to apply the SMTP settings', { variant: 'error' })
    }
  }

  async saveEmailSettings () {
    try {
      await this.leaguesAPIClient.remindersEmailPut(
        this.state.emailRemindersEnabled,
        this.state.emailFrom,
        parseInt(this.state.emailReminderDays),
        format(this.state.emailReminderTime, 'HH:mm')
      )
      await this.leaguesAPIClient.remindersEmailBodyPut(
        this.state.emailBodyLeader,
        this.state.emailBodyTailer
      )
      this.refreshData()
      this.enqueueSnackbar(`Email config saved`, { variant: 'success' })
    } catch (e) {
      this.enqueueSnackbar('Failed to save email config', { variant: 'error' })
    }
  }


  render () {
    let reminder = <div style={{padding: '0px 16px'}}>
      <p>Next Reminder at: <code>No pending match reminders</code></p>
    </div>
    if (this.state.emailRemindersEnabled && this.state.nextReminder.time) {
      reminder = <div style={{padding: '0px 16px'}}>
        <p>Next Reminder at: <code>{format(new Date(this.state.nextReminder.time), 'yyyy-MM-dd HH:mm')}</code></p>
        <p>From: <code>{this.state.emailFrom}</code></p>
        <p>To: <code>{this.state.nextReminder.recipients}</code></p>
        <p>Subject: <code>{this.state.nextReminder.subject}</code></p>
        <p>Body: </p>
        <pre>{this.state.nextReminder.body}</pre>
      </div>
    }

    return (
      <div className='mainBody'>
        <center>
          <h1>Email Reminders</h1>
        </center>
        <FormControlLabel value="start" control={<Switch checked={this.state.emailRemindersEnabled} onChange={this.toggleEmailRemindersEnabled} color="primary" name="emailRemindersEnabled" inputProps={{ 'aria-label': 'primary checkbox' }} />} label="Enable Email Reminders" labelPlacement="start" />
        <br/><br/>
        <div>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="additional-actions1-header">
              SMTP Config
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField id="smtp.host" label="SMTP Hostname" style={{width: 400}} variant="outlined" value={this.state.smtpHost} onChange={this.handleSMTPHostChange} />&nbsp;&nbsp;
              <TextField id="smtp.port" label="SMTP Port" style={{width: 100}} variant="outlined" value={this.state.smtpPort} onChange={this.handleSMTPPortChange} />
              <br/><br/>
              <TextField id="smtp.user" label="SMTP Username" style={{width: 250}} variant="outlined" value={this.state.smtpUser} onChange={this.handleSMTPUserChange} />&nbsp;&nbsp;
              <TextField id="smtp.password" label="SMTP Password" type='password' style={{width: 250}} variant="outlined" value={this.state.smtpPass} onChange={this.handleSMTPPassChange} />&nbsp;&nbsp;
              <br/><br/>
              <Tooltip title="Apply SMTP Settings"><Button variant="contained" style={Colours.emailReminders.iconStyle} startIcon={<CloudUpload />} onClick={this.saveSMTPSettings}>Save config</Button></Tooltip>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions2-content" id="additional-actions2-header">
              Email Config
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField id="email.from" label="From Address" style={{width: 510}} variant="outlined" value={this.state.emailFrom} onChange={this.handleEmailFromChange} /><br/>
              <span>Email will be sent at <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker style={{'verticalAlign': 'baseline'}} format="HH:mm" margin="normal" id="time-picker-inline" label="Pick time" value={this.state.emailReminderTime} onChange={this.handleEmailTimeChange} KeyboardButtonProps={{ 'aria-label': 'pick time', }} />
              </MuiPickersUtilsProvider>, <TextField id="reminder.days" label="days" style={{width: 50, 'verticalAlign': 'baseline'}} variant="outlined" value={this.state.emailReminderDays} onChange={this.handleEmailDaysChange} />&nbsp;&nbsp;days in advance.</span>
              <br/><br/>
              <TextField id="email.leader" label="Email Leader" multiline rows={5} onChange={this.handleEmailLeaderChange} fullWidth variant="outlined" value={this.state.emailBodyLeader} />
              <br/><br/>
              <TextField id="email.tailer" label="Email Tailer" multiline rows={6} onChange={this.handleEmailTailerChange} fullWidth variant="outlined" value={this.state.emailBodyTailer} />
              <br/><br/>
              <Tooltip title="Apply Email Settings"><Button variant="contained" style={Colours.emailReminders.iconStyle} startIcon={<CloudUpload />} onClick={this.saveEmailSettings}>Save config</Button></Tooltip>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        <br/><br/>
        {reminder}
      </div>
    )
  }

}

export default withSnackbar(EmailReminders)
