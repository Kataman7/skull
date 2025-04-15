import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSocketContext } from '../../lib/contexts/SocketContext'
import AtmButton from '../atoms/AtmButton'
import { playerActions } from '../../lib/store/slices/playerSlice'

const MolGameJoin = () => {
  const { name, inGame } = useSelector((state) => state.player)
  const dispatch = useDispatch()
  const { joinGame, connected } = useSocketContext()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      joinGame(name)
    }
  }

  return (

    inGame ? null :

    <div>
      <h2 className="text-xl mb-4">Join the game</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="playerName" className="block mb-2">Player's name</label>
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => dispatch(playerActions.setName(e.target.value))}
            className="w-full p-2 bg-gray-900 text-white"
            required
          />
        </div>
        <AtmButton 
          label="Rejoindre" 
          onClick={handleSubmit} 
          disabled={!connected || !name.trim()}
        />
        {!connected && <p className="text-yellow-500 mt-2">Connecting to the server...</p>}
      </form>
    </div>
  )
}

export default MolGameJoin