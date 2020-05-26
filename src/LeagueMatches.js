import React from 'react'
import League from'./dataviews/League.js'

const editConfig = {
  seasons: false,
  competitions: false,
  fixtures: false,
  teams: false,
  contacts: false
}

const drawConfig = {
  competitions: {
    teams: false,
    fixtures: false,
    matches: true
  }
}

class LeagueMatches extends React.Component {
  constructor (props) {
    super(props)
    this.leaguesAPIClient = props.utils.leaguesAPIClient
    this.utils = {
      leaguesAPIClient: this.leaguesAPIClient
    }
  }

  render () {
    return (
      <div className='mainBody'>
        <center>
          <h1>League Matches</h1>
        </center>
        <League editConfig={editConfig} drawConfig={drawConfig} utils={this.utils} />
      </div>
    )
  }
}

export default LeagueMatches
