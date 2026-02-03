import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as theme from "../../styles/theme";

const AdminHome = () => {
   const navigator = useNavigation();
   return (
      <SafeAreaView style={[styles.container, theme.layout.container]}>
         <View style={styles.header}>
            <Image
               source={require("../../assets/logo-long-text.png")}
               resizeMode="contain"
               style={styles.headerLogo}
            />
            <TouchableOpacity
               onPress={() => {
                  navigator.navigate("Settings");
               }}
            >
               <Image
                  source={require("../../assets/settings_icon.jpg")}
                  resizeMode="contain"
                  style={styles.headerProfileIcon}
               />
            </TouchableOpacity>
         </View>
         <View style={styles.operationsContainer}>
            <Text style={styles.heading}>Admin Operations</Text>
            <TouchableOpacity
               style={styles.operationButton}
               onPress={() => navigator.navigate("AllOrders")}
            >
               <Text style={styles.operationButtonText}>Manage Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => navigator.navigate("ManageMenu")}
               style={styles.operationButton}
            >
               <Text style={styles.operationButtonText}>Manage Menu</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {},
   screen: {
      ...theme.layout.container,
   },

   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 20,
      backgroundColor: theme.colors.white,
      borderWidth: 1,
      borderColor: theme.colors.black,
   },
   headerLogo: {
      width: 200,
      height: 40,
   },
   headerProfileIcon: {
      width: 40,
      height: 40,
   },
   heading: {
      ...theme.typography.h2,
      marginBottom: 10,
   },
   operationButton: {
      padding: 10,
      backgroundColor: theme.colors.black,
      margin: 5,
   },
   operationButtonText: {
      ...theme.typography.button,
      color: theme.colors.white,
   },
   operationsContainer: {
      padding: 20,
   },
});
export default AdminHome;
