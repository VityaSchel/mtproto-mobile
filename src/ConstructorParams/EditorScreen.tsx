import { NavigationProp, useRoute } from '@react-navigation/native'
import ConstructorParamsEditor from './editor'

export default function EditorScreen(props: { navigation: NavigationProp<{}> }) {
  const route = useRoute()
  console.log(route.params)

  return (
    <ConstructorParamsEditor  /> 
  )
}