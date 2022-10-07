import clone from 'just-clone'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button, IconButton, Text } from 'react-native-paper'
import tlschema from '../../tl-schema.json'
import { BooleanField, FieldProps, NumberField, StringField } from './fields'
import styles from './styles'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { setParam } from '../../redux/slices/request'

export default function MethodParams(props: { methodParams: { name: string, type: string }[], prefix: string }) {
  return (
    <ScrollView style={styles.params} nestedScrollEnabled>
      {props.methodParams
        .filter(param => !['!X', '#'].includes(param.type))
        .map((param, i) => <Param param={param} prefix={props.prefix} key={i} />)}
    </ScrollView>
  )
}

type ParamAlias = typeof tlschema['methods'][number]['params'][number]
type ParamType = 'number' | 'string' | 'boolean' | 'bytes'| string
type ParamTypeResult = { array: boolean, type: ParamType, isConstructor: boolean, optional: boolean, optionalDefault: any | null }

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

function Param(props: { param: ParamAlias, prefix: string }) {
  const navigation = useNavigation()
  const paramType = getParamInputType(props.param.type)

  const sharedProps: FieldProps = { fieldID: props.prefix + props.param.name, default: paramType.optionalDefault }

  const paramComponent = paramType.isConstructor
    ? (
      <View>
        {/* {!paramType.array && <Text style={{ marginRight: 10 }}>[_]</Text>} */}
        <Button 
          // icon='playlist-edit' 
          mode='outlined' 
          onPress={() => {
            navigation.push('ConstructorEditor', { 
              constructorType: paramType.type,
              prefix: props.prefix,
              field: props.param.name
            })
          }}
          style={{ flex: 1 }}
          compact
        >
          <Icon name='playlist-edit' size={15} />
          {' '}
          {paramType.type}
        </Button>
      </View>
    )
    : {
      'number': <NumberField {...sharedProps} />,
      'string': <StringField {...sharedProps} />,
      'boolean': <BooleanField {...sharedProps} />,
      'bytes': <Text>bytes</Text>,
    }[paramType.type]
  if(paramComponent === undefined) throw 'Unknown param type'

  return (
    <View style={styles.param}>
      <Text style={styles.paramName}>{props.param.name}{paramType.optional && '?'}: </Text>
      {paramType.array
        ? <ArrayOfParams fieldProps={sharedProps}>{paramComponent}</ArrayOfParams>
        : paramComponent}
    </View>
  )
}

function ArrayOfParams(props: { children: JSX.Element, fieldProps: FieldProps }) {
  // const [value, setValue] = React.useState<string[]>([])
  const request = useAppSelector(store => store.request)
  const arrayFieldID = `_vector_header_${props.fieldProps.fieldID}`
  const value = request.params[arrayFieldID] as string[] ?? []
  const dispatch = useAppDispatch()

  const setValue = (newValues: string[]) => {
    dispatch(setParam({ fieldID: arrayFieldID, value: { type: 'vector', value: newValues } }))
  }

  const addItem = () => {
    setValue(value.concat(nanoid()))
  }

  const removeItem = (index: number) => {
    const newArray = clone(value)
    newArray.splice(index, 1)
    setValue(newArray)
  }

  return (
    <View style={styles.vector}>
      <View style={styles.vectorTopRow}>
        <Text style={styles.vectorInfo}>Vector ({value.length})</Text>
        <Button 
          mode='contained-tonal'
          compact 
          onPress={addItem}
          style={styles.vectorAdd}
        >+</Button>
      </View>
      <ScrollView style={styles.vectorList} nestedScrollEnabled>
        {value.map((fieldArrayID, index) => (
          <View key={index} style={styles.vectorField}>
            {{ 
              ...props.children, 
              props: { 
                ...props.children.props, 
                fieldID: `_vector_item_${props.fieldProps.fieldID}_${fieldArrayID}` 
              }
            }}
            <IconButton 
              icon='trash-can-outline'
              size={15}
              onPress={() => removeItem(index)}
              style={styles.vectorRemove}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}