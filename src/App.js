import React from 'react'
// import { NavLink } from 'react-router-dom'
import { NavLink, Switch, Route } from 'react-router-dom'
import './App.css'

function LeagueContacts () {
  return (
    <div className='mainBody'>
      <center>
        <h1>SADVA League Contacts</h1>
      </center>
    </div>
  )
}

function LeagueFixtures () {
  return (
    <div className='mainBody'>
      <center>
        <h1>SADVA League Fixtures</h1>
      </center>
    </div>
  )
}

function LeagueMatches () {
  return (
    <div className='mainBody'>
      <center>
        <h1>SADVA League Matches</h1>
      </center>
    </div>
  )
}

class Home extends React.Component {
  render () {
    if (this.props.loggedIn) {
      return (
        <div className='mainBody'>
          <center>
            <h1>SADVA League Resources</h1>
          </center>
          <center>
            <NavLink to='/ui/LeagueContacts'>League Contacts</NavLink><br />
            <NavLink to='/ui/LeagueFixtures'>League Fixtures</NavLink><br />
            <NavLink to='/ui/LeagueMatches'>League Matches</NavLink><br />
          </center>
        </div>
      )
    } else {
      return (
        <div className='mainBody'>
          <center>
            <h1>SADVA League Resources</h1>
          </center>
          <center>
            <p>Welcome to SADVA League Resources</p>
          </center>
        </div>
      )
    }
  }
}

function Login () {
  return (
    <div className='loginback'>
      <div className='loginwrap'>
        <div id='login' className='login'>
          <form action='/ui/login' method='post'>
            <div className='headingBlock'>
              <div className='heading'>
                <span className='heading'>SADVA League Resources login</span>
              </div>
            </div>
            <div className='entryBlock'>
              <div className='entryField'>
                <span>Username:</span>
              </div>
              <div className='entryField'>
                <input id='username' name='username' className='loginCredentials' />
              </div>
            </div>
            <div className='entryBlock'>
              <div className='entryField'>
                <span>Password:</span>
              </div>
              <div className='entryField'>
                <input id='password' name='password' type='password' className='loginCredentials' />
              </div>
            </div>
            <div className='buttonBlock'>
              <input type='submit' value='Log in' className='loginButton' />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

class Main extends React.Component {
  render () {
    if (this.props.loggedIn) {
      return (
        <Switch>
          <Route exact path='/ui'>
            <Home loggedIn={this.props.loggedIn} />
          </Route>
          <Route exact path='/ui/LeagueContacts'>
            <LeagueContacts />
          </Route>
          <Route exact path='/ui/LeagueFixtures'>
            <LeagueFixtures />
          </Route>
          <Route exact path='/ui/LeagueMatches'>
            <LeagueMatches />
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

class Banner extends React.Component {
  // <button onClick={this.props.loginFunc}>{this.props.loggedIn ? 'Hi andy - logout' : 'login'}</button>
  render () {
    return (
      <div className='topBanner'>
        <div className='topBannerLeft'>
          <NavLink to='/ui' className='flatLink'>Home</NavLink>
        </div>
        <div className='topBannerRight'>
          <NavLink to='/ui/login' className='flatLink'>login</NavLink>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: false
    }

    this.login = this.login.bind(this)
  }

  // temp fake login
  login () {
    this.setState(state => ({
      loggedIn: !this.state.loggedIn
    }))
  }

  render () {
    return (
      <div className='app'>
        <Banner loggedIn={this.state.loggedIn} loginFunc={this.login} />
        <Main loggedIn={this.state.loggedIn} />
      </div>
    )
  }
}

export default App
