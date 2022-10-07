import React from 'react'
import { ScrollView, View } from 'react-native'
import { RadioButton, Text } from 'react-native-paper'
import styles from './styles'
import { setParam } from '../redux/slices/request'
import { useAppDispatch, useAppSelector } from '../redux/store'
import tlschema from '../tl-schema.json'
import MethodParams from '../components/MethodParams'

export default function ConstructorParamsEditor(props: { constructorType: string, fieldIDPrefix: string }) {
  const request = useAppSelector(selector => selector.request)
  const dispatch = useAppDispatch()
  const subConstructors = tlschema.constructors.filter(c => c.type === props.constructorType)
  const subTypeFieldID = `${props.fieldIDPrefix}_subType`
  const selectedSubConstructorPredicate = request.params[subTypeFieldID] as string
  const selectedSubConstructor = subConstructors.find(sc => sc.predicate == selectedSubConstructorPredicate)

  const setValue = (predicate: string) => {
    // TODO: clear params from current constructor subtype (set to null every param from this subtype)
    dispatch(setParam({ fieldID: subTypeFieldID, value: { type: 'string', value: predicate }}))
  }

  return (
    <View style={styles.view}>
      <ScrollView nestedScrollEnabled>
        <RadioButton.Group
          onValueChange={setValue} 
          value={selectedSubConstructorPredicate}
        >
          {subConstructors.map((constructor, index) => (
            <RadioButton.Item 
              key={constructor.id}
              label={constructor.predicate} 
              value={constructor.predicate} 
              style={styles.subTypeSelectorItem}
            />
          ))}
        </RadioButton.Group>
        {selectedSubConstructor && (
          <MethodParams 
            methodParams={selectedSubConstructor.params} 
            prefix={`${props.fieldIDPrefix}_value_`}
          />
        )}
      </ScrollView>
    </View>
  )
}