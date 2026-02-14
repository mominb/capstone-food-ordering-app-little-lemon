import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
   Alert,
   Image,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as theme from "../../styles/theme";
import * as supabase from "../../utils/supabase";

const AdminHome = () => {
   const navigation = useNavigation();
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
      <SafeAreaView style={[styles.container, theme.layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: theme.colors.white }}
         />
         <View style={styles.header}>
            <Image
               source={require("../../assets/logo-long-text.png")}
               resizeMode="contain"
               style={styles.headerLogo}
            />
         </View>
         <View style={styles.content}>
            <View style={styles.operationsContainer}>
               <Text style={styles.heading}>Admin Operations</Text>
               <TouchableOpacity
                  style={styles.operationButton}
                  onPress={() => navigation.navigate("AllOrders")}
               >
                  <Text style={styles.operationButtonText}>Manage Orders</Text>
               </TouchableOpacity>
               <TouchableOpacity
                  onPress={() => navigation.navigate("ManageMenu")}
                  style={styles.operationButton}
               >
                  <Text style={styles.operationButtonText}>Manage Menu</Text>
               </TouchableOpacity>
               <TouchableOpacity
                  onPress={() => navigation.navigate("Settings")}
                  style={styles.operationButton}
               >
                  <Text style={styles.operationButtonText}>
                     Restaurant Settings
                  </Text>
               </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={confirmLogout} style={styles.button}>
               <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {},

   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.white,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
   },
   headerLogo: {
      width: 160,
      height: 32,
   },
   headerProfileIcon: {
      width: 40,
      height: 40,
   },
   heading: {
      ...theme.typography.h2,
      marginBottom: theme.spacing.lg,
      color: theme.colors.primary,
   },
   content: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
   },
   operationButton: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.primary,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.small,
   },
   operationButtonText: {
      ...theme.typography.button,
      color: theme.colors.white,
      textAlign: "center",
   },
   operationsContainer: {
      paddingVertical: theme.spacing.lg,
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.red,
      marginVertical: theme.spacing.lg,
      ...theme.shadows.medium,
   },
   buttonText: {
      ...theme.typography.button,
      color: theme.colors.white,
      textAlign: "center",
   },
});
export default AdminHome;
