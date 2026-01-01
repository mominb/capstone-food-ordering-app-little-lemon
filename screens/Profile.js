import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
const Profile = () => {
  const navigation = useNavigation();
  const handleLogout = async () => {
    navigation.navigate('Onboarding');
    try {
        await AsyncStorage.clear();
        navigation.navigate('Onboarding');
        console.log('User data cleared');
    } catch (error) {
        console.log('Error clearing user data')
    }  
  };
  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../assets/back-button.jpg')} resizeMode="contain" style={styles.backButton} />
          </TouchableOpacity>
          <Text style={styles.headerText}> Your Profile</Text>
        </View>
        <View style={styles.content}>
            <View>
                <Image source={require('../assets/profile-icon.png') } resizeMode="contain" style={styles.profileImage} />
            </View>
            <View>
                <TouchableOpacity
                          style={styles.logoutButton}
                          onPress={handleLogout}
                        >
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
      </SafeAreaView>
    )  
};

const styles = StyleSheet.create({
  container : {
    flex: 1,
  },
  logoutContainer :{
    borderColor: 'black',
    borderWidth: 1,

  },
  logoutButton : {
    alignSelf: 'center',
    width: '90%',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: '#EDEFEE',
    borderColor: 'black',
    borderWidth: 2
  },
  content : {
    flex: 1,
    backgroundColor: 'white'
  },
  headerText : {
    alignSelf: 'center',
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage :{
    height: '40%',
    alignSelf: 'center',
    marginTop: 50
  },
  header : {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 1,
    padding: 20
  },
  
  backButton : {
    alignSelf: 'flex-start',
    width: 48,
    height: 48,
   
  },
  buttonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default Profile;