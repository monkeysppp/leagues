import React from 'react'
import League from'./dataviews/League.js'

class LeagueFixtures extends React.Component {
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
          <h1>League Fixtures</h1>
        </center>
        <League utils={this.utils} />
      </div>
    )
  }
}

export default LeagueFixtures
