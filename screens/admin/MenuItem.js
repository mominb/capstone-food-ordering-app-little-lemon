import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
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
import PageHeader from "../../components/PageHeader";
import * as theme from "../../styles/theme";
import {
   addMenuItem,
   getGlobalSettings,
   updateMenuItem,
} from "../../utils/supabase";

const Item = ({ route }) => {
   const navigator = useNavigation();
   const item = route?.params?.item ?? {};
   const [currency, setCurrency] = useState();
   const [itemName, setItemName] = useState(item.name);
   const [itemDescription, setItemDescription] = useState(item.description);
   const [itemPrice, setItemPrice] = useState(item.price?.toString());
   const [itemCategory, setItemCategory] = useState(item.category);
   const [isLoading, setIsLoading] = useState(false);
   const isItemExistent = Boolean(item.id);
   const handleItemUpdate = async () => {
      setIsLoading(true);
      try {
         let res;
         if (!isItemExistent) {
            res = await addMenuItem(
               itemName,
               itemDescription,
               itemPrice,
               itemCategory,
            );
         } else {
            res = await updateMenuItem(
               item.id,
               itemName,
               itemDescription,
               itemPrice,
               itemCategory,
            );
         }
         setIsLoading(false);
         if (res?.error) {
            Toast.show({ type: "error", text1: "Save failed" });
         } else {
            Toast.show({ type: "success", text1: "Saved successfully" });
            navigator.goBack();
         }
      } catch (err) {
         console.log(err);
         setIsLoading(false);
         Toast.show({ type: "error", text1: "Save failed" });
      }
   };
   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code);
      };
      fetchSettings();
   }, []);

   return (
      <SafeAreaView style={[styles.container, theme.layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: theme.colors.white }}
         />
         <PageHeader navigator={navigator} heading={"Edit Item"} />

         <ScrollView style={styles.container}>
            <View style={styles.infoBox}>
               <Text style={styles.label}>Name</Text>
               <TextInput
                  style={styles.input}
                  value={itemName}
                  onChangeText={setItemName}
               />

               <Text style={styles.label}>Description</Text>
               <TextInput
                  style={styles.input}
                  value={itemDescription}
                  onChangeText={setItemDescription}
               />

               <Text style={styles.label}>Category</Text>
               <TextInput
                  autoCapitalize="none"
                  style={styles.input}
                  value={itemCategory}
                  onChangeText={setItemCategory}
               />

               <Text style={styles.label}>Price ({currency})</Text>
               <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  value={itemPrice}
                  onChangeText={setItemPrice}
               />
            </View>
         </ScrollView>

         <KeyboardAvoidingView behavior="padding">
            <View>
               <TouchableOpacity
                  onPress={handleItemUpdate}
                  style={styles.button}
               >
                  <Text style={styles.buttonText}>Save</Text>
               </TouchableOpacity>
            </View>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {},
   infoBox: {
      width: "100%",
      padding: 20,
   },
   seperator: {
      width: "100%",
      height: 0.5,
      backgroundColor: theme.colors.black,
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
      margin: 10,
   },
   buttonText: {
      ...theme.typography.bodyBold,
      color: theme.colors.black,
      textAlign: "center",
   },
   input: {
      height: 48,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      backgroundColor: theme.colors.tertiary,
   },
   label: {
      ...theme.typography.caption,
      color: theme.colors.black,
      marginBottom: 6,
   },
});

export default Item;
