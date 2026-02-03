import { StyleSheet } from "react-native";

export const colors = {
   darkGreen: "#495E57",
   lemonYellow: "#F4CE14",
   lightGreen: "#EDEFEE",
   darkGray: "#333333",
   white: "#FFFFFF",
};

export const spacing = {
   xs: 4,
   sm: 8,
   md: 12,
   lg: 16,
   xl: 20,
   xxl: 24,
   xxxl: 32,
};

export const typography = {
   headline: {
      fontSize: 24,
      fontWeight: "600",
      color: colors.darkGreen,
   },
   body: {
      fontSize: 16,
      fontWeight: "400",
      color: colors.darkGray,
   },
};

export const globalStyles = StyleSheet.create({});
