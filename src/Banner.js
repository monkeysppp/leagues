import React from 'react'
import { NavLink } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import { withStyles } from '@material-ui/core/styles'
import packageJson from '../package.json';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: '#ffffff'
  },
  version: {
    flexGrow: 1,
    fontSize: 12,
    color: '#bbccff',
    marginTop: '5px'
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
    if (this.props.loggedIn) {
      return (
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <NavLink to='/ui' className="whiteLink">
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <HomeIcon />
              </IconButton>
            </NavLink>
            <Typography variant="h6">Leagues</Typography>
            <Typography variant="body2" className={classes.version}>&nbsp;&nbsp;v{packageJson.version}</Typography>
            <a href="/auth/logout" className="whiteLink">Logout</a>
          </Toolbar>
        </AppBar>
      )
    } else {
      return (
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <NavLink to='/ui' className="whiteLink">
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <HomeIcon />
              </IconButton>
            </NavLink>
            <Typography variant="h6">Leagues</Typography>
            <Typography variant="body2" className={classes.version}>&nbsp;&nbsp;v{packageJson.version}</Typography>
            <NavLink to='/ui/login' className="whiteLink">Login</NavLink>
          </Toolbar>
        </AppBar>
      )
    }
  }
}

export default withStyles(styles)(Banner)
