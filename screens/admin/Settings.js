import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import PageHeader from "../../components/PageHeader";
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
      <SafeAreaView>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: "#fff" }}
         />
         <PageHeader navigator={navigator} heading={"Settings"} />
         <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <Text style={styles.buttonText}>Logout</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: "#F4CE14",
      borderColor: "black",
      borderWidth: 2,
      marginTop: 15,
   },
   buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
   },
});
export default Settings;
