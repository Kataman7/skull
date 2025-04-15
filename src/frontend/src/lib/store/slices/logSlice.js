import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
}

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    }
  },
})

export const logsActions = logSlice.actions

export default logSlice.reducer
