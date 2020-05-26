import React from 'react'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/styles'
import Colours from './Colours.js'

const NavCard = withStyles(() => ({
  root: {
    maxWidth: 230,
    margin: '5px',
    display: 'inline-block',
    background: Colours.navigationCars.background,
    color: 'white'
  }
}))(Card)

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
            <NavCard>
              <CardActionArea onClick={() => this.routeChange('/ui/PopulateLeagues')}>
                <CardContent>
                  <Typography variant="h5" component="h4">Populate League</Typography>
                  <Typography variant="body2" component="p">Import data on a league from CSV</Typography>
                </CardContent>
              </CardActionArea>
            </NavCard>
            <NavCard>
              <CardActionArea onClick={() => this.routeChange('/ui/LeagueContacts')}>
                <CardContent>
                  <Typography variant="h5" component="h4">League Contacts</Typography>
                  <Typography variant="body2" component="p">Check and update the team contacts</Typography>
                </CardContent>
              </CardActionArea>
            </NavCard>
            <NavCard>
              <CardActionArea onClick={() => this.routeChange('/ui/LeagueFixtures')}>
                <CardContent>
                  <Typography variant="h5" component="h4">League Fixtures</Typography>
                  <Typography variant="body2" component="p">Edit every aspect of a season's data</Typography>
                </CardContent>
              </CardActionArea>
            </NavCard>
            <NavCard>
              <CardActionArea onClick={() => this.routeChange('/ui/LeagueMatches')}>
                <CardContent>
                  <Typography variant="h5" component="h4">League Matches</Typography>
                  <Typography variant="body2" component="p">View a list of matches for each team</Typography>
                </CardContent>
              </CardActionArea>
            </NavCard>
            <NavCard>
              <CardActionArea onClick={() => this.routeChange('/ui/EmailReminders')}>
                <CardContent>
                  <Typography variant="h5" component="h4">Email Reminders</Typography>
                  <Typography variant="body2" component="p">Manage the email reminders sent out to the teams</Typography>
                </CardContent>
              </CardActionArea>
            </NavCard>
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
