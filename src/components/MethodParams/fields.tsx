import React from 'react'
import { Checkbox, Text, TextInput } from 'react-native-paper'
import { setParam } from '../../redux/slices/request'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import styles from './styles'

export type FieldProps = {
  fieldID: string
  default: null | any
}

export function NumberField(props: FieldProps) {
  const params = useAppSelector(selector => selector.request.params)
  const dispatch = useAppDispatch()
  const value = params[props.fieldID] ?? ''
  const setValue = (text: string | number | null) => dispatch(setParam({ fieldID: props.fieldID, value: { type: 'number', value: text } }))
  
  React.useEffect(() => {
    if(params[props.fieldID] === undefined && props.default !== null) {
      setValue(props.default)
    }
  }, [])

  const valid = !value.length || Number.isFinite(Number(value))

  const onChange = (text: string) => {
    if(!text.length) {
      setValue(null)
    } else {
      const numberValue = Number(text)
      if(Number.isFinite(numberValue) && !/^[^.]+\.$/.test(text)) {
        setValue(numberValue)
      } else {
        setValue(text)
      }
    }
  }

  return (
    <TextInput
      mode='outlined'
      keyboardType='decimal-pad'
      value={String(value)}
      onChangeText={onChange}
      style={styles.field}
      dense
      error={!valid}
      placeholder='number'
      // returnKeyType='next'
    />
  )
}

export function StringField(props: FieldProps) {
  const params = useAppSelector(selector => selector.request.params)
  const dispatch = useAppDispatch()
  const value = params[props.fieldID] ?? ''
  const setValue = (text: string) => dispatch(setParam({ fieldID: props.fieldID, value: { type: 'string', value: text } }))

  React.useEffect(() => {
    if(params[props.fieldID] === undefined && props.default !== null) {
      setValue(props.default)
    }
  }, [])

  return (
    <TextInput
      mode='outlined'
      value={String(value)}
      onChangeText={setValue}
      style={styles.field}
      dense
      placeholder='string'
    />
  )
}

export function BooleanField(props: FieldProps) {
  const params = useAppSelector(selector => selector.request.params)
  const dispatch = useAppDispatch()
  const value = params[props.fieldID] ?? false
  const setValue = (value: boolean) => dispatch(setParam({ fieldID: props.fieldID, value: { type: 'boolean', value } }))

  React.useEffect(() => {
    if(params[props.fieldID] === undefined && props.default !== null) {
      setValue(props.default)
    }
  }, [])

  return (
    <>
      <Checkbox
        status={value ? 'checked' : 'unchecked'}
        onPress={() => setValue(!value)}
      />
      <Text>{value ? 'true' : 'false'}</Text>
    </>
  )
}