# Shaw Enterprise — Institutional E-Commerce & B2B Portal

Production-ready, highly scalable, and 100% dynamic B2B/B2C E-commerce platform engineered for **Shaw Enterprise** (Kolkata-based manufacturer & wholesaler of writing boards, display equipment, classroom desks, and office furniture).

---

## 🛠️ Unified Architecture

- **Frontend**: React 19 + Tailwind CSS (Vite Bundler) located in `resources/`
- **Backend**: Native PHP REST API with MySQL located in `backend/`
- **Database**: Local MySQL 8.0 (`shaw_enterprise`)
- **Image Storage**: Local server folder `backend/uploads/`

In the admin dashboard, editing a product supports multiple size/price variants
(including a custom-size price), a product image gallery, short and full
descriptions, and key/value specifications. Product images are stored in
`backend/uploads/`; gallery paths, variants, and specifications are saved with
the product in MySQL.

---

## 📂 Project Structure

```
shaw-enterprise/
├── backend/                       # Single Unified PHP Backend
│   ├── config/
│   │   ├── database.php           # Separate Backend Connection File (DB & Base URL)
│   │   └── db_connect.php         # PDO Singleton Database Connection
│   ├── controllers/               # PHP REST API Controllers
│   │   ├── ProductController.php
│   │   ├── CategoryController.php
│   │   ├── ClientController.php   # Institutional clients (4 category toggles)
│   │   ├── InquiryController.php  # RFQ quotes
│   │   ├── OrderController.php    # Retail orders
│   │   ├── SettingController.php  # Store & payment configs
│   │   ├── UploadController.php   # Local image uploads
│   │   ├── TestimonialController.php
│   │   └── BlogController.php
│   ├── database/                  # MySQL Migrations & Database Seeds
│   ├── models/                    # Data Models
│   ├── scripts/
│   │   └── migrateAndSeed.js      # Automatic MySQL Schema & Seeder
│   ├── uploads/                   # Local folder where all uploaded images are stored
│   ├── .htaccess                  # Apache / cPanel URL rewriting
│   ├── .env                       # Backend database environment config
│   └── index.php                  # Central API Router & Static Image Server
│
├── resources/                     # Single Unified Frontend Application
│   ├── js/
│   │   ├── config/
│   │   │   └── api.config.js      # Separate Frontend Connection File (Change endpoint here!)
│   │   ├── services/
│   │   │   └── api.js             # Central REST API Service
│   │   ├── Pages/                 # Storefront & Admin Dashboard Pages
│   │   ├── Components/            # UI Components & ImageUploadInput
│   │   ├── app.jsx                # React Root SPA
│   │   └── store.js               # Reactive Store synced with MySQL Backend
│   └── css/
│       └── app.css                # Tailwind CSS
│
├── .env                           # Frontend environment variables (VITE_API_BASE_URL)
├── index.html                     # HTML Template
├── vite.config.js                 # Vite Bundler & Dev Server Config
└── package.json                   # Scripts & dependencies
```

---

## 🔌 Separate Connection Files (Changing Endpoints in Production)

### 1. Frontend API Endpoint
File: [`resources/js/config/api.config.js`](file:///c:/Users/CHINMOY/Desktop/work/shaw-enterprise/resources/js/config/api.config.js)
```javascript
export const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const UPLOADS_BASE_URL =
  import.meta.env?.VITE_UPLOADS_URL || 'http://localhost:8000/uploads';
```
*Change `API_BASE_URL` to your production URL (e.g. `https://api.shawenterprise.in/api`) or set `VITE_API_BASE_URL` in `.env` before building.*

### 2. Backend MySQL Database Connection
File: [`backend/config/database.php`](file:///c:/Users/CHINMOY/Desktop/work/shaw-enterprise/backend/config/database.php)
```php
$databasePassword = getenv('DB_PASSWORD');
if ($databasePassword === false || $databasePassword === '') {
    throw new RuntimeException('DB_PASSWORD must be set in backend/.env or the environment.');
}

return [
    'db' => [
        'host'     => getenv('DB_HOST') ?: '127.0.0.1',
        'port'     => getenv('DB_PORT') ?: '3306',
        'dbname'   => getenv('DB_NAME') ?: 'shaw_enterprise',
        'user'     => getenv('DB_USER') ?: 'root',
        'password' => $databasePassword,
        'charset'  => 'utf8mb4',
    ],
    'app' => [
        'base_url'    => getenv('APP_URL') ?: 'http://localhost:8000',
        'uploads_dir' => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads',
        'cors_origin' => '*',
    ],
];
```

---

## 🚀 How to Run

Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in an
untracked `backend/.env` file before starting the backend. `DB_PASSWORD` is
required; do not commit the environment file. Frontend API URLs can be
overridden with `VITE_API_BASE_URL` and `VITE_UPLOADS_URL` in the root `.env`.

### 1. Start Frontend Dev Server
```bash
npm run dev
```
Storefront runs at `http://localhost:5173/`

### 2. Start PHP Backend Server
```bash
npm run php:serve
# Or directly:
php -S localhost:8000 -t backend
```
API runs at `http://localhost:8000/api`

### 3. Re-seed MySQL Database
```bash
npm run db:seed
```
Populates all categories, products, clients, settings, testimonials, and blogs.
