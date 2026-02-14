import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import {
   borderRadius,
   colors,
   layout,
   shadows,
   spacing,
   typography,
} from "../../styles/theme";
import { saveItemToCart } from "../../utils/database";
import { getGlobalSettings } from "../../utils/supabase";

const Item = ({ route }) => {
   const navigation = useNavigation();
   const item = route.params.item;
   const [amount, setAmount] = useState(1);
   const [isLoading, setIsLoading] = useState(false);
   const [currency, setCurrency] = useState();

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code);
      };
      fetchSettings();
   }, []);

   const formatCurrency = (value) =>
      currency ? `${value} ${currency}` : `${value}`;

   const increaseAmount = () => {
      setAmount((prev) => prev + 1);
   };
   const decreaseAmount = () => {
      if (amount > 1) {
         setAmount((prev) => prev - 1);
      }
   };

   return (
      <SafeAreaView style={[styles.container, layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.white }}
         />
         <View style={styles.header}>
            <TouchableOpacity
               onPress={() => {
                  if (navigation.canGoBack()) {
                     navigation.goBack();
                  }
               }}
               style={styles.backButtonContainer}
            >
               <Ionicons name="chevron-back" size={28} color={colors.primary} />
            </TouchableOpacity>
            <Image
               source={require("../../assets/logo-long-text.png")}
               resizeMode="contain"
               style={styles.logoLemon}
            />
         </View>

         {item.image_url ? (
            <Image
               style={styles.heroImage}
               source={{
                  uri: item.image_url,
               }}
            />
         ) : (
            <View style={styles.heroImagePlaceholder}>
               <Text style={styles.heroImagePlaceholderText}>No Image</Text>
            </View>
         )}
         <View style={styles.infoBox}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
         </View>
         <View style={styles.seperator} />
         <View>
            <View style={styles.counterContainer}>
               <TouchableOpacity
                  style={styles.CounterButton}
                  onPress={decreaseAmount}
               >
                  <Ionicons name="remove" size={20} color={colors.white} />
               </TouchableOpacity>
               <Text style={[styles.counterText, { color: colors.black }]}>
                  {amount}
               </Text>
               <TouchableOpacity
                  style={styles.CounterButton}
                  onPress={increaseAmount}
               >
                  <Ionicons name="add" size={20} color={colors.white} />
               </TouchableOpacity>
            </View>
            <TouchableOpacity
               onPress={async () => {
                  setIsLoading(true);
                  try {
                     const response = await saveItemToCart(item, amount);
                     Toast.show({
                        type: response.type,
                        text1: response.message,
                     });
                     navigation.navigate("Home");
                  } catch (err) {
                     console.log(err);
                     Toast.show({ type: "error", text1: "Add to cart failed" });
                  } finally {
                     setIsLoading(false);
                  }
               }}
               style={styles.button}
            >
               <Ionicons name="cart" size={20} color={colors.primary} />
               <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {},
   header: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
      position: "relative",
   },

   backButtonContainer: {
      position: "absolute",
      left: spacing.lg,
      padding: spacing.sm,
   },
   logoLemon: {
      width: 160,
      height: 32,
   },
   infoBox: {
      width: "100%",
      padding: spacing.lg,
      backgroundColor: colors.white,
   },
   heroImage: {
      resizeMode: "cover",
      backgroundColor: colors.lightgrey,
      width: "100%",
      height: 320,
   },
   heroImagePlaceholder: {
      backgroundColor: colors.tertiary,
      width: "100%",
      height: 320,
      alignItems: "center",
      justifyContent: "center",
      borderBottomColor: colors.borderLight,
      borderBottomWidth: 1,
   },
   heroImagePlaceholderText: {
      ...typography.body,
      color: colors.lightgrey,
      fontSize: 16,
   },
   itemName: {
      ...typography.h2,
      marginBottom: spacing.md,
      color: colors.primary,
   },
   itemDescription: {
      ...typography.body,
      color: colors.lightgrey,
      marginBottom: spacing.lg,
      lineHeight: 24,
   },
   itemPrice: {
      ...typography.h1,
      color: colors.secondary,
      fontWeight: "700",
   },
   seperator: {
      width: "100%",
      height: 1,
      backgroundColor: colors.borderLight,
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.secondary,
      marginVertical: spacing.lg,
      ...shadows.medium,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
   },
   buttonText: {
      ...typography.button,
      color: colors.primary,
      textAlign: "center",
   },
   counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.lg,
      paddingVertical: spacing.xl,
      backgroundColor: colors.tertiary,
      marginHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      marginVertical: spacing.lg,
   },
   CounterButton: {
      backgroundColor: colors.primary,
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius.md,
      ...shadows.small,
   },
   counterText: {
      ...typography.h2,
      color: colors.white,
   },
});

export default Item;
