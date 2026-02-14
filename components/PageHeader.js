import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "../styles/theme";

const PageHeader = ({ navigator, heading }) => {
   return (
      <View style={styles.header}>
         <TouchableOpacity
            onPress={() => navigator.goBack()}
            style={styles.backButtonContainer}
         >
            <Ionicons name="chevron-back" size={28} color={colors.primary} />
         </TouchableOpacity>
         <Text style={styles.heading}>{heading}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   header: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.white,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      position: "relative",
   },
   backButtonContainer: {
      position: "absolute",
      left: spacing.lg,
      padding: spacing.sm,
      borderRadius: borderRadius.md,
   },
   heading: {
      ...typography.h2,
      color: colors.primary,
      textAlign: "center",
      width: "100%",
   },
});

export default PageHeader;
