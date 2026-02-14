import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import OrderCards from "../../components/OrderCards";
import PageHeader from "../../components/PageHeader";
import {
   borderRadius,
   colors,
   layout,
   shadows,
   spacing,
   typography,
} from "../../styles/theme";
import { getUsersOrders } from "../../utils/supabase";

const Orders = () => {
   const navigator = useNavigation();
   const [orders, setOrders] = useState();
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      const getOrders = async () => {
         setIsLoading(true);
         try {
            const orders = await getUsersOrders();
            setOrders(orders.reverse());
         } catch (error) {
            console.log(error);
            Toast.show({ type: "error", text1: "Failed to load orders" });
         } finally {
            setIsLoading(false);
         }
      };

      getOrders();
   }, []);

   return (
      <SafeAreaView style={[styles.container, layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.white }}
         />
         <PageHeader navigator={navigator} heading={"Your Orders"} />
         <View style={styles.content}>
            <OrderCards navigator={navigator} orders={orders} />
            <TouchableOpacity
               onPress={() => navigator.navigate("Home")}
               style={styles.button}
            >
               <Text style={styles.buttonText}>Back to home</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {},
   content: { flex: 1, justifyContent: "space-between" },
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
export default Orders;
