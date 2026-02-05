import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/PageHeader";
import * as theme from "../../styles/theme";
import { getGlobalSettings } from "../../utils/supabase";

const Settings = () => {
   const [currency, setCurrency] = useState();
   const [availability, setAvailability] = useState();
   const navigator = useNavigation();
   useFocusEffect(() => {
      const fetchSettings = async () => {
         const data = await getGlobalSettings();
         setCurrency(data?.[0]?.currency_code);
         setAvailability(data?.[0]?.restaurant_available);
      };
      fetchSettings();
   });
   return (
      <SafeAreaView style={[styles.container, theme.layout.container]}>
         <PageHeader navigator={navigator} heading={"Restaurant Settings"} />
         <View>
            <Text>
               {currency}, {availability ? "Available" : "Not Available"}
            </Text>
         </View>
         <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Save Changes</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: { flexDirection: "column", justifyContent: "space-between" },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.black,
      borderWidth: 2,
      marginTop: 15,
   },
   buttonText: {
      ...theme.typography.bodyBold,
      color: theme.colors.black,
      textAlign: "center",
   },
});
export default Settings;
