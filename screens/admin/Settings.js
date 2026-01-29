import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/PageHeader";
import { supabase } from "../../utils/supabase";

const Settings = () => {
   const navigator = useNavigation();
   const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
         console.log("error logging out: ", error);
      }
   };
   return (
      <SafeAreaView>
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
