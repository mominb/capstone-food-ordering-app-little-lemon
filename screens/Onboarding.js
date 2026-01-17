import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
   Image,
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const Onboarding = ({ setIsOnboarded }) => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [isNameFocused, setIsNameFocused] = useState(false);
   const [isEmailFocused, setIsEmailFocused] = useState(false);
   const isNameValid = name.trim() !== "";
   const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   const isFormValid = isNameValid && isEmailValid;
   const handleSaveAndNavi = async () => {
      try {
         await AsyncStorage.setItem("userName", name);
         await AsyncStorage.setItem("userEmail", email);
         await AsyncStorage.setItem("userLastName", "");
         await AsyncStorage.setItem("userPhone", "");
         await AsyncStorage.setItem("isOnboarded", "true");
         setIsOnboarded("true");
      } catch (error) {
         console.log("Error saving user info:", error);
      } finally {
         console.log("Finished saving user info");
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <View>
            <Image
               source={require("../assets/littlelemon-logo-long-white.jpg")}
               style={styles.logo}
               resizeMode="contain"
            />
         </View>
         <Text style={styles.title}>Let us get to know you</Text>

         <ScrollView style={styles.content}>
            <View>
               <Text style={styles.label}>First Name</Text>
               <TextInput
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  style={[styles.input, isNameFocused && styles.inputFocused]}
                  value={name}
                  onChangeText={setName}
               />
            </View>

            <View>
               <Text style={styles.label}>Email</Text>
               <TextInput
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  style={[styles.input, isEmailFocused && styles.inputFocused]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
               />
            </View>
         </ScrollView>
         <KeyboardAvoidingView behavior="padding">
            <TouchableOpacity
               style={[styles.button, !isFormValid && styles.buttonDisabled]}
               disabled={!isFormValid}
               onPress={handleSaveAndNavi}
            >
               <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,

      backgroundColor: "#495E57",
      padding: 20,
   },
   header: {
      alignItems: "center",
      padding: 20,
      backgroundColor: "white",
   },
   logo: {
      width: 200,
      height: 150,
      alignSelf: "center",
   },
   content: {},
   title: {
      fontSize: 25,
      fontWeight: "bold",
      color: "#F4CE14",
      padding: 30,
      textAlign: "center",
   },
   label: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#EDEFEE",
      marginBottom: 6,
      marginLeft: 20,
   },
   input: {
      height: 48,
      width: "90%",
      borderWidth: 2.5,
      borderColor: "#495E57",
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      backgroundColor: "#EDEFEE",
      alignSelf: "center",
   },
   inputFocused: {
      borderColor: "#F4CE14",
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: "#F4CE14",
      borderColor: "black",
      borderWidth: 2,
   },
   buttonDisabled: {
      opacity: 0.4,
   },

   buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "500",
      textAlign: "center",
   },
});

export default Onboarding;
