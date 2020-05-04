import React from 'react'
import { withRouter } from 'react-router-dom'

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.routeChange = this.routeChange.bind(this);
  }

  routeChange=(path)=> {
    this.props.history.push(path)
  }

  render () {
    if (this.props.loggedIn) {
      return (
        <div className='mainBody'>
          <center>
            <h1>Leagues</h1>
          </center>
          <center>
            <button className="tile" onClick={() => this.routeChange('/ui/PopulateLeagues')}>Populate<br/>League</button>
            <button className="tile" onClick={() => this.routeChange('/ui/LeagueContacts')}>League<br/>Contacts</button>
            <button className="tile" onClick={() => this.routeChange('/ui/LeagueFixtures')}>League<br/>Fixtures</button>
            <button className="tile" onClick={() => this.routeChange('/ui/LeagueMatches')}>League<br/>Matches</button>
            <button className="tile" onClick={() => this.routeChange('/ui/EmailReminders')}>Email<br/>Reminders</button>
          </center>
        </div>
      )
    } else {
      return (
        <div className='mainBody'>
          <center>
            <h1>League Resources</h1>
          </center>
          <center>
            <p>Welcome to League Resources</p>
          </center>
        </div>
      )
    }
  }
}

export default withRouter(Home)
