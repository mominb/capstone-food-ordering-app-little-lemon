import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../styles/theme";

const RestaurantClosedOverlay = ({ visible }) => {
   if (!visible) return null;

   return (
      <View style={styles.overlay} pointerEvents="auto">
         <View style={styles.card}>
            <Text style={styles.title}>Restaurant is closed</Text>
            <Text style={styles.message}>
               Ordering is unavailable. Please try again later.
            </Text>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
   },
   card: {
      width: "85%",
      backgroundColor: colors.lightgrey,
      borderRadius: 12,
      padding: 16,
      borderColor: colors.black,
      borderWidth: 2,
   },
   title: {
      ...typography.h2,
      textAlign: "center",
      marginBottom: 6,
   },
   message: {
      ...typography.body,
      textAlign: "center",
      color: colors.black,
   },
});

export default RestaurantClosedOverlay;
