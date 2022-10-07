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
  const subTypeFieldID = `${props.fieldIDPrefix}_${props.constructorType}_subType`
  const selectedSubConstructorPredicate = request.params[subTypeFieldID] as string
  const selectedSubConstructor = subConstructors.find(sc => sc.predicate == selectedSubConstructorPredicate)

  const setValue = (predicate: string) => {
    dispatch(setParam({ fieldID: subTypeFieldID, value: { type: 'string', value: predicate }}))
  }

  console.log(subConstructors)

  return (
    <View style={styles.view}>
      <ScrollView nestedScrollEnabled>
        <RadioButton.Group
          onValueChange={setValue} 
          value={selectedSubConstructorPredicate}
        >
          {subConstructors.map((constructor, index) => (
            // <View key={constructor.id} style={styles.subTypeSelector}>
            //   <RadioButton value={constructor.predicate} />
            //   <Text onPress={() => setValue(constructor.predicate)}>{constructor.predicate}</Text>
            // </View>
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
            prefix={`${props.fieldIDPrefix}_${props.constructorType}_value_`}
          />
        )}
      </ScrollView>
    </View>
  )
}