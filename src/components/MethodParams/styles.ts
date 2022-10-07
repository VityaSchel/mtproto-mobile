import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  selectMethodFirst: {
    marginTop: 20,
    fontSize: 20
  },
  noParams: {
    marginTop: 30,
    fontSize: 16,
    marginBottom: 'auto'
  },
  params: {
    display: 'flex',
    width: '100%',
    marginTop: 20,
  },
  param: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10
  },
  paramName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 10,
    maxWidth: 180
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
    alignItems: 'center',
    marginBottom: 10
  },
  vectorRemove: {
    width: 30
  }
})