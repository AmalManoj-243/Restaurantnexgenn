# Nexgenn Restaurant (Expo + React Native) — Odoo POS Mobile App

## Overview
**Nexgenn Restaurant** is a React Native (Expo) mobile application designed primarily for **Restaurant POS order-taking** and related business operations.  
The app supports:

- **Odoo login (JSON-RPC)** using `Server URL + Username + Password`
- **POS session management** (open/continue/close POS register sessions)
- **Dine-In & Takeaway order workflows**
- Product browsing by POS category and cart management
- Payment flow, invoice creation, and receipt preview/printing

In addition to Restaurant POS, the repository also includes modules commonly used in enterprise apps (Inventory, CRM, Attendance, Audit, Purchases, etc.), but the **restaurant POS path is the main flow implemented here**.

---

## Table of Contents
1. [Tech Stack](#tech-stack)  
2. [How the App Works (Main Flow)](#how-the-app-works-main-flow)  
3. [Installation & Run](#installation--run)  
4. [Configuration](#configuration)  
   - [Odoo Server Config](#odoo-server-config)  
   - [Backend API Base URL (Non-Odoo)](#backend-api-base-url-non-odoo)  
   - [Expo Environment Variables](#expo-environment-variables)  
5. [Project Folder Structure (Detailed)](#project-folder-structure-detailed)  
6. [Key Screens and Their Responsibilities](#key-screens-and-their-responsibilities)  
7. [API Layer (Odoo JSON-RPC)](#api-layer-odoo-json-rpc)  
8. [State Management (Zustand Stores)](#state-management-zustand-stores)  
9. [Navigation](#navigation)  
10. [Common Developer Notes](#common-developer-notes)  

---

## Tech Stack
- **React Native** (0.73.x)
- **Expo SDK** (~50)
- **React Navigation** (Stack + Bottom Tabs)
- **Axios** for API calls
- **Zustand** for state management
- **NativeWind** (Tailwind-style utility classes)
- **@gorhom/bottom-sheet** for bottom sheets (Home screen category listing)
- **expo-print / react-native-print** for printing/receipts (where configured)

---

## How the App Works (Main Flow)

### 1) App Entry
- `App.js` is the entry point.
- It sets up:
  - `NavigationContainer`
  - `StackNavigator`
  - `GestureHandlerRootView`
  - `BottomSheetModalProvider`
  - Toast Provider
  - `react-native-paper` Provider

### 2) Login (Odoo)
**Screen:** `src/screens/Auth/LoginScreenOdoo.js`

User enters:
- **Server URL (optional)**
- **Username**
- **Password**

Login logic:
- If the entered server URL looks like an Odoo URL, the app calls:
  - `POST {odooBaseUrl}/web/session/authenticate` (JSON-RPC)
- If not, it attempts a separate admin login (`/viewuser/login`) using the configured backend base URL.

On success:
- Saves user session data in `AsyncStorage`
- Navigates to: `AppNavigator` (bottom tabs)

### 3) Home Screen (Take Orders)
**Screen:** `src/screens/Home/HomeScreen.js`

Key action:
- **Take Orders** button navigates to `POSRegister`

### 4) POS Register (Sessions)
**Screen:** `src/screens/Home/Sections/Customer/POSRegister.js`

It loads:
- POS Registers
- Open POS Sessions

Important:
- It filters registers/sessions for those containing `"restaurant"` in their name (case-insensitive).

Actions:
- **Open Register** → creates a new POS session in Odoo
- **Continue** → continues an already-open session
- **Close** → closes an open session

### 5) Choose Order Type
**Screen:** `src/screens/Home/Sections/Customer/ChooseOrderType.js`

Options:
- **DINE IN** → goes to `TablesScreen`
- **NEW TAKEOUT ORDER** → creates a fresh draft POS order, then goes to product selection
- **TAKEOUT ORDERS** → shows existing takeaway orders

### 6) POS Products → Cart → Payment → Receipt
Restaurant POS workflow screens are located here:

`src/screens/Home/Sections/Customer/`
- `POSProducts.js` (select products)
- `POSCartSummary.js` (cart view and confirmation)
- `POSPayment.js` (payment handling)
- `POSReceiptScreen.js` (receipt preview)
- `CreateInvoice.js`, `CreateInvoicePreview.js`, `KitchenBillPreview.js` (invoice / kitchen print flows)
- `TakeoutDelivery.js` (takeout delivery details)
- `TakeawayOrdersScreen.js` (listing existing takeout orders)

---

## Installation & Run

### Prerequisites
- Node.js (recommended 16+)
- Yarn (recommended)
- Expo CLI

### Install Dependencies
```bash
yarn install
Start the App
bash
Copy code
yarn start
Or directly:

bash
Copy code
yarn android
yarn ios
yarn web
Configuration
Odoo Server Config
File: src/api/config/odooConfig.js

This file controls the default Odoo instance used by the app:

ODOO_BASE_URL

DEFAULT_ODOO_DB

optional dev credentials

Example:

js
Copy code
const ODOO_BASE_URL = "http://192.168.100.175:8079/";
const DEFAULT_ODOO_DB = "nexgenn-restaurant";
Important:

The login screen allows user to override server URL at runtime.

The DB is taken from config (DB input was removed from UI in current code).

Backend API Base URL (Non-Odoo)
File: src/api/config/apiConfig.js

This is used when the app is doing admin login or other non-Odoo calls.

Example currently enabled:

js
Copy code
const API_BASE_URL = 'https://danatuae.369ai.biz:3049'
Expo Environment Variables
File: .env

Contains multiple app identity options (UAE/Oman/Test/Alpha).
Used by scripts like generateAppJson.js to build different variants.

Example keys:

EXPO_PUBLIC_APP_NAME_*

EXPO_PUBLIC_PACKAGE_NAME_*

EXPO_PUBLIC_PROJECT_ID_*

Project Folder Structure (Detailed)
This is the real structure from your uploaded project:

text
Copy code
Restaurantnexgenn-main/
├─ App.js
├─ app.json
├─ babel.config.js
├─ eas.json
├─ generateAppJson.js
├─ jsconfig.json
├─ package.json
├─ tailwind.config.js
├─ yarn.lock
├─ .env
├─ assets/
│  ├─ animations/
│  ├─ fonts/
│  ├─ icons/
│  ├─ images/
│  ├─ splash.png
│  ├─ icon.png
│  └─ favicon.png
├─ scripts/
├─ packagescommented/
└─ src/
   ├─ api/
   │  ├─ config/
   │  │  ├─ apiConfig.js
   │  │  ├─ inventoryConfig.js
   │  │  ├─ odooConfig.js
   │  │  └─ index.js
   │  ├─ customer/
   │  │  └─ cartApi.js
   │  ├─ details/
   │  │  ├─ detailApi.js
   │  │  └─ index.js
   │  ├─ dropdowns/
   │  │  └─ dropdownApi.js
   │  ├─ endpoints/
   │  │  ├─ endpoints.js
   │  │  └─ index.js
   │  ├─ services/
   │  │  ├─ generalApi.js
   │  │  ├─ kotService.js
   │  │  ├─ odooAuth.js
   │  │  └─ utils.js
   │  ├─ uploads/
   │  │  ├─ uploadApi.js
   │  │  └─ index.js
   │  └─ utils/
   │     └─ handleApiError.js
   │
   ├─ components/
   │  ├─ Scanner.js
   │  ├─ SignaturePad.js
   │  └─ Text.js
   │
   ├─ constants/
   │  ├─ dropdownConst.js
   │  ├─ links.js
   │  └─ theme.js
   │
   ├─ hooks/
   │  ├─ index.js
   │  ├─ useDataFetching.js
   │  ├─ useDebouncedSearch.js
   │  ├─ useDropdownFetching.js
   │  └─ useLoader.js
   │
   ├─ navigation/
   │  ├─ AppNavigator.js
   │  └─ StackNavigator.js
   │
   ├─ print/
   │  └─ printReceipt.js
   │
   ├─ screens/
   │  ├─ index.js
   │  ├─ Auth/
   │  │  └─ LoginScreenOdoo.js
   │  ├─ Home/
   │  │  ├─ HomeScreen.js
   │  │  ├─ Options/
   │  │  │  ├─ Attendance/
   │  │  │  ├─ Audit/
   │  │  │  ├─ Inventory/
   │  │  │  ├─ Purchases/
   │  │  │  ├─ VehicleTracking/
   │  │  │  └─ ... (other business modules)
   │  │  └─ Sections/
   │  │     ├─ Customer/
   │  │     │  ├─ SalesOrderChoice.js
   │  │     │  ├─ POSRegister.js
   │  │     │  ├─ ChooseOrderType.js
   │  │     │  ├─ POSProducts.js
   │  │     │  ├─ POSCartSummary.js
   │  │     │  ├─ POSPayment.js
   │  │     │  ├─ POSReceiptScreen.js
   │  │     │  ├─ TakeawayOrdersScreen.js
   │  │     │  ├─ TakeoutDelivery.js
   │  │     │  ├─ CreateInvoice.js
   │  │     │  ├─ CreateInvoicePreview.js
   │  │     │  └─ KitchenBillPreview.js
   │  │     └─ Services/
   │  ├─ Tables/
   │  │  └─ TablesScreen.js
   │  ├─ Products/
   │  ├─ Profile/
   │  ├─ Cart/
   │  ├─ MyOrders/
   │  ├─ Dashboard/
   │  └─ Splash/
   │
   ├─ stores/
   │  ├─ auth/
   │  │  ├─ index.js
   │  │  └─ useAuthStore.js
   │  ├─ product/
   │  │  ├─ index.js
   │  │  └─ productStore.js
   │  ├─ kitchen/
   │  │  └─ ticketsStore.js
   │  ├─ box/
   │  └─ currency/
   │
   └─ utils/
      └─ (formatters, validation, helpers, etc. depending on depth)
Key Screens and Their Responsibilities
Auth
LoginScreenOdoo.js

Handles Odoo JSON-RPC authentication

Stores session/user data in AsyncStorage

Routes to AppNavigator

Home (Restaurant Entry)
HomeScreen.js

Shows categories (bottom sheet)

Has “Take Orders” button → POSRegister

Restaurant POS
SalesOrderChoice.js

Choose “POS” vs “Place Order”

POSRegister.js

List open sessions + available registers

Open/Continue/Close sessions

ChooseOrderType.js

Dine In / New Takeout / Takeout Orders

POSProducts.js

Product selection for order

POSCartSummary.js

Cart confirmation and totals

POSPayment.js

Payment processing / validation

POSReceiptScreen.js

Final receipt screen

API Layer (Odoo JSON-RPC)
Where Odoo Calls Happen
File: src/api/services/generalApi.js

This file contains many Odoo JSON-RPC functions such as:

Fetch POS categories

Fetch product templates by pos_categ_id

Create POS sessions

Create draft POS order

Validate POS order

Create invoice and post payment flows

Odoo endpoints used commonly:

/web/session/authenticate

/web/dataset/call_kw

Authentication Helper
File: src/api/services/odooAuth.js

Contains helper method odooLogin() which authenticates against:

${DEFAULT_ODOO_BASE_URL}/web/session/authenticate

State Management (Zustand Stores)
Auth Store
File: src/stores/auth/useAuthStore.js

Tracks isLoggedIn

Stores user

Provides login() and logout()

Product / Cart Store
File: src/stores/product/productStore.js

Manages cart items per customer

Supports add/remove/clear

Maintains currentCustomerId

Kitchen Ticket Store
File: src/stores/kitchen/ticketsStore.js

Keeps print snapshots

Computes delta for kitchen printing (print only newly added items)

Navigation
Stack Navigation
File: src/navigation/StackNavigator.js

Important Restaurant POS routes:

Login

POSRegister

ChooseOrderType

TablesScreen

POSProducts

POSCartSummary

POSPayment

POSReceiptScreen

plus invoice/preview/kitchen/takeaway routes

Bottom Tabs
File: src/navigation/AppNavigator.js

Home

Profile

Common Developer Notes
Path Aliases
Your imports like @screens/... and @components/... are enabled via:

File: jsconfig.json

Example:

json
Copy code
"paths": {
  "@*": ["src/*"],
  "@assets/*":["assets/*"],
  "@components/*": ["src/components/*"],
  "@screens/*": ["src/screens/*"]
}
Cleartext Traffic / Local IP Odoo
Android usesCleartextTraffic: true is enabled in app.json, which helps during LAN development with http://192.168.x.x.

Printing
Receipt printing logic exists in:

src/print/printReceipt.js

Some POS screens may call print/preview features depending on device support.

Quick Troubleshooting
1) Login fails
Check:

Odoo URL correct (example: http://192.168.100.175:8079)

DB name exists in Odoo (DEFAULT_ODOO_DB in odooConfig.js)

Odoo is reachable from mobile network (same LAN or public tunnel like ngrok)

2) POS Register shows empty
Check:

POS configs in Odoo include “restaurant” in config name (your code filters on name)

Odoo POS module installed and configured properly

3) Products not loading
Check:

POS categories exist in Odoo (pos.category)

Products have pos_categ_id assigned in Odoo

Maintainers / Notes
This repository is an Expo-based app that combines restaurant POS and business modules.

Keep Odoo credentials out of git if you use real credentials.

For production builds, configure proper package name + EAS project ID via .env and generateAppJson.js.

yaml
