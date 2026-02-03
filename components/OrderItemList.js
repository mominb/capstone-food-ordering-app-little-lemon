import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../styles/theme";
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
                     {item.price && (
                        <Text style={styles.itemText}>
                           ${item.price.toFixed(2)}
                        </Text>
                     )}
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
      borderColor: colors.black,
      borderWidth: 2,
      borderRadius: 10,
   },
   subHeading: {
      ...typography.bodyBold,
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
      ...typography.body,
      marginVertical: 8,
      marginHorizontal: 6,
   },
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
   },
   totalAmountText: {
      ...typography.h3,
      margin: 10,
   },
});

export default OrderItemList;
