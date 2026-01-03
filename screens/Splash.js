import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';


const Splash = () => {
const navigation = useNavigation();
 useEffect(() => {
    getOnboardingData();
  }, []);
  const getOnboardingData = async () => {
    try {
        const data = await AsyncStorage.getItem('isOnboarded');
        if (data !== null) {   
        console.log('isOnboarded?', data);
        setTimeout(() => {
        navigation.navigate('Home');
        }, 1000);
        } else {
        console.log('isOnboarded?', data);
        setTimeout(() => {
        navigation.navigate('Onboarding');
        }, 1000);
       
        }
    } catch (error) {
        console.log('Error getting onboarding data:', error);
    }


}
  return (
    
    <SafeAreaView>
      <Image
        source={require('../assets/logo-square-text.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </SafeAreaView>
   
    
  );
};

const styles = StyleSheet.create({
    container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    },
    logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginTop: 200,
    }
})


export default Splash;