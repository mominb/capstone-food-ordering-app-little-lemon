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
import Toast from "react-native-toast-message";
import OrderItemList from "../../components/OrderItemList";
import PageHeader from "../../components/PageHeader";
import * as theme from "../../styles/theme";
import { updateOrderStatus } from "../../utils/supabase";

const ManageOrder = ({ route }) => {
   const statusUpdateOptions = [
      { label: "Pending", value: "pending" },
      { label: "Confirmed", value: "confirmed" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
   ];

   const navigation = useNavigation();
   const { item: order } = route.params;
   const orderItems = order.order_items || [];
   const [statusUpdate, setStatusUpdate] = useState(order.order_status);
   const [isLoading, setIsLoading] = useState(false);
   const formattedDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleString("en-GB", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
      });
   };

   const handleUpdate = async () => {
      setIsLoading(true);
      try {
         const res = await updateOrderStatus(statusUpdate, order.id);
         if (res?.error) {
            Toast.show({ type: "error", text1: "Update failed" });
         } else {
            Toast.show({ type: "success", text1: "Order updated" });
            if (navigation.canGoBack()) {
               navigation.goBack();
            }
         }
      } catch (error) {
         console.log(error);
         Toast.show({ type: "error", text1: "Update failed" });
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <SafeAreaView style={[styles.container, theme.layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: theme.colors.white }}
         />
         <PageHeader navigation={navigation} heading={"Order"} />
         <View style={styles.dropdownContainer}>
            <Text style={[styles.subHeading, { alignSelf: "flex-start" }]}>
               Status
            </Text>
            <Dropdown
               style={styles.dropdown}
               data={statusUpdateOptions}
               labelField="label"
               valueField="value"
               placeholder="Select"
               value={statusUpdate}
               onChange={(item) => {
                  setStatusUpdate(item.value);
               }}
            />
         </View>
         <ScrollView>
            <OrderItemList orderItems={orderItems} order={order} />
            <View style={styles.orderInfoContainer}>
               <Text style={styles.subHeading}>Order Information</Text>
               <Text style={styles.infoText}>Order ID: {order.id}</Text>
               <Text style={styles.infoText}>
                  Placed on {formattedDate(order.created_at)}
               </Text>
               <Text style={styles.infoText}>Status: {order.order_status}</Text>
               <Text style={styles.infoText}>
                  Payment: {order.payment_mode}
               </Text>
               <Text style={styles.infoText}>{order.delivery_mode}</Text>
               <Text style={styles.subHeading}>Customer Information</Text>
               <Text style={styles.infoText}>
                  Name: {order.user_data.displayName}
               </Text>
               <Text style={styles.infoText}>
                  Email: {order.user_data.email}
               </Text>
               <Text style={styles.infoText}>
                  Phone: 0{order.user_data.phone}
               </Text>
            </View>
         </ScrollView>

         <TouchableOpacity onPress={handleUpdate} style={styles.button}>
            <Text style={styles.buttonText}>Update Order Status</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {},
   orderInfoContainer: {
      margin: 16,
      padding: 12,
      borderRadius: 8,
      backgroundColor: theme.colors.tertiary,
      borderWidth: 1,
      borderColor: theme.colors.black,
   },
   infoText: {
      ...theme.typography.body,
      marginVertical: 4,
   },
   subHeading: {
      ...theme.typography.h2,
      marginBottom: 10,
      alignSelf: "center",
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.black,
      borderWidth: 2,
      marginTop: 15,
   },
   buttonText: {
      ...theme.typography.bodyBold,
      textAlign: "center",
   },
   dropdown: {
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: theme.colors.tertiary,
      borderColor: theme.colors.black,
      borderWidth: 2,
      marginTop: 5,
      marginBottom: 10,
   },
   dropdownContainer: {
      margin: 20,
   },
});
export default ManageOrder;
