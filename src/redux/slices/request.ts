import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import tlschema from '../../tl-schema.json'

type MethodName = typeof tlschema['methods'][number]['method']

export interface RequestSlice {
  method: string | null
}

const initialState: RequestSlice = {
  method: null,
}

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    setMethod: (state, action: PayloadAction<MethodName>) => {
      state.method = action.payload
    },
    resetMethod: (state) => {
      state.method = null
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMethod, resetMethod } = requestSlice.actions

export default requestSlice.reducer