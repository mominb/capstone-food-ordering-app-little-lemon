import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
   FlatList,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemSeperator from "../../components/ItemSeperator";
import PageHeader from "../../components/PageHeader";
import {
   borderRadius,
   colors,
   layout,
   shadows,
   spacing,
   typography,
} from "../../styles/theme";
import { getGlobalSettings, placeOrder } from "../../utils/supabase";

const Checkout = ({ route, deleteUserCart }) => {
   const [isLoading, setIsLoading] = useState(false);
   const navigation = useNavigation();
   const data = route.params;
   const cartItems = data.cartItems;
   const totalAmount = data.totalAmount;
   const paymentMethods = [{ label: "Cash", value: "COD" }];
   const [paymentMethod, setPaymentMethod] = useState("COD");
   const [currency, setCurrency] = useState();
   const deliveryMethods = [
      { label: "Deliver to Doorstep", value: "Delivery" },
      { label: "Pick-up from restaurant", value: "Pickup" },
   ];
   const [deliveryMethod, setDeliveryMethod] = useState("Delivery");

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code);
      };
      fetchSettings();
   }, []);

   const formatCurrency = (value) =>
      currency ? `${value} ${currency}` : `${value}`;
   const handleOrderPlacement = async () => {
      setIsLoading(true);
      try {
         await placeOrder(
            cartItems,
            deliveryMethod,
            paymentMethod,
            totalAmount,
         );
         navigation.navigate("Orders");
         await deleteUserCart();
      } catch (error) {
         console.log(error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <SafeAreaView style={[styles.container, layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.white }}
         />
         <PageHeader navigation={navigation} heading={"Checkout"}></PageHeader>
         <ScrollView>
            <View style={styles.orderDetailsContainer}>
               <Text style={styles.subHeading}>Order Details</Text>
               <FlatList
                  data={cartItems}
                  keyExtractor={(item) => String(item.item_id)}
                  ItemSeparatorComponent={ItemSeperator}
                  renderItem={({ item }) => (
                     <View style={styles.itemContainer}>
                        <View style={styles.itemInfoContainer}>
                           <Text style={styles.itemText}>{item.amount}x</Text>
                           <Text style={styles.itemText}>{item.name}</Text>
                        </View>

                        <View style={styles.itemPriceContainer}>
                           <Text style={styles.itemText}>
                              {formatCurrency(
                                 (item.amount * item.price).toFixed(2),
                              )}
                           </Text>
                        </View>
                     </View>
                  )}
               />
               <ItemSeperator />
               <View style={styles.totalAmountContainer}>
                  <Text style={styles.totalAmountText}>Total :</Text>
                  <Text style={styles.totalAmountText}>
                     {formatCurrency(totalAmount)}
                  </Text>
               </View>
            </View>
            <View style={styles.DetailsContainer}>
               <Text style={[styles.subHeading, { alignSelf: "flex-start" }]}>
                  Delivery Method
               </Text>
               <Dropdown
                  style={styles.MethodSelector}
                  data={deliveryMethods}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  value={deliveryMethod}
                  onChange={(item) => {
                     setDeliveryMethod(item.value);
                  }}
               />
               <Text style={[styles.subHeading, { alignSelf: "flex-start" }]}>
                  Payment Method
               </Text>
               <Dropdown
                  style={styles.MethodSelector}
                  data={paymentMethods}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  value={paymentMethod}
                  onChange={(item) => {
                     setPaymentMethod(item.value);
                  }}
               />
            </View>
         </ScrollView>
         <View>
            <TouchableOpacity
               onPress={handleOrderPlacement}
               style={styles.button}
            >
               <Text style={styles.buttonText}>Place order</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {},
   subHeading: {
      ...typography.h3,
      marginBottom: spacing.md,
      color: colors.primary,
      alignSelf: "flex-start",
   },
   orderDetailsContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      marginHorizontal: spacing.md,
      marginVertical: spacing.md,
      borderColor: colors.borderLight,
      borderWidth: 1,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.white,
      ...shadows.small,
   },
   itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
      alignItems: "center",
   },
   itemInfoContainer: {
      flexDirection: "row",
      flex: 1,
      gap: spacing.md,
   },
   itemPriceContainer: {},
   itemText: {
      ...typography.bodyBold,
      color: colors.black,
   },
   totalAmountText: {
      ...typography.h3,
      color: colors.black,
      margin: spacing.md,
   },
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.md,
      marginTop: spacing.md,
   },
   DetailsContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
   },
   MethodSelector: {
      width: "100%",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.white,
      borderColor: colors.borderLight,
      borderWidth: 1,
      marginVertical: spacing.md,
      ...shadows.small,
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primary,
      marginVertical: spacing.lg,
      ...shadows.medium,
   },
   buttonText: {
      ...typography.button,
      color: colors.white,
      textAlign: "center",
   },
});

export default Checkout;
