import React from 'react'
import { AddBoxOutlined, AddCircleOutlined, DeleteOutlined, EditOutlined, ExpandMoreOutlined, ExpandLessOutlined } from '@material-ui/icons'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tooltip from '@material-ui/core/Tooltip'
import { withSnackbar  } from 'notistack'


class Match extends React.Component {
  constructor(props) {
    super(props)
    const teamMap = {}
    props.teams.forEach(team => {
      teamMap[`id-${team.id}`] = team
    })
    this.state = {
      teams: teamMap,
    }
  }

  render () {
    const matches = []
    this.props.match.matches.forEach((match, index) => {
      matches.push(<div key={index}>
        <span>{match.time} : {this.state.teams[`id-${match.homeTeam}`].name} v {this.state.teams[`id-${match.awayTeam}`].name} ({this.state.teams[`id-${match.refTeam}`].name} ref)</span>
      </div>)
    })

    return (
      <div>
        {matches}
      </div>
    )
    // const matches = []
    // this.state.match.matches.forEach((match, index) => {
    //   matches.push(<div key={index}>
    //     <span>{match.time} : {this.state.teams[`id-${match.homeTeam}`].name} v {this.state.teams[`id-${match.awayTeam}`].name} ({this.state.teams[`id-${match.refTeam}`].name} ref)</span>
    //   </div>)
    // })
    //
    // if (this.state.expanded) {
    //   return (
    //     <div className='matchbox'>
    //       <span className='boxButton' onClick={() => this.toggleExpanded()}>{this.state.match.date}&nbsp;&nbsp;<EditOutlined />&nbsp;&nbsp;<DeleteOutlined /></span>
    //       {matches}
    //     </div>
    //   )
    // }
    // return (
    //   <div className='matchbox'>
    //     <span className='boxButton' onClick={() => this.toggleExpanded()}>{this.state.match.date}...&nbsp;&nbsp;<EditOutlined />&nbsp;&nbsp;<DeleteOutlined /></span>
    //   </div>
    // )
  }
}

export default withSnackbar(Match)
