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

const filter = (item: Method, query) => item.method.toLowerCase().includes(query.toLowerCase())
const methods = tlSchema.methods

export default function MethodInput() {
  const [value, setValue] = React.useState(null)
  const [data, setData] = React.useState<Method[]>(tlSchema.methods)

  const onSelect = (item) => {
    // setValue(movies[index].title)
    console.log(item)
  }

  const onChangeText = (query) => {
    setValue(query)
    const suggestions = []
    let i = 0
    while(suggestions.length < 5) {
      const suggestion = methods[i]
      if(filter(suggestion, query)) suggestions.push(suggestion)
      if(++i === methods.length) break
    }
    setData(suggestions)
  }

  const renderOption = (item: Method, index) => (
    <Menu.Item 
      onPress={() => onSelect(item)} 
      title={item.method}
      key={index}
    />
  )

  return (
    <View style={styles.container}>
      <TextInput
        label='API Method'
        value={value}
        onChangeText={onChangeText}
      />
      <Menu
        visible={value?.length > 1 && data.length > 0}
        onDismiss={() => {}}
        anchor={{ x: 10, y: 10 }}
        style={{ marginTop: 60, position: 'absolute' }}
      >
        {data.map(renderOption)}
      </Menu>
    </View>
  )
}