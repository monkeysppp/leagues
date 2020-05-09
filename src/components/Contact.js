import React from 'react'

import Colours from '../Colours.js'

class Contact extends React.Component {
  render () {
    return (
      <span style={Colours.contacts.iconStyle}>{this.props.contact.email}</span>
    )
  }
}

export default Contact
