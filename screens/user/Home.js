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
import { colors, layout, typography } from "../../styles/theme";
import {
   getGlobalSettings,
   getMenuByFilterAndSearch,
} from "../../utils/supabase";

const Home = ({ menuCategories, database }) => {
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
      navigation.navigate("Profile");
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
               <Image
                  source={require("../../assets/profile-icon.png")}
                  resizeMode="contain"
                  style={styles.headerProfileIcon}
               />
            </TouchableOpacity>
         </View>

         <View style={styles.searchBarSection}>
            <View style={styles.searchBar}>
               <Image
                  source={require("../../assets/search-icon.png")}
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
               <Image
                  source={require("../../assets/shopping-bag-icon.png")}
                  resizeMode="contain"
                  style={styles.cartIcon}
               />
               <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{numOfCartItems}</Text>
               </View>
            </TouchableOpacity>
         </View>

         <View>
            <View style={{ backgroundColor: colors.primary }}>
               <TouchableOpacity
                  style={[
                     styles.cartButton,
                     { width: "90%", alignSelf: "center", marginBottom: 10 },
                  ]}
                  onPress={() => navigation.navigate("Orders")}
               >
                  <Text style={[styles.itemTitle, { marginHorizontal: 10 }]}>
                     View orders
                  </Text>
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

                  <Image
                     style={styles.itemImage}
                     source={{
                        uri: item.image_url,
                     }}
                  />
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
      padding: 20,
   },
   headerLogo: {
      width: 200,
      height: 40,
   },
   headerProfileIcon: {
      width: 40,
      height: 40,
   },

   searchBarSection: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
   },
   searchBar: {
      flexDirection: "row",
      backgroundColor: colors.white,
      width: "80%",
      height: 40,
      borderRadius: 15,
      alignSelf: "center",
      alignItems: "center",
      marginVertical: 15,
   },
   searchIcon: {
      height: 30,
      width: 30,
      borderRadius: 15,
      marginLeft: 5,
   },
   searchInput: {
      height: 40,
      width: "60%",
   },

   cartButton: {
      backgroundColor: colors.secondary,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      height: 40,
      flexDirection: "row",

      paddingHorizontal: 6,
   },
   cartIcon: {
      width: 30,
      height: 30,
   },
   cartBadge: {
      backgroundColor: colors.red,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
   },
   cartBadgeText: {
      ...typography.caption,
      color: colors.white,
   },

   filtersSection: {
      marginLeft: 20,
      marginTop: 5,
   },

   itemRow: {
      flexDirection: "row",
      padding: 15,
      justifyContent: "space-between",
   },
   itemTextColumn: {
      width: "60%",
   },
   itemTitle: {
      ...typography.h2,
   },
   itemDescription: {
      ...typography.body,
      color: colors.black,
      marginTop: 5,
      marginBottom: 5,
   },
   itemPrice: {
      ...typography.bodyBold,
   },
   itemImage: {
      resizeMode: "fill",
      width: 100,
      height: 100,
      backgroundColor: colors.lightgrey,
      borderRadius: 10,
   },
});

export default Home;
