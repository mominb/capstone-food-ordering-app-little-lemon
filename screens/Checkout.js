import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../components/PageHeader";

const Checkout = () => {
   const navigator = useNavigation();
   return (
      <SafeAreaView style={styles.container}>
         <PageHeader navigator={navigator} heading={"Checkout"}></PageHeader>
         <View style={styles.detailsContainer}>
            <Text style={styles.subHeading}>Order Details</Text>
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
   subHeading: { fontWeight: "bold", fontSize: 20 },
   detailsContainer: {},
});
export default Checkout;
