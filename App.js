import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { getCategories } from "./utils/menu";
import { getMenuItemsInCart } from "./utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Item from "./screens/Item";
import Cart from "./screens/Cart";

const Stack = createNativeStackNavigator();

export default function App() {
   const [menuCategories, setMenuCategories] = useState([]);
   const [isOnboarded, setIsOnboarded] = useState();
   const [cartItems, setCartItems] = useState([]);

   useEffect(() => {
      const load = async () => {
         try {
            const onboardingData = await AsyncStorage.getItem("isOnboarded");
            setIsOnboarded(onboardingData);
            const cats = await getCategories();
            setMenuCategories(cats);
            const cartItems = await getMenuItemsInCart();
            setCartItems(cartItems);
            console.log(cartItems);
         } catch (err) {
            console.error("load error:", err);
         }
      };

      load();
   }, []);

   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isOnboarded ? (
               <>
                  <Stack.Screen name="Home">
                     {(props) => (
                        <Home {...props} menuCategories={menuCategories} />
                     )}
                  </Stack.Screen>
                  <Stack.Screen name="Profile">
                     {(props) => (
                        <Profile {...props} setIsOnboarded={setIsOnboarded} />
                     )}
                  </Stack.Screen>
                  <Stack.Screen name="Item" component={Item} />
                  <Stack.Screen name="Cart">
                     {(props) => <Cart {...props} cartItems={cartItems} />}
                  </Stack.Screen>
               </>
            ) : (
               <Stack.Screen name="Onboarding">
                  {(props) => (
                     <Onboarding {...props} setIsOnboarded={setIsOnboarded} />
                  )}
               </Stack.Screen>
            )}
         </Stack.Navigator>
      </NavigationContainer>
   );
}
