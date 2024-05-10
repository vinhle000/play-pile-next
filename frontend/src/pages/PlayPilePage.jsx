import {useState, useContext} from 'react'
import PlayPileGameList from '../components/PlayPileGameList'

function PlayPilePage() {
  return (

    <div className="mt-10">

    {/* search bar */}
    {/* search results list */}
    {/* pagination */}
    {/* spinner icon */}

    {/* PlayPileGame, show it in a grid style flexbox. it will have a cover image, and on click, a popover will appear being able to assign it to a column */}
    <PlayPileGameList  />

    </div>
  )
}

export default PlayPilePage