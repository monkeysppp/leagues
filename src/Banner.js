import React from 'react'
import { NavLink } from 'react-router-dom'

class Banner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: props.loggedIn,
      logout: props.logout,
      username: props.username
    }
  }

  render () {
    //<NavLink to='/logout' onClick={this.props.logout} className='flatLink'>logout</NavLink>
    if (this.props.loggedIn) {
      return (
        <div className='topBanner'>
          <div className='topBannerLeft'>
            <NavLink to='/ui' className='flatLink'>Home</NavLink>
          </div>
          <div className='topBannerRight'>
            <span>Hi {this.state.username} - </span><a href='/auth/logout' className='flatLink'>logout</a>
          </div>
        </div>
      )
      // I'm struggling to get this to actually "go" to /logout, it just changes the URL and handles locally (and finds nothing)
      // so it doesn't actually do anything
    } else {
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
}

export default Banner
