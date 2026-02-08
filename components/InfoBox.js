import { StyleSheet, Text, View } from "react-native";

const InfoBox = ({ message }) => {
   return (
      <View style={styles.box}>
         <Text style={styles.message}>ⓘ </Text>
         <Text style={styles.message}>{message}</Text>
      </View>
   );
};
const styles = StyleSheet.create({
   box: {
      width: "90%",
      height: "auto",
      backgroundColor: "lightyellow",
      alignSelf: "center",
      justifyContent: "space-between",
      padding: 15,
      marginVertical: 10,
      flexDirection: "row",
   },
   message: {
      fontWeight: "bold",
      marginHorizontal: 5,
   },
});
export default InfoBox;
