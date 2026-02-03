import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
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
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import OtpTimer from "../components/OtpTimer";
import { sendEmailOTP, verifyEmailOTP } from "../utils/supabase";
import { layout, colors, typography } from "../styles/theme";

const Onboarding = () => {
   const [email, setEmail] = useState("");
   const [token, setToken] = useState("");
   const [isOTPFocused, setIsOTPFocused] = useState(false);
   const [isEmailFocused, setIsEmailFocused] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   const isOTPValid = /^\d{6}$/.test(token);
   const isFormValid = isEmailValid && isOTPValid;

   const sendOTP = async () => {
      await AsyncStorage.setItem("userEmail", email);
      setIsLoading(true);
      try {
         const status = await sendEmailOTP(email);
         if (status === "error") {
            Toast.show({
               type: "error",
               text1: `Unable to send OTP: ${error.message}`,
            });
         } else {
            Toast.show({
               type: "success",
               text1: "Successfully sent OTP to email",
            });
         }
      } finally {
         setIsLoading(false);
      }
   };
   const verifyOTPandLogin = async () => {
      setIsLoading(true);
      try {
         const { error } = await verifyEmailOTP(email, token);
         if (error) {
            console.log(error.message);
            Toast.show({
               type: "error",
               text1: `Unable to verify OTP: ${error.message}`,
            });
         } else {
            Toast.show({
               type: "success",
               text1: "Successfully verified OTP",
            });
         }
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <SafeAreaView style={[styles.container, layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.white }}
         />
         <View>
            <Image
               source={require("../assets/littlelemon-logo-long-white.jpg")}
               style={styles.logo}
               resizeMode="contain"
            />
         </View>
         <Text style={styles.title}>Sign in to Little Lemon</Text>

         <ScrollView style={styles.content}>
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
            {<OtpTimer sendOTP={sendOTP} />}

            <View>
               <Text style={styles.label}>OTP</Text>
               <TextInput
                  onFocus={() => setIsOTPFocused(true)}
                  onBlur={() => setIsOTPFocused(false)}
                  style={[styles.input, isOTPFocused && styles.inputFocused]}
                  value={token}
                  onChangeText={setToken}
                  keyboardType="number-pad"
               />
            </View>
         </ScrollView>
         <KeyboardAvoidingView behavior="padding">
            <TouchableOpacity
               style={[styles.button, !isFormValid && styles.buttonDisabled]}
               disabled={!isFormValid}
               onPress={() => verifyOTPandLogin(email, token)}
            >
               <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {},
   logo: {
      width: 200,
      height: 150,
      alignSelf: "center",
   },
   content: {},
   title: {
      ...typography.h1,
      color: colors.secondary,
      padding: 30,
      textAlign: "center",
   },
   label: {
      ...typography.caption,
      color: colors.tertiary,
      marginBottom: 6,
   },
   input: {
      height: 48,
      width: "100%",
      borderWidth: 2.5,
      borderColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      backgroundColor: colors.tertiary,
      alignSelf: "center",
   },
   inputFocused: {
      borderColor: colors.secondary,
   },
   button: {
      alignSelf: "center",
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: colors.secondary,
      borderColor: colors.black,
      borderWidth: 2,
      marginBottom: 10,
   },
   buttonDisabled: {
      opacity: 0.4,
   },

   buttonText: {
      ...typography.body,
      color: colors.black,
      textAlign: "center",
   },
});

export default Onboarding;
