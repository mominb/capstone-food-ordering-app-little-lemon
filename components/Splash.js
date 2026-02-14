import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/theme";

const Splash = () => {
   return (
      <SafeAreaView style={styles.container}>
         <Image
            style={styles.image}
            resizeMethod="contain"
            source={require("../assets/littlelemon-logo-long-white.jpg")}
         />
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
   },

   image: {
      width: "75%",
      height: "20%",
      alignItems: "center",
      justifyContent: "center",
      resizeMode: "contain",
   },
});
export default Splash;
