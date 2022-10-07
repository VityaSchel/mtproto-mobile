import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  params: {
    display: 'flex',
    width: '100%',
    marginTop: 20,
  },
  param: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  paramName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 10,
    maxWidth: 190
  },
  field: {
    flex: 1
  },
  vector: { 
    backgroundColor: '#222', 
    padding: 10, 
    flex: 1 
  },
  vectorTopRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  vectorInfo: {
    fontSize: 18
  },
  vectorAdd: {
    width: 40
  },
  vectorList: {
    maxHeight: 200
  },
  vectorField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  vectorRemove: {
    width: 30
  }
})