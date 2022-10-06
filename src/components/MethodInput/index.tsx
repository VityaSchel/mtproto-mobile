import React from 'react'
import { View } from 'react-native'
import { TextInput, Menu, Surface } from 'react-native-paper'
import tlSchema from '../../tl-schema.json'
import styles from './styles'

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
  const [value, setValue] = React.useState(null)
  const isValidMethodName = methodsNames.includes(value)
  const [data, setData] = React.useState<Method['method'][]>(methodsNames)
  const methodInputRef = React.useRef()

  const onSelect = (item: Method) => {
    setValue(item.method)
    methodInputRef.current.blur()
  }

  const onChangeText = (query) => {
    setValue(query)
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