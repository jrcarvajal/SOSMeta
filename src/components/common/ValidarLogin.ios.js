import React, {useState, createRef, useEffect, useContext} from 'react';
import { theme } from '../../theme';
import CityContext from '../../context/cityContext';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Keyboard,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import Loader from './Loader';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [hidePassword, setHidePass] = useState(true);
  const { email, changeEmail} = useContext(CityContext);
  
  const managePasswordVisibility = () => {  //function used to change password visibility 
    setHidePass(!hidePassword);
  } 

  const passwordInputRef = createRef();
  
  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('Ingrese su email');
      return;
    }
    if (!userPassword) {
      alert('Ingrese su password');
      return;
    }
    setLoading(true);
    let dataToSend = {email: userEmail, password: userPassword};
    
    fetch('http://sos.meta.gov.co/reportes/api/login', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        if (responseJson != false) {
          changeEmail(userEmail);
          navigation.navigate('Home');
          console.log(responseJson);
        } else {
          setErrortext('Verifique su email o password');
        }
      })
      .catch((error) => {
        setErrortext("Error de Internet o Wifi inactiva");
        setLoading(false);
        console.error(error);
    }); 
  }; //Fin handleSubmitPress

  return (
    <View style={styles.mainBody}>
      <View style={[styles.box1]}>
          <Text style={styles.titulo}>SOS Meta</Text>
        </View>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            
            <View style={styles.SectionStyle}>
              <View>
                  <Text style={styles.textLogin}>Usuario</Text>
              </View>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                placeholder="Enter Email" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
            <View>
                  <Text style={styles.textLogin}>Password</Text>
              </View>
              <View style = { styles.textBoxBtnHolder }>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                  placeholder="Enter Password" //12345
                  placeholderTextColor="#8b9cb5"
                  keyboardType="default"
                  ref={passwordInputRef}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  secureTextEntry={hidePassword}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                />
                <TouchableOpacity activeOpacity = { 0.8 } 
                   style = { styles.visibilityBtn } 
                   onPress = {managePasswordVisibility}> 
                   <Image 
                        source = { 
                          (hidePassword) ?
                            require('../../../assets/hide.png') 
                          : 
                            require('../../../assets/view.png')
                        } 
                        style = { styles.btnImage } 
                  /> 
                </TouchableOpacity> 
              </View>
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
                   
          </KeyboardAvoidingView>
          <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>Aceptar</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'column',
    height: 80,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: theme.colors.green,
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#e60000',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
    top: '15%'
  },
  box1: {
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    backgroundColor: theme.colors.orange,
    justifyContent: "center",
    left: 0,
    height: 45,
  },
  titulo: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textLogin: {
    color: 'black',
    paddingVertical: 10,
    fontSize: 18,
  },
  inputStyle: {
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#dadae8',
    height: 40,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  visibilityBtn: {
    position: 'absolute', 
    right: 3,
    height: 40,
    width: 35, 
    padding: 5 
 },
  btnImage: {
    resizeMode: 'contain',
    height: '100%', 
    width: '100%'
 },
 textBoxBtnHolder: { 
   position: 'relative',
   alignSelf: 'stretch',
   justifyContent: 'center' 
 }
});
