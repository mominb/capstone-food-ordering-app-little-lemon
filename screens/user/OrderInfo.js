import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoBox from "../../components/InfoBox";
import OrderItemList from "../../components/OrderItemList";
import PageHeader from "../../components/PageHeader";
import { colors, layout, typography } from "../../styles/theme";

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
      <SafeAreaView style={[styles.container, layout.container]}>
         <PageHeader navigator={navigator} heading={"Order Details"} />
         <InfoBox
            message={
               "For any further changes or cancellation please contact the restaurant"
            }
         />
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
   container: {},
   metaContainer: {
      margin: 16,
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.tertiary,
      borderWidth: 1,
      borderColor: colors.black,
   },
   metaText: {
      ...typography.body,
      marginVertical: 4,
   },
});
export default OrderInfo;
