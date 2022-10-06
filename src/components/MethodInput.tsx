import React from 'react'
import { Autocomplete, AutocompleteItem } from '@ui-kitten/components'
import tlSchema from '../tl-schema.json'

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

export default function MethodInput() {
  const [value, setValue] = React.useState(null)
  const [data, setData] = React.useState<Method[]>(tlSchema.methods)

  const onSelect = (index) => {
    // setValue(movies[index].title)
    console.log(tlSchema.methods[index])
  }

  const onChangeText = (query) => {
    setValue(query)
    setData(tlSchema.methods.filter(item => filter(item, query)))
  }

  const renderOption = (item, index) => (
    <AutocompleteItem
      key={index}
      title={item.title}
    />
  )

  return (
    <Autocomplete
      placeholder='Place your Text'
      value={value}
      onSelect={onSelect}
      onChangeText={onChangeText}>
      {data.map(renderOption)}
    </Autocomplete>
  )
}