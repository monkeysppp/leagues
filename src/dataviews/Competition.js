import React from 'react'

import Fixtures from './Fixtures.js'
import Teams from './Teams.js'
import Matches from './Matches.js'

class Competition extends React.Component {
  constructor(props) {
    super(props)
    this.utils = props.utils
  }

  render () {
    return (
      <div>
        <Fixtures editConfig={this.props.editConfig} drawConfig={this.props.drawConfig} season={this.props.season} competition={this.props.competition} utils={this.utils}/>
        <Teams editConfig={this.props.editConfig} drawConfig={this.props.drawConfig} season={this.props.season} competition={this.props.competition} utils={this.utils}/>
        <Matches editConfig={this.props.editConfig} drawConfig={this.props.drawConfig} season={this.props.season} competition={this.props.competition} utils={this.utils}/>
      </div>
    )
  }
}

export default Competition
