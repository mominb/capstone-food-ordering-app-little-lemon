import { StyleSheet, Text, View } from "react-native";
import {
   borderRadius,
   colors,
   shadows,
   spacing,
   typography,
} from "../styles/theme";

const RestaurantClosedOverlay = ({ visible }) => {
   if (!visible) return null;

   return (
      <View style={styles.overlay} pointerEvents="auto">
         <View style={[styles.card, shadows.large]}>
            <Text style={styles.title}>🍋 Restaurant Closed</Text>
            <Text style={styles.message}>
               Ordering is currently unavailable. Please check back later.
            </Text>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
   },
   card: {
      width: "85%",
      backgroundColor: colors.white,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
   },
   title: {
      ...typography.h2,
      textAlign: "center",
      marginBottom: spacing.md,
      color: colors.primary,
   },
   message: {
      ...typography.body,
      textAlign: "center",
      color: colors.black,
   },
});

export default RestaurantClosedOverlay;
