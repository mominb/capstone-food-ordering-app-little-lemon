import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import PageHeader from "../../components/PageHeader";
import * as theme from "../../styles/theme";
import { supabase } from "../../utils/supabase";

const Settings = () => {
   const navigator = useNavigation();
   const [isLoading, setIsLoading] = useState(false);
   const handleLogout = async () => {
      setIsLoading(true);
      try {
         const { error } = await supabase.auth.signOut();
         if (error) {
            Toast.show({ type: "error", text1: "Logout failed" });
         } else {
            Toast.show({ type: "success", text1: "You have been logged out" });
         }
      } catch (err) {
         console.log(err);
         Toast.show({ type: "error", text1: "Logout failed" });
      } finally {
         setIsLoading(false);
      }
   };
   return (
      <SafeAreaView style={[styles.container, theme.layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: theme.colors.white }}
         />
         <PageHeader navigator={navigator} heading={"Settings"} />
         <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <Text style={styles.buttonText}>Logout</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {},
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: theme.colors.red,
      borderColor: theme.colors.red,
      borderWidth: 2,
      marginTop: 15,
   },
   buttonText: {
      ...theme.typography.bodyBold,
      color: theme.colors.white,
      textAlign: "center",
   },
});
export default Settings;
