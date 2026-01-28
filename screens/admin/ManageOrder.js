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
import { SafeAreaView } from "react-native-safe-area-context";
import OrderItemList from "../../components/OrderItemList";
import PageHeader from "../../components/PageHeader";
import { updateOrderStatus } from "../../utils/supabase";

const ManageOrder = ({ route }) => {
   const statusUpdateOptions = [
      { label: "Pending", value: "pending" },
      { label: "Confirmed", value: "confirmed" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
   ];

   const navigator = useNavigation();
   const { item: order } = route.params;
   const orderItems = order.order_items || [];
   const [statusUpdate, setStatusUpdate] = useState(order.order_status);
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

   return (
      <SafeAreaView style={styles.container}>
         <PageHeader navigator={navigator} heading={"Order"} />
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
                  Phone: {order.user_data.phone}
               </Text>
            </View>
         </ScrollView>

         <TouchableOpacity
            onPress={() => {
               updateOrderStatus(statusUpdate, order.id);
               navigator.goBack();
            }}
            style={styles.button}
         >
            <Text style={styles.buttonText}>Update Order Status</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
   orderInfoContainer: {
      margin: 16,
      padding: 12,
      borderRadius: 8,
      backgroundColor: "#F6F6F6",
      borderWidth: 1,
      borderColor: "#DDD",
   },
   infoText: {
      fontWeight: "600",
      marginVertical: 4,
   },
   subHeading: {
      fontWeight: "bold",
      fontSize: 20,
      marginBottom: 10,
      alignSelf: "center",
   },
   orderDetailsContainer: {
      padding: 20,
      margin: 20,
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 10,
   },
   itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
   },
   itemInfoContainer: {
      flexDirection: "row",
   },
   itemText: {
      fontWeight: "600",
      marginVertical: 8,
      marginHorizontal: 6,
   },
   totalAmountText: {
      fontWeight: "bold",
      fontSize: 17,
      margin: 10,
   },
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
   },
   DetailsContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      margin: 20,
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
      marginTop: 15,
   },
   buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
   },
   dropdown: {
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: "#EDEFEE",
      borderColor: "black",
      borderWidth: 2,
      marginTop: 5,
      marginBottom: 10,
   },
   dropdownContainer: {
      margin: 20,
   },
});
export default ManageOrder;
