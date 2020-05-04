import React from 'react'
import { AddCircleOutlined, DeleteOutlined, EditOutlined } from '@material-ui/icons'

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

import Contact from'./Contact.js'

class Team extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contactEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('contacts')) ? this.props.editConfig.contacts : true,
      addContactDialogOpen: false,
      addContactDialogContactAddress: ''
    }
    this.utils = props.utils
    this.seasonsClient = props.utils.seasonsClient
    this.enqueueSnackbar = props.utils.enqueueSnackbar
    this.refreshData = props.utils.refreshData

    this.addContactDialogClose = this.addContactDialogClose.bind(this)
    this.addContactDialogOpen = this.addContactDialogOpen.bind(this)
    this.addContactDialogAdd = this.addContactDialogAdd.bind(this)
    this.addContactDialogContactNameChange = this.addContactDialogContactNameChange.bind(this)
    this.deleteContact = this.deleteContact.bind(this)
  }

  addContactDialogAdd () {
    this.addContactDialogClose()
    const contactAddress = this.state.addContactDialogContactAddress
    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsPost(this.props.seasonId, this.props.competitionId, this.props.team.id, contactAddress)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Contact ' + contactAddress + ' added', { variant: 'success' });
        },
        (err) => {
          this.enqueueSnackbar('Failed to add Contact ' + contactAddress, { variant: 'error' });
        })
  }

  addContactDialogOpen () {
    this.setState({ addContactDialogOpen: true })
  }

  addContactDialogClose () {
    this.setState({ addContactDialogOpen: false })
  }

  addContactDialogContactNameChange (e) {
    this.setState({ addContactDialogContactAddress: e.target.value })
  }

  deleteContact (contact) {
    this.seasonsClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdDelete(this.props.seasonId, this.props.competitionId, this.props.team.id, contact.id)
      .then(
        () => {
          this.enqueueSnackbar('Contact ' + contact.name + ' deleted', { variant: 'success' })
          this.refreshData()
        },
        (err) => {
          this.enqueueSnackbar('Failed to delete Season ' + contact.name, { variant: 'error' })
        })
  }

  render () {
    const contacts = []

    this.props.team.contacts.forEach((contact) => {
      if (this.state.contactEditable) {
        contacts.push(<div key={contact.id}>
          <Contact contact={contact}></Contact>
          <Tooltip title="Edit contact"><IconButton aria-label="Edit contact" component="span"><EditOutlined /></IconButton></Tooltip>
          <Tooltip title="Delete contact"><IconButton aria-label="Delete contact" component="span" onClick={(e) => {e.stopPropagation(); this.deleteContact(contact)}} onFocus={(event) => event.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
        </div>)
      } else {
        contacts.push(<Contact contact={contact}></Contact>)
      }
    })

    let addContact = <span></span>
    if (this.state.contactEditable) {
      addContact = <div>
        <Tooltip title="Add new contact"><Button style={{ color: "#66cc66" }} startIcon={<AddCircleOutlined />} onClick={this.addContactDialogOpen}>Add Contact</Button></Tooltip>
        <Dialog open={this.state.addContactDialogOpen} onClose={this.addContactDialogClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="add-contact-dialog-title">Add Contact</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter the name for the new Contact</DialogContentText>
            <TextField autoFocus margin="dense" id="add-contact-contactName" onChange={this.addContactDialogContactNameChange} onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.addContactDialogAdd()}} label="Contact address" type="email" fullWidth/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.addContactDialogClose} color="primary">Cancel</Button>
            <Button onClick={this.addContactDialogAdd} color="primary">Add</Button>
          </DialogActions>
        </Dialog>
      </div>
    }

    return (
      <div>
        {addContact}
        {contacts}
      </div>
    )
  }
}

export default withSnackbar(Team)
