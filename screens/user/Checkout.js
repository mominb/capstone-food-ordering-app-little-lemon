import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderItemList from "../../components/OrderItemList";
import PageHeader from "../../components/PageHeader";
import {
   borderRadius,
   colors,
   layout,
   shadows,
   spacing,
   typography,
} from "../../styles/theme";
import { placeOrder } from "../../utils/supabase";

const Checkout = ({ route, deleteUserCart }) => {
   const [isLoading, setIsLoading] = useState(false);
   const navigation = useNavigation();
   const data = route.params;
   const cartItems = data.cartItems;
   const totalAmount = data.totalAmount;
   const paymentMethods = [{ label: "Cash", value: "COD" }];
   const [paymentMethod, setPaymentMethod] = useState("COD");
   const deliveryMethods = [
      { label: "Deliver to Doorstep", value: "Delivery" },
      { label: "Pick-up from restaurant", value: "Pickup" },
   ];
   const [deliveryMethod, setDeliveryMethod] = useState("Delivery");

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
            <OrderItemList
               orderItems={cartItems}
               order={{ total_price: totalAmount }}
               showHeader={true}
               showTotal={true}
               totalLabel="Total :"
               showItemPrice={true}
            />
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
   subHeading: {
      ...typography.h3,
      marginBottom: spacing.md,
      color: colors.primary,
      alignSelf: "flex-start",
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
