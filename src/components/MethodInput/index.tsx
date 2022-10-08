import React from 'react'
import { View } from 'react-native'
import type { TextInput as ReactNativeTextInput } from 'react-native'
import { TextInput, Menu, Surface } from 'react-native-paper'
// import type { NativeTextInput } from 'react-native'
import tlSchema from '../../tl-schema.json'
import styles from './styles'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { resetMethod, resetParams, setMethod } from '../../redux/slices/request'

type Method = {
    id: string
    method: string
    params: {
        name: string
        type: string
    }[]
    type: string
}

const filter = (methodName: Method['method'], query) => methodName.toLowerCase().includes(query.toLowerCase())
const methods = tlSchema.methods
const methodsNames = tlSchema.methods.map(m => m.method)

export default function MethodInput() {
  const [value, setValue] = React.useState<string | null>(null)
  const isValidMethodName = methodsNames.includes(value)
  const [data, setData] = React.useState<Method['method'][]>(methodsNames)
  const methodInputRef = React.useRef<ReactNativeTextInput>()
  const methodName = useAppSelector(store => store.request.method)
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    if(!methodInputRef.current?.isFocused())
      setValue(methodName)
  }, [methodName])

  // React.useEffect(() => {
  //   if(isValidMethodName) {
  //     dispatch(setMethod(value))
  //   } else {
  //     dispatch(resetMethod())
  //   }
  // }, [isValidMethodName])

  const onSelect = (item: Method) => {
    setValue(item.method)
    dispatch(setMethod(item.method))
    methodInputRef.current.blur()
  }

  const onChangeText = (query: string) => {
    if(value !== query) {
      dispatch(resetParams())
    }

    setValue(query)
    if(methodsNames.includes(query)) {
      dispatch(setMethod(query))
    } else {
      dispatch(resetMethod())
    }
    
    const suggestions = []
    let i = 0
    while(suggestions.length < 5) {
      const suggestion = methodsNames[i]
      if(filter(suggestion, query)) suggestions.push(suggestion)
      if(++i === methods.length) break
    }
    setData(suggestions)
  }

  const renderOption = (methodName: Method['method'], index) => {
    const method = methods.find(m => m.method === methodName)
    
    return (
      <Menu.Item 
        onPress={() => onSelect(method)} 
        title={method.method}
        key={index}
        style={styles.menuItem}
        contentStyle={styles.menuItem}
      />
    )
  }

  const showSuggestionsList = !isValidMethodName && value?.length > 0 && data.length > 0

  return (
    <View style={styles.container}>
      <TextInput
        label='API Method'
        value={value}
        onChangeText={onChangeText}
        ref={methodInputRef}
        mode='outlined'
      />
      <Surface
        style={{ ...styles.menu, display: showSuggestionsList ? 'flex' : 'none' }}
      >
        {data.map(renderOption)}
      </Surface>
    </View>
  )
}