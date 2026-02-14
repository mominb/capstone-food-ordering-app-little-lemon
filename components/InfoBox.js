import { StyleSheet, Text, View } from "react-native";
import {
   borderRadius,
   colors,
   shadows,
   spacing,
   typography,
} from "../styles/theme";

const InfoBox = ({ message }) => {
   return (
      <View style={styles.box}>
         <Text style={styles.icon}>ℹ</Text>
         <Text style={styles.message}>{message}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   box: {
      width: "90%",
      backgroundColor: colors.warning,
      alignSelf: "center",
      justifyContent: "flex-start",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      marginVertical: spacing.md,
      flexDirection: "row",
      borderRadius: borderRadius.lg,
      ...shadows.small,
   },
   icon: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.black,
      marginRight: spacing.md,
   },
   message: {
      ...typography.caption,
      color: colors.black,
      flex: 1,
   },
});

export default InfoBox;
