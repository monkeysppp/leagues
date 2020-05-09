import React from 'react'

import Colours from '../Colours.js'

class Fixture extends React.Component {
  constructor(props) {
    super(props)
    const teamMap = {}
    props.teams.forEach(team => {
      teamMap[`id-${team.id}`] = team
    })
    this.state = {
      teams: teamMap,
    }
  }

  render () {
    const matches = []
    this.props.fixture.matches.forEach((match, index) => {
      matches.push(<div key={index}>
        <span style={Colours.matches.iconStyle}>{match.time} : {this.state.teams[`id-${match.homeTeam}`].name} v {this.state.teams[`id-${match.awayTeam}`].name} ({this.state.teams[`id-${match.refTeam}`].name} ref)</span>
      </div>)
    })

    return (
      <div>
        {matches}
      </div>
    )
  }
}

export default Fixture
