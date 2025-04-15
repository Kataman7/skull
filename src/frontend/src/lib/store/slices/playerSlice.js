import { createSlice } from '@reduxjs/toolkit'
import { generateSimpleId } from '../../helpers/utils'

const initialState = {
  name: '',
  id: generateSimpleId(),
  inGame: false,
  position: [0, 0, 0],
  rotation: 0,
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setInGame: (state, action) => {
      state.inGame = action.payload
    },
    setPosition: (state, action) => {
      state.position = action.payload
    },
    setRotation: (state, action) => {
      state.rotation = action.payload
    },
  },
})

export const playerActions = playerSlice.actions

export default playerSlice.reducer
