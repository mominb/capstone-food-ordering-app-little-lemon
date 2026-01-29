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
import { SafeAreaView } from "react-native-safe-area-context";
import ItemSeperator from "../../components/ItemSeperator";
import PageHeader from "../../components/PageHeader";

const ManageMenu = () => {
   const [menu, setMenu] = useState([]);

   const navigator = useNavigation();

   useFocusEffect(() => {
      const load = async () => {
         const menu = await getMenuItems();
         setMenu(menu);
      };
      load();
   });
   return (
      <SafeAreaView>
         <PageHeader heading={"Menu Management"} navigator={navigator} />
         <TouchableOpacity onPress={() => navigator.navigate("MenuItem")}>
            <Text>ADD ITEM</Text>
         </TouchableOpacity>
         <FlatList
            keyExtractor={(item) => item.id}
            data={menu}
            ItemSeparatorComponent={ItemSeperator}
            renderItem={({ item }) => (
               <TouchableOpacity
                  onPress={() => navigator.navigate("MenuItem", { item })}
                  style={styles.itemRow}
               >
                  <View style={styles.itemTextColumn}>
                     <Text style={styles.itemTitle}>{item.name}</Text>
                     <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                     </Text>
                     <Text style={styles.itemPrice}>${item.price}</Text>
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
      width: 100,
      height: 100,
      backgroundColor: "gray",
      borderRadius: 10,
   },
});
export default ManageMenu;
