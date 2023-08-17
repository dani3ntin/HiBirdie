import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width

function IntroPage() {
    const navigation = useNavigation()
  return (
    <View style={styles.container}>
        <Text style={{ fontFamily: 'sans-serif-thin', fontSize: 70 }}>HiBirdie</Text>
        <Text style={{ fontFamily: 'sans-serif-thin', fontSize: 30, paddingBottom: 20 }}>Share your bird watching </Text>
      <Image
        source={require('../../assets/images/introImages/intro2.jpg')} 
        style={styles.image}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonMargin]}
          onPress={() => navigation.navigate('RegisterPage')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonMargin]}
          onPress={() => navigation.navigate('LoginPage')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default IntroPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c0daf8'
  },
  image: {
    marginBottom: 30,
    borderRadius: 200,
    width: 0.8 * windowWidth, 
    height: 0.8 * windowWidth,
  },
  buttonContainer: {
    
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#adb2fc',
    borderRadius: 10,
    width: 0.55 * windowWidth,
    marginTop: 10,
  },
  buttonMargin: {
    margin: 2,
    borderColor: 'blue',
    borderWidth: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
});
