function isLineGood(line) {
  const parts = line.split(',')
  const fixtureDate = parts[0]
  const time = parts[1]
  const court = parts[2]
  const comp = parts[3]
  const team1 = parts[4]
  const team2 = parts[5]
  const referee = parts[6]

  if (fixtureDate && time && court && comp && team1 && team2 && referee) {
    if (!fixtureDate.match(/Date/)) {
      if (!team1.match(/Men \d/)) {
        return true
      }
    }
  }

  return false
}

function truncateLine(line) {
  let pos = 0

  for (let i = 0; i < 22; i++) {
    pos = line.indexOf(',', pos + 1)
  }

  return (pos === -1) ? line : line.substring(0, pos)
}

function cleanCSV(csvIn) {
  const lines = csvIn.split('\n')
  let hasALine = false
  let csvOut = ''

  lines.forEach(line => {
    if (isLineGood(line)) {
      if (hasALine) {
        csvOut += '\n'
      }

      csvOut += truncateLine(line)
      hasALine = true
    }
  })

  return csvOut
}

function getCompetition(line) {
  return line.split(',')[3]
}

function isCompetition(line, competition) {
  const parts = line.split(',')
  const rex = RegExp(competition)
  return (parts[3].match(rex))
}

function getCompetitions(csvIn) {
  console.log('Extracting competitions')
  const lines = csvIn.split('\n')
  const competitionList = []
  const competitions = []

  lines.forEach(line => {
    competitionList[getCompetition(line)] = true
  })

  let count = 1
  Object.keys(competitionList).forEach(competitionName => {
    console.log(`Found Competition ${competitionName}`)
    competitions.push({ id: count++, name: competitionName })
  })

  return competitions;
}

function getHomeTeam(line) {
  return line.split(',')[4]
}

function getAwayTeam(line) {
  return line.split(',')[5]
}

function getRefTeam(line) {
  return line.split(',')[6]
}

function getTeams(csvIn, competition) {
  console.log(`Extracting Teams for Competition ${competition.name}`)
  const lines = csvIn.split('\n')
  const teamList = {}
  const teams = []

  lines.forEach(line => {
    if (isCompetition(line, competition.name)) {
      teamList[getHomeTeam(line)] = true
      teamList[getAwayTeam(line)] = true
      teamList[getRefTeam(line)] = true
    }
  })

  let count = 1
  Object.keys(teamList).forEach(teamName => {
    console.log(`Found Team ${teamName}`)
    let team = {
      id: count++,
      name: teamName,
      contacts: []
    }
    teams.push(team)
  })

  return teams
}

function getFixtures(csvIn, competition) {
  console.log(`Extracting Fixtures for Competition ${competition.name}`)
  const lines = csvIn.split('\n')
  let thisFixture
  const fixtures = []

  const teamMap = {}
  competition.teams.forEach((team) => {
    teamMap[`id-${team.name}`] = team.id
  })

  let count = 1
  lines.forEach(line => {
    if (isCompetition(line, competition.name)) {
      const parts = line.split(',')
      if (!thisFixture || thisFixture.date !== parts[0]) {
        console.log(`Found Fixture on ${parts[0]}`)
        thisFixture = {
          id: count++,
          date: parts[0],
          venue: parts[2],
          matches: []
        }
        if (parts[22] && parts[22].length > 1) {
          thisFixture.adjudicator = parts[22]
        }
        fixtures.push(thisFixture)
      }

      const thisMatch = {
        id: count++,
        time: parts[1],
        homeTeam: teamMap[`id-${parts[4]}`],
        awayTeam: teamMap[`id-${parts[5]}`],
        refTeam: teamMap[`id-${parts[6]}`]
      }
      thisFixture.matches.push(thisMatch)
    }
  })

  return fixtures
}

module.exports = {
  cleanCSV: cleanCSV,
  getFixtures: getFixtures,
  getCompetitions: getCompetitions,
  getTeams: getTeams,
};
