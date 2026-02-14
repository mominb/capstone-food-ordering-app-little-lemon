import {
   FlatList,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import {
   borderRadius,
   colors,
   shadows,
   spacing,
   typography,
} from "../styles/theme";

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
               style={[
                  styles.card,
                  item.order_status === "completed" ||
                  item.order_status === "cancelled"
                     ? styles.cardInactive
                     : styles.cardActive,
               ]}
            >
               <View style={styles.headerRow}>
                  <Text style={styles.orderId}>
                     Order #{item.id.substring(0, 8)}
                  </Text>
                  <View
                     style={[
                        styles.badge,
                        item.order_status === "pending" && styles.badgePending,
                        item.order_status === "confirmed" &&
                           styles.badgeConfirmed,
                        item.order_status === "completed" &&
                           styles.badgeCompleted,
                        item.order_status === "cancelled" &&
                           styles.badgeCancelled,
                     ]}
                  >
                     <Text style={styles.badgeText}>{item.order_status}</Text>
                  </View>
               </View>
               <Text style={styles.metaText}>
                  Placed on {formattedDate(item.created_at)}
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
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
   },
   card: {
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.small,
   },
   cardActive: {
      backgroundColor: colors.white,
      borderLeftWidth: 4,
      borderLeftColor: colors.success,
   },
   cardInactive: {
      backgroundColor: colors.tertiary,
      borderLeftWidth: 4,
      borderLeftColor: colors.lightgrey,
   },
   headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
   },
   orderId: {
      ...typography.h3,
      color: colors.black,
   },
   badge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      backgroundColor: colors.tertiary,
   },
   badgePending: {
      backgroundColor: colors.warning,
   },
   badgeConfirmed: {
      backgroundColor: "#2196F3",
   },
   badgeCompleted: {
      backgroundColor: colors.success,
   },
   badgeCancelled: {
      backgroundColor: colors.red,
   },
   badgeText: {
      ...typography.small,
      color: colors.white,
      textTransform: "capitalize",
      fontWeight: "700",
   },
   metaText: {
      ...typography.caption,
      color: colors.lightgrey,
      marginBottom: spacing.xs,
   },
});

export default OrderCards;
