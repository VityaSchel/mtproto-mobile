import React from 'react'
import styles from './styles'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { Button, Text } from 'react-native-paper'
import { Buffer } from 'buffer'
import { uploadFile } from '../mtproto/files'
import { View } from 'react-native'
import { format } from 'date-fns'
import { filesize as filesize_ } from 'filesize/dist/filesize.js'

export default function UploadWidget() {
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadingResults, setUploadingResults] = React.useState<{ date: Date, fileID: number, parts: number, size?: number, name: string }[]>([])

  const selectDocumentForUpload = () => {
    DocumentPicker.getDocumentAsync({}).then(async file => {
      if(file.type === 'cancel') return
      setIsUploading(true)
      try {
        const fileContents = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' })
        const result = await uploadFile(Buffer.from(fileContents, 'base64'))
        setUploadingResults(uploadingResults.concat({
          date: new Date(),
          fileID: result.id,
          parts: result.parts,
          size: file.size,
          name: file.name
        }))
        setIsUploading(false)
      } catch(e) {
        setIsUploading(false)
        throw e
      }
    })
  }

  return (
    <>
      <Text variant='headlineSmall' style={{ marginTop: 20 }}>Uploading</Text>
      <View style={styles.container}>
        <Button
          mode='contained'
          onPress={selectDocumentForUpload}
          disabled={isUploading}
          loading={isUploading}
        >
          Upload file/image/document
        </Button>
        <View style={styles.results}>
          <Text>Uploaded files:</Text>
          {!uploadingResults.length && <Text>None</Text>}
          {uploadingResults.map((result, index) => (
            <View style={styles.result} key={index}>
              <View style={styles.stat}>
                <Text style={styles.statTitle}>Name:</Text>
                <Text selectable>{result.name}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statTitle}>FileID:</Text>
                <Text selectable>{result.fileID}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statTitle}>Parts:</Text>
                <Text selectable>{result.parts} (max 512kb per part)</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statTitle}>Size:</Text>
                <Text selectable>{filesize_(result.size)}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statTitle}>Date:</Text>
                <Text selectable>{format(result.date, 'dd MMMM yyyy, hh:mm:ss')}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  )
}