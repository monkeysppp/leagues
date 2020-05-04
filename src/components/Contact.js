import React from 'react'
import { AddBoxOutlined, AddCircleOutlined, DeleteOutlined, EditOutlined, ExpandMoreOutlined, ExpandLessOutlined } from '@material-ui/icons'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'

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

class Contact extends React.Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   competition: props.competition,
    //   expanded: false
    // }
  }

  // toggleExpanded () {
  //   this.setState(
  //     { expanded: !this.state.expanded }
  //   )
  // }

  render () {
    return (
      <div>{this.props.contact.email}</div>
    )
    // const contacts = []
    //
    // this.state.competition.fixtures.forEach((fixture) => {
    //   fixtures.push(<Contact fixture={fixture}  key={fixture.id} contacts={this.state.competition.contacts}/>)
    // })
    //
    // if (this.state.expanded) {
    //   return (
    //     <div className='competitionbox'>
    //       <span className='boxButton' onClick={() => this.toggleExpanded()}>Competition:{this.state.competition.name}&nbsp;&nbsp;<EditOutlined />&nbsp;&nbsp;<DeleteOutlined /></span>
    //       {fixtures}
    //       <div className='fixturebox narrow'>
    //         <span className='boxButton' onClick={() => {}}><AddBoxOutlined /></span>
    //       </div>
    //     </div>
    //   )
    // }
    // return (
    //   <div className='competitionbox'>
    //     <span className='boxButton' onClick={() => this.toggleExpanded()}>Competition:{this.state.competition.name}...&nbsp;&nbsp;<EditOutlined />&nbsp;&nbsp;<DeleteOutlined /></span>
    //   </div>
    // )
  }
}

export default withSnackbar(Contact)
