import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
   Alert,
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import PageHeader from "../../components/PageHeader";
import {
   countryCode,
   validateEmail,
   validateName,
   validatePhone,
   validation,
} from "../../config";
import {
   borderRadius,
   colors,
   layout,
   shadows,
   spacing,
   typography,
} from "../../styles/theme";
import { getUserData, supabase, updateUserData } from "../../utils/supabase";

const Profile = ({ refreshUserInfo, deleteUserCart }) => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [isNameFocused, setIsNameFocused] = useState(false);
   const [isEmailFocused, setIsEmailFocused] = useState(false);
   const [isPhoneFocused, setIsPhoneFocused] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const navigation = useNavigation();

   useEffect(() => {
      const loadUserData = async () => {
         setIsLoading(true);
         try {
            const userData = await getUserData();
            const user = userData.data?.user;
            if (user) {
               setName(user.user_metadata?.displayName ?? "");
               setEmail(user.user_metadata?.email ?? "");

               // Parse phone number to extract just the number part
               const fullPhone = user.user_metadata?.phone ?? "";
               if (fullPhone) {
                  let phoneNumber = fullPhone.trim();
                  if (phoneNumber.startsWith(countryCode)) {
                     phoneNumber = phoneNumber.substring(countryCode.length);
                  }
                  setPhone(phoneNumber);
               }
            }
         } catch (err) {
            console.error("Error loading user data:", err);
         } finally {
            setIsLoading(false);
         }
      };
      loadUserData();
   }, []);

   const handleSaveInfo = async () => {
      // Validate name
      const nameValidation = validateName(name);
      if (!nameValidation.valid) {
         Toast.show({
            type: "error",
            text1: nameValidation.message,
         });
         return;
      }

      // Validate phone
      if (!phone) {
         Toast.show({
            type: "error",
            text1: "Phone number is required",
         });
         return;
      }

      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.valid) {
         Toast.show({
            type: "error",
            text1: phoneValidation.message,
         });
         return;
      }

      // Validate email if provided
      if (email) {
         const emailValidation = validateEmail(email);
         if (!emailValidation.valid) {
            Toast.show({
               type: "error",
               text1: emailValidation.message,
            });
            return;
         }
      }

      setIsLoading(true);
      try {
         // Combine country code and phone number
         const fullPhone = `${countryCode}${phone}`;
         await updateUserData({
            phone: fullPhone,
            email: email,
            displayName: name,
         });
         Keyboard.dismiss();
         Toast.show({
            type: "success",
            text1: "Information updated",
         });
         refreshUserInfo();
      } catch (error) {
         console.log("Error saving user info:", error);
         Toast.show({
            type: "error",
            text1: "Failed to update information",
         });
      } finally {
         setIsLoading(false);
      }
   };
   const handleLogout = async () => {
      setIsLoading(true);
      try {
         const { error } = await supabase.auth.signOut();
         if (error) {
            Toast.show({
               type: "error",
               text1: "Logout failed",
            });
         } else {
            Toast.show({
               type: "success",
               text1: "Logged out",
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
         { cancelable: true },
      );
   };

   return (
      <SafeAreaView style={[styles.container, layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.white }}
         />
         <PageHeader navigation={navigation} heading="Profile" />
         <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
         >
            <ScrollView>
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
                     placeholder="Your name"
                     placeholderTextColor={colors.gray}
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
                     placeholder="name@example.com"
                     placeholderTextColor={colors.gray}
                  />

                  <Text style={styles.label}>Phone</Text>
                  <View style={styles.phoneContainer}>
                     <View style={styles.countryCodeDisplay}>
                        <Text style={styles.countryCodeText}>
                           {countryCode}
                        </Text>
                     </View>
                     <TextInput
                        keyboardType="phone-pad"
                        onFocus={() => setIsPhoneFocused(true)}
                        onBlur={() => setIsPhoneFocused(false)}
                        style={[
                           styles.phoneInput,
                           isPhoneFocused && styles.inputFocused,
                        ]}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder={validation.phoneFormat}
                        placeholderTextColor={colors.gray}
                        maxLength={validation.phoneMaxLength}
                     />
                  </View>
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
   content: {
      flex: 1,
      backgroundColor: colors.white,
   },
   form: {
      padding: spacing.lg,
   },
   label: {
      ...typography.caption,
      color: colors.primary,
      marginBottom: spacing.sm,
      fontWeight: "700",
   },
   input: {
      height: 52,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
      backgroundColor: colors.white,
      ...typography.body,
      ...shadows.small,
   },
   inputFocused: {
      borderWidth: 2,
      borderColor: colors.primary,
   },
   phoneContainer: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.lg,
   },
   countryCodeDisplay: {
      height: 52,
      width: 80,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: borderRadius.md,
      backgroundColor: colors.tertiary,
      justifyContent: "center",
      alignItems: "center",
      ...shadows.small,
   },
   countryCodeText: {
      ...typography.body,
      fontWeight: "700",
      color: colors.primary,
   },
   phoneInput: {
      flex: 1,
      height: 52,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.white,
      ...typography.body,
      ...shadows.small,
   },
   saveButton: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primary,
      marginBottom: spacing.lg,
      ...shadows.medium,
   },
   saveButtonText: {
      ...typography.button,
      color: colors.white,
      textAlign: "center",
   },
   logoutButton: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.red,
      marginVertical: spacing.lg,
      ...shadows.medium,
   },
   logoutButtonText: {
      ...typography.button,
      color: colors.white,
      textAlign: "center",
   },
});

export default Profile;
