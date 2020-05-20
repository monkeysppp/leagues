import React from 'react'
import { NavLink } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: '#ffffff'
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    'background-color': '#3C91E6'
  }
})

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
    const { classes } = this.props
    //<NavLink to='/logout' onClick={this.props.logout} className='flatLink'>logout</NavLink>
    if (this.props.loggedIn) {
      return (
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <NavLink to='/ui' className="whiteLink">
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <HomeIcon />
              </IconButton>
            </NavLink>
            <Typography variant="h6" className={classes.title}>
              Leagues
            </Typography>
            <a href="/auth/logout" className="whiteLink">Logout</a>
          </Toolbar>
        </AppBar>
      )
      // <div className='topBanner'>
      //   <div className='topBannerLeft'>
      //     <NavLink to='/ui' className='flatLink'>Home</NavLink>
      //   </div>
      //   <div className='topBannerRight'>
      //     <span>Hi {this.state.username} - </span><a href='/auth/logout' className='flatLink'>logout</a>
      //   </div>
      // </div>
    } else {
      return (
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <NavLink to='/ui' className="whiteLink">
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <HomeIcon />
              </IconButton>
            </NavLink>
            <Typography variant="h6" className={classes.title}>
              Leagues
            </Typography>
            <NavLink to='/ui/login' className="whiteLink">Login</NavLink>
          </Toolbar>
        </AppBar>
      )
      // <div className='topBanner'>
      //   <div className='topBannerLeft'>
      //     <NavLink to='/ui' className='flatLink'>Home</NavLink>
      //   </div>
      //   <div className='topBannerRight'>
      //     <NavLink to='/ui/login' className='flatLink'>login</NavLink>
      //   </div>
      // </div>
    }
  }
}

export default withStyles(styles)(Banner)
