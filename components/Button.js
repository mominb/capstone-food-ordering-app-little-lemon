import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
   borderRadius,
   colors,
   shadows,
   spacing,
   typography,
} from "../styles/theme";

const Button = ({
   onPress,
   title,
   variant = "primary",
   disabled = false,
   size = "medium",
   icon,
   iconPosition = "left",
}) => {
   const getVariantStyle = () => {
      switch (variant) {
         case "secondary":
            return styles.secondaryButton;
         case "tertiary":
            return styles.tertiaryButton;
         case "danger":
            return styles.dangerButton;
         default:
            return styles.primaryButton;
      }
   };

   const getSizeStyle = () => {
      switch (size) {
         case "small":
            return styles.smallButton;
         case "large":
            return styles.largeButton;
         default:
            return styles.mediumButton;
      }
   };

   const getTextColor = () => {
      if (variant === "tertiary") return colors.black;
      return colors.white;
   };

   const getIconColor = getTextColor();

   return (
      <TouchableOpacity
         onPress={onPress}
         disabled={disabled}
         style={[
            styles.button,
            getVariantStyle(),
            getSizeStyle(),
            disabled && styles.disabledButton,
         ]}
      >
         <View style={styles.buttonContent}>
            {icon && iconPosition === "left" && (
               <Ionicons
                  name={icon}
                  size={18}
                  color={getIconColor}
                  style={styles.iconLeft}
               />
            )}
            <Text
               style={[
                  styles.buttonText,
                  { color: getTextColor() },
                  disabled && styles.disabledText,
               ]}
            >
               {title}
            </Text>
            {icon && iconPosition === "right" && (
               <Ionicons
                  name={icon}
                  size={18}
                  color={getIconColor}
                  style={styles.iconRight}
               />
            )}
         </View>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   button: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius.lg,
      ...shadows.small,
   },
   buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   primaryButton: {
      backgroundColor: colors.primary,
   },
   secondaryButton: {
      backgroundColor: colors.secondary,
   },
   tertiaryButton: {
      backgroundColor: colors.tertiary,
      borderWidth: 2,
      borderColor: colors.black,
   },
   dangerButton: {
      backgroundColor: colors.red,
   },
   smallButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
   },
   mediumButton: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
   },
   largeButton: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
   },
   buttonText: {
      ...typography.button,
      color: colors.white,
   },
   disabledButton: {
      opacity: 0.6,
   },
   disabledText: {
      color: colors.lightgrey,
   },
   iconLeft: {
      marginRight: spacing.sm,
   },
   iconRight: {
      marginLeft: spacing.sm,
   },
});

export default Button;
