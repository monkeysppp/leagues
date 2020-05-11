import React from 'react'

class EmailReminders extends React.Component {
  render () {
    return (
      <div className='mainBody'>
        <center>
          <h1>Email Reminders</h1>
        </center>
        <p>Expanding config that is open if the config is not set, and closed otherwise.  This contains the settings needed for the app to email, so maybe...</p>
        <ul>
          <li>smtp address</li>
          <li>smtp credentials</li>
          <li>time to send email</li>
        </ul>
        <p>Then the usual settings:</p>
        <ul>
          <li>enabled/disabled</li>
          <li>leader / tailer, or maybe one box and you have to have a template string for where the fixtures go</li>
          <li>The next reminder and it's schedule time</li>
        </ul>
      </div>
    )
  }

}

export default EmailReminders
