import AsyncStorage from "@react-native-async-storage/async-storage";
import * as database from "./database";
import { getMenuCategories } from "./supabase";

export async function bootstrap() {
   await database.createTable();
   const menuCategories = await getMenuCategories();
   const isOnboarded = await AsyncStorage.getItem("isOnboarded");
   return [menuCategories, isOnboarded];
}
