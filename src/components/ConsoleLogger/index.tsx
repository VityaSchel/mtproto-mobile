import React from 'react'
import { View } from 'react-native'
import { Button, Divider, Text } from 'react-native-paper'
import { BottomSheetBackdrop, BottomSheetBackgroundProps, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import styles from './styles'
import clone from 'just-clone'

export default function ConsoleLogger() {
  const [logs, setLogs] = React.useState([])

  const bottomSheetRef = React.useRef<BottomSheetModal>(null)
  const snapPoints = React.useMemo(() => ['80%'], [])

  // don't care + didn't ask + shut up
  global.api.openConsole = () => {
    bottomSheetRef.current?.present()
  }

  React.useEffect(() => {
    global.apiLoggerUpdate = () => {
      setLogs(clone(global.apiLogger).reverse())
    }
  }, [setLogs])

  const CustomBackground: React.FC<BottomSheetBackgroundProps> = () => (
    <View style={styles.sheet} />
  )

  const renderItem = React.useCallback(
    ({ item, index }) => {
      let itemContent = item.content
      try {
        const itemContentParsed = JSON.parse(itemContent)
        if(typeof itemContentParsed === 'object') {
          if(itemContentParsed['app_id']) itemContentParsed['app_id'] = '[hidden from console]'
          if(itemContentParsed['app_hash']) itemContentParsed['app_hash'] = '[hidden from console]'
        }
        itemContent = JSON.stringify(itemContentParsed)
      } catch(e) {/**/}
      return (
        <View>
          <Text style={{ color: item.type === 'error' ? 'red' : 'white', ...styles.text }} selectable>{itemContent}</Text>
          {(index !== (logs.length - 1)) && <Divider style={{ marginVertical: 10 }} />}
        </View>
      )
    },
    []
  )

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: '#fff' }}
      backgroundComponent={CustomBackground}
      enablePanDownToClose
      style={styles.sheet}
    >
      <View style={{ padding: 30, width: '100%', height: '100%' }}>
        <Button mode='contained' onPress={() => { global.apiLogger = []; global.apiLoggerUpdate() }}>Clear</Button>
        <BottomSheetFlatList
          data={logs}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 20 }}
        />
      </View>
    </BottomSheetModal>
  )
}