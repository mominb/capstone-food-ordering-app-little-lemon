import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import Home from "./screens/Home";
import Item from "./screens/Item";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";
import { bootstrap } from "./utils/bootstrap";
import * as database from "./utils/database";
import { getUserData, supabase } from "./utils/supabase";

const Stack = createNativeStackNavigator();

export default function App() {
   const [loading, SetLoading] = useState(true);
   const [session, setSession] = useState(null);
   const [menuCategories, setMenuCategories] = useState([]);
   const [userMetaDataExists, setUserMetaDataExists] = useState(false);

   useEffect(() => {
      const getUserInformation = async () => {
         const data = await getUserData();
         setUserMetaDataExists(
            data.user.user_metadata.displayName &&
               data.user.user_metadata.phone,
         );
      };
      const load = async () => {
         const data = await bootstrap();
         setMenuCategories(data[0]);
      };

      load();
      getUserInformation();

      supabase.auth.getSession().then(({ data }) => {
         setSession(data.session);
      });

      const { data: listener } = supabase.auth.onAuthStateChange(
         (_event, session) => {
            setSession(session);
         },
      );
      SetLoading(false);
      return () => {
         listener.subscription.unsubscribe();
      };
   }, []);

   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{ headerShown: false }}>
            {session ? (
               <>
                  <Stack.Screen name="Home">
                     {(props) => (
                        <Home
                           {...props}
                           menuCategories={menuCategories}
                           database={database}
                        />
                     )}
                  </Stack.Screen>

                  <Stack.Screen name="Profile">
                     {(props) => <Profile {...props} />}
                  </Stack.Screen>

                  <Stack.Screen name="Item" component={Item} />

                  <Stack.Screen name="Cart">
                     {(props) => (
                        <Cart
                           {...props}
                           getCartItems={database.getMenuItemsInCart}
                           deleteCartItem={database.deleteCartItem}
                           changeItemQtyInCart={database.changeItemQtyInCart}
                           getTotalCartCost={database.getTotalCartCost}
                           userMetaDataExists={userMetaDataExists}
                        />
                     )}
                  </Stack.Screen>
                  <Stack.Screen name="Checkout" component={Checkout} />
               </>
            ) : (
               <Stack.Screen name="Onboarding">
                  {(props) => <Onboarding {...props} />}
               </Stack.Screen>
            )}
         </Stack.Navigator>
         <Toast />
         <Spinner
            visible={loading}
            textContent="Loading..."
            textStyle={{ color: "#fff" }}
         />
      </NavigationContainer>
   );
}
