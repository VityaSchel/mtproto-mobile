import tlschema from '../tl-schema.json'

type ParamType = 'number' | 'string' | 'boolean' | 'bytes'| string
type ParamTypeResult = { array: boolean, type: ParamType, isConstructor: boolean, optional: boolean, optionalDefault: any | null }

export const getParamInputType = (mtprotoType: string): ParamTypeResult => {
  const result: ParamTypeResult = { array: false, type: '', isConstructor: false, optional: false, optionalDefault: null }
  const optionalPrefixRegex = /^flags.\d+\?(.+)$/
  if(optionalPrefixRegex.test(mtprotoType)) {
    result.optional = true
    const [,postprefixPart] = mtprotoType.match(optionalPrefixRegex)
    mtprotoType = postprefixPart
  }
  
  const arrayTypeRegex = /^Vector<(.+)>$/
  if(arrayTypeRegex.test(mtprotoType)) {
    const [,subMtprotoType] = mtprotoType.match(arrayTypeRegex)
    const subType = getParamInputType(subMtprotoType)
    if(subType.isConstructor !== undefined) result.isConstructor = subType.isConstructor
    return { ...result, array: true, type: subType.type, isConstructor: subType.isConstructor }
  } else if(['long', 'int', 'double'].includes(mtprotoType)) {
    return { ...result, type: 'number' }
  } else if('bytes' === mtprotoType) {
    return { ...result, type: 'bytes' }
  } else if('string' === mtprotoType) {
    return { ...result, type: 'string' }
  } else if('Bool' === mtprotoType) {
    return { ...result, type: 'boolean' }
  } else if(['true', 'false'].includes(mtprotoType)) {
    return { ...result, type: 'boolean', optionalDefault: mtprotoType === 'true' }
  } else if(/^\d+$/.test(mtprotoType)) {
    return { ...result, type: 'number', optionalDefault: mtprotoType }
  } else {
    return { ...result, type: mtprotoType, isConstructor: true }
  }
}