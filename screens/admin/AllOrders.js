import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import OrderCards from "../../components/OrderCards";
import PageHeader from "../../components/PageHeader";
import * as theme from "../../styles/theme";
import { getAllOrders } from "../../utils/supabase";

const AllOrders = () => {
   const navigation = useNavigation();
   const [orders, setOrders] = useState();
   const [isLoading, setIsLoading] = useState(false);
   useFocusEffect(
      useCallback(() => {
         const getOrders = async () => {
            setIsLoading(true);
            try {
               const orders = await getAllOrders();
               setOrders(orders.reverse());
            } catch (error) {
               console.log(error);
               Toast.show({ type: "error", text1: "Failed to load orders" });
            } finally {
               setIsLoading(false);
            }
         };
         getOrders();
      }, []),
   );

   return (
      <SafeAreaView style={[styles.container, theme.layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: theme.colors.white }}
         />
         <PageHeader navigation={navigation} heading={"Orders"} />
         <OrderCards
            navigation={navigation}
            orders={orders}
            onPressRoute="ManageOrder"
         />
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {},
});
export default AllOrders;
