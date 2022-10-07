import type { RequestSlice } from '../redux/slices/request'
import tlschema from '../tl-schema.json'

export function call(methodName: string, params: object) {
  
}

export function parseFields(methodName: RequestSlice['method'], fields: RequestSlice['params']): object {
  // const method = tlschema.methods.find(m => m.method === methodName)
  // method.params
  // console.log(fields)
  const entries = Object.entries(fields)
  const result: { [key: string]: any } = {}
  
  const simpleFields = entries.filter(([key]) => !key.startsWith('_'))
  Object.assign(result, Object.fromEntries(simpleFields))

  const vectorFields = entries.filter(([key]) => key.startsWith('_vector_header'))
  for(const [vectorKeyRaw, vectorValuesIDs] of vectorFields) {
    const vectorKey = vectorKeyRaw.match(/^_vector_header_(.+)$/)[1]
    const values = (vectorValuesIDs as string[]).map((valueID: string) => fields[`_vector_item_${vectorKey}_${valueID}`])
    result[vectorKey] = values
  }

  const constructorFields = entries.filter(([key]) => /^_constructor<[^>]+>_subType$/.test(key))
  for(const [fieldKeyRaw, subType] of constructorFields) {
    const fieldID = fieldKeyRaw.match(/^_constructor<([^>]+)>/)[1]
    const constructorSubType = subType//fields[`_constructor<${fieldID}>_subType`]
    const values: { [key: string]: any } = {}
    const constructorFields = entries.filter(([key]) => key.startsWith(`_constructor<${fieldID}>_value_`))
    for(const [innerFieldKeyRaw, innerFieldValue] of constructorFields) {
      const regex = new RegExp(`^_constructor<${fieldID}>_value_(.+)$`)
      const innerFieldKey = innerFieldKeyRaw.match(regex)[1]
      values[innerFieldKey] = innerFieldValue
    }
    console.log(values)
    result[fieldID] = {
      _: constructorSubType,
      ...values
    }
  }

  return result
}