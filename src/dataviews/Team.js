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
import Colours from '../Colours.js'

class Team extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contactEditable: (this.props.editConfig && this.props.editConfig.hasOwnProperty('contacts')) ? this.props.editConfig.contacts : true,
      addContactDialogOpen: false,
      addContactDialogContactAddress: '',
      editContactDialogOpen: false,
      editContactDialogContact: {},
      deleteContactDialogOpen: false,
      deleteContactDialogContact: {}
    }
    this.utils = props.utils
    this.leaguesAPIClient = props.utils.leaguesAPIClient
    this.enqueueSnackbar = props.utils.enqueueSnackbar
    this.refreshData = props.utils.refreshData

    this.addContactDialogOpen = this.addContactDialogOpen.bind(this)
    this.addContactDialogClose = this.addContactDialogClose.bind(this)
    this.addContactDialogAdd = this.addContactDialogAdd.bind(this)
    this.addContactDialogContactAddressChange = this.addContactDialogContactAddressChange.bind(this)
    this.editContactDialogOpen = this.editContactDialogOpen.bind(this)
    this.editContactDialogClose = this.editContactDialogClose.bind(this)
    this.editContactDialogEdit = this.editContactDialogEdit.bind(this)
    this.editContactDialogContactAddressChange = this.editContactDialogContactAddressChange.bind(this)
    this.deleteContactDialogOpen = this.deleteContactDialogOpen.bind(this)
    this.deleteContactDialogClose = this.deleteContactDialogClose.bind(this)
    this.deleteContactDialogDelete = this.deleteContactDialogDelete.bind(this)
  }

  addContactDialogOpen () {
    this.setState({ addContactDialogOpen: true })
  }

  addContactDialogClose () {
    this.setState({ addContactDialogOpen: false })
  }

  addContactDialogAdd () {
    this.addContactDialogClose()
    const contactAddress = this.state.addContactDialogContactAddress
    this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsPost(this.props.seasonId, this.props.competitionId, this.props.team.id, contactAddress)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Contact ' + contactAddress + ' added', { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar('Failed to add Contact ' + contactAddress, { variant: 'error' })
        })
  }

  addContactDialogContactAddressChange (e) {
    this.setState({ addContactDialogContactAddress: e.target.value })
  }

  editContactDialogOpen(contact) {
    this.setState({ editContactDialogOpen: true, editContactDialogContact: { id: contact.id, originalEmail: contact.email, email: contact.email } })
  }

  editContactDialogClose () {
    this.setState({ editContactDialogOpen: false })
  }

  editContactDialogEdit () {
    this.editContactDialogClose()
    const contact = this.state.editContactDialogContact
    this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdPut(this.props.seasonId, this.props.competitionId, this.props.team.id, contact.id, contact.email)
      .then(
        () => {
          this.refreshData()
          this.enqueueSnackbar('Contact address updated to ' + contact.email, { variant: 'success' })
        },
        (err) => {
          this.enqueueSnackbar('Failed to update contact email from ' + contact.originalEmail + ' to ' + contact.email, { variant: 'error' })
        })
  }

  editContactDialogContactAddressChange (e) {
    const email = e.target.value
    this.setState(state => {
      return { editContactDialogContact: { id: state.editContactDialogContact.id, originalEmail: state.editContactDialogContact.originalEmail, email: email }}
    })
  }

  deleteContactDialogOpen (contact) {
    this.setState({ deleteContactDialogOpen: true, deleteContactDialogContact: contact })
  }

  deleteContactDialogClose () {
    this.setState({ deleteContactDialogOpen: false })
  }

  deleteContactDialogDelete () {
    this.deleteContactDialogClose()
    this.leaguesAPIClient.seasonsSeasonIdCompetitionsCompetitionIdTeamsTeamIdContactsContactIdDelete(this.props.seasonId, this.props.competitionId, this.props.team.id, this.state.deleteContactDialogContact.id)
      .then(
        () => {
          this.enqueueSnackbar('Contact ' + this.state.deleteContactDialogContact.name + ' deleted', { variant: 'success' })
          this.refreshData()
        },
        (err) => {
          this.enqueueSnackbar('Failed to delete Contact ' + this.state.deleteContactDialogContact.name, { variant: 'error' })
        })
  }

  render () {
    const contacts = []

    this.props.team.contacts.forEach((contact) => {
      if (this.state.contactEditable) {
        contacts.push(<div key={contact.id}>
          <Contact contact={contact}></Contact>
          <Tooltip title="Edit contact"><IconButton aria-label="Edit contact" component="span" style={Colours.contacts.iconStyle} onClick={(e) => {e.stopPropagation(); this.editContactDialogOpen(contact)}} onFocus={(event) => event.stopPropagation()}><EditOutlined /></IconButton></Tooltip>
          <Tooltip title="Delete contact"><IconButton aria-label="Delete contact" component="span" style={Colours.contacts.iconStyle} onClick={(e) => {e.stopPropagation(); this.deleteContactDialogOpen(contact)}} onFocus={(event) => event.stopPropagation()}><DeleteOutlined /></IconButton></Tooltip>
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
            <DialogContentText>Enter the email address for the new Contact</DialogContentText>
            <TextField autoFocus margin="dense" id="add-contact-contactAddress" onChange={this.addContactDialogContactAddressChange} onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.addContactDialogAdd()}} label="Contact address" type="email" fullWidth/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.addContactDialogClose} variant="outlined" color="primary">Cancel</Button>
            <Button onClick={this.addContactDialogAdd} variant="contained" color="primary">Add</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.editContactDialogOpen} onClose={this.editContactDialogClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="edit-contact-dialog-title">Edit Contact</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter the email address for the Contact</DialogContentText>
            <TextField autoFocus margin="dense" id="edit-contact-contactAddress" onChange={this.editContactDialogContactAddressChange} onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.editContactDialogEdit()}} label="Contact address" type="email" fullWidth defaultValue={this.state.editContactDialogContact.originalEmail}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.editContactDialogClose} variant="outlined" color="primary">Cancel</Button>
            <Button onClick={this.editContactDialogEdit} variant="contained" color="primary">Edit</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.deleteContactDialogOpen} onClose={this.deleteContactDialogClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="delete-contact-dialog-title">Delete Contact</DialogTitle>
          <DialogContent>
            <DialogContentText onKeyUp={(e) => {if (e.keyCode === 10 || e.keyCode === 13) this.deleteContactDialogDelete()}}>Are you sure you want to delete the contact "{this.state.deleteContactDialogContact.email}" from {this.props.team.name}?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteContactDialogClose} variant="outlined" color="primary">Cancel</Button>
            <Button onClick={this.deleteContactDialogDelete} variant="contained" color="secondary" disableElevation>Delete</Button>
          </DialogActions>
        </Dialog>
      </div>
    }

    return (
      <div>
        {addContact}
        <div>
          {contacts}
        </div>
      </div>
    )
  }
}

export default withSnackbar(Team)
