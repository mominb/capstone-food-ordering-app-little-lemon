import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
   FlatList,
   Image,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Filter from "../../components/Filter";
import ItemSeperator from "../../components/ItemSeperator";
import RestaurantClosedOverlay from "../../components/RestaurantClosedOverlay";
import {
   borderRadius,
   colors,
   layout,
   shadows,
   spacing,
   typography,
} from "../../styles/theme";
import {
   getGlobalSettings,
   getMenuByFilterAndSearch,
} from "../../utils/supabase";

const Home = ({ menuCategories, database, session }) => {
   const [searchTerm, setSearchTerm] = useState("");
   const [data, setData] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [activeCategories, setActiveCategories] = useState([]);
   const [numOfCartItems, setNumOfCartItems] = useState(0);
   const [currency, setCurrency] = useState();
   const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
   const navigation = useNavigation();

   const handleFilterSelection = (filter) => {
      setActiveCategories((prev) => {
         if (prev.includes(filter)) return prev.filter((c) => c !== filter);
         return [...prev, filter];
      });
   };

   const handleItemPress = (item) => {
      navigation.navigate("Item", { item });
   };

   const handleProfileIconClick = () => {
      if (!session) {
         Toast.show({
            type: "error",
            text1: "You must login to continue",
         });
         navigation.navigate("Onboarding");
      } else {
         navigation.navigate("Profile");
      }
   };

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code);
         const isOpen = globalSettings?.[0]?.restaurant_available;
         setIsRestaurantOpen(isOpen !== false);
      };
      fetchSettings();
   }, []);

   useEffect(() => {
      const loadData = async () => {
         setIsLoading(true);
         try {
            const filteredItems = await getMenuByFilterAndSearch(
               activeCategories,
               searchTerm,
            );
            setData(filteredItems);
         } catch (err) {
            console.log(err);
            Toast.show({ type: "error", text1: "Failed to load items" });
         } finally {
            setIsLoading(false);
         }
      };
      loadData();
   }, [activeCategories, searchTerm]);

   const formatCurrency = (value) =>
      currency ? `${value} ${currency}` : `${value}`;

   useFocusEffect(() => {
      async function fetchCartItemCount() {
         const cartItemCount = await database.cartItemCount();
         setNumOfCartItems(cartItemCount);
      }
      fetchCartItemCount();
   });

   return (
      <SafeAreaView style={[styles.container, layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.white }}
         />
         <View style={styles.header}>
            <Image
               source={require("../../assets/logo-long-text.png")}
               resizeMode="contain"
               style={styles.headerLogo}
            />
            <TouchableOpacity onPress={handleProfileIconClick}>
               <Ionicons
                  name="person-circle"
                  size={40}
                  color={colors.primary}
               />
            </TouchableOpacity>
         </View>

         <View style={styles.searchBarSection}>
            <View style={styles.searchBar}>
               <Ionicons
                  name="search"
                  size={20}
                  color={colors.primary}
                  style={styles.searchIcon}
               />
               <TextInput
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  style={styles.searchInput}
               />
            </View>
            <TouchableOpacity
               style={styles.cartButton}
               onPress={() => navigation.navigate("Cart")}
            >
               <Ionicons name="bag" size={24} color={colors.black} />
               <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{numOfCartItems}</Text>
               </View>
            </TouchableOpacity>
         </View>

         <View>
            <View
               style={{
                  backgroundColor: colors.primary,
                  paddingVertical: spacing.md,
               }}
            >
               <TouchableOpacity
                  style={styles.viewOrdersButton}
                  onPress={() => {
                     if (!session) {
                        Toast.show({
                           type: "error",
                           text1: "You must login to continue",
                        });
                        navigation.navigate("Onboarding");
                     } else {
                        navigation.navigate("Orders");
                     }
                  }}
               >
                  <Ionicons name="receipt" size={20} color={colors.black} />
                  <Text style={styles.viewOrdersButtonText}>View orders</Text>
               </TouchableOpacity>
            </View>
            <ItemSeperator />

            <ScrollView
               style={styles.filtersSection}
               horizontal
               showsHorizontalScrollIndicator={false}
            >
               <Filter
                  categories={menuCategories}
                  onClick={handleFilterSelection}
                  activeCat={activeCategories}
               />
            </ScrollView>
            <ItemSeperator />
         </View>

         <FlatList
            keyExtractor={(item) => item.id}
            data={data.filter((item) => !item.is_disabled)}
            ItemSeparatorComponent={ItemSeperator}
            renderItem={({ item }) => (
               <TouchableOpacity
                  onPress={() => handleItemPress(item)}
                  style={styles.itemRow}
               >
                  <View style={styles.itemTextColumn}>
                     <Text style={styles.itemTitle}>{item.name}</Text>
                     <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                     </Text>
                     <Text style={styles.itemPrice}>
                        {formatCurrency(item.price)}
                     </Text>
                  </View>

                  {item.image_url ? (
                     <Image
                        style={styles.itemImage}
                        source={{
                           uri: item.image_url,
                        }}
                     />
                  ) : (
                     <View style={styles.itemImagePlaceholder}>
                        <Text style={styles.itemImagePlaceholderText}>
                           No Image
                        </Text>
                     </View>
                  )}
               </TouchableOpacity>
            )}
         />
         <RestaurantClosedOverlay visible={!isRestaurantOpen} />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {},
   screen: {
      flex: 1,
   },

   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.white,
   },
   headerLogo: {
      width: 160,
      height: 32,
   },
   headerProfileIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
   },

   searchBarSection: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      gap: spacing.md,
   },
   searchBar: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: colors.white,
      height: 44,
      borderRadius: borderRadius.lg,
      alignItems: "center",
      paddingHorizontal: spacing.md,
      ...shadows.small,
   },
   searchIcon: {
      marginRight: spacing.sm,
   },
   searchInput: {
      height: 44,
      flex: 1,
      ...typography.body,
   },

   cartButton: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      height: 44,
      width: 44,
      flexDirection: "row",
      ...shadows.small,
      position: "relative",
   },
   cartBadge: {
      backgroundColor: colors.red,
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: -8,
      right: -8,
   },
   cartBadgeText: {
      ...typography.small,
      color: colors.white,
      fontWeight: "700",
   },

   viewOrdersButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
      alignSelf: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.lg,
      ...shadows.medium,
   },
   viewOrdersButtonText: {
      ...typography.button,
      color: colors.black,
      fontSize: 16,
   },

   filtersSection: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
   },

   itemRow: {
      flexDirection: "row",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      justifyContent: "space-between",
      alignItems: "center",
      ...shadows.small,
      marginHorizontal: spacing.md,
      marginVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.white,
   },
   itemTextColumn: {
      flex: 1,
      marginRight: spacing.md,
   },
   itemTitle: {
      ...typography.h3,
      marginBottom: spacing.xs,
   },
   itemDescription: {
      ...typography.caption,
      color: colors.lightgrey,
      marginBottom: spacing.sm,
   },
   itemPrice: {
      ...typography.bodyBold,
      color: colors.primary,
   },
   itemImage: {
      resizeMode: "cover",
      width: 100,
      height: 100,
      backgroundColor: colors.lightgrey,
      borderRadius: borderRadius.lg,
   },
   itemImagePlaceholder: {
      width: 100,
      height: 100,
      backgroundColor: colors.tertiary,
      borderRadius: borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.borderLight,
   },
   itemImagePlaceholderText: {
      ...typography.caption,
      color: colors.lightgrey,
      textAlign: "center",
   },
});

export default Home;
