import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors, typography } from "../styles/theme";

const Filter = ({ categories, onClick, activeCat }) => {
   const isActive = (category) => {
      if (activeCat.includes(category)) {
         return true;
      } else {
         return false;
      }
   };
   return categories.map((category) => (
      <TouchableOpacity
         style={
            isActive(category) ? styles.filterButtonActive : styles.filterButton
         }
         onPress={() => onClick(category)}
         key={category}
      >
         <Text style={styles.filterButtonText}>{category}</Text>
      </TouchableOpacity>
   ));
};

const styles = StyleSheet.create({
   filterButton: {
      padding: 10,
      margin: 10,
      borderRadius: 15,
      backgroundColor: colors.tertiary,
   },

   filterButtonActive: {
      padding: 10,
      margin: 10,
      borderRadius: 15,
      backgroundColor: colors.secondary,
   },

   filterButtonText: {
      ...typography.bodyBold,
      color: colors.black,
   },
});

export default Filter;
