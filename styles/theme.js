import { Platform, StyleSheet } from "react-native";

export const colors = {
   primary: "#495E57",
   secondary: "#F4CE14",
   tertiary: "#EDEFEE",
   lightgrey: "#B0B0B0",
   red: "#E53935",
   black: "#000000",
   white: "#FFFFFF",
   success: "#4CAF50",
   warning: "#FF9800",
   error: "#E53935",
   shadow: "rgba(0, 0, 0, 0.1)",
   borderLight: "#E0E0E0",
};

export const spacing = {
   xs: 4,
   sm: 8,
   md: 12,
   lg: 16,
   xl: 20,
   xxl: 24,
};

export const borderRadius = {
   sm: 4,
   md: 8,
   lg: 12,
   xl: 16,
   full: 24,
};

export const shadows = {
   small: {
      shadowColor: colors.black,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
   },
   medium: {
      shadowColor: colors.black,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
   },
   large: {
      shadowColor: colors.black,
      shadowOpacity: 0.15,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
   },
};

export const layout = {
   container: {
      flex: 1,
      backgroundColor: colors.white,
   },
};

const fontFamilies = {
   regular: Platform.select({ ios: "System", android: "Inter_400Regular" }),
   medium: Platform.select({ ios: "System", android: "Inter_500Medium" }),
   semibold: Platform.select({ ios: "System", android: "Inter_600SemiBold" }),
   bold: Platform.select({ ios: "System", android: "Inter_700Bold" }),
};

export const typography = {
   h1: {
      fontSize: 28,
      fontWeight: "700",
      fontFamily: fontFamilies.bold,
      color: colors.black,
      lineHeight: 34,
   },
   h2: {
      fontSize: 22,
      fontWeight: "700",
      fontFamily: fontFamilies.bold,
      color: colors.black,
      lineHeight: 28,
   },
   h3: {
      fontSize: 18,
      fontWeight: "700",
      fontFamily: fontFamilies.bold,
      color: colors.black,
      lineHeight: 24,
   },
   body: {
      fontSize: 16,
      fontWeight: "400",
      fontFamily: fontFamilies.regular,
      color: colors.black,
      lineHeight: 22,
   },
   bodyBold: {
      fontSize: 16,
      fontWeight: "700",
      fontFamily: fontFamilies.bold,
      color: colors.black,
      lineHeight: 22,
   },
   button: {
      fontSize: 16,
      fontWeight: "700",
      fontFamily: fontFamilies.semibold,
      color: colors.black,
   },
   caption: {
      fontSize: 14,
      fontWeight: "500",
      fontFamily: fontFamilies.medium,
      color: colors.black,
      lineHeight: 20,
   },
   small: {
      fontSize: 12,
      fontWeight: "400",
      fontFamily: fontFamilies.regular,
      color: colors.lightgrey,
      lineHeight: 16,
   },
};

export const globalStyles = StyleSheet.create({});
