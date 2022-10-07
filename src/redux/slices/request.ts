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
  | { type: 'vector', value: string[] | null }

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    setMethod: (state, action: PayloadAction<MethodName>) => {
      state.method = action.payload
    },
    setParam: (state, action: PayloadAction<{ fieldID: string, value: ParamNewValue }>) => {
      state.params[action.payload.fieldID] = action.payload.value.value
    },
    resetMethod: (state) => {
      state.method = null
    },
    resetParams: (state) => {
      state.params = {}
    },
    resetData: (state) => {
      state.method = null
      state.params = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setMethod, setParam, resetMethod, resetParams, resetData } = requestSlice.actions

export default requestSlice.reducer