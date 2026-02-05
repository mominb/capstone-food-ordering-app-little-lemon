import AsyncStorage from "@react-native-async-storage/async-storage";
import * as database from "./database";

export async function bootstrap() {
   await database.createTable();
   const menuCategories = await database.getCategoriesfromDB();
   const isOnboarded = await AsyncStorage.getItem("isOnboarded");
   return [menuCategories, isOnboarded];
}
