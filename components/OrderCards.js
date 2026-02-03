import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

const OrderCards = ({ orders, navigator }) => {
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
               onPress={() => navigator.navigate("OrderInfo", { item })}
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
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
      borderLeftWidth: 5,
      borderLeftColor: "#2E7D32",
   },
   orderInactive: {
      backgroundColor: "#F2F2F2",
      borderRadius: 10,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      borderLeftWidth: 5,
      borderLeftColor: "#757575",
   },
   orderId: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 6,
      color: "#212121",
   },
   metaText: {
      fontSize: 13,
      color: "#616161",
      marginBottom: 4,
   },
   statusText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#424242",
      marginBottom: 6,
   },
});

export default OrderCards;
