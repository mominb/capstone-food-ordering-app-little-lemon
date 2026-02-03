import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, typography } from "../styles/theme";

const OtpTimer = ({ sendOTP }) => {
   const [seconds, setSeconds] = useState(0);
   const handleButtonPress = () => {
      setSeconds(30);
      sendOTP();
   };
   useEffect(() => {
      if (seconds === 0) return;
      const timer = () => {
         setTimeout(() => {
            setSeconds(seconds - 1);
         }, 1000);
      };

      timer();
   }, [seconds]);
   return (
      <View style={styles.container}>
         {seconds > 0 ? (
            <Text style={styles.resendText}>
               Resend OTP in ({seconds}) seconds
            </Text>
         ) : (
            <TouchableOpacity onPress={() => handleButtonPress()}>
               <Text style={styles.sendText}>Send OTP</Text>
            </TouchableOpacity>
         )}
      </View>
   );
};

export default OtpTimer;

const styles = StyleSheet.create({
   container: {
      alignSelf: "center",
      marginBottom: 10,
   },
   sendText: {
      ...typography.bodyBold,
      color: colors.secondary,
   },
   resendText: {
      ...typography.bodyBold,
      color: colors.black,
   },
});
