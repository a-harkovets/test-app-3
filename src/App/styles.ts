import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';



const header: ViewStyle = {
  height: 100,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};

const headerMessage: TextStyle = {
  fontSize: 16,
  maxWidth: 320,
  textAlign: 'center',
};


const map: ViewStyle = {
  height: Dimensions.get('screen').height - 360,
};


const footer: ViewStyle = {
  height: 210,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};

const footerMesage: TextStyle = {
  fontSize: 16,
  maxWidth: 360,
  textAlign: 'center',
};



export default StyleSheet.create({
  header,
  headerMessage,

  map,

  footer,
  footerMesage,
});
