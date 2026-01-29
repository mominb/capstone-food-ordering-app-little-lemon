import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
   Image,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   addMenuItem,
   deleteMenuItem,
   updateMenuItem,
} from "../../utils/supabase";

const Item = ({ route }) => {
   const navigator = useNavigation();
   const item = route?.params?.item ?? {};
   const [itemName, setItemName] = useState(item.name);
   const [itemDescription, setItemDescription] = useState(item.description);
   const [itemPrice, setItemPrice] = useState(item.price?.toString());
   const isItemExistent = Boolean(item.id);
   const handleItemUpdate = async (item) => {
      if (!isItemExistent) {
         await addMenuItem(item.name, item.description, item.price);
      } else {
         await updateMenuItem(item.id, item.name, item.description, item.price);
      }
   };
   const handleItemDelete = async (item_id) => {
      await deleteMenuItem(item_id);
   };
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => navigator.goBack()}>
               <Image
                  source={require("../../assets/back-button.jpg")}
                  resizeMode="contain"
                  style={styles.backButton}
               />
            </TouchableOpacity>
            <Image
               source={require("../../assets/logo-long-text.png")}
               resizeMode="contain"
               style={styles.logoLemon}
            />
         </View>

         <Image
            style={{
               resizeMode: "stretch",
               backgroundColor: "gray",
               width: "100%",
               height: "30%",
               borderBottomColor: "black",
               borderBottomWidth: 2,
            }}
            source={{
               uri: item.image_url,
            }}
         />
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
            <Text style={styles.label}>Price</Text>
            <TextInput
               keyboardType="numeric"
               style={styles.input}
               value={itemPrice}
               onChangeText={setItemPrice}
            />
         </View>
         <View style={styles.seperator} />
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   header: {
      justifyContent: "flex-start",
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "black",
      flexDirection: "row",
      padding: 20,
   },

   logoLemon: {
      alignSelf: "center",
      marginLeft: 25,
      width: 200,
      height: 40,
   },
   backButton: {
      alignSelf: "flex-start",
      width: 48,
      height: 48,
   },
   infoBox: {
      width: "100%",
      padding: 20,
   },
   itemName: {
      fontWeight: "bold",
      fontSize: 20,
      marginBottom: 5,
   },
   itemDescription: {},
   itemPrice: {
      marginTop: 30,
      fontWeight: "bold",
      fontSize: 20,
   },
   seperator: {
      width: "100%",
      height: 0.5,
      backgroundColor: "black",
   },
   addOnBox: {
      width: "100%",
      padding: 20,
   },
   heading: {
      fontWeight: "bold",
      fontSize: 20,
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
      marginBottom: 20,
   },
   buttonText: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
   },
   counterContainer: {
      height: "50%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   CounterButton: {
      backgroundColor: "grey",
      width: 40,
      height: 40,
      alignItems: "center",
      borderRadius: 20,
      margin: 15,
   },
   counterText: {
      color: "white",
      fontSize: 30,
   },
   input: {
      height: 48,
      borderWidth: 2,
      borderColor: "#495E57",
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      backgroundColor: "#EDEFEE",
   },
   label: {
      fontSize: 14,
      fontWeight: "bold",
      color: "black",
      marginBottom: 6,
   },
});

export default Item;
