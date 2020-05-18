import React from 'react'
import League from'./dataviews/League.js'

class LeagueFixtures extends React.Component {
  constructor (props) {
    super(props)
    this.seasonsClient = props.utils.seasonsClient
    this.utils = {
      seasonsClient: this.seasonsClient
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
