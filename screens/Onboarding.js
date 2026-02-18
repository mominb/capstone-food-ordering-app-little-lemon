import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
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
import {
   borderRadius,
   colors,
   layout,
   shadows,
   spacing,
   typography,
} from "../styles/theme";
import { sendEmailOTP, verifyEmailOTP } from "../utils/supabase";

const Onboarding = () => {
   const navigation = useNavigation();
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
      <SafeAreaView style={[layout.container, styles.container]}>
         <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
         >
            <Ionicons name="chevron-back" size={28} color={colors.white} />
         </TouchableOpacity>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.white }}
         />
         <View style={styles.logoContainer}>
            <Image
               source={require("../assets/littlelemon-logo-long-white.jpg")}
               style={styles.logo}
               resizeMode="contain"
            />
         </View>

         <Text style={styles.title}>Welcome Back</Text>

         <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
         >
            <View style={styles.inputGroup}>
               <Text style={styles.label}>Email</Text>
               <TextInput
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  style={[styles.input, isEmailFocused && styles.inputFocused]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(237, 239, 238, 0.5)"
               />
            </View>

            <OtpTimer sendOTP={sendOTP} />

            <View style={styles.inputGroup}>
               <Text style={styles.label}>OTP Code</Text>
               <TextInput
                  onFocus={() => setIsOTPFocused(true)}
                  onBlur={() => setIsOTPFocused(false)}
                  style={[styles.input, isOTPFocused && styles.inputFocused]}
                  value={token}
                  onChangeText={setToken}
                  keyboardType="number-pad"
                  placeholder="6-digit code"
                  placeholderTextColor="rgba(237, 239, 238, 0.5)"
                  maxLength={6}
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
   container: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
   },
   backButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      marginBottom: spacing.md,
   },
   logoContainer: {
      alignItems: "center",
      paddingVertical: spacing.xxl * 2,
   },
   logo: {
      width: 200,
      height: 120,
   },
   content: {
      flex: 1,
   },
   title: {
      ...typography.h1,
      color: colors.white,
      textAlign: "center",
      marginBottom: spacing.xxl,
      fontSize: 26,
   },
   inputGroup: {
      marginBottom: spacing.xl,
   },
   label: {
      ...typography.caption,
      color: colors.tertiary,
      marginBottom: spacing.sm,
      fontSize: 14,
   },
   input: {
      height: 54,
      width: "100%",
      borderWidth: 2,
      borderColor: "rgba(237, 239, 238, 0.3)",
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.lg,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      ...typography.body,
      color: colors.white,
      fontSize: 16,
   },
   inputFocused: {
      borderColor: colors.secondary,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
   },
   button: {
      width: "100%",
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.secondary,
      marginVertical: spacing.xl,
      ...shadows.medium,
   },
   buttonDisabled: {
      opacity: 0.4,
   },

   buttonText: {
      ...typography.button,
      color: colors.black,
      textAlign: "center",
   },
});

export default Onboarding;
