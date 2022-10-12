import type { RequestSlice } from '../redux/slices/request'
import tlschema from '../tl-schema.json'
import { getParamInputType } from './schemaParamParser'

global.apiLogger = []

const logging = {
  log(...content: (string | object)[]) {
    console.log(...content)
    global.apiLogger.push(({ type: 'info', content: consoleFormatter(...content) }))
    global.apiLoggerUpdate()
  },
  error(...content: (string | object)[]) {
    console.error(...content)
    global.apiLogger.push(({ type: 'error', content: consoleFormatter(...content) }))
    global.apiLoggerUpdate()
  }
}

const consoleFormatter = (...content: (string | object)[]): string => {
  return content.map(contentPart => {
    if(typeof contentPart === 'string') {
      return contentPart
    } else {
      if(typeof contentPart === 'object') {
        if(contentPart['app_id']) contentPart['app_id'] = '[hidden from console]'
        if(contentPart['app_hash']) contentPart['app_hash'] = '[hidden from console]'
      }
      return JSON.stringify(contentPart, null, 2)
    }
  }).join(' ')
}

export async function call(methodName: string, params: object) {
  global.api.openConsole()
  logging.log('Executing', methodName, 'with params', params)
  try {
    const result = await global.api.call(methodName, params)
    logging.log(result)
  } catch(e) {
    logging.error(JSON.stringify(e))
  }
}

export function parseFields(defaults: { [key: string]: any }, fields: RequestSlice['params']): object {
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
    const constructorSubType = subType
    const values: { [key: string]: any } = {}
    const constructorFields = entries.filter(([key]) => key.startsWith(`_constructor<${fieldID}>_value_`))
    for(const [innerFieldKeyRaw, innerFieldValue] of constructorFields) {
      const regex = new RegExp(`^_constructor<${fieldID}>_value_(.+)$`)
      const innerFieldKey = innerFieldKeyRaw.match(regex)[1]
      values[innerFieldKey] = innerFieldValue
    }
    result[fieldID] = {
      _: constructorSubType,
      ...parseFields({}, values)
    }
  }

  return result
}

export function getDefaults(methodName: string): { [key: string]: any } {
  const result: { [key: string]: any } = {}
  const method = tlschema.methods.find(m => m.method === methodName)
  if(!method) return {}

  for(const param of method.params) {
    const paramType = getParamInputType(param.type)
    if(paramType.optionalDefault !== null)
      result[param.name] = paramType.optionalDefault
  }

  return result
}