import React from 'react'
import { Switch, Route } from 'react-router-dom'
import './App.css'
import Banner from './Banner.js'
import Home from './Home.js'
import Login from './Login.js'
import EmailReminders from './EmailReminders.js'
import LeagueContacts from './LeagueContacts.js'
import LeagueFixtures from './LeagueFixtures.js'
import LeagueMatches from './LeagueMatches.js'
import PopulateLeagues from './PopulateLeagues.js'

import SeasonsClient from './seasonsClient.js'
import Cookies from 'universal-cookie'
// import jsonwebtoken from 'jsonwebtoken'
const cookies = new Cookies()

class Main extends React.Component {
  render () {
    if (this.props.loggedIn) {
      return (
        <Switch>
          <Route exact path='/ui'>
            <Home loggedIn={this.props.loggedIn} />
          </Route>
          <Route exact path='/ui/LeagueContacts'>
            <LeagueContacts utils={this.props.utils}/>
          </Route>
          <Route exact path='/ui/LeagueFixtures'>
            <LeagueFixtures utils={this.props.utils}/>
          </Route>
          <Route exact path='/ui/LeagueMatches'>
            <LeagueMatches utils={this.props.utils}/>
          </Route>
          <Route exact path='/ui/PopulateLeagues'>
            <PopulateLeagues />
          </Route>
          <Route exact path='/ui/EmailReminders'>
            <EmailReminders />
          </Route>
          <Route exact path='/ui/logout'>
            <Home loggedIn={this.props.loggedIn} logout={true} />
          </Route>
        </Switch>
      )
    } else {
      return (
        <Switch>
          <Route exact path='/ui'>
            <Home loggedIn={this.props.loggedIn} />
          </Route>
          <Route exact path='/ui/login'>
            <Login />
          </Route>
        </Switch>
      )
    }
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: cookies.get('user'),
      loggedIn: typeof cookies.get('user') === 'string'
    }
    this.seasonsClient = new SeasonsClient()
    this.utils = {
      seasonsClient: this.seasonsClient,
      enqueueSnackbar: this.enqueueSnackbar
    }
    // this.checkLoggedIn()
  }

  // Can't do this as we can't access the JWT as it is httponly
  // checkLoggedIn () {
  //   if (typeof cookies.get('user') === 'string' && typeof cookies.get('jwt')) {
  //     try {
  //       const token = jsonwebtoken.verify(cookies.get('jwt'), 'changeThisSecret')
  //       const dateNow = new Date()
  //       const timeNow = dateNow.getTime()
  //       if (timeNow < token.exp) {
  //         this.setState({
  //           username: token.username,
  //           loggedIn: true
  //         })
  //         return
  //       }
  //     } catch (err) {
  //     }
  //   }
  //   this.setState({
  //     username: '',
  //     loggedIn: false
  //   })
  // }

  render () {
    return (
      <div className='app'>
        <Banner loggedIn={this.state.loggedIn} username={this.state.username} />
        <Main loggedIn={this.state.loggedIn} utils={this.utils} />
      </div>
    )
  }
}

// export default withCookies(App)
export default App
