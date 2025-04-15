import { configureStore } from "@reduxjs/toolkit"
import counterSlice from "./slices/counterSlice.js"
import playerSlice from "./slices/playerSlice.js"
import logSlice from "./slices/logSlice.js"

const store = configureStore({
  reducer: {
    counter: counterSlice,
    player: playerSlice,
    logs: logSlice,
  },
})

export default store
