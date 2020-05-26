import React from 'react'
import League from'./dataviews/League.js'

const editConfig = {
  seasons: false,
  competitions: false,
  fixtures: false,
  teams: false,
  contacts: true
}

const drawConfig = {
  competitions: {
    teams: true,
    fixtures: false,
    matches: false
  }
}

class LeagueContacts extends React.Component {
  constructor (props) {
    super(props)
    this.leaguesAPIClient = props.utils.leaguesAPIClient
    this.utils = {
      leaguesAPIClient: props.utils.leaguesAPIClient
    }
  }

  render () {
    return (
      <div className='mainBody'>
        <center>
          <h1>League Contacts</h1>
        </center>
        <League editConfig={editConfig} drawConfig={drawConfig} utils={this.utils} />
      </div>
    )
  }
}

export default LeagueContacts
