import React from 'react'

import Colours from '../Colours.js'

class MatchList extends React.Component {
  constructor(props) {
    super(props)
    const teamMap = {}
    props.teams.forEach(team => {
      teamMap[`id-${team.id}`] = team
    })
    this.state = {
      teamMap: teamMap
    }
  }

  render () {
    const matches = []
    let teamId

    this.props.teams.forEach(team => {
      if (team.name === this.props.team.name) {
        teamId = this.props.team.id
      }
    })

    this.props.fixtures.forEach((fixture, findex) => {
      fixture.matches.forEach((match, mindex) => {
        if (match.homeTeam === teamId || match.awayTeam === teamId) {
          let index = `${findex}:${mindex}`
          matches.push(<div key={index}>
            <span style={Colours.matches.iconStyle}>{fixture.date} : {this.state.teamMap[`id-${match.homeTeam}`].name} v {this.state.teamMap[`id-${match.awayTeam}`].name}</span>
          </div>)
        }
      })
    })

    return (
      <div>
        {matches}
      </div>
    )
  }
}

export default MatchList
