import { Text } from 'react-native-paper'
import { useAppSelector } from '../redux/store'
import tlschema from '../tl-schema.json'

export default function MethodParams() {
  const request = useAppSelector(selector => selector.request)
  const method = tlschema.methods.find(m => m.method === request.method)

  return (
    <Text>
      {method ? JSON.stringify(method) : 'Select method first'}
    </Text>
  )
}