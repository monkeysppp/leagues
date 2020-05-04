import React from 'react'
import League from'./components/League.js'

const editConfig = {
  seasons: false,
  competitions: false,
  fixtures: false,
  teams: false,
  contacts: true
}

class LeagueContacts extends React.Component {
  constructor (props) {
    super(props)
    this.seasonsClient = props.utils.seasonsClient
    this.utils = {
      seasonsClient: props.utils.seasonsClient
    }
  }

  render () {
    return (
      <div className='mainBody'>
        <center>
          <h1>League Contacts</h1>
        </center>
        <League editConfig={editConfig} utils={this.utils} />
      </div>
    )
  }
}

export default LeagueContacts
