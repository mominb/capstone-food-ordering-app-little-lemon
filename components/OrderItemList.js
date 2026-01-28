import { StyleSheet, Text, View } from "react-native";
import ItemSeperator from "./ItemSeperator";

const OrderItemList = ({ orderItems, order }) => {
   return (
      <View style={styles.orderDetailsContainer}>
         <Text style={styles.subHeading}>Order Items</Text>

         {orderItems.map((item, index) => (
            <View key={item.id ?? item.item_id ?? index}>
               <View style={styles.itemContainer}>
                  <View style={styles.itemInfoContainer}>
                     <Text style={styles.itemText}>{item.quantity}x</Text>
                     <Text style={styles.itemText}>{item.name}</Text>
                  </View>
               </View>
               {index !== orderItems.length - 1 && <ItemSeperator />}
            </View>
         ))}

         <ItemSeperator />

         <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmountText}>Total :</Text>
            <Text style={styles.totalAmountText}>
               ${Number(order.total_price).toFixed(2)}
            </Text>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   orderDetailsContainer: {
      padding: 20,
      margin: 20,
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 10,
   },
   subHeading: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 10,
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
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
   },
   totalAmountText: {
      fontWeight: "bold",
      fontSize: 17,
      margin: 10,
   },
});

export default OrderItemList;
