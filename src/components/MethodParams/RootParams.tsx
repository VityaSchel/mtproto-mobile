import { ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import MethodParams from '.'
import { useAppSelector } from '../../redux/store'
import tlschema from '../../tl-schema.json'
import styles from './styles'

export default function RootParams() {
  const request = useAppSelector(selector => selector.request)
  const method = tlschema.methods.find(m => m.method === request.method)
  
  if(!method) return (
    <Text style={styles.selectMethodFirst}>
      Select method first
    </Text>
  )

  return (
    <MethodParams methodParams={method.params} prefix='' />
  )
}