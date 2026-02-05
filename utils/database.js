import * as SQLite from "expo-sqlite";

let db;

async function initDB() {
   if (!db) {
      db = await SQLite.openDatabaseAsync("little_lemon-v3");
   }
   return db;
}

export async function createTable() {
   const database = await initDB();
   await database.execAsync(`
    CREATE TABLE IF NOT EXISTS menuitems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price TEXT,
      description TEXT,
      image TEXT,
      category TEXT,
      UNIQUE(name, category)
    );

    CREATE TABLE IF NOT EXISTS cartitems (
      item_id INTEGER PRIMARY KEY,
      amount INTEGER NOT NULL,
      FOREIGN KEY (item_id) REFERENCES menuitems(id)
    );
  `);
}

export async function getMenuItems() {
   const database = await initDB();
   const rows = await database.getAllAsync("SELECT * FROM menuitems");
   return rows;
}

export async function clearMenuItems() {
   const database = await initDB();
   await database.execAsync("DELETE FROM menuitems;");
}

export async function getMenuItemsInCart() {
   const database = await initDB();
   const cartItems = await database.getAllAsync(`
    SELECT
      cartitems.item_id,
      cartitems.amount,
      menuitems.name,
      menuitems.price,
      menuitems.description,
      menuitems.image,
      menuitems.category
    FROM cartitems
      JOIN menuitems ON cartitems.item_id = menuitems.id
  `);
   return cartItems;
}

export async function getCategoriesfromDB() {
   const database = await initDB();
   const menu = await database.getAllAsync("SELECT * FROM menuitems");
   const categories = [];
   menu.forEach((item) => {
      if (!categories.includes(item.category)) {
         categories.push(item.category);
      }
   });
   return categories;
}

export async function saveItemToCart(item_id, amount) {
   const database = await initDB();

   try {
      await database.execAsync("BEGIN TRANSACTION;");
      const sql = `
  INSERT INTO cartitems (item_id, amount)
  VALUES (?, ?)
  ON CONFLICT (item_id) DO UPDATE SET
  amount = amount + excluded.amount
  `;
      await database.runAsync(sql, item_id, amount);
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
         SELECT SUM( cartitems.amount * menuitems.price ) AS total
         FROM cartitems
         JOIN menuitems ON cartitems.item_id = menuitems.id
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
