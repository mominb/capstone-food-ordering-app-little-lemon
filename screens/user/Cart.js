import { Ionicons } from "@expo/vector-icons";
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
import {
   borderRadius,
   colors,
   layout,
   shadows,
   spacing,
   typography,
} from "../../styles/theme";
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
                     {item.image_url ? (
                        <Image
                           source={{
                              uri: item.image_url,
                           }}
                           style={styles.itemImage}
                        />
                     ) : (
                        <View style={styles.itemImagePlaceholder}>
                           <Text style={styles.itemImagePlaceholderText}>
                              No Image
                           </Text>
                        </View>
                     )}
                     <View style={styles.counterContainer}>
                        <TouchableOpacity
                           style={styles.CounterButton}
                           onPress={() => decreaseAmount(item.item_id)}
                        >
                           <Ionicons
                              name="remove"
                              size={20}
                              color={colors.white}
                           />
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
                           <Ionicons
                              name="add"
                              size={20}
                              color={colors.white}
                           />
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
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
   },
   itemContainer: {
      backgroundColor: colors.white,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      ...shadows.small,
   },
   itemInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
   },
   itemName: {
      ...typography.bodyBold,
   },
   itemQty: {
      ...typography.caption,
      color: colors.lightgrey,
      marginTop: spacing.xs,
   },
   itemTotal: {
      ...typography.bodyBold,
      color: colors.primary,
   },
   itemActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: spacing.md,
   },
   itemImage: {
      width: 70,
      height: 70,
      borderRadius: borderRadius.md,
      backgroundColor: colors.lightgrey,
   },
   itemImagePlaceholder: {
      width: 70,
      height: 70,
      borderRadius: borderRadius.md,
      backgroundColor: colors.tertiary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.borderLight,
   },
   itemImagePlaceholderText: {
      ...typography.caption,
      color: colors.lightgrey,
      fontSize: 11,
      textAlign: "center",
   },
   deleteButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.red,
      borderRadius: borderRadius.md,
   },
   deleteText: {
      ...typography.button,
      color: colors.white,
      fontSize: 13,
   },
   counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: colors.tertiary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
   },
   CounterButton: {
      backgroundColor: colors.primary,
      width: 28,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius.md,
   },
   counterText: {
      ...typography.button,
      color: colors.white,
   },
   footer: {
      paddingBottom: spacing.lg,
   },
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.secondary,
      padding: spacing.lg,
      marginHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
   },
   totalAmountText: {
      ...typography.h3,
      color: colors.black,
   },
   checkoutButton: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primary,
      ...shadows.medium,
   },
   checkoutButtonText: {
      ...typography.button,
      color: colors.white,
      textAlign: "center",
   },
});

export default Cart;
