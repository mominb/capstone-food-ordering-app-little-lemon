import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors, typography } from "../styles/theme";

const OrderCards = ({ orders, navigator, onPressRoute = "OrderInfo" }) => {
   const formattedDate = (date) => {
      const formatted = new Date(date).toLocaleString("en-GB", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
      });
      return formatted;
   };

   return (
      <FlatList
         style={styles.list}
         data={orders}
         keyExtractor={(item) => String(item.id)}
         contentContainerStyle={styles.listContent}
         renderItem={({ item }) => (
            <TouchableOpacity
               onPress={() => navigator.navigate(onPressRoute, { item })}
               style={
                  item.order_status === "completed" ||
                  item.order_status === "cancelled"
                     ? styles.orderInactive
                     : styles.orderActive
               }
            >
               <Text style={styles.orderId}>
                  Order #{item.id.substring(0, 8)}
               </Text>
               <Text style={styles.metaText}>
                  Placed on {formattedDate(item.created_at)}
               </Text>
               <Text style={styles.statusText}>
                  Status: {item.order_status}
               </Text>
               <Text style={styles.metaText}>{item.delivery_mode}</Text>
            </TouchableOpacity>
         )}
      />
   );
};

const styles = StyleSheet.create({
   list: {
      flex: 1,
   },
   listContent: {
      paddingVertical: 12,
   },
   orderActive: {
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: colors.black,
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
      borderLeftWidth: 5,
      borderLeftColor: "green",
   },
   orderInactive: {
      backgroundColor: "lightgray",
      borderRadius: 10,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: colors.black,
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      borderLeftWidth: 5,
      borderLeftColor: colors.black,
   },
   orderId: {
      ...typography.bodyBold,
      marginBottom: 6,
      color: colors.black,
   },
   metaText: {
      ...typography.caption,
      color: colors.black,
      marginBottom: 4,
   },
   statusText: {
      ...typography.caption,
      color: colors.black,
      marginBottom: 6,
   },
});

export default OrderCards;
