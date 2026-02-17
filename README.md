# Little Lemon 🍋

A full-featured mobile restaurant ordering app built with React Native and Expo. Little Lemon provides a complete dual-interface solution with a customer-facing ordering system and an admin management dashboard, all backed by Supabase.

> **📌 Project Evolution:** This project was extended from an initial non-functional app for Meta React Native Course into a fully functional, production-ready full-stack application with complete backend integration, authentication, real-time data synchronization, and a comprehensive admin management system.

## ✨ Features

### Customer Features
- 🔐 **Email OTP Authentication** - Secure sign-in with Supabase Auth
- 🍽️ **Menu Browsing** - Search and filter menu items by category
- 🛒 **Smart Cart Management** - Add, remove, and update item quantities
- 📦 **Order Checkout** - Select delivery method and payment options
- 📋 **Order History** - Track current and past orders
- 👤 **Profile Management** - Update name, email, and phone number
- 🔄 **Real-time Updates** - Live order status synchronization

### Admin Features
- 📊 **Order Management Dashboard** - View and manage all customer orders
- ✏️ **Order Status Updates** - Update order status in real-time
- 🍴 **Menu Management** - Add, edit, and delete menu items
- 📷 **Image Upload** - Manage menu item images
- ⚙️ **Settings Panel** - Admin account management

### Technical Features
- 💾 **Offline Support** - Local SQLite cache for menu data
- 🚀 **Performance Optimized** - Efficient data loading and caching
- 📱 **Cross-platform** - Works on iOS, Android, and Web
- 🎨 **Modern UI** - Clean, responsive interface with custom components

## 🛠️ Tech Stack
- **Frontend**: React Native (Expo SDK 54)
- **Navigation**: React Navigation (Native Stack)
- **Backend**: Supabase (Auth + PostgreSQL)
- **Local Storage**: Expo SQLite + AsyncStorage
- **UI Components**: Custom components with react-native-loading-spinner-overlay
- **Notifications**: react-native-toast-message
- **Media**: expo-image-picker
- **Form Controls**: react-native-element-dropdown, react-native-phone-number-input

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher) + npm/yarn
- Expo CLI or `npx expo`
- A Supabase project with required tables (see Database Setup below)
- iOS Simulator (for macOS) or Android Emulator

### Installation

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the project root:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**
   
   Create the following tables in your Supabase project:

   **`menu` table:**
   ```sql
   - id (uuid, primary key)
   - name (text)
   - description (text)
   - price (numeric)
   - category (text)
   - image (text, URL)
   - created_at (timestamp)
   ```

   **`orders` table:**
   ```sql
   - id (uuid, primary key)
   - user_id (uuid, foreign key to auth.users)
   - items (jsonb, array of order items)
   - total (numeric)
   - status (text: 'pending', 'preparing', 'ready', 'delivered')
   - delivery_method (text)
   - payment_method (text)
   - created_at (timestamp)
   ```

   **`user_roles` table:**
   ```sql
   - id (uuid, primary key)
   - user_id (uuid, foreign key to auth.users)
   - role (text: 'customer' or 'admin')
   - created_at (timestamp)
   ```

4. **Start the Development Server**
   ```bash
   npm start
   ```

### Running on Devices

```bash
npm run android   # Launch on Android emulator/device
npm run ios       # Launch on iOS simulator/device
npm run web       # Launch in web browser
```

## 📝 Scripts
- `npm start` - Start Expo development server with QR code
- `npm run android` - Launch on Android emulator/device
- `npm run ios` - Launch on iOS simulator/device
- `npm run web` - Launch in web browser

## 📁 Project Structure

