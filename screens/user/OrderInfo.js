import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderItemList from "../../components/OrderItemList";
import PageHeader from "../../components/PageHeader";

const OrderInfo = ({ route }) => {
   const navigator = useNavigation();
   const { item: order } = route.params;
   const orderItems = order.order_items || [];

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
         <ScrollView>
            <OrderItemList orderItems={orderItems} order={order} />

            <View style={styles.metaContainer}>
               <Text style={styles.metaText}>Order ID: {order.id}</Text>
               <Text style={styles.metaText}>
                  Placed on {formattedDate(order.created_at)}
               </Text>
               <Text style={styles.metaText}>Status: {order.order_status}</Text>
               <Text style={styles.metaText}>
                  Payment: {order.payment_mode}
               </Text>
               <Text style={styles.metaText}>{order.delivery_mode}</Text>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
   metaContainer: {
      margin: 16,
      padding: 12,
      borderRadius: 8,
      backgroundColor: "#F6F6F6",
      borderWidth: 1,
      borderColor: "#DDD",
   },
   metaText: {
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
});
export default OrderInfo;
