import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
   borderRadius,
   colors,
   shadows,
   spacing,
   typography,
} from "../styles/theme";
import { getGlobalSettings } from "../utils/supabase";
import ItemSeperator from "./ItemSeperator";

const OrderItemList = ({ orderItems, order }) => {
   const [currency, setCurrency] = useState();

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code);
      };
      fetchSettings();
   }, []);

   const formatCurrency = (value) =>
      currency ? `${value} ${currency}` : `${value}`;

   return (
      <View style={styles.orderDetailsContainer}>
         <Text style={styles.subHeading}>Order Items</Text>

         {orderItems.map((item, index) => (
            <View key={item.id ?? item.item_id ?? index}>
               <View style={styles.itemContainer}>
                  <View style={styles.itemInfoContainer}>
                     <Text style={styles.quantity}>{item.quantity}x</Text>
                     <View style={styles.itemDetails}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        {item.price && (
                           <Text style={styles.itemPrice}>
                              {formatCurrency(item.price.toFixed(2))}
                           </Text>
                        )}
                     </View>
                  </View>
               </View>
               {index !== orderItems.length - 1 && <ItemSeperator />}
            </View>
         ))}

         <ItemSeperator />

         <View style={styles.totalAmountContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>
               {formatCurrency(Number(order.total_price).toFixed(2))}
            </Text>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   orderDetailsContainer: {
      padding: spacing.lg,
      margin: spacing.lg,
      borderColor: colors.borderLight,
      borderWidth: 1,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.white,
      ...shadows.small,
   },
   subHeading: {
      ...typography.h3,
      marginBottom: spacing.md,
      color: colors.primary,
   },
   itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
   },
   itemInfoContainer: {
      flexDirection: "row",
      flex: 1,
      gap: spacing.md,
      alignItems: "flex-start",
   },
   quantity: {
      ...typography.bodyBold,
      color: colors.primary,
      minWidth: 30,
   },
   itemDetails: {
      flex: 1,
   },
   itemText: {
      ...typography.bodyBold,
      marginBottom: spacing.xs,
      color: colors.black,
   },
   itemPrice: {
      ...typography.caption,
      color: colors.primary,
   },
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.md,
      marginTop: spacing.md,
   },
   totalLabel: {
      ...typography.bodyBold,
      color: colors.black,
   },
   totalAmount: {
      ...typography.h2,
      color: colors.black,
   },
});

export default OrderItemList;
