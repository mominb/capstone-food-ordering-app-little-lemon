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
   const navigation = useNavigation();

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
            <PageHeader navigation={navigation} heading={"Restaurant Settings"} />

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
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary,
      marginVertical: theme.spacing.lg,
      ...theme.shadows.medium,
   },
   buttonText: {
      ...theme.typography.button,
      color: theme.colors.white,
      textAlign: "center",
   },
   dropdown: {
      width: "100%",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.borderLight,
      borderWidth: 1,
      marginVertical: theme.spacing.md,
      ...theme.shadows.small,
   },
   dropdownContainer: {
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.lg,
   },
});
export default Settings;
