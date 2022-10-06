import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { useAppSelector } from '../../redux/store'
import tlschema from '../../tl-schema.json'
import styles from './styles'

export default function MethodParams() {
  const request = useAppSelector(selector => selector.request)
  const method = tlschema.methods.find(m => m.method === request.method)

  if(!method) return (
    <Text>
      Select method first
    </Text>
  )

  const methodParams = method.params

  return (
    <View style={styles.params}>
      {methodParams
        .filter(param => !['!X', '#'].includes(param.name))
        .map((param, i) => <Param param={param} key={i} />)}
    </View>
  )
}

type ParamAlias = typeof tlschema['methods'][number]['params'][number]
type ParamType = 'number' | 'string' | 'boolean' | 'bytes'| string
type ParamTypeResult = { array: boolean, type: ParamType, isConstructor: boolean, optional: boolean, optionalDefault: any }

const getParamInputType = (mtprotoType: string): ParamTypeResult => {
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
  } else if('Bool' === mtprotoType) {
    return { ...result, type: 'boolean' }
  } else if(['true', 'false'].includes(mtprotoType)) {
    return { ...result, type: 'boolean', optionalDefault: mtprotoType }
  } else if(/^\d+$/.test(mtprotoType)) {
    return { ...result, type: 'number', optionalDefault: mtprotoType }
  } else {
    return { ...result, type: mtprotoType, isConstructor: true }
  }
}

function Param(props: { param: ParamAlias }) {
  const paramType = getParamInputType(props.param.type)

  const paramComponent = paramType.isConstructor
    ? <Text>[_] {paramType.type} [_]</Text>
    : {
      'number': <Text>number</Text>,
      'string': <Text>string</Text>,
      'boolean': <Text>bool</Text>,
      'bytes': <Text>bytes</Text>,
    }[paramType.type]

  return (
    <View style={styles.param}>
      <Text style={{ fontWeight: 'bold' }}>{props.param.name}: </Text>
      {paramType.array
        ? <ArrayOfParams>{paramComponent}</ArrayOfParams>
        : paramComponent}
    </View>
  )
}

function ArrayOfParams(props: { children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: 'gray' }}>
      {props.children}
    </View>
  )
}