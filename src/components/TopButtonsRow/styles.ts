import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  code: {
    backgroundColor: '#555555',
    padding: 5,
    borderRadius: 5
  },
  title: { 
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 10
  },
  templatesInnerView: {
    // justifyContent: 'flex-start'
    alignItems: 'flex-start'
  },
  button: {
    marginVertical: 10
  }
})