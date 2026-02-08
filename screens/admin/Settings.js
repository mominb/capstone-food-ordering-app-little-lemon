import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import PageHeader from "../../components/PageHeader";
import * as theme from "../../styles/theme";
import { getGlobalSettings, updateGlobalSettings } from "../../utils/supabase";

const Settings = () => {
   const [availability, setAvailability] = useState();
   const navigator = useNavigation();

   useFocusEffect(
      useCallback(() => {
         const fetchSettings = async () => {
            const data = await getGlobalSettings();
            setAvailability(data?.[0]?.restaurant_available);
         };
         fetchSettings();
      }, []),
   );

   const handleSaveChanges = async () => {
      try {
         await updateGlobalSettings(availability);
         Toast.show({
            type: "success",
            text1: "Settings saved successfully",
         });
      } catch (error) {
         console.log("Error saving settings:", error);
         Toast.show({
            type: "error",
            text1: "Failed to save settings",
         });
      }
   };
   return (
      <SafeAreaView style={[styles.container, theme.layout.container]}>
         <View>
            <PageHeader navigator={navigator} heading={"Restaurant Settings"} />

            <View style={styles.dropdownContainer}>
               <Text style={[theme.typography.h2, { alignSelf: "flex-start" }]}>
                  Restaurant Availability
               </Text>
               <Dropdown
                  style={styles.dropdown}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Status"
                  value={availability}
                  onChange={(item) => setAvailability(item.value)}
                  data={[
                     { label: "Open", value: true },
                     { label: "Closed", value: false },
                  ]}
               />
            </View>
         </View>

         <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Save Changes</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {
      flexDirection: "column",
      justifyContent: "space-between",
      flex: 1,
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.black,
      borderWidth: 2,
      marginTop: 20,
      marginBottom: 20,
   },
   buttonText: {
      ...theme.typography.bodyBold,
      color: theme.colors.black,
      textAlign: "center",
   },
   dropdown: {
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: theme.colors.tertiary,
      borderColor: theme.colors.black,
      borderWidth: 2,
      marginTop: 8,
      marginBottom: 10,
   },
   dropdownContainer: {
      marginHorizontal: 20,
      marginVertical: 15,
   },
});
export default Settings;
