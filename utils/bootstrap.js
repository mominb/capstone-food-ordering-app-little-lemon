import AsyncStorage from "@react-native-async-storage/async-storage";
import * as database from "./database";
import { getMenuItems } from "./supabase";

export async function bootstrap() {
   await database.createTable();
   // const isTablePopulated = await database.isMenuPopulated();
   // if (!isTablePopulated) {
   try {
      const data = await getMenuItems();
      await database.saveMenuItems(data);
   } catch (err) {
      console.error("load error:", err);
   }
   // }
   const menuCategories = await database.getCategoriesfromDB();
   const isOnboarded = await AsyncStorage.getItem("isOnboarded");
   return [menuCategories, isOnboarded];
}
