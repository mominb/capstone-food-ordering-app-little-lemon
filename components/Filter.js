import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {
   borderRadius,
   colors,
   shadows,
   spacing,
   typography,
} from "../styles/theme";

const Filter = ({ categories, onClick, activeCat }) => {
   const isActive = (category) => {
      return activeCat.includes(category);
   };

   return categories.map((category) => (
      <TouchableOpacity
         style={[
            isActive(category)
               ? styles.filterButtonActive
               : styles.filterButton,
            shadows.small,
         ]}
         onPress={() => onClick(category)}
         key={category}
      >
         <Text
            style={
               isActive(category)
                  ? styles.filterButtonTextActive
                  : styles.filterButtonText
            }
         >
            {category}
         </Text>
      </TouchableOpacity>
   ));
};

const styles = StyleSheet.create({
   filterButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.sm,
      marginVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.tertiary,
      borderWidth: 1,
      borderColor: colors.borderLight,
   },

   filterButtonActive: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.sm,
      marginVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.secondary,
      borderWidth: 1,
      borderColor: colors.primary,
   },

   filterButtonText: {
      ...typography.button,
      color: colors.black,
      fontSize: 14,
   },

   filterButtonTextActive: {
      ...typography.button,
      color: colors.primary,
      fontSize: 14,
   },
});

export default Filter;
