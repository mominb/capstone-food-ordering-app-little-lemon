import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
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
import { deleteMenuItem, getMenuItems } from "../../utils/supabase";

const ManageMenu = () => {
   const [menu, setMenu] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const navigator = useNavigation();

   useFocusEffect(() => {
      const load = async () => {
         try {
            const menu = await getMenuItems();
            setMenu(menu);
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
   return (
      <SafeAreaView style={styles.container}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: "#fff" }}
         />
         <PageHeader heading={"Menu Management"} navigator={navigator} />
         <View>
            <TouchableOpacity
               onPress={() => navigator.navigate("MenuItem")}
               style={styles.button}
            >
               <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
         </View>
         <View>
            <Text style={styles.title}>Menu</Text>
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
                  style={styles.itemRow}
               >
                  <View
                     style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                     }}
                  >
                     <View style={styles.itemTextColumn}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Text style={styles.itemDescription} numberOfLines={2}>
                           {item.description}
                        </Text>
                        <Text style={styles.itemPrice}>${item.price}</Text>
                     </View>
                     <TouchableOpacity
                        style={{
                           alignItems: "center",
                           marginTop: 10,
                           borderWidth: 1,
                           borderColor: "red",
                           padding: 10,
                           borderRadius: 10,
                        }}
                        onPress={() => handleDelete(item.id)}
                     >
                        <Text style={{ color: "red" }}>DELETE</Text>
                     </TouchableOpacity>
                  </View>
                  <Image
                     style={styles.itemImage}
                     source={{
                        uri: item.image_url,
                     }}
                  />
               </TouchableOpacity>
            )}
         />
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   itemRow: {
      flexDirection: "row",
      padding: 15,
      justifyContent: "space-between",
   },
   itemTextColumn: {
      width: "60%",
   },
   itemTitle: {
      fontWeight: "bold",
      fontSize: 20,
   },
   itemDescription: {
      color: "gray",
      marginTop: 5,
      marginBottom: 5,
   },
   itemPrice: {
      fontWeight: "bold",
   },
   itemImage: {
      resizeMode: "fill",
      width: "30%",
      height: "100%",
      backgroundColor: "gray",
      borderRadius: 10,
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: "#F4CE14",
      borderColor: "black",
      borderWidth: 2,
      marginVertical: 15,
   },
   buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
   },
   title: {
      fontWeight: "bold",
      fontSize: 20,
      padding: 10,
   },
});
export default ManageMenu;
