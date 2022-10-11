import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginBottom: 20
  },
  session: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  item: {
    flex: 1
  },
  hint: {
    marginBottom: 20,
    color: '#999'
  },
  sessionData: {
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 10,
    lineHeight: 10
  },
  bottomButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
})