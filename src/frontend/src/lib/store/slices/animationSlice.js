import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

const animationSlice = createSlice({
  name: 'animation',
  initialState,
  reducers: {
    playAnimation: (state, action) => {
      state.value[action.payload.playerIndex] = action.payload.animationName
    }
  },
})

export const animationActions = animationSlice.actions

export default counterSlice.reducer
