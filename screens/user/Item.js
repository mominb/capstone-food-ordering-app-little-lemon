import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { colors, layout, typography } from "../../styles/theme";
import { saveItemToCart } from "../../utils/database";
import { getGlobalSettings } from "../../utils/supabase";

const Item = ({ route }) => {
   const navigator = useNavigation();
   const item = route.params.item;
   const [amount, setAmount] = useState(1);
   const [isLoading, setIsLoading] = useState(false);
   const [currency, setCurrency] = useState();

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code);
      };
      fetchSettings();
   }, []);

   const formatCurrency = (value) =>
      currency ? `${value} ${currency}` : `${value}`;

   const increaseAmount = () => {
      setAmount((prev) => prev + 1);
   };
   const decreaseAmount = () => {
      if (amount > 1) {
         setAmount((prev) => prev - 1);
      }
   };

   return (
      <SafeAreaView style={[styles.container, layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.white }}
         />
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
               backgroundColor: colors.lightgrey,
               width: "100%",
               height: "30%",
               borderBottomColor: colors.black,
               borderBottomWidth: 2,
            }}
            source={{
               uri: item.image_url,
            }}
         />
         <View style={styles.infoBox}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
         </View>
         <View style={styles.seperator} />
         <View>
            <View style={styles.counterContainer}>
               <TouchableOpacity
                  style={styles.CounterButton}
                  onPress={decreaseAmount}
               >
                  <Text style={styles.counterText}>-</Text>
               </TouchableOpacity>
               <Text style={[styles.counterText, { color: colors.black }]}>
                  {amount}
               </Text>
               <TouchableOpacity
                  style={styles.CounterButton}
                  onPress={increaseAmount}
               >
                  <Text style={styles.counterText}>+</Text>
               </TouchableOpacity>
            </View>
            <TouchableOpacity
               onPress={async () => {
                  setIsLoading(true);
                  try {
                     const response = await saveItemToCart(item, amount);
                     Toast.show({
                        type: response.type,
                        text1: response.message,
                     });
                     navigator.navigate("Home");
                  } catch (err) {
                     console.log(err);
                     Toast.show({ type: "error", text1: "Add to cart failed" });
                  } finally {
                     setIsLoading(false);
                  }
               }}
               style={styles.button}
            >
               <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {},
   header: {
      justifyContent: "flex-start",
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.black,
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
      ...typography.h2,
      marginBottom: 5,
   },
   itemDescription: {
      ...typography.body,
   },
   itemPrice: {
      ...typography.h2,
      marginTop: 30,
   },
   seperator: {
      width: "100%",
      height: 0.5,
      backgroundColor: colors.black,
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: colors.secondary,
      borderColor: colors.black,
      borderWidth: 2,
      marginBottom: 20,
   },
   buttonText: {
      ...typography.bodyBold,
      color: colors.black,
      textAlign: "center",
   },
   counterContainer: {
      height: "50%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   CounterButton: {
      backgroundColor: colors.lightgrey,
      width: 35,
      height: 35,
      alignItems: "center",
      borderRadius: 20,
      margin: 15,
   },
   counterText: {
      ...typography.h1,
      color: colors.white,
   },
});

export default Item;
