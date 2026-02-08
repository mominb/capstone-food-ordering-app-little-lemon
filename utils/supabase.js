import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
   process.env.EXPO_PUBLIC_SUPABASE_URL,
   process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
   {
      auth: {
         storage: AsyncStorage,
         persistSession: true,
         autoRefreshToken: true,
         detectSessionInUrl: false,
      },
   },
);

export async function sendEmailOTP(email) {
   const { error } = await supabase.auth.signInWithOtp({ email });

   if (error) {
      console.log(error.message);
      return "error";
   }
   return "success";
}

export async function verifyEmailOTP(email, token) {
   const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
   });

   if (error) {
      console.log(error.message);
      return null;
   }

   return data.session;
}

export async function updateUserData(updates) {
   const { data, error } = await supabase.auth.updateUser({ data: updates });
   if (error) {
      console.log("error updating user data in supabase: ", error);
      return { error };
   }
   return { user: data.user, error: null };
}

export async function getUserData() {
   const { data, error } = await supabase.auth.getUser();

   if (error) {
      console.log("error retrieving user data from supabase: ", error);
      return { error };
   }

   return { data, error: null };
}

export async function placeOrder(
   cartItems,
   deliveryMethod,
   paymentMethod,
   total_price,
) {
   const user = await getUserData();
   const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.amount,
   }));
   const { error } = await supabase.from("orders").insert([
      {
         order_items: orderItems,
         payment_mode: paymentMethod,
         delivery_mode: deliveryMethod,
         total_price: total_price,
         user_data: user.data?.user?.user_metadata,
      },
   ]);
   if (error) {
      console.log("error placing order: ", error);
      return { error };
   }
   return { error: null };
}

export async function getUsersOrders() {
   const { data: userData, error: userErr } = await supabase.auth.getUser();
   if (userErr) {
      console.log("error getting user: ", userErr);
      return [];
   }
   const userId = userData?.user?.id;
   const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId);
   if (error) {
      console.log("error retrieving user orders: ", error);
      return [];
   }
   return data;
}

export async function getAllOrders() {
   const { data, error } = await supabase.from("orders").select("*");
   if (error) {
      console.log("error retrieving user orders: ", error);
      return [];
   }
   return data;
}

export async function getUserRole() {
   const { data: userData, error: userErr } = await supabase.auth.getUser();
   if (userErr) {
      console.log("error getting user: ", userErr);
      return [];
   }
   const userId = userData?.user?.id;
   const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId);
   if (error) {
      console.log("error retrieving user roles: ", error);
      return [];
   }

   return data;
}

export async function updateOrderStatus(status, id) {
   const { error } = await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", id);
   if (error) {
      console.log("error updating order status: ", error);
      return { error };
   }
   return { error: null };
}

export async function getMenuItems() {
   const { data, error } = await supabase.from("menu").select("*");
   if (error) {
      console.log("error fetching menu items: ", error);
      return [];
   }
   return data;
}

export async function updateMenuItem(id, name, description, price, category) {
   const { error } = await supabase
      .from("menu")
      .update({ name, description, price, category })
      .eq("id", id);
   if (error) {
      console.log("error updating menu item: ", error);
      return { error };
   } else {
      console.log("menu updated");
      return { error: null };
   }
}

export async function addMenuItem(name, description, price, category) {
   const { error } = await supabase
      .from("menu")
      .insert({ name, description, price, category });
   if (error) {
      console.log("error adding menu item: ", error);
      return { error };
   } else {
      console.log("menu updated");
      return { error: null };
   }
}

export async function deleteMenuItem(id) {
   const { error } = await supabase.from("menu").delete().eq("id", id);
   if (error) {
      console.log("error deleting menu item: ", error);
      return { error };
   } else {
      console.log("menu updated");
      return { error: null };
   }
}
export async function getGlobalSettings() {
   const { data, error } = await supabase
      .from("global_settings")
      .select("*")
      .eq("id", true);

   if (error) {
      console.log("error fetching global settings: ", error);
   } else {
      return data;
   }
}
export async function updateGlobalSettings(restaurant_available) {
   const { error } = await supabase
      .from("global_settings")
      .update({ restaurant_available })
      .eq("id", true);
   if (error) {
      console.log("error updating global settings: ", error);
   }
}

export async function getMenuByFilterAndSearch(categories, searchTerm) {
   let query = supabase.from("menu").select("*");

   if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
   }

   if (categories?.length) {
      query = query.in("category", categories);
   }

   const { data, error } = await query;
   if (error) {
      console.log("error filtering menu items: ", error);
      return [];
   }
   return data;
}

export async function getMenuCategories() {
   const { data, error } = await supabase.from("menu").select("category");
   if (error) {
      console.log("error fetching menu categories: ", error);
      return [];
   }
   const categories = [];
   data.forEach((item) => {
      if (item.category && !categories.includes(item.category)) {
         categories.push(item.category);
      }
   });
   return categories;
}
