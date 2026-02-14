import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
   Alert,
   FlatList,
   Image,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ItemSeperator from "../../components/ItemSeperator";
import PageHeader from "../../components/PageHeader";
import * as theme from "../../styles/theme";
import {
   deleteMenuItem,
   getGlobalSettings,
   getMenuItems,
} from "../../utils/supabase";

const ManageMenu = () => {
   const [menu, setMenu] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [currency, setCurrency] = useState();
   const navigator = useNavigation();

   useFocusEffect(() => {
      const load = async () => {
         try {
            const menu = await getMenuItems();
            setMenu(menu);
            const globalSettings = await getGlobalSettings();
            setCurrency(globalSettings?.[0]?.currency_code);
         } catch (error) {
            console.log(error);
            Toast.show({ type: "error", text1: "Failed to load menu" });
         } finally {
            setIsLoading(false);
         }
      };
      load();
   });

   const handleDelete = async (id) => {
      setIsLoading(true);
      try {
         const res = await deleteMenuItem(id);
         if (res?.error) {
            Toast.show({ type: "error", text1: "Delete failed" });
         } else {
            Toast.show({ type: "success", text1: "Item deleted" });
            const menu = await getMenuItems();
            setMenu(menu);
         }
      } catch (error) {
         console.log(error);
         Toast.show({ type: "error", text1: "Delete failed" });
      } finally {
         setIsLoading(false);
      }
   };

   const confirmDelete = (id, name) => {
      Alert.alert(
         "Delete menu item",
         `Are you sure you want to delete "${name}"?`,
         [
            { text: "Cancel", style: "cancel" },
            {
               text: "Delete",
               style: "destructive",
               onPress: () => handleDelete(id),
            },
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
         <PageHeader heading={"Menu Management"} navigator={navigator} />
         <View>
            <ItemSeperator />
            <TouchableOpacity onPress={() => navigator.navigate("MenuItem")}>
               <View
                  style={{
                     flexDirection: "row",
                     justifyContent: "space-between",
                     alignItems: "center",
                     padding: 15,
                  }}
               >
                  <Text
                     style={[
                        theme.typography.body,
                        { fontSize: 20, fontWeight: "400" },
                     ]}
                  >
                     Add Item
                  </Text>
                  <Text
                     style={[
                        theme.typography.body,
                        { fontSize: 30, fontWeight: "400" },
                     ]}
                  >
                     +
                  </Text>
               </View>
            </TouchableOpacity>
         </View>

         <ItemSeperator />
         <FlatList
            data={menu}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={ItemSeperator}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
               <TouchableOpacity
                  onPress={() => navigator.navigate("MenuItem", { item })}
                  style={
                     item.is_disabled
                        ? [styles.itemRow, styles.itemRowDisabled]
                        : styles.itemRow
                  }
               >
                  <View style={styles.itemContentSection}>
                     <View style={styles.itemTextColumn}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Text style={styles.itemDescription} numberOfLines={2}>
                           {item.description}
                        </Text>
                        <Text style={styles.itemPrice}>
                           {item.price} {currency}
                        </Text>
                     </View>

                     <TouchableOpacity
                        style={{
                           alignItems: "center",
                           justifyContent: "center",
                           marginTop: 10,
                           borderWidth: 1,
                           borderColor: theme.colors.red,
                           padding: 10,
                           borderRadius: theme.borderRadius.md,
                           width: 44,
                           height: 44,
                        }}
                        onPress={() => confirmDelete(item.id, item.name)}
                     >
                        <Ionicons
                           name="trash"
                           size={20}
                           color={theme.colors.red}
                        />
                     </TouchableOpacity>
                  </View>
                  <View style={styles.itemImageSection}>
                     {item.image_url ? (
                        <Image
                           style={styles.itemImage}
                           source={{
                              uri: item.image_url,
                           }}
                        />
                     ) : (
                        <View style={styles.itemImagePlaceholder}>
                           <Text style={styles.itemImagePlaceholderText}>
                              No Image
                           </Text>
                        </View>
                     )}
                  </View>
               </TouchableOpacity>
            )}
         />
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {},
   itemRow: {
      flexDirection: "row",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.white,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.small,
      overflow: "hidden",
   },
   itemContentSection: {
      width: "70%",
      flexDirection: "column",
      justifyContent: "space-between",
      paddingRight: theme.spacing.md,
   },
   itemImageSection: {
      width: "30%",
      alignItems: "center",
      justifyContent: "center",
   },
   itemRowDisabled: {
      backgroundColor: theme.colors.tertiary,
      opacity: 0.6,
   },
   itemTextColumn: {
      marginRight: theme.spacing.md,
   },
   itemTitle: {
      ...theme.typography.h3,
      marginBottom: theme.spacing.xs,
   },
   itemDescription: {
      ...theme.typography.caption,
      color: theme.colors.lightgrey,
      marginVertical: theme.spacing.xs,
   },
   itemPrice: {
      ...theme.typography.bodyBold,
      color: theme.colors.primary,
   },
   itemImage: {
      resizeMode: "cover",
      width: 80,
      height: 80,
      backgroundColor: theme.colors.lightgrey,
      borderRadius: theme.borderRadius.lg,
      flexShrink: 1,
   },
   itemImagePlaceholder: {
      width: 80,
      height: 80,
      backgroundColor: theme.colors.tertiary,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      flexShrink: 1,
   },
   itemImagePlaceholderText: {
      ...theme.typography.caption,
      color: theme.colors.lightgrey,
      fontSize: 12,
      textAlign: "center",
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
   title: {
      ...theme.typography.h2,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      color: theme.colors.primary,
   },
});
export default ManageMenu;
