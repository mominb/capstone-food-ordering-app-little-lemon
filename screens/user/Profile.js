import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
   Alert,
   Image,
   Keyboard,
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import PhoneInput from "react-native-phone-number-input";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import PageHeader from "../../components/PageHeader";
import { colors, layout, typography } from "../../styles/theme";
import { getUserData, supabase, updateUserData } from "../../utils/supabase";

const Profile = ({ refreshUserInfo, deleteUserCart }) => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [isNameFocused, setIsNameFocused] = useState(false);
   const [isEmailFocused, setIsEmailFocused] = useState(false);
   const [phoneInputKey, setPhoneInputKey] = useState(0);

   const [isLoading, setIsLoading] = useState(false);

   const navigator = useNavigation();

   useEffect(() => {
      const loadUserData = async () => {
         setIsLoading(true);
         const userData = await getUserData();
         const user = userData.data?.user;
         if (user) {
            setName(user.user_metadata?.displayName ?? "");
            setEmail(user.user_metadata?.email ?? "");
            setPhone(user.user_metadata?.phone ?? "");
            setPhoneInputKey((prev) => prev + 1);
         }
         setIsLoading(false);
      };
      loadUserData();
   }, []);
   const handleSaveInfo = async () => {
      setIsLoading(true);
      try {
         await updateUserData({
            phone: phone,
            email: email,
            displayName: name,
         });
         setIsLoading(false);
         Keyboard.dismiss();
         console.log("User info saved");
         Toast.show({
            type: "success",
            text1: "Information updated successfully",
         });
         refreshUserInfo();
      } catch (error) {
         console.log("Error saving user info:", error);
         Toast.show({
            type: "error",
            text1: "Failed to update information",
         });
      }
   };
   const handleLogout = async () => {
      setIsLoading(true);
      try {
         const { error } = await supabase.auth.signOut();
         if (error) {
            console.log("Error logging out:", error);
            Toast.show({
               type: "error",
               text1: "Logout failed",
            });
         } else {
            Toast.show({
               type: "success",
               text1: "You have been logged out",
            });
         }

         await deleteUserCart();
      } finally {
         setIsLoading(false);
      }
   };

   const confirmLogout = () => {
      Alert.alert(
         "Log out",
         "Are you sure you want to log out?",
         [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: handleLogout },
         ],
         { cancelable: true }
      );
   };
   return (
      <SafeAreaView style={[styles.container, layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.white }}
         />
         <PageHeader navigator={navigator} heading={"Profile"}></PageHeader>
         <KeyboardAvoidingView behavior="padding" style={styles.content}>
            <ScrollView>
               <View style={styles.profileImageContainer}>
                  <Image
                     source={require("../../assets/profile-icon.png")}
                     resizeMode="contain"
                     style={styles.profileImage}
                  />
               </View>
               <View style={styles.form}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                     onFocus={() => setIsNameFocused(true)}
                     onBlur={() => setIsNameFocused(false)}
                     style={[
                        styles.input,
                        isNameFocused && styles.inputFocused,
                     ]}
                     value={name}
                     onChangeText={setName}
                  />

                  <Text style={styles.label}>Email</Text>
                  <TextInput
                     keyboardType="email-address"
                     autoCapitalize="none"
                     onFocus={() => setIsEmailFocused(true)}
                     onBlur={() => setIsEmailFocused(false)}
                     style={[
                        styles.input,
                        isEmailFocused && styles.inputFocused,
                     ]}
                     value={email}
                     onChangeText={setEmail}
                  />
                  <Text style={styles.label}>Phone</Text>
                  <PhoneInput
                     key={`phone-input-${phoneInputKey}`}
                     defaultCode="PK"
                     defaultValue={phone}
                     onChangeText={setPhone}
                     containerStyle={[styles.phoneContainer]}
                     textContainerStyle={styles.phoneTextContainer}
                     textInputStyle={styles.phoneTextInput}
                  />
               </View>
            </ScrollView>
            <TouchableOpacity
               style={styles.saveButton}
               onPress={handleSaveInfo}
            >
               <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
         </KeyboardAvoidingView>
         <View>
            <TouchableOpacity
               style={styles.logoutButton}
               onPress={confirmLogout}
            >
               <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {},
   profileImageContainer: {
      height: "25%",
      alignSelf: "center",
   },
   logoutButton: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: colors.red,
      borderColor: colors.red,
      borderWidth: 2,
   },
   content: {
      backgroundColor: colors.white,
   },
   profileImage: {
      height: 100,
      width: 100,
      margin: 20,
   },
   logoutButtonText: {
      ...typography.bodyBold,
      color: colors.white,
      textAlign: "center",
   },
   input: {
      height: 54,
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      backgroundColor: colors.white,
   },
   inputFocused: {
      height: 54,
      borderWidth: 2,
      borderColor: colors.secondary,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
   },
   phoneContainer: {
      width: "100%",
      height: 54,
      borderColor: colors.black,
      borderWidth: 2,
      borderRadius: 8,
   },
   phoneTextContainer: {
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      backgroundColor: colors.lightgrey,
   },
   phoneTextInput: {
      height: 50,
      fontWeight: "600",
      paddingTop: 2.45,
   },
   label: {
      ...typography.caption,
      color: colors.black,
      marginBottom: 6,
   },
   form: {
      padding: 20,
   },
   saveButton: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: colors.secondary,
      borderColor: colors.black,
      borderWidth: 2,
      marginBottom: 20,
   },
   saveButtonText: {
      ...typography.bodyBold,
      color: colors.black,
      textAlign: "center",
   },
});
export default Profile;
