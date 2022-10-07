import React from 'react'
import { View } from 'react-native'
import { RadioButton } from 'react-native-paper'
import { setParam } from '../redux/slices/request'
import { useAppDispatch, useAppSelector } from '../redux/store'
import tlschema from '../tl-schema.json'

export default function ConstructorParamsEditor(props: { constructorType: string, fieldIDPrefix: string }) {
  const request = useAppSelector(selector => selector.request)
  const dispatch = useAppDispatch()
  const subConstructors = tlschema.constructors.filter(c => c.type === props.constructorType)
  const subTypeFieldID = `${props.fieldIDPrefix}_${props.constructorType}_subType`
  const selectedSubConstructor = request.params[subTypeFieldID]

  return (
    <View>
      {subConstructors.map(constructor => (
        <RadioButton
          value={constructor.predicate}
          status={constructor.predicate === selectedSubConstructor ? 'checked' : 'unchecked' }
          onPress={() => dispatch(setParam({ fieldID: subTypeFieldID, value: { type: 'string', value: constructor.predicate }}))}
          key={constructor.id}
        />
      ))}
    </View>
  )
}