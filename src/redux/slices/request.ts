import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import tlschema from '../../tl-schema.json'

type MethodName = typeof tlschema['methods'][number]['method']

export interface RequestSlice {
  method: string | null
  params: { [key: string]: number | string | boolean | string[] | null }
}

const initialState: RequestSlice = {
  method: null,
  params: {}
}

type ParamNewValue = { type: 'number', value: string | number | null }
  | { type: 'string', value: string | null }
  | { type: 'boolean', value: boolean | null }
  | { type: 'bytes', value: string[] | null }
  // | { type: 'constructor', value: number }

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    setMethod: (state, action: PayloadAction<MethodName>) => {
      state.method = action.payload
    },
    resetMethod: (state) => {
      state.method = null
    },
    setParam: (state, action: PayloadAction<{ fieldID: string, value: ParamNewValue }>) => {
      state.params[action.payload.fieldID] = action.payload.value.value
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMethod, resetMethod, setParam } = requestSlice.actions

export default requestSlice.reducer