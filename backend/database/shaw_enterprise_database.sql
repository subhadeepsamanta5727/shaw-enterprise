-- =========================================================================
-- SHAW ENTERPRISE - COMPLETE PRODUCTION MYSQL DATABASE DUMP
-- =========================================================================
-- Character set: utf8mb4
-- Compatible with MySQL 5.7 / 8.0 & MariaDB (InfinityFree, cPanel, phpMyAdmin)
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- -------------------------------------------------------------------------
-- Table structure for: categories
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Table structure for: products
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  sku VARCHAR(100),
  short_description TEXT,
  full_description LONGTEXT,
  main_image VARCHAR(500),
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  mrp DECIMAL(10, 2) DEFAULT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  stock INT DEFAULT 50,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category_id),
  INDEX idx_slug (slug),
  INDEX idx_active (is_active),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Table structure for: product_variants
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS product_variants;
CREATE TABLE product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  size_label VARCHAR(255),
  surface_type VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  mrp DECIMAL(10, 2),
  stock_quantity INT DEFAULT 50,
  is_default BOOLEAN DEFAULT FALSE,
  sku_extension VARCHAR(100),
  INDEX idx_product (product_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Table structure for: product_specifications
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS product_specifications;
CREATE TABLE product_specifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  spec_key VARCHAR(255) NOT NULL,
  spec_value TEXT NOT NULL,
  INDEX idx_product_specs (product_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Table structure for: product_images
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS product_images;
CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  INDEX idx_product_imgs (product_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Table structure for: clients
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS clients;
CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'others',
  category_label VARCHAR(100),
  location VARCHAR(255),
  project_details TEXT,
  established VARCHAR(50),
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_client_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Table structure for: bulk_inquiries
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS bulk_inquiries;
CREATE TABLE bulk_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  organization_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  product_title VARCHAR(255),
  variant_details VARCHAR(255),
  quantity INT DEFAULT 1,
  delivery_city VARCHAR(100),
  message TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Table structure for: orders
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  delivery_address TEXT NOT NULL,
  city VARCHAR(100) DEFAULT 'Kolkata',
  pincode VARCHAR(20),
  items JSON NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(100) DEFAULT 'COD',
  payment_status VARCHAR(50) DEFAULT 'Pending',
  order_status VARCHAR(50) DEFAULT 'Processing',
  transaction_id VARCHAR(150),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Table structure for: settings
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Table structure for: testimonials
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS testimonials;
CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_designation VARCHAR(255),
  organization_name VARCHAR(255),
  review_text TEXT NOT NULL,
  rating INT DEFAULT 5,
  is_featured BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Table structure for: blogs
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS blogs;
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  thumbnail_image VARCHAR(500),
  video_url VARCHAR(500),
  author_name VARCHAR(255),
  content LONGTEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_published BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Dumping data for: categories
-- -------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES (1, 'Writing Board', 'writing-board', 'High-gloss non-magnetic whiteboards, blackboards, green chalkboards, glass boards, and acrylic white writing boards.', 'categories/writing-boards.jpg', 1, 1);
INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES (2, 'Display Notice Board', 'display-notice-board', 'Pin-up felt bulletin boards, lockable covered display boards, key hanger boards, exhibition boards, cork boards, and grooved boards.', 'categories/display-notice-boards.jpg', 2, 1);
INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES (3, 'Magnetic Writing Board', 'magnetic-writing-board', 'Magnetic-receptive whiteboard, green chalkboard, and magnetic toughened glass writing boards for markers and magnets.', 'categories/magnetic-writing-boards.jpg', 3, 1);
INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES (4, 'Graph Writing Board', 'graph-writing-board', 'Precision permanent grid graph boards in white, black, and green for engineering, mathematics, science, and plotting.', 'categories/graph-writing-boards.jpg', 4, 1);
INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES (5, 'Metal Stand', 'metal-stand', 'Heavy MS powder-coated 3-leg, 4-leg, trolley, revolving, lobby grooved, flip chart, magazine/newspaper, and folding stands.', 'categories/metal-stands.jpg', 5, 1);
INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES (6, 'Acrylic Product', 'acrylic-product', 'Writing desk/table elevators, executive name plates, double-sided menu holders, business card holders, wall mount info pockets, literature racks, and display stands.', 'categories/acrylic-products.jpg', 6, 1);
INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES (7, 'Wooden Product', 'wooden-product', 'Handcrafted artist wooden easels, stretched canvas boards, wooden dusters, wooden geometry teaching boxes, and pen stands.', 'categories/wooden-products.jpg', 7, 1);
INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES (8, 'Box', 'box', 'Lockable MS sheet metal letter boxes, wall-mounted first aid emergency boxes, office suggestion boxes, and key hanger security boxes.', 'categories/boxes.jpg', 8, 1);
INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES (9, 'School & Office Furniture', 'school-office-furniture', 'Heavy institutional classroom dual desks, science lab tables, library book stacks, executive office desks, workstations, and reception counters.', 'categories/school-office-furniture.jpg', 9, 1);

-- -------------------------------------------------------------------------
-- Dumping data for: products, product_variants, product_specifications, product_images
-- -------------------------------------------------------------------------
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (1, 1, 'White Writing Board (High-Gloss Non-Magnetic)', 'white-writing-board', 'SE-WB-01', 'High-gloss melamine dry-erase white writing surface framed in 6063-T6 virgin aluminium with ABS safety corners.', '', 'products/main/whiteboard.jpg', 749, 990, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (1, 'products/main/whiteboard.jpg', 0);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (1, 'products/main/whiteboard-corner.jpg', 1);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (101, 1, 'Standard', '', 449, 600, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (102, 1, 'Standard', '', 749, 990, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (103, 1, 'Standard', '', 1450, 1950, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (104, 1, 'Standard', '', 1850, 2400, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (105, 1, 'Standard', '', 2890, 3800, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (106, 1, 'Standard', '', 4200, 5500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (1, 'Surface', 'High-Gloss Non-Magnetic White Melamine');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (1, 'Frame', 'Virgin Extruded Aluminium Alloy 6063-T6');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (1, 'Core', '9mm High-Density Water-Resistant MDF');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (1, 'Corners', 'Virgin ABS Moulded Plastic Corners');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (1, 'Accessories Included', 'Marker Tray + Wall Clamps');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (2, 1, 'Black Chalk Writing Board (Traditional Wooden & Aluminium Frame)', 'black-chalk-writing-board', 'SE-BCB-02', 'Traditional deep-black non-reflective chalk writing board for smooth dustless chalk adhesion and high contrast.', '', 'products/main/blackboard.jpg', 699, 950, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (2, 'products/main/blackboard.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (201, 2, 'Standard', '', 420, 580, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (202, 2, 'Standard', '', 699, 950, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (203, 2, 'Standard', '', 1390, 1850, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (204, 2, 'Standard', '', 2750, 3600, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (2, 'Surface', 'Matte High-Contrast Blackboard');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (2, 'Frame', 'Aluminium Alloy / Solid Wood Border');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (2, 'Chalk Compatibility', 'Dustless, Calcium & Coloured Chalks');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (2, 'Warranty', '3 Years Shaw Enterprise Guarantee');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (3, 1, 'Green Chalk Writing Board (Matte Eye-Comfort Surface)', 'green-chalk-writing-board', 'SE-GCB-03', 'School-recommended forest green chalk writing board with soothing matte finish that reduces eye strain.', '', 'products/main/green-chalkboard.jpg', 749, 990, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (3, 'products/main/green-chalkboard.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (301, 3, 'Standard', '', 449, 600, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (302, 3, 'Standard', '', 749, 990, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (303, 3, 'Standard', '', 1450, 1950, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (304, 3, 'Standard', '', 2890, 3800, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (305, 3, 'Standard', '', 4200, 5500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (3, 'Surface', 'Forest Green Matte Chalk Finish');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (3, 'Frame', 'Virgin Extruded Aluminium');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (3, 'Anti-Glare', '100\% Glare-Free from all viewing angles');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (4, 1, 'Glass White Writing Board (Toughened Float Glass)', 'glass-white-writing-board', 'SE-GWB-04', 'Ultra-modern 4mm/6mm tempered toughened glass whiteboard with stainless steel standoff mounts. 100\% scratch and stain proof.', '', 'products/main/glass-whiteboard.jpg', 2490, 3200, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (4, 'products/main/glass-whiteboard.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (401, 4, 'Standard', '', 2490, 3200, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (402, 4, 'Standard', '', 4890, 6200, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (403, 4, 'Standard', '', 8990, 11500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (4, 'Glass Type', 'Tempered Toughened Safety Float Glass');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (4, 'Thickness', '4mm to 6mm');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (4, 'Mounting', 'Solid Stainless Steel Standoff Studs');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (4, 'Stain Resistance', 'Permanent 100\% Ghost-Free');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (5, 1, 'Acrylic White Writing Board (Lightweight & Unbreakable)', 'acrylic-white-writing-board', 'SE-AWB-05', 'Shatter-proof cast acrylic white writing board with crystal gloss finish and ultra-lightweight mounting.', '', 'products/main/acrylic-whiteboard.jpg', 990, 1400, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (5, 'products/main/acrylic-whiteboard.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (501, 5, 'Standard', '', 650, 900, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (502, 5, 'Standard', '', 990, 1400, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (503, 5, 'Standard', '', 2190, 2900, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (5, 'Material', 'Virgin Grade A Cast Acrylic Sheet');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (5, 'Impact Resistance', '17x Stronger than regular glass');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (5, 'Edge Finish', 'Diamond Polished Safe Rounded Edges');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (6, 2, 'Pin Use Notice Board (Soft Board Felt / Fabric)', 'pin-use-notice-board', 'SE-PNB-06', 'High-density self-healing felt fabric pin board with aluminium border. Available in Blue, Maroon, Green, and Grey.', '', 'products/main/notice-board.jpg', 649, 890, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (6, 'products/main/notice-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (601, 6, 'Standard', '', 420, 590, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (602, 6, 'Standard', '', 649, 890, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (603, 6, 'Standard', '', 1290, 1750, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (604, 6, 'Standard', '', 2650, 3500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (6, 'Surface', 'Anti-Fraying Flocked Felt Fabric');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (6, 'Core', 'High-Density Self-Healing Softboard');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (6, 'Frame', 'Satin Finish Anodized Aluminium');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (7, 2, 'Cover Notice Board with Lock (Sliding Acrylic / Glass Door)', 'cover-notice-board-with-lock', 'SE-CNB-07', 'Tamper-proof lockable showcase notice board with twin sliding acrylic or toughened glass doors and key lock.', '', 'products/main/cover-notice-board.jpg', 2190, 2900, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (7, 'products/main/cover-notice-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (701, 7, 'Standard', '', 2190, 2900, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (702, 7, 'Standard', '', 3890, 4900, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (703, 7, 'Standard', '', 7490, 9500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (7, 'Door Mechanism', 'Smooth Ball-Bearing Track Sliding Doors');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (7, 'Security', 'Cam Lock with 2 Duplicate Brass Keys');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (7, 'Internal Board', 'Choice of Pin-Up Felt or Magnetic Steel');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (8, 2, 'Key Hanger Board (Numbered Hooks with Aluminium Frame)', 'key-hanger-board', 'SE-KHB-08', 'Organized key storage board with brass/chrome-plated numbered hooks and heavy-duty aluminium border.', '', 'products/main/key-hanger-board.jpg', 1099, 1500, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (8, 'products/main/key-hanger-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (801, 8, 'Standard', '', 799, 1100, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (802, 8, 'Standard', '', 1099, 1500, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (803, 8, 'Standard', '', 1950, 2600, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (804, 8, 'Standard', '', 2990, 3900, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (8, 'Hooks', 'Chrome-Plated Solid Brass / Steel Hooks');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (8, 'Indexing', 'Printed High-Visibility Key Numbers');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (8, 'Backing', 'Pre-Drilled Heavy Aluminium Casing');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (9, 2, 'Exhibition Display Notice Board (Folding & Multi-Panel)', 'exhibition-display-notice-board', 'SE-ENB-09', 'Modular folding exhibition pin-up panel system with 360° hinges for trade shows, science fairs, and art galleries.', '', 'products/main/exhibition-board.jpg', 3490, 4500, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (9, 'products/main/exhibition-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (901, 9, 'Standard', '', 3490, 4500, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (902, 9, 'Standard', '', 5190, 6600, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (903, 9, 'Standard', '', 6890, 8800, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (9, 'Hinges', '360° Heavy-Duty Steel Pivot Hinges');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (9, 'Fabric', 'Double-Sided Felt Fabric');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (9, 'Portability', 'Folds Flat with Optional Carry Bag');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (10, 2, 'Cork Display Notice Board (Natural Self-Healing Cork)', 'cork-display-notice-board', 'SE-CDNB-10', 'Natural organic Portuguese cork bulletin board with self-healing grain that conceals pin holes automatically.', '', 'products/main/cork-board.jpg', 890, 1200, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (10, 'products/main/cork-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1001, 10, 'Standard', '', 550, 750, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1002, 10, 'Standard', '', 890, 1200, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1003, 10, 'Standard', '', 1750, 2400, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (10, 'Material', '100\% Natural Organic Cork Sheet');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (10, 'Self-Healing', 'Yes, Pin holes close naturally');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (10, 'Frame', 'Satin Aluminium or Natural Pine Wood');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (11, 2, 'Grooved Board (Welcome Board with Changeable Letters & Figures)', 'grooved-board', 'SE-GB-11', 'Golden / Silver grooved felt board with complete set of interchangeable English alphabets, numbers, and currency symbols.', '', 'products/main/grooved-board.jpg', 1190, 1600, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (11, 'products/main/grooved-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1101, 11, 'Standard', '', 850, 1150, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1102, 11, 'Standard', '', 1190, 1600, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1103, 11, 'Standard', '', 2390, 3200, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (11, 'Groove Type', 'Precision Extruded Horizontal Grooves');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (11, 'Letter Kit', 'Full Set of Push-in Golden/White Characters');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (11, 'Frame Finish', 'Anodized Gold or Metallic Silver');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (12, 3, 'Magnetic White Board (Polymer Coated Steel)', 'magnetic-white-board', 'SE-MWB-12', 'High-contrast scratch-resistant magnetic surface for smooth marker glide and 100\% ghost-free dry erasing. Holds magnetic accessories.', '', 'products/main/magnetic-whiteboard.jpg', 1099, 1450, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (12, 'products/main/magnetic-whiteboard.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1201, 12, 'Standard', '', 699, 950, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1202, 12, 'Standard', '', 1099, 1450, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1203, 12, 'Standard', '', 2199, 2800, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1204, 12, 'Standard', '', 2790, 3600, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1205, 12, 'Standard', '', 4299, 5400, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1206, 12, 'Standard', '', 6199, 7800, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (12, 'Surface', 'Magnetic Polymer Coated White Steel');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (12, 'Frame', 'Satin Finish Extruded Aluminium 6063-T6');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (12, 'Magnetic Adhesion', 'Strong attraction for neodymium & ferrite magnets');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (12, 'Warranty', '5 Years Manufacturer Guarantee');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (13, 3, 'Magnetic Green Chalk Board (Ceramic Vitreous Steel)', 'magnetic-green-chalk-board', 'SE-MGB-13', 'Vitreous ceramic porcelain steel green chalkboard with 25-year scratch-proof guarantee. Anti-glare matte finish with magnetic grip.', '', 'products/main/magnetic-green-board.jpg', 1350, 1800, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (13, 'products/main/magnetic-green-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1301, 13, 'Standard', '', 799, 1100, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1302, 13, 'Standard', '', 1350, 1800, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1303, 13, 'Standard', '', 2690, 3500, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1304, 13, 'Standard', '', 5190, 6800, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1305, 13, 'Standard', '', 7490, 9800, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (13, 'Surface', 'Vitreous Enamelled Ceramic Steel (Green)');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (13, 'Hardness', 'Mohs Scale 7+ (Scratch-Proof against coins & compasses)');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (13, 'Chalk Type', 'All regular and dust-free chalks');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (13, 'Warranty', '25 Years Surface Guarantee');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (14, 3, 'Magnetic Glass Writing Board (Steel Backed Toughened Glass)', 'magnetic-glass-writing-board', 'SE-MGWB-14', 'Architectural toughened glass board with galvanized steel backing plate. Supports heavy rare-earth neodymium magnets.', '', 'products/main/magnetic-glass-board.jpg', 3290, 4200, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (14, 'products/main/magnetic-glass-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1401, 14, 'Standard', '', 3290, 4200, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1402, 14, 'Standard', '', 6290, 8000, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1403, 14, 'Standard', '', 11490, 14500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (14, 'Glass', '4mm Extra-Clear Tempered Safety Glass');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (14, 'Backing', 'Integrated Galvanized Magnetic Steel Plate');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (14, 'Magnet Requirement', 'Requires Neodymium / Rare-Earth Magnets');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (15, 4, 'White Graph Board (Permanent Fused Grid Lines)', 'white-graph-board', 'SE-WGB-15', 'Dry-erase whiteboard with permanently fused 25mm × 25mm or 50mm × 50mm precision coordinate grid lines.', '', 'products/main/white-graph-board.jpg', 1390, 1800, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (15, 'products/main/white-graph-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1501, 15, 'Standard', '', 1390, 1800, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1502, 15, 'Standard', '', 2690, 3500, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1503, 15, 'Standard', '', 4990, 6500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (15, 'Grid Spacing', '25mm x 25mm Precision Subdivided');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (15, 'Grid Durability', 'Permanently Silk-Screen Heat Fused');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (15, 'Dry Erase', '100\% Ghost Free');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (16, 4, 'Black Graph Board (High-Contrast Chalk Grid)', 'black-graph-board', 'SE-BGB-16', 'Traditional deep-black blackboard with permanent fine white coordinate graph grids for chalk plotting.', '', 'products/main/black-graph-board.jpg', 1290, 1750, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (16, 'products/main/black-graph-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1601, 16, 'Standard', '', 1290, 1750, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1602, 16, 'Standard', '', 2490, 3300, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1603, 16, 'Standard', '', 4790, 6200, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (16, 'Surface', 'Non-Reflective Matte Blackboard');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (16, 'Grid Lines', 'Permanent Weather-Proof White Print');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (17, 4, 'Green Graph Board (Eye-Friendly Forest Green Chalk Grid)', 'green-graph-board', 'SE-GGB-17', 'School standard forest green chalkboard with indelible white/yellow coordinate plotting grid lines.', '', 'products/main/green-graph-board.jpg', 1390, 1850, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (17, 'products/main/green-graph-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1701, 17, 'Standard', '', 1390, 1850, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1702, 17, 'Standard', '', 2690, 3500, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1703, 17, 'Standard', '', 4990, 6500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (17, 'Colour', 'Forest Green Matte');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (17, 'Grid Accuracy', '±0.5mm Lab Calibrated');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (18, 5, '3-Leg Stand (Tripod Display Stand for Boards & Posters)', '3-leg-stand', 'SE-MS-3L-18', 'Heavy gauge tubular mild steel tripod display stand with adjustable clamps to fit boards from 2x1.5 ft up to 4x3 ft.', '', 'products/main/3leg-stand.jpg', 1290, 1800, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (18, 'products/main/3leg-stand.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1801, 18, 'Standard', '', 1290, 1800, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1802, 18, 'Standard', '', 1690, 2200, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (18, 'Material', 'Powder-Coated Mild Steel (MS Pipe)');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (18, 'Height Adjustment', 'Telescopic from 3.5 ft to 6 ft');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (18, 'Feet', 'Non-Skid Heavy Rubber Shoes');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (19, 5, 'Four Leg Stand (Heavy-Duty Stationary Board Stand)', 'four-leg-stand', 'SE-MS-4L-19', 'Ultra-stable 4-legged square tube metal frame stand for large writing and notice boards up to 6x4 ft.', '', 'products/main/4leg-stand.jpg', 1990, 2600, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (19, 'products/main/4leg-stand.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1901, 19, 'Standard', '', 1990, 2600, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1902, 19, 'Standard', '', 2390, 3100, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (1903, 19, 'Standard', '', 2890, 3800, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (19, 'Structure', '25mm x 25mm Heavy Gauge Square MS Tubing');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (19, 'Coating', '7-Tank Anti-Rust Epoxy Powder Coating');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (20, 5, 'Trolley Stand (With 360° Lockable Castor Wheels)', 'trolley-stand', 'SE-MS-TR-20', 'Mobile wheeled trolley stand with four heavy-duty nylon swivel castor wheels and foot locks.', '', 'products/main/trolley-stand.jpg', 2490, 3200, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (20, 'products/main/trolley-stand.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2001, 20, 'Standard', '', 2490, 3200, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2002, 20, 'Standard', '', 3490, 4500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (20, 'Wheels', '4x 50mm Industrial Castors with Foot Brakes');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (20, 'Base', 'H-Shaped Anti-Topple Wide Stance');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (21, 5, 'Revolving Stand (Double-Sided 360° Board Rotator)', 'revolving-stand', 'SE-MS-REV-21', 'Double-sided 360-degree rotating mobile board stand with precision brass lock pins and castor wheels.', '', 'products/main/revolving-stand.jpg', 2890, 3800, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (21, 'products/main/revolving-stand.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2101, 21, 'Standard', '', 2890, 3800, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2102, 21, 'Standard', '', 3390, 4400, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2103, 21, 'Standard', '', 3990, 5200, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (21, 'Rotation', 'Full 360° with Multi-Angle Tightening Knobs');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (21, 'Mobility', 'Lockable Castor Wheels Included');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (22, 5, 'Lobby Grooved Display Stand (Single / Double Pole)', 'lobby-grooved-display-stand', 'SE-MS-LOB-22', 'Prestigious lobby pedestal stand for grooved welcome boards in gold/chrome finish with heavy cast-iron round base.', '', 'products/main/lobby-stand.jpg', 2390, 3100, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (22, 'products/main/lobby-stand.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2201, 22, 'Standard', '', 2390, 3100, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2202, 22, 'Standard', '', 3490, 4600, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (22, 'Base', 'Heavy Cast Iron Weighted Anti-Topple Base');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (22, 'Finish', 'Mirror Brass or Satin Stainless Steel');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (23, 5, 'Flip Chart Stand (Easel Style with Paper Pad Clamp)', 'flip-chart-stand', 'SE-MS-FC-23', 'Magnetic dry-erase whiteboard easel with top-mounted universal paper pad clamp for seminar presentations.', '', 'products/main/flip-chart-stand.jpg', 2690, 3500, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (23, 'products/main/flip-chart-stand.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2301, 23, 'Standard', '', 2690, 3500, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2302, 23, 'Standard', '', 3890, 4900, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (23, 'Paper Clamp', 'Spring-Loaded Quick-Release Top Bar');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (23, 'Writing Surface', 'Magnetic Dry-Erase Whiteboard 3x2 ft');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (24, 5, 'Magazine & Newspaper Stand (Multi-Tier Display Rack)', 'magazine-newspaper-stand', 'SE-MS-MN-24', 'Heavy duty wire/sheet multi-pocket magazine display rack with newspaper hanging rods for reception areas.', '', 'products/main/magazine-stand.jpg', 2190, 2900, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (24, 'products/main/magazine-stand.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2401, 24, 'Standard', '', 2190, 2900, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2402, 24, 'Standard', '', 3290, 4200, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (24, 'Tiers', '4 to 6 Heavy Gauge Steel Display Pockets');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (24, 'Capacity', 'Up to 30 Magazines + 6 Newspapers');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (25, 5, 'Metal Folding Stand (Compact Portable Easy-Carry)', 'metal-folding-stand', 'SE-MS-MF-25', 'Lightweight scissor-folding tubular metal stand that collapses in 2 seconds for mobile trainers and exhibitions.', '', 'products/main/folding-stand.jpg', 1190, 1650, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (25, 'products/main/folding-stand.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2501, 25, 'Standard', '', 1190, 1650, 50, 1, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (25, 'Mechanism', 'Quick-Fold Scissor Hinge');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (25, 'Weight', 'Only 3.2 kg');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (26, 7, 'Wooden Easel (6ft Easel, 5ft Easel, Mini Easel)', 'wooden-easel', 'SE-WD-EAS-26', 'Handcrafted seasoned pine & beech wood artist easel with adjustable canvas mast and tilt angle.', '', 'products/main/wooden-easel.jpg', 990, 1400, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (26, 'products/main/wooden-easel.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2601, 26, 'Standard', '', 349, 500, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2602, 26, 'Standard', '', 990, 1400, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2603, 26, 'Standard', '', 1590, 2200, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (26, 'Wood', 'Kiln-Dried Seasoned Pine / Beech');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (26, 'Finish', 'Natural Lacquered Smooth Polish');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (26, 'Hardware', 'Anti-Rust Solid Brass Knobs');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (27, 7, 'Canvas Board (Frame Canvas, Board Canvas, MDF Board for Art & Craft)', 'canvas-board', 'SE-WD-CAN-27', '100\% pure cotton primed canvas: Stretched Canvas with wooden frame, Canvas Panels, and MDF Boards for resin and acrylic art.', '', 'products/main/canvas-board.jpg', 299, 450, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (27, 'products/main/canvas-board.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2701, 27, 'Standard', '', 299, 450, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2702, 27, 'Standard', '', 449, 650, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2703, 27, 'Standard', '', 790, 1100, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2704, 27, 'Standard', '', 349, 500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (27, 'Canvas Weight', '10oz (380 GSM) 100\% Cotton');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (27, 'Priming', 'Triple Acid-Free Titanium Acrylic Gesso');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (27, 'Frame', 'Kiln-Dried Pine Stretcher Bars');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (28, 7, 'Wooden Duster (With Thick Woollen / Felt Base)', 'wooden-duster', 'SE-WD-DST-28', 'Comfort-grip solid wooden handle chalk and whiteboard duster with thick, washable high-density felt wipe pad.', '', 'products/main/wooden-duster.jpg', 119, 180, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (28, 'products/main/wooden-duster.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2801, 28, 'Standard', '', 119, 180, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2802, 28, 'Standard', '', 499, 750, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2803, 28, 'Standard', '', 999, 1600, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (28, 'Handle', 'Solid Natural Hardwood Grip');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (28, 'Wiper Pad', '12mm Compressed Woollen Felt');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (29, 7, 'Wooden Geo Box (Teacher Blackboard Geometry Instrument Set)', 'wooden-geo-box', 'SE-WD-GEO-29', 'Complete large wooden geometry teaching kit: 100cm Ruler, 45° and 60° Set Squares, Protractor, and Chalk Compass with knob.', '', 'products/main/geo-box.jpg', 1350, 1800, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (29, 'products/main/geo-box.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (2901, 29, 'Standard', '', 1350, 1800, 50, 1, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (29, 'Instruments', 'Meter Ruler, 2x Set Squares, Protractor, Compass');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (29, 'Material', 'Laminated Seasoned Timber with Handle Knobs');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (30, 7, 'Wooden Pen Stand (Multi-Compartment Desktop Organizer)', 'wooden-pen-stand', 'SE-WD-PEN-30', 'Executive polished wooden stationery organizer for markers, pens, clips, post-it pads, and mobile phone.', '', 'products/main/wooden-pen-stand.jpg', 349, 490, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (30, 'products/main/wooden-pen-stand.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3001, 30, 'Standard', '', 349, 490, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3002, 30, 'Standard', '', 699, 950, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (30, 'Material', 'Natural Sheesham / Teak Polish Pine');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (30, 'Finish', 'Gloss Lacquer Anti-Dust Finish');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (31, 6, 'Writing Desk / Table Elevator (Ergonomic Slanted Acrylic Riser)', 'writing-desk-table-elevator', 'SE-AC-01-ELEV', 'Ergonomic 20-degree angled clear acrylic writing surface riser with book ledge to promote healthy writing posture.', '', 'products/main/desk-elevator.jpg', 990, 1450, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (31, 'products/main/desk-elevator.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3101, 31, 'Standard', '', 990, 1450, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3102, 31, 'Standard', '', 1390, 1900, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3103, 31, 'Standard', '', 1790, 2400, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3104, 31, 'Standard', '', 1290, 1800, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (31, 'Material', '5mm Heavy-Duty Clear Cast Acrylic');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (31, 'Incline Angle', 'Ergonomic 20° Slope');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (31, 'Ledge', 'Integrated Book & Pencil Stop Lip');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (31, 'Applications', 'School, College, Office & Study Table');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (32, 6, 'Acrylic Name Plates (Desk & Door Executive Display Plates)', 'acrylic-name-plates', 'SE-AC-02-NP', 'Custom laser engraved or UV printed acrylic name plates for doctor chambers, advocate desks, and corporate cabins.', '', 'products/main/name-plate.jpg', 449, 650, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (32, 'products/main/name-plate.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3201, 32, 'Standard', '', 449, 650, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3202, 32, 'Standard', '', 799, 1100, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3203, 32, 'Standard', '', 1190, 1600, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3204, 32, 'Standard', '', 699, 950, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (32, 'Printing', 'UV Direct Print / Gold Foil Inlay');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (32, 'Mounting', 'Freestanding or SS Standoff Mounts');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (32, 'Applications', 'Doctor Chamber, Advocate Cabin, Office Reception');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (33, 6, 'Acrylic Menu Holder (T-Shape & L-Shape Tabletop Displays)', 'acrylic-menu-holder', 'SE-AC-03-MH', 'Display menu holder stand both side visible for school, college, office, restaurant, and any party.', '', 'products/main/menu-holder.jpg', 180, 290, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (33, 'products/main/menu-holder.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3301, 33, 'Standard', '', 180, 290, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3302, 33, 'Standard', '', 250, 390, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3303, 33, 'Standard', '', 320, 490, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3304, 33, 'Standard', '', 450, 690, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3305, 33, 'Standard', '', 390, 590, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3306, 33, 'Standard', '', 1650, 2500, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3307, 33, 'Standard', '', 1990, 3000, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (33, 'Standard Size', '4x6, 5x8, 6x9, 8.5x12 Inch & Customized');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (33, 'Display', 'Display Menu Holder Stand Both Side Visible');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (33, 'Use For', 'School, College, Office, and Any Party');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (33, 'Material', '100\% Cast Virgin Acrylic (Ultra Clear)');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (34, 6, 'Acrylic Business Card Holder (Desktop & Counter Visiting Card Stand)', 'acrylic-business-card-holder', 'SE-AC-04-BCH', 'Crystal-clear desktop visiting card dispensers and multi-tier organizers for reception desks and office tables.', '', 'products/main/acrylic-display.jpg', 120, 190, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (34, 'products/main/acrylic-display.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3401, 34, 'Standard', '', 120, 190, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3402, 34, 'Standard', '', 199, 320, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3403, 34, 'Standard', '', 399, 590, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3404, 34, 'Standard', '', 140, 220, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3405, 34, 'Standard', '', 499, 800, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (34, 'Capacity', '50 to 250 Standard Visiting Cards');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (34, 'Material', 'Crystal Clear Cast Acrylic (Smooth Polished Corners)');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (34, 'Applications', 'Office Table, Reception, Exhibition Stalls, Doctor Chambers');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (35, 6, 'Wall Mount Information Holder (Clear Acrylic Notice & Certificate Pocket)', 'wall-mount-information-holder', 'SE-AC-05-WMIH', 'Wall-mounted clear acrylic pocket for circulars, license certificates, fire exit maps, and safety notices.', '', 'products/main/info-holder.jpg', 199, 320, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (35, 'products/main/info-holder.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3501, 35, 'Standard', '', 199, 320, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3502, 35, 'Standard', '', 399, 580, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3503, 35, 'Standard', '', 149, 240, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3504, 35, 'Standard', '', 890, 1400, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (35, 'Standard Size', 'A4 (8.5x12), A3 (12x18), A5 (6x8.5 Inch)');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (35, 'Mounting', 'Pre-applied 3M Tape + Screw Holes');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (35, 'Clarity', 'Optical Grade Clear View');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (35, 'Applications', 'Notice Boards, License Certificates, Fire Exit Plans');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (36, 6, 'Acrylic Literature Holders (Brochure, Pamphlet & Catalog Dispenser Stand)', 'acrylic-literature-holders', 'SE-AC-06-LH', 'Multi-tier clear acrylic brochure dispensers and catalog display stands for desk or wall mounting.', '', 'products/main/acrylic-display.jpg', 340, 490, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (36, 'products/main/acrylic-display.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3601, 36, 'Standard', '', 340, 490, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3602, 36, 'Standard', '', 790, 1150, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3603, 36, 'Standard', '', 240, 360, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3604, 36, 'Standard', '', 199, 300, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3605, 36, 'Standard', '', 890, 1350, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (36, 'Tiers', 'Single Pocket, 3-Tier Stepped, or Wall Mount');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (36, 'Material', 'Cast Virgin Acrylic with Bevelled Edges');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (36, 'Applications', 'School Prospectuses, Bank Leaflets, Reception Catalogs');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (37, 6, 'Acrylic QR Code Stand (UPI & Payment Scanner Display)', 'acrylic-qr-code-stand', 'SE-AC-07-QR', 'Countertop angled acrylic stand for Google Pay, PhonePe, Paytm, and UPI QR codes with custom business branding slot.', '', 'products/main/qr-stand.jpg', 180, 290, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (37, 'products/main/qr-stand.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3701, 37, 'Standard', '', 180, 290, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3702, 37, 'Standard', '', 260, 390, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3703, 37, 'Standard', '', 590, 900, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (37, 'Thickness', '3mm Cast Clear Acrylic');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (37, 'Orientation', 'Angled L-Shape for Fast Scanning');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (37, 'Applications', 'Payment Counters, Billing Desks, Exhibition Stalls');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (38, 6, 'Acrylic Display Stand (Shoe, Jewellery & Multi-Tier Exhibition Riser)', 'acrylic-display-stand', 'SE-AC-08-DISP', 'Multi-tier acrylic riser display steps for retail showrooms, jewellery counters, cosmetics, and optical stores.', '', 'products/main/acrylic-display.jpg', 440, 650, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (38, 'products/main/acrylic-display.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3801, 38, 'Standard', '', 440, 650, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3802, 38, 'Standard', '', 690, 990, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3803, 38, 'Standard', '', 550, 800, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (38, 'Capacity', 'Holds up to 5kg per tier');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (38, 'Edges', 'Smooth Bevelled Safe Corners');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (38, 'Applications', 'Showcases, Exhibitions, Display Counters');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (39, 8, 'MS Letter Box (Powder-Coated with Lock & Newspaper Holder)', 'ms-letter-box', 'SE-BX-LB-39', 'Weatherproof heavy mild steel post box with mail slot, viewing window, lock with keys, and lower newspaper roll holder.', '', 'products/main/letter-box.jpg', 699, 990, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (39, 'products/main/letter-box.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3901, 39, 'Standard', '', 699, 990, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (3902, 39, 'Standard', '', 990, 1390, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (39, 'Material', 'Heavy Gauge Mild Steel Sheet');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (39, 'Lock', 'Built-in Cam Lock + 2 Brass Keys');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (39, 'Weatherproofing', 'Rainproof Slanted Overhang Lid');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (40, 8, 'First Aid Box (Wall Mount Metal / Acrylic Emergency Cabinet)', 'first-aid-box', 'SE-BX-FA-40', 'Factory and school mandatory first aid emergency cabinet with distinct red cross emblem, multi-shelves, and secure latch/lock.', '', 'products/main/first-aid-box.jpg', 849, 1200, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (40, 'products/main/first-aid-box.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4001, 40, 'Standard', '', 849, 1200, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4002, 40, 'Standard', '', 1390, 1850, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4003, 40, 'Standard', '', 990, 1400, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (40, 'Shelves', '3 Fixed Compartment Tiers');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (40, 'Marking', 'Standard International Red Cross Graphic');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (40, 'Mounting', 'Wall Hanging Brackets on Back');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (41, 8, 'Suggestion Box (Complaint & Feedback Drop Box with Lock)', 'suggestion-box', 'SE-BX-SB-41', 'Confidential suggestion and grievance drop box with drop slot, pen & form holder, and lock for HR departments and schools.', '', 'products/main/suggestion-box.jpg', 790, 1100, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (41, 'products/main/suggestion-box.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4101, 41, 'Standard', '', 790, 1100, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4102, 41, 'Standard', '', 990, 1350, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (41, 'Slot Size', '120mm x 8mm Wide Confidential Drop Slot');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (41, 'Access', 'Hinged Front / Bottom Door with Key Lock');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (42, 8, 'Key Hanger Box (Lockable Metal Key Security Cabinet)', 'key-hanger-box', 'SE-BX-KB-42', 'Heavy gauge steel key management safe box with interior numbered hooks, key tags, and master cylinder lock.', '', 'products/main/key-box.jpg', 1290, 1800, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (42, 'products/main/key-box.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4201, 42, 'Standard', '', 1290, 1800, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4202, 42, 'Standard', '', 1890, 2500, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4203, 42, 'Standard', '', 3190, 4200, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (42, 'Cabinet Material', '0.8mm Heavy Cold-Rolled Steel');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (42, 'Inclusions', 'Coloured Write-On Key Fobs Included');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (42, 'Security', 'Cylinder Lock with 2 Keys');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (43, 9, 'Class Room Furniture (School Dual Desk & Bench Set)', 'classroom-dual-desk-bench', 'SE-FN-CR-43', 'Heavy-duty ergonomic dual student desk and attached bench with book shelf and bag hooks. Built with virgin MS pipe and prelaminated board.', '', 'products/main/classroom-desk.jpg', 3990, 5500, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (43, 'products/main/classroom-desk.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4301, 43, 'Standard', '', 3490, 4800, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4302, 43, 'Standard', '', 3990, 5500, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4303, 43, 'Standard', '', 1690, 2300, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (43, 'Frame', '25mm Round / Square Mild Steel Tube 16-Gauge');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (43, 'Top Material', '18mm Prelaminated MDF with 2mm PVC Edge Bending');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (43, 'Book Shelf', 'Integrated Perforated Metal Book Tray');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (44, 9, 'Lab Furniture (Science Laboratory Chemical-Resistant Worktable)', 'science-laboratory-worktable', 'SE-FN-LAB-44', 'Laboratory worktable with acid/alkali resistant solid epoxy/granite worktop, reagent rack, sink provision, and gas/water tap sockets.', '', 'products/main/lab-table.jpg', 10990, 14500, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (44, 'products/main/lab-table.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4401, 44, 'Standard', '', 6990, 9200, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4402, 44, 'Standard', '', 10990, 14500, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4403, 44, 'Standard', '', 21900, 2800, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (44, 'Worktop', '18mm Black Jet Granite / Trespa Chemical Board');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (44, 'Framework', 'Heavy 50x25mm C-Frame Steel Structure');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (44, 'Chemical Resistance', 'Resistant to Acids, Alkalis & Organic Solvents');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (45, 9, 'Library Furniture (Double-Sided Book Stacks & Reading Tables)', 'library-furniture-book-stacks', 'SE-FN-LIB-45', 'Modular heavy-gauge steel library book shelving racks and 6-seater wooden reading tables with partition dividers.', '', 'products/main/library-rack.jpg', 8490, 11000, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (45, 'products/main/library-rack.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4501, 45, 'Standard', '', 8490, 11000, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4502, 45, 'Standard', '', 7490, 9800, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4503, 45, 'Standard', '', 4200, 5500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (45, 'Shelf Capacity', '80 - 100 kg per tier');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (45, 'Coating', 'Electrostatic Epoxy Powder Coated');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (46, 9, 'Office Desk & Table (Executive Cabin Table with Drawer Pedestal)', 'office-desk-and-table', 'SE-FN-OFD-46', 'Executive wooden and metal office desk with 3-drawer lockable storage pedestal, wire management grommet, and modesty panel.', '', 'products/main/office-desk.jpg', 6490, 8500, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (46, 'products/main/office-desk.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4601, 46, 'Standard', '', 4990, 6800, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4602, 46, 'Standard', '', 6490, 8500, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4603, 46, 'Standard', '', 9990, 13500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (46, 'Top Thickness', '25mm Commercial Grade Prelam Board');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (46, 'Storage', 'Lockable 3-Tier Telescopic Drawer Pedestal');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (46, 'Edge Bending', '2mm Machine-Glued Seamless PVC Edge');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (47, 9, 'Work Station (Modular 2-Seater / 4-Seater Office Cubicle Set)', 'modular-office-workstation', 'SE-FN-WS-47', 'Contemporary modular office workstation with acoustic fabric pin-up partition screen, cable raceways, and individual drawer units.', '', 'products/main/workstation.jpg', 13900, 18500, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (47, 'products/main/workstation.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4701, 47, 'Standard', '', 8900, 11800, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4702, 47, 'Standard', '', 13900, 18500, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4703, 47, 'Standard', '', 21500, 28500, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (47, 'Partition', 'Aluminium Tileable Screen with Fabric Pin-up');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (47, 'Wire Management', 'Inbuilt Dual Raceway for Data & Power Cables');
INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (48, 9, 'Reception Counter (Modern Curved & Linear Front Office Desk)', 'modern-reception-counter', 'SE-FN-REC-48', 'Imposing front-office reception counter with elevated customer ledge, LED profile lighting slot, and internal receptionist workspace.', '', 'products/main/reception-counter.jpg', 14900, 19500, 0, 1);
INSERT INTO product_images (product_id, image_url, display_order) VALUES (48, 'products/main/reception-counter.jpg', 0);
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4801, 48, 'Standard', '', 8900, 11800, 50, 0, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4802, 48, 'Standard', '', 14900, 19500, 50, 1, '');
INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (4803, 48, 'Standard', '', 24900, 32000, 50, 0, '');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (48, 'Structure', 'Commercial Marine Grade Ply & Prelam Board');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (48, 'Lighting', 'Concealed LED Warm Strip Provision');
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (48, 'Storage', 'Cash Drawer, Document Cupboard & CPU Space');

-- -------------------------------------------------------------------------
-- Dumping data for: clients
-- -------------------------------------------------------------------------
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (1, 'Calcutta University', 'university_colleges', 'University & Colleges', 'College Street Campus, Kolkata', '150+ Ceramic Green Chalkboards, Revolving Stands & Faculty Notice Systems', '1857', 1, 1);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (2, 'Presidency University', 'university_colleges', 'University & Colleges', 'College Street, Kolkata', 'Custom 8x4 ft Auditorium Ceramic Boards & Laboratory Notice Systems', '1817', 1, 2);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (3, 'Jadavpur University', 'university_colleges', 'University & Colleges', 'Jadavpur, Kolkata', 'Precision Engineering Graph Boards & High-Gloss Magnetic Whiteboards', '1955', 1, 3);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (4, 'St. Xavier\'s College (Autonomous)', 'university_colleges', 'University & Colleges', 'Park Street, Kolkata', 'Covered Key & Pin Notice Boards, Class Room Wooden Benches & Acrylic Fixtures', '1860', 1, 4);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (5, 'Scottish Church College', 'university_colleges', 'University & Colleges', 'Hedua, North Kolkata', 'Ceramic Magnetic Chalkboards & Mobile Trolley Flip Stands', '1830', 0, 5);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (6, 'South Point High School', 'schools', 'Schools', 'Ballygunge Place, Kolkata', '120+ Dual-Surface Writing Boards & Student Desk Furniture', '1954', 1, 6);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (7, 'Delhi Public School (DPS Ruby Park)', 'schools', 'Schools', 'Ruby Park / Newtown, Kolkata', 'Magnetic Toughened Glass Whiteboards & Bulletin Pin Boards', '2003', 1, 7);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (8, 'La Martiniere for Boys & Girls', 'schools', 'Schools', 'Rawdon Street, Kolkata', 'Heavy-Duty 4-Leg Revolving Mobile Stands & Lockable Display Cases', '1836', 1, 8);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (9, 'Don Bosco School', 'schools', 'Schools', 'Park Circus, Kolkata', 'Lockable Covered Corridor Notice Boards & First Aid Emergency Cabinets', '1958', 0, 9);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (10, 'St. James\' School', 'schools', 'Schools', 'AJC Bose Road, Kolkata', 'Self-Healing Fabric Pin Boards & Wooden Geometry Teaching Instruments', '1864', 0, 10);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (11, 'State Bank of India (Samriddhi Bhavan)', 'corporate_banks', 'Corporate Office / Bank', 'Strand Road, Kolkata', 'Executive Glass Whiteboards & Brass Lobby Grooved Letter Display Stands', '1955', 1, 11);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (12, 'Bandhan Bank Corporate HQ', 'corporate_banks', 'Corporate Office / Bank', 'Sector V, Salt Lake, Kolkata', 'Acrylic Desk Elevators, Executive Nameplates & Menu Stands for Zonal Branches', '2001', 1, 12);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (13, 'Tata Consultancy Services (TCS)', 'corporate_banks', 'Corporate Office / Bank', 'Gitanjali Park, Newtown, Kolkata', 'Agile Team Magnetic Writing Boards, Flip Chart Mobile Stands & Acoustic Wall Pin Panels', '1968', 1, 13);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (14, 'Wipro Technologies', 'corporate_banks', 'Corporate Office / Bank', 'Sector V, Salt Lake, Kolkata', 'Revolving Mobile Whiteboards & Conference Room Notice Display Systems', '1945', 0, 14);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (15, 'Punjab National Bank (Zonal Office)', 'corporate_banks', 'Corporate Office / Bank', 'BBD Bagh, Kolkata', 'Notice Boards with Sliding Acrylic Locks & Wall-Mounted Suggestion Boxes', '1894', 0, 15);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (16, 'Narayana Health (RN Tagore Hospital)', 'others', 'Others', 'Mukundapur, EM Bypass, Kolkata', 'Doctor Duty Schedule Magnetic Boards & Wall Mount Information Pockets', '2000', 1, 16);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (17, 'Peerless Hospital & B.K. Roy Research Centre', 'others', 'Others', 'Panchasayar, Kolkata', 'Department Display Notice Systems & Acrylic Literature Dispensers', '1993', 0, 17);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (18, 'Allen Career Institute', 'others', 'Others', 'Kalighat & Newtown Centers, Kolkata', '10x4 ft Continuous Seamless Classroom Whiteboards & Marker Duster Kits', '1988', 1, 18);
INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (19, 'Aakash Educational Services', 'others', 'Others', 'Salt Lake & South Kolkata Centers', 'Ceramic Green Chalkboards & Heavy Mobile 4-Leg Stands', '1988', 0, 19);

-- -------------------------------------------------------------------------
-- Dumping data for: settings
-- -------------------------------------------------------------------------
INSERT INTO settings (setting_key, setting_value) VALUES ('general', '{\"site_name\":\"Shaw Enterprise\",\"logo_url\":\"\",\"site_logo\":\"\",\"logo\":\"\",\"tagline\":\"Manufacturer, Wholesaler & Retailer of Writing Boards, Display Systems & Educational Accessories\",\"proprietor\":\"Mr. Indrajit Shaw\",\"phone\":\"+91 9933944007\",\"phone_secondary\":\"+91 7003779114\",\"whatsapp\":\"+91 9933944007\",\"email\":\"shaw.entt.edu@gmail.com\",\"address\":\"44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B\",\"registered_office_address\":\"44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B\",\"workshop_address\":\"Balagarh Industrial, Suryapur, Navarand, Kolkata – 700121\",\"maps_embed_url\":\"https://maps.google.com/maps?q=44/1B,\%20Beniatola\%20Lane,\%20College\%20Street,\%20Kolkata\%20700009&t=&z=16&ie=UTF8&iwloc=&output=embed\",\"gst_number\":\"19AAIFS4821N1ZM\",\"established_year\":\"2014\",\"working_hours\":\"Monday – Saturday: 10:00 AM – 8:00 PM (Sunday Closed)\",\"announcement_text\":\"🚚 Free Delivery in Kolkata on orders above ₹1,999 • Direct Factory Pricing with GST Invoices • Fast Dispatch Across India\",\"hero_banner_url\":\"https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80\",\"social_links\":{\"facebook\":\"https://facebook.com\",\"instagram\":\"https://instagram.com\",\"youtube\":\"https://youtube.com\",\"whatsapp\":\"https://wa.me/919933944007\",\"linkedin\":\"\",\"twitter\":\"\"},\"payment_settings\":{\"enable_razorpay\":true,\"razorpay_key_id\":\"rzp_test_shaw_ent_kolkata_99339\",\"razorpay_key_secret\":\"\",\"enable_upi_qr\":true,\"upi_id\":\"9933944007@upi\",\"upi_qr_url\":\"https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=9933944007@upi&pn=Shaw\%20Enterprise&cu=INR\",\"enable_cod\":true,\"enable_bank_transfer\":true,\"bank_name\":\"State Bank of India\",\"bank_account_no\":\"389012345678\",\"bank_ifsc\":\"SBIN0000087\",\"bank_branch\":\"College Street Branch, Kolkata\"},\"sections\":{\"hero\":{\"badge\":\"🏭 Regd. Office: 44/1B, Beniatola Lane, College Street • Works: Balagarh Industrial, Kolkata\",\"title\":\"Kolkata\'s Premier Manufacturer of Writing Boards & Display Systems\",\"description\":\"Manufactured by Shaw Enterprise with 100\% ghost-free surfaces and virgin 6063-T6 aluminium frames. Direct factory rates for retail, schools, coaching institutes & offices.\",\"btn_primary_text\":\"Shop Products Online →\",\"btn_primary_link\":\"/products\",\"btn_secondary_text\":\"📐 Custom Size Calculator\",\"image\":\"https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80\",\"badge_featured_title\":\"Popular in Kolkata\",\"badge_featured_sub\":\"Shaw 3x2 Magnetic Whiteboard\",\"badge_featured_price\":\"₹1,099\"},\"features\":[{\"id\":1,\"icon\":\"🏭\",\"title\":\"College Street Works\",\"subtitle\":\"Direct factory manufacture\"},{\"id\":2,\"icon\":\"🚚\",\"title\":\"Safe Wooden Packaging\",\"subtitle\":\"Reinforced corner battens\"},{\"id\":3,\"icon\":\"📱\",\"title\":\"UPI / Cards / COD\",\"subtitle\":\"Instant QR scan or Cash on Delivery\"},{\"id\":4,\"icon\":\"📄\",\"title\":\"GST Tax Invoices\",\"subtitle\":\"Official GSTIN provided\"}],\"about_home\":{\"badge\":\"About Shaw Enterprise\",\"title\":\"Serving Bengal’s Leading Classrooms, Offices & Institutions Since 2014\",\"content\":\"Founded at College Street, Kolkata, Shaw Enterprise manufactures superior classroom display boards, institutional desks, and presentation hardware.\",\"points\":[\"Over 10,000+ Writing Boards Delivered to WB Schools & Colleges\",\"Direct College Street Factory Pricing with No Middleman Markups\",\"Ceramic Green Chalkboards with 25-Year Zero Ghosting Warranty\",\"Custom Dimensions Made-to-Order in 48 Hours\"]},\"manufacturing\":{\"title\":\"Our Kolkata Workshop & Fabrication Standards\",\"description\":\"Every board is hand-checked at our workshop in Balagarh Industrial Area, Kolkata before being packed in bubble wrap and wooden battens.\",\"specs\":[{\"label\":\"Surface Standard\",\"value\":\"High Gloss Ceramic Enamel / Melamine\"},{\"label\":\"Frame Alloy\",\"value\":\"Virgin 6063-T6 Anodized Aluminium\"},{\"label\":\"Core Material\",\"value\":\"High-Density Honeycomb Paper Board / PVC\"},{\"label\":\"Backing\",\"value\":\"0.3mm Anti-Rust Galvanized Steel Sheet\"}]}}}');

-- -------------------------------------------------------------------------
-- Dumping data for: testimonials
-- -------------------------------------------------------------------------
INSERT INTO testimonials (id, client_name, client_designation, organization_name, review_text, rating, is_featured, display_order) VALUES (1, 'Dr. Debabrata Sen', 'Academic Director', 'St. Xavier’s Collegiate Extension, Kolkata', 'We placed an order for 45 Ceramic Green Chalkboards and 20 Mobile Revolving Stands for our new block. Shaw Enterprise delivered well before the semester started, with perfect batten packaging. The ghost-free ceramic finish is unmatched.', 5, 1, 0);
INSERT INTO testimonials (id, client_name, client_designation, organization_name, review_text, rating, is_featured, display_order) VALUES (2, 'Swati Bhattacharya', 'Centre Head', 'Pathfinder Coaching Institute, College Street', 'Being right in College Street, Shaw Enterprise is our go-to manufacturer. Their magnetic whiteboards withstand 10 hours of daily continuous marker writing without any residue or ghost stains.', 5, 1, 0);
INSERT INTO testimonials (id, client_name, client_designation, organization_name, review_text, rating, is_featured, display_order) VALUES (3, 'Rohan Ganguly', 'Admin & Infrastructure Lead', 'Techno India Corporate Office, Salt Lake Sector V', 'From modular office workstations to glass white writing boards for our executive boardrooms, Mr. Indrajit Shaw provided direct factory wholesale rates and flawless installation.', 5, 1, 0);
INSERT INTO testimonials (id, client_name, client_designation, organization_name, review_text, rating, is_featured, display_order) VALUES (4, 'Anirban Mitra', 'Managing Partner', 'Apex Academy, Gariahat', 'Custom dimensions ordered on WhatsApp on Tuesday were delivered on Thursday. The 360-degree castor revolving stands are exceptionally sturdy and don’t wobble during lecture writing.', 5, 1, 0);

-- -------------------------------------------------------------------------
-- Dumping data for: blogs
-- -------------------------------------------------------------------------
INSERT INTO blogs (id, title, slug, thumbnail_image, video_url, author_name, content, is_published) VALUES (1, 'Ceramic Steel vs Melamine Whiteboard: Which Surface Lasts Longer in Kolkata?', 'ceramic-steel-vs-melamine-whiteboard-comparison', 'blogs/whiteboard-guide.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Shaw Enterprise Design Cell', '\n      <h2>The Science of Board Surfaces</h2>\n      <p>Educational institutions in West Bengal face a unique challenge: high atmospheric humidity during monsoons. Inferior commercial whiteboards absorb moisture through unsealed backings, leading to warped frames and stubborn marker ghosting within weeks.</p>\n      <h3>Vitreous Enamelled Ceramic Steel</h3>\n      <p>Manufactured by fusing porcelain enamel to heavy gauge steel at over 800°C, creating a glass-smooth surface that is 100\% non-porous. Marker ink wipes off cleanly even after being left on the board for over 6 months.</p>\n      <h3>Key Advantages of Shaw Enterprise Boards</h3>\n      <ul>\n        <li><strong>Virgin 6063-T6 Aluminium:</strong> Resists bending under student weight or heavy vibration.</li>\n        <li><strong>Moisture-Resistant Backing:</strong> 0.25mm galvanized anti-rust backing prevents moisture ingress.</li>\n        <li><strong>Ghost-Free Warranty:</strong> Certified for over 100,000 erase cycles.</li>\n      </ul>\n    ', 1);
INSERT INTO blogs (id, title, slug, thumbnail_image, video_url, author_name, content, is_published) VALUES (2, 'How to Properly Clean & Restore Whiteboards: Factory Maintenance Hacks', 'how-to-properly-clean-and-maintain-whiteboards', 'blogs/cleaning-tips.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Shaw Enterprise Design Cell', '\n      <h2>Never Use Harsh Abrasives</h2>\n      <p>One of the most common mistakes schools make is cleaning writing boards with abrasive powders or harsh solvents like acetone. These destroy the micro-thin polymer coating, creating microscopic pores that permanently trap marker pigments.</p>\n      <h3>The Safe Shaw Enterprise Cleaning Protocol</h3>\n      <ol>\n        <li>Wipe board thoroughly with a clean micro-fibre felt duster.</li>\n        <li>Spray a 50/50 mixture of isopropyl alcohol and distilled water or our specialized Board Cleaner.</li>\n        <li>Allow solution to break down solvent waxes for 30 seconds.</li>\n        <li>Wipe dry with a clean micro-fibre towel in circular motions.</li>\n      </ol>\n    ', 1);

-- -------------------------------------------------------------------------
-- Dumping data for: orders
-- -------------------------------------------------------------------------
INSERT INTO orders (id, customer_name, phone, email, delivery_address, city, items, total_amount, payment_method, payment_status, order_status) VALUES ('SE-ORD-8821', 'Dr. Debabrata Mukherjee', '+91 98301 23456', 'd.mukherjee@cu.ac.in', 'Dept of Physics, University of Calcutta, 92 APC Road', 'Kolkata', '[{\"id\":1,\"title\":\"Shaw Non-Magnetic Whiteboard (Melamine Surface)\",\"size\":\"4x3 Feet (Standard Office/Tuition)\",\"quantity\":2,\"price\":849}]', 1698, 'Razorpay Online', 'Paid', 'Dispatched');

-- -------------------------------------------------------------------------
-- Dumping data for: bulk_inquiries
-- -------------------------------------------------------------------------
INSERT INTO bulk_inquiries (id, client_name, organization_name, email, phone, product_title, variant_details, quantity, delivery_city, message, status) VALUES (1001, 'Prof. Anirban Roy', 'Presidency College Campus', 'infra@presidency.edu', '+91 99339 44007', 'Shaw Ceramic Magnetic Green Chalkboard', '6x4 Feet (College / University Hall)', 25, 'College Street, Kolkata', 'Require bulk quotation with GST invoice and door delivery to College Street campus.', 'Pending');

SET FOREIGN_KEY_CHECKS = 1;
