# Little Lemon

Mobile ordering app for the Little Lemon restaurant, built with React Native + Expo. The app supports a customer flow (browse menu, cart, checkout, orders, profile) and an admin flow (menu management and order status updates) backed by Supabase.

## Features
- Email OTP sign-in with Supabase Auth.
- Menu browsing with search + category filters.
- Item details, cart management, and quantity updates.
- Checkout with delivery method and payment method selection.
- Order history for customers.
- Profile management (name, email, phone) and logout.
- Admin dashboard to view all orders and update order status.
- Admin menu management (add, edit, delete items).
- Local SQLite cache for menu data and cart storage.

## Tech Stack
- React Native (Expo)
- React Navigation (native stack)
- Supabase (Auth + data tables)
- Expo SQLite + AsyncStorage
- react-native-toast-message, loading spinner overlay

## Getting Started

### Prerequisites
- Node.js + npm
- Expo CLI (or `npx expo`)
- A Supabase project with the required tables:
  - `menu`
  - `orders`
  - `user_roles`

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Start the app:
   ```bash
   npm start
   ```

### Run on devices
```bash
npm run android
npm run ios
npm run web
```

## Scripts
- `npm start` - Start Expo dev server
- `npm run android` - Launch on Android
- `npm run ios` - Launch on iOS
- `npm run web` - Launch on Web

## Project Structure
- `App.js` - Navigation and role-based routing
- `screens/`
  - `user/` - Customer flow (home, item, cart, checkout, orders, profile)
  - `admin/` - Admin flow (orders, menu management, settings)
- `components/` - UI components (headers, filters, separators, etc.)
- `utils/`
  - `supabase.js` - Supabase client and API helpers
  - `database.js` - SQLite menu + cart helpers
  - `bootstrap.js` - Initial data load and setup

## Admin Access
Admin routing is based on the `user_roles` table in Supabase. Users with `role = "admin"` are routed to the admin screens.

##Gallery
<img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/898c08fb-399f-4c2f-8238-6d2b6522c27a" />
<img width="1170" height="2532" alt="image" src="https://github.com/user-attachments/assets/10feac00-3bc4-4d83-aa16-94f1741bdc89" />
<img width="1170" height="2532" alt="Simulator Screenshot - iPhone 16e - 2026-02-04 at 17 47 29" src="https://github.com/user-attachments/assets/15455fa8-a869-443e-bdf5-e7f5d36341b4" />
<img width="1170" height="2532" alt="Simulator Screenshot - iPhone 16e - 2026-02-04 at 17 48 38" src="https://github.com/user-attachments/assets/e4337022-4ad0-41e1-9c9c-629b70b29a75" />



