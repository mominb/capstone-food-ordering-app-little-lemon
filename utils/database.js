import * as SQLite from "expo-sqlite";

let db;

async function initDB() {
   if (!db) {
      db = await SQLite.openDatabaseAsync("little_lemon-v5");
   }
   return db;
}

export async function createTable() {
   const database = await initDB();

   await database.execAsync(`
      CREATE TABLE IF NOT EXISTS cartitems (
        item_id TEXT PRIMARY KEY,
        name TEXT,
        price REAL,
        description TEXT,
        image_url TEXT,
        category TEXT,
        amount INTEGER NOT NULL
      );
    `);
   return;
}

export async function getMenuItemsInCart() {
   const database = await initDB();
   const cartItems = await database.getAllAsync(`
    SELECT
      item_id,
      amount,
      name,
      price,
      description,
      image_url,
      category
    FROM cartitems
  `);
   return cartItems;
}

export async function saveItemToCart(item, amount) {
   const database = await initDB();

   try {
      await database.execAsync("BEGIN TRANSACTION;");
      const sql = `
  INSERT INTO cartitems (item_id, name, price, description, image_url, category, amount)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT (item_id) DO UPDATE SET
  amount = amount + excluded.amount,
  name = excluded.name,
  price = excluded.price,
  description = excluded.description,
  image_url = excluded.image_url,
  category = excluded.category
  `;
      await database.runAsync(
         sql,
         item.id,
         item.name,
         item.price,
         item.description,
         item.image_url,
         item.category,
         amount,
      );
      await database.execAsync("COMMIT;");
      return { type: "success", message: "Item added to cart" };
   } catch (e) {
      console.log("Add to cart failed: ", e);
      await database.execAsync("ROLLBACK;");
      return { type: "error", message: "Failed to add item" };
   }
}

export async function deleteCartItem(item_id) {
   const database = await initDB();
   try {
      await database.execAsync("BEGIN TRANSACTION;");
      const sql = `
      DELETE FROM cartitems
      WHERE item_id = ?;
      `;
      await database.runAsync(sql, item_id);
      await database.execAsync("COMMIT;");
      return { type: "success", message: "Item deleted from cart" };
   } catch (e) {
      console.log("Deletion from cart failed: ", e);
      await database.execAsync("ROLLBACK;");
      return { type: "error", message: "Failed to delete item" };
   }
}

export async function cartItemCount() {
   const database = await initDB();
   const cartItems = await database.getAllAsync("SELECT * FROM cartitems");
   return cartItems.length;
}

export async function changeItemQtyInCart(item_id, operation) {
   const database = await initDB();
   let sql;
   if (operation === "increase") {
      sql = `UPDATE cartitems
      SET amount = amount + 1
      WHERE item_id = ?`;
   }
   if (operation === "decrease") {
      sql = `UPDATE cartitems
      SET amount = amount - 1
      WHERE item_id = ? AND amount > 1 `;
   }

   try {
      await database.execAsync("BEGIN TRANSACTION;");
      await database.runAsync(sql, item_id);
      await database.execAsync("COMMIT;");
   } catch (error) {
      console.log("Error changing amount item from cart: ", error);
      await database.execAsync("ROLLBACK;");
   }
}

export async function getTotalCartCost() {
   const database = await initDB();
   try {
      const rows = await database.getAllAsync(`
         SELECT SUM(amount * price) AS total
         FROM cartitems
         `);
      return rows[0].total;
   } catch (error) {
      console.log("Error calculating total cose of cart: ", error);
   }
}

export async function deleteAllCartRows() {
   const database = await initDB();
   await database.execAsync("DELETE FROM cartitems;");
}
