import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const handleIconClick = () => { 
    navigation.navigate('Profile');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo-long-text.png')} resizeMode="contain" style={styles.logoLemon}/>
        <TouchableOpacity onPress={handleIconClick}>
          <Image source={require('../assets/profile-icon.png')} resizeMode="contain" style={styles.logoProfile} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )  
  };

const styles = StyleSheet.create({
  container : {
    flex: 1,
  },
  header : {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#000',
    borderWidth: 1,
    padding: 20
  },
  logoLemon : {
    alignSelf: 'flex-start',
    width: 200,
    height: 48,
  },
  logoProfile : {
    alignSelf: 'flex-end',
    width: 48,
    height: 48,
   
  },
});


export default Home;