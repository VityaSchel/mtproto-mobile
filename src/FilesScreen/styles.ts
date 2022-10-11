import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    display: 'flex',
    marginTop: 10,
    marginBottom: 20
  },
  results: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center'
  },
  result: {
    marginTop: 10
  },
  stat: {
    display: 'flex',
    flexDirection: 'row'
  },
  statTitle: {
    marginRight: 10,
    fontWeight: 'bold'
  },
  input: {
    // flex: 0,
    width: 200,
    marginBottom: 10
  },
  divider: {
    width: '100%'
  },
  doneButton: {
    marginTop: 20
  }
})