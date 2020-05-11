import React from 'react'

class PopulateLeagues extends React.Component {
  render () {
    return (
      <div className='mainBody'>
        <center>
          <h1>Populate Leagues</h1>
        </center>
        <p>One big box to paste the CSV, followed by a box to set the season name</p>
        <p>Click a button to analyse and it shows the teams and fixtures.  This can use the &lt;League /&gt; component but driven by the generated "season" (it'd have to have nothing as editable).  This would require moving the refreshData function up from League, or have it use a different mode.</p>
        <p>The exiting one does "Process Teams", then "Process Fixtures".</p>
      </div>
    )
  }

}

export default PopulateLeagues
