import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
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
import PageHeader from "../../components/PageHeader";
import { colors, layout, typography } from "../../styles/theme";
import { getGlobalSettings } from "../../utils/supabase";

const Cart = ({
   getCartItems,
   deleteCartItem,
   changeItemQtyInCart,
   getTotalCartCost,
   userMetaDataExists,
}) => {
   const navigator = useNavigation();
   const [cartItems, setCartItems] = useState([]);
   const [totalAmount, setTotalAmount] = useState(0);
   const [isLoading, setIsLoading] = useState(true);
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

   const load = async () => {
      try {
         const items = await getCartItems();
         setCartItems(items);
         const cost = await getTotalCartCost();
         if (cost) {
            setTotalAmount(cost.toFixed(2));
         } else {
            setTotalAmount(0);
         }
      } catch (err) {
         console.log(err);
         Toast.show({ type: "error", text1: "Failed to load cart" });
      } finally {
         setIsLoading(false);
      }
   };

   const increaseAmount = async (item_id) => {
      setIsLoading(true);
      try {
         const res = await changeItemQtyInCart(item_id, "increase");
         if (res?.error)
            Toast.show({
               type: "error",
               text1: res.message || "Update failed",
            });
      } catch (err) {
         console.log(err);
         Toast.show({ type: "error", text1: "Update failed" });
      } finally {
         await load();
      }
   };
   const decreaseAmount = async (item_id) => {
      setIsLoading(true);
      try {
         const res = await changeItemQtyInCart(item_id, "decrease");
         if (res?.error)
            Toast.show({
               type: "error",
               text1: res.message || "Update failed",
            });
      } catch (err) {
         console.log(err);
         Toast.show({ type: "error", text1: "Update failed" });
      } finally {
         await load();
      }
   };
   useFocusEffect(() => {
      load();
   });
   const isCheckoutAllowed = userMetaDataExists && cartItems.length > 0;

   const handleCheckoutNavi = () => {
      if (isCheckoutAllowed) {
         navigator.navigate("Checkout", {
            cartItems: cartItems,
            totalAmount: totalAmount,
         });
      } else {
         if (!userMetaDataExists) {
            Toast.show({
               type: "error",
               text1: "Please complete profile",
               text2: "You cannot checkout until information is complete",
            });
            navigator.navigate("Profile");
         } else {
            Toast.show({
               type: "error",
               text1: "Cart is empty",
               text2: "You cannot checkout with an empty cart",
            });
         }
      }
   };
   return (
      <SafeAreaView style={[styles.container, layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.white }}
         />
         <PageHeader navigator={navigator} heading={"Cart"}></PageHeader>

         <FlatList
            data={cartItems}
            keyExtractor={(item) => String(item.item_id)}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
               <View style={styles.itemContainer}>
                  <View style={styles.itemInfo}>
                     <View>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemQty}>Qty: {item.amount}</Text>
                     </View>
                     <Text style={styles.itemTotal}>
                        Total:{" "}
                        {formatCurrency((item.amount * item.price).toFixed(2))}
                     </Text>
                  </View>

                  <View style={styles.itemActions}>
                     <Image
                        source={{
                           uri: item.image_url,
                        }}
                        style={styles.itemImage}
                     />
                     <View style={styles.counterContainer}>
                        <TouchableOpacity
                           style={styles.CounterButton}
                           onPress={() => decreaseAmount(item.item_id)}
                        >
                           <Text style={styles.counterText}>-</Text>
                        </TouchableOpacity>
                        <Text
                           style={[styles.counterText, { color: colors.black }]}
                        >
                           {item.amount}
                        </Text>
                        <TouchableOpacity
                           style={styles.CounterButton}
                           onPress={() => increaseAmount(item.item_id)}
                        >
                           <Text style={styles.counterText}>+</Text>
                        </TouchableOpacity>
                     </View>
                     <TouchableOpacity
                        onPress={async () => {
                           setIsLoading(true);
                           try {
                              const response = await deleteCartItem(
                                 item.item_id,
                              );
                              Toast.show({
                                 type: response.type,
                                 text1: response.message,
                              });
                           } catch (err) {
                              console.log(err);
                              Toast.show({
                                 type: "error",
                                 text1: "Delete failed",
                              });
                           } finally {
                              await load();
                           }
                        }}
                        style={styles.deleteButton}
                     >
                        <Text style={styles.deleteText}>Delete</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            )}
         />
         <View style={styles.footer}>
           <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountText}>Total amount</Text>
               <Text style={styles.totalAmountText}>
                  {formatCurrency(totalAmount)}
               </Text>
           </View>
            <TouchableOpacity
               onPress={handleCheckoutNavi}
               style={styles.checkoutButton}
            >
               <Text style={styles.checkoutButtonText}>
                  Continue to Checkout
               </Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {},
   listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      marginTop: 30,
   },
   itemContainer: {
      backgroundColor: colors.tertiary,
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      borderColor: colors.black,
      borderWidth: 1,
   },
   itemInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
   },
   itemName: {
      ...typography.body,
   },
   itemQty: {
      ...typography.caption,
      color: colors.black,
      marginTop: 4,
   },
   itemTotal: {
      ...typography.button,
   },
   itemActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   itemImage: {
      width: 60,
      height: 60,
      borderRadius: 6,
      backgroundColor: colors.lightgrey,
   },
   deleteButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: colors.red,
      borderRadius: 4,
   },
   deleteText: {
      ...typography.body,
      color: colors.white,
   },
   counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   CounterButton: {
      backgroundColor: colors.lightgrey,
      width: 20,
      height: 20,
      alignItems: "center",
      borderRadius: 20,
      margin: 8,
   },
   counterText: {
      ...typography.button,
      color: colors.white,
   },
   footer: {},
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: colors.secondary,
      padding: 10,
   },
   totalAmountText: {
      ...typography.h2,
   },
   checkoutButton: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: colors.tertiary,
      borderColor: colors.black,
      borderWidth: 2,
      marginTop: 15,
   },
   checkoutButtonText: {
      ...typography.bodyBold,
      textAlign: "center",
   },
});

export default Cart;