```
little-lemon/
├── App.js                    # Main navigation and authentication logic
├── index.js                  # App entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies and scripts
├── biome.json               # Biome linter configuration
│
├── screens/
│   ├── Onboarding.js        # Email OTP authentication screen
│   ├── user/                # Customer-facing screens
│   │   ├── Home.js          # Menu browsing with search/filters
│   │   ├── Item.js          # Item detail view
│   │   ├── Cart.js          # Shopping cart
│   │   ├── Checkout.js      # Order checkout
│   │   ├── Orders.js        # Order history
│   │   ├── OrderInfo.js     # Individual order details
│   │   └── Profile.js       # User profile management
│   │
│   └── admin/               # Admin dashboard screens
│       ├── AdminHome.js     # Admin dashboard home
│       ├── AllOrders.js     # View all customer orders
│       ├── ManageOrder.js   # Update order status
│       ├── ManageMenu.js    # Menu management list
│       ├── MenuItem.js      # Add/edit menu items
│       └── Settings.js      # Admin settings
│
├── components/              # Reusable UI components
│   ├── Button.js           # Custom button component
│   ├── Filter.js           # Category filter chips
│   ├── InfoBox.js          # Information display box
│   ├── ItemSeperator.js    # List item separator
│   ├── OrderCards.js       # Order card component
│   ├── OrderItemList.js    # Order items list
│   ├── OtpTimer.js         # Countdown timer for OTP
│   ├── PageHeader.js       # Screen header component
│   ├── RestaurantClosedOverlay.js  # Closed status overlay
│   └── Splash.js           # Loading splash screen
│
├── utils/                  # Utility functions
│   ├── supabase.js        # Supabase client and API methods
│   ├── database.js        # SQLite operations for menu/cart
│   └── bootstrap.js       # App initialization and data loading
│
├── styles/
│   └── theme.js           # Color palette and theme constants
│
└── assets/                # Images, fonts, and static files
```

## 🎨 Design System & Theming

The app uses a centralized theme system defined in [styles/theme.js](styles/theme.js):

### Color Palette
- **Primary** (`#495E57`) - Main brand color
- **Secondary** (`#F4CE14`) - Accent highlights
- **Tertiary** (`#EDEFEE`) - Light backgrounds
- **Status Colors** - Success, Warning, Error indicators

### Spacing Scale
Consistent spacing values (xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 20px, xxl: 24px)

### Typography System
- **Headings** (h1, h2, h3) - Bold, semantic sizing
- **Body Text** - Regular and bold variants
- **Button Typography** - Semibold with emphasis
- **Captions** - Medium weight for secondary info

### Shadows & Effects
- **Small** - Subtle elevation (2dp)
- **Medium** - Moderate depth (4dp)  
- **Large** - Strong emphasis (6dp)

### Border Radius
Standardized corner radius values (sm: 4px to full: 24px)

All components import from this single theme file to maintain visual consistency across the app.

## 🔐 Admin Access

Admin privileges are controlled through the `user_roles` table in Supabase. To grant admin access:

1. Sign in to your Supabase dashboard
2. Navigate to the `user_roles` table
3. Add a new row with:
   - `user_id`: The UUID from `auth.users`
   - `role`: `"admin"`

Users with `role = "admin"` will automatically be routed to the admin dashboard instead of the customer interface.

## 🎬 App Flow

### Customer Flow
1. **Sign In** → Email OTP authentication
2. **Browse Menu** → Search and filter by category
3. **Add to Cart** → Select items and quantities
4. **Checkout** → Choose delivery and payment method
5. **Track Orders** → View order status in real-time
6. **Manage Profile** → Update personal information

### Admin Flow
1. **Dashboard** → Overview of restaurant operations
2. **View Orders** → See all customer orders
3. **Update Status** → Change order status (pending → preparing → ready → delivered)
4. **Manage Menu** → Add, edit, or delete menu items
5. **Settings** → Admin account management

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot connect to Supabase"**
- Verify your `.env` file contains the correct Supabase URL and anon key
- Check that your Supabase project is active and accessible
- Ensure environment variables are prefixed with `EXPO_PUBLIC_`

**Issue: "No menu items showing"**
- Run the app once to initialize the local SQLite database
- Ensure your `menu` table in Supabase has data
- Check the database bootstrap process in `utils/bootstrap.js`

**Issue: "Authentication not working"**
- Verify Email Auth is enabled in your Supabase project settings
- Check that the email provider is properly configured
- Ensure OTP email templates are set up in Supabase

**Issue: "Admin dashboard not accessible"**
- Confirm the user has an entry in the `user_roles` table with `role = "admin"`
- Check that the `user_id` matches the authenticated user's UUID

## 📄 License

This project is part of the Meta React Native Specialization capstone project.

## 🤝 Contributing

This is a capstone project for educational purposes. Feel free to fork and modify for your own learning!

## 📷 Gallery



<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/ae5304ee-ce15-42dc-b939-e17a320a9a2a" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/fcb99177-9711-4b5b-bf1f-aad7e9441af7" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/5f698d31-4ee1-413d-aa6c-1e4e2f73f9f9" width="250"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/4bbe4af7-25cb-40eb-967e-b66fd5680db6" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/b676ab34-5bf1-4746-87a0-a54251b5cbd9" width="250"/></td>
    <td><img src="https://github.com/user-attachments/assets/b00a2e60-0bed-47f3-937d-0453d99cf9fe" width="250"/></td>
  </tr>
</table>
