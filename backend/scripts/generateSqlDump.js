import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, '..', 'database', 'catalog_seed.json');
const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const initialCategories = seedData.categories || [];
const initialProducts = seedData.products || [];
const initialTestimonials = seedData.testimonials || [];
const initialBlogs = seedData.blogs || [];

const defaultSettings = {
  site_name: 'Shaw Enterprise',
  logo_url: '',
  site_logo: '',
  logo: '',
  tagline: 'Manufacturer, Wholesaler & Retailer of Writing Boards, Display Systems & Educational Accessories',
  proprietor: 'Mr. Indrajit Shaw',
  phone: '+91 9933944007',
  phone_secondary: '+91 7003779114',
  whatsapp: '+91 9933944007',
  email: 'shaw.entt.edu@gmail.com',
  address: '44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B',
  registered_office_address: '44/1B, Beniatola Lane (College Street), Kolkata – 700009, W.B',
  workshop_address: 'Balagarh Industrial, Suryapur, Navarand, Kolkata – 700121',
  maps_embed_url: 'https://maps.google.com/maps?q=44/1B,%20Beniatola%20Lane,%20College%20Street,%20Kolkata%20700009&t=&z=16&ie=UTF8&iwloc=&output=embed',
  gst_number: '19AAIFS4821N1ZM',
  established_year: '2014',
  working_hours: 'Monday – Saturday: 10:00 AM – 8:00 PM (Sunday Closed)',
  announcement_text: '🚚 Free Delivery in Kolkata on orders above ₹1,999 • Direct Factory Pricing with GST Invoices • Fast Dispatch Across India',
  hero_banner_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
  social_links: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/919933944007',
    linkedin: '',
    twitter: '',
  },
  payment_settings: {
    enable_razorpay: true,
    razorpay_key_id: 'rzp_test_shaw_ent_kolkata_99339',
    razorpay_key_secret: 'sec_test_9933944007_college_st',
    enable_upi_qr: true,
    upi_id: '9933944007@upi',
    upi_qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=9933944007@upi&pn=Shaw%20Enterprise&cu=INR',
    enable_cod: true,
    enable_bank_transfer: true,
    bank_name: 'State Bank of India',
    bank_account_no: '389012345678',
    bank_ifsc: 'SBIN0000087',
    bank_branch: 'College Street Branch, Kolkata',
  },
  sections: {
    hero: {
      badge: '🏭 Regd. Office: 44/1B, Beniatola Lane, College Street • Works: Balagarh Industrial, Kolkata',
      title: "Kolkata's Premier Manufacturer of Writing Boards & Display Systems",
      description: 'Manufactured by Shaw Enterprise with 100% ghost-free surfaces and virgin 6063-T6 aluminium frames. Direct factory rates for retail, schools, coaching institutes & offices.',
      btn_primary_text: 'Shop Products Online →',
      btn_primary_link: '/products',
      btn_secondary_text: '📐 Custom Size Calculator',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      badge_featured_title: 'Popular in Kolkata',
      badge_featured_sub: 'Shaw 3x2 Magnetic Whiteboard',
      badge_featured_price: '₹1,099',
    },
    features: [
      { id: 1, icon: '🏭', title: 'College Street Works', subtitle: 'Direct factory manufacture' },
      { id: 2, icon: '🚚', title: 'Safe Wooden Packaging', subtitle: 'Reinforced corner battens' },
      { id: 3, icon: '📱', title: 'UPI / Cards / COD', subtitle: 'Instant QR scan or Cash on Delivery' },
      { id: 4, icon: '📄', title: 'GST Tax Invoices', subtitle: 'Official GSTIN provided' },
    ],
    about_home: {
      badge: 'About Shaw Enterprise',
      title: 'Serving Bengal’s Leading Classrooms, Offices & Institutions Since 2014',
      content: 'Founded at College Street, Kolkata, Shaw Enterprise manufactures superior classroom display boards, institutional desks, and presentation hardware.',
      points: [
        'Over 10,000+ Writing Boards Delivered to WB Schools & Colleges',
        'Direct College Street Factory Pricing with No Middleman Markups',
        'Ceramic Green Chalkboards with 25-Year Zero Ghosting Warranty',
        'Custom Dimensions Made-to-Order in 48 Hours',
      ],
    },
    manufacturing: {
      title: 'Our Kolkata Workshop & Fabrication Standards',
      description: 'Every board is hand-checked at our workshop in Balagarh Industrial Area, Kolkata before being packed in bubble wrap and wooden battens.',
      specs: [
        { label: 'Surface Standard', value: 'High Gloss Ceramic Enamel / Melamine' },
        { label: 'Frame Alloy', value: 'Virgin 6063-T6 Anodized Aluminium' },
        { label: 'Core Material', value: 'High-Density Honeycomb Paper Board / PVC' },
        { label: 'Backing', value: '0.3mm Anti-Rust Galvanized Steel Sheet' },
      ],
    },
  },
};

const initialOrders = [
  {
    id: 'SE-ORD-8821',
    customer_name: 'Dr. Debabrata Mukherjee',
    phone: '+91 98301 23456',
    email: 'd.mukherjee@cu.ac.in',
    delivery_address: 'Dept of Physics, University of Calcutta, 92 APC Road',
    city: 'Kolkata',
    items: [
      {
        id: 1,
        title: 'Shaw Non-Magnetic Whiteboard (Melamine Surface)',
        size: '4x3 Feet (Standard Office/Tuition)',
        quantity: 2,
        price: 849,
      },
    ],
    total_amount: 1698.00,
    payment_method: 'Razorpay Online',
    payment_status: 'Paid',
    order_status: 'Dispatched',
  },
];

const initialInquiries = [
  {
    id: 1001,
    client_name: 'Prof. Anirban Roy',
    organization_name: 'Presidency College Campus',
    email: 'infra@presidency.edu',
    phone: '+91 99339 44007',
    product_title: 'Shaw Ceramic Magnetic Green Chalkboard',
    variant_details: '6x4 Feet (College / University Hall)',
    quantity: 25,
    delivery_city: 'College Street, Kolkata',
    message: 'Require bulk quotation with GST invoice and door delivery to College Street campus.',
    status: 'Pending',
  },
];

const initialClients = [
  { id: 1, name: 'Calcutta University', category: 'university_colleges', category_label: 'University & Colleges', location: 'College Street Campus, Kolkata', project_details: '150+ Ceramic Green Chalkboards, Revolving Stands & Faculty Notice Systems', established: '1857', is_featured: true },
  { id: 2, name: 'Presidency University', category: 'university_colleges', category_label: 'University & Colleges', location: 'College Street, Kolkata', project_details: 'Custom 8x4 ft Auditorium Ceramic Boards & Laboratory Notice Systems', established: '1817', is_featured: true },
  { id: 3, name: 'Jadavpur University', category: 'university_colleges', category_label: 'University & Colleges', location: 'Jadavpur, Kolkata', project_details: 'Precision Engineering Graph Boards & High-Gloss Magnetic Whiteboards', established: '1955', is_featured: true },
  { id: 4, name: "St. Xavier's College (Autonomous)", category: 'university_colleges', category_label: 'University & Colleges', location: 'Park Street, Kolkata', project_details: 'Covered Key & Pin Notice Boards, Class Room Wooden Benches & Acrylic Fixtures', established: '1860', is_featured: true },
  { id: 5, name: 'Scottish Church College', category: 'university_colleges', category_label: 'University & Colleges', location: 'Hedua, North Kolkata', project_details: 'Ceramic Magnetic Chalkboards & Mobile Trolley Flip Stands', established: '1830', is_featured: false },
  { id: 6, name: 'South Point High School', category: 'schools', category_label: 'Schools', location: 'Ballygunge Place, Kolkata', project_details: '120+ Dual-Surface Writing Boards & Student Desk Furniture', established: '1954', is_featured: true },
  { id: 7, name: 'Delhi Public School (DPS Ruby Park)', category: 'schools', category_label: 'Schools', location: 'Ruby Park / Newtown, Kolkata', project_details: 'Magnetic Toughened Glass Whiteboards & Bulletin Pin Boards', established: '2003', is_featured: true },
  { id: 8, name: 'La Martiniere for Boys & Girls', category: 'schools', category_label: 'Schools', location: 'Rawdon Street, Kolkata', project_details: 'Heavy-Duty 4-Leg Revolving Mobile Stands & Lockable Display Cases', established: '1836', is_featured: true },
  { id: 9, name: 'Don Bosco School', category: 'schools', category_label: 'Schools', location: 'Park Circus, Kolkata', project_details: 'Lockable Covered Corridor Notice Boards & First Aid Emergency Cabinets', established: '1958', is_featured: false },
  { id: 10, name: "St. James' School", category: 'schools', category_label: 'Schools', location: 'AJC Bose Road, Kolkata', project_details: 'Self-Healing Fabric Pin Boards & Wooden Geometry Teaching Instruments', established: '1864', is_featured: false },
  { id: 11, name: 'State Bank of India (Samriddhi Bhavan)', category: 'corporate_banks', category_label: 'Corporate Office / Bank', location: 'Strand Road, Kolkata', project_details: 'Executive Glass Whiteboards & Brass Lobby Grooved Letter Display Stands', established: '1955', is_featured: true },
  { id: 12, name: 'Bandhan Bank Corporate HQ', category: 'corporate_banks', category_label: 'Corporate Office / Bank', location: 'Sector V, Salt Lake, Kolkata', project_details: 'Acrylic Desk Elevators, Executive Nameplates & Menu Stands for Zonal Branches', established: '2001', is_featured: true },
  { id: 13, name: 'Tata Consultancy Services (TCS)', category: 'corporate_banks', category_label: 'Corporate Office / Bank', location: 'Gitanjali Park, Newtown, Kolkata', project_details: 'Agile Team Magnetic Writing Boards, Flip Chart Mobile Stands & Acoustic Wall Pin Panels', established: '1968', is_featured: true },
  { id: 14, name: 'Wipro Technologies', category: 'corporate_banks', category_label: 'Corporate Office / Bank', location: 'Sector V, Salt Lake, Kolkata', project_details: 'Revolving Mobile Whiteboards & Conference Room Notice Display Systems', established: '1945', is_featured: false },
  { id: 15, name: 'Punjab National Bank (Zonal Office)', category: 'corporate_banks', category_label: 'Corporate Office / Bank', location: 'BBD Bagh, Kolkata', project_details: 'Notice Boards with Sliding Acrylic Locks & Wall-Mounted Suggestion Boxes', established: '1894', is_featured: false },
  { id: 16, name: 'Narayana Health (RN Tagore Hospital)', category: 'others', category_label: 'Others', location: 'Mukundapur, EM Bypass, Kolkata', project_details: 'Doctor Duty Schedule Magnetic Boards & Wall Mount Information Pockets', established: '2000', is_featured: true },
  { id: 17, name: 'Peerless Hospital & B.K. Roy Research Centre', category: 'others', category_label: 'Others', location: 'Panchasayar, Kolkata', project_details: 'Department Display Notice Systems & Acrylic Literature Dispensers', established: '1993', is_featured: false },
  { id: 18, name: 'Allen Career Institute', category: 'others', category_label: 'Others', location: 'Kalighat & Newtown Centers, Kolkata', project_details: '10x4 ft Continuous Seamless Classroom Whiteboards & Marker Duster Kits', established: '1988', is_featured: true },
  { id: 19, name: 'Aakash Educational Services', category: 'others', category_label: 'Others', location: 'Salt Lake & South Kolkata Centers', project_details: 'Ceramic Green Chalkboards & Heavy Mobile 4-Leg Stands', established: '1988', is_featured: false },
];

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? '1' : '0';
  const str = String(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
      default:
        return char;
    }
  });
  return `'${str}'`;
}

let sql = `-- =========================================================================
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
`;

for (const cat of initialCategories) {
  sql += `INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES (${cat.id}, ${escapeSql(cat.name)}, ${escapeSql(cat.slug)}, ${escapeSql(cat.description || '')}, ${escapeSql(cat.image || '')}, ${cat.display_order || 0}, ${cat.is_active !== false ? 1 : 0});\n`;
}

sql += `\n-- -------------------------------------------------------------------------\n-- Dumping data for: products, product_variants, product_specifications, product_images\n-- -------------------------------------------------------------------------\n`;

let variantIdCounter = 1;
for (const prod of initialProducts) {
  sql += `INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active) VALUES (${prod.id}, ${prod.category_id || 'NULL'}, ${escapeSql(prod.title)}, ${escapeSql(prod.slug)}, ${escapeSql(prod.sku || `SE-PRD-${prod.id}`)}, ${escapeSql(prod.short_description || '')}, ${escapeSql(prod.full_description || '')}, ${escapeSql(prod.main_image || '')}, ${prod.base_price || 0}, ${prod.mrp || 'NULL'}, ${prod.is_featured ? 1 : 0}, ${prod.is_active !== false ? 1 : 0});\n`;

  // Images
  const uniqueImgs = [...new Set([prod.main_image, ...(prod.images || [])].filter(Boolean))];
  for (let order = 0; order < uniqueImgs.length; order++) {
    sql += `INSERT INTO product_images (product_id, image_url, display_order) VALUES (${prod.id}, ${escapeSql(uniqueImgs[order])}, ${order});\n`;
  }

  // Variants
  if (prod.variants && prod.variants.length > 0) {
    for (const v of prod.variants) {
      const vId = v.id || variantIdCounter++;
      sql += `INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension) VALUES (${vId}, ${prod.id}, ${escapeSql(v.size_label || 'Standard')}, ${escapeSql(v.surface_type || '')}, ${v.price || prod.base_price}, ${v.mrp || 'NULL'}, ${v.stock_quantity || 50}, ${v.is_default ? 1 : 0}, ${escapeSql(v.sku_extension || '')});\n`;
    }
  }

  // Specifications
  if (prod.specifications && prod.specifications.length > 0) {
    for (const s of prod.specifications) {
      sql += `INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (${prod.id}, ${escapeSql(s.spec_key)}, ${escapeSql(s.spec_value)});\n`;
    }
  }
}

sql += `\n-- -------------------------------------------------------------------------\n-- Dumping data for: clients\n-- -------------------------------------------------------------------------\n`;
for (const client of initialClients) {
  sql += `INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order) VALUES (${client.id}, ${escapeSql(client.name)}, ${escapeSql(client.category)}, ${escapeSql(client.category_label || '')}, ${escapeSql(client.location || '')}, ${escapeSql(client.project_details || '')}, ${escapeSql(client.established || '')}, ${client.is_featured ? 1 : 0}, ${client.id});\n`;
}

sql += `\n-- -------------------------------------------------------------------------\n-- Dumping data for: settings\n-- -------------------------------------------------------------------------\n`;
sql += `INSERT INTO settings (setting_key, setting_value) VALUES ('general', ${escapeSql(JSON.stringify(defaultSettings))});\n`;

sql += `\n-- -------------------------------------------------------------------------\n-- Dumping data for: testimonials\n-- -------------------------------------------------------------------------\n`;
for (const t of initialTestimonials) {
  sql += `INSERT INTO testimonials (id, client_name, client_designation, organization_name, review_text, rating, is_featured, display_order) VALUES (${t.id}, ${escapeSql(t.client_name)}, ${escapeSql(t.role || t.client_designation || '')}, ${escapeSql(t.organization_name || '')}, ${escapeSql(t.content || t.review_text || '')}, ${t.rating || 5}, ${t.is_featured ? 1 : 0}, ${t.display_order || 0});\n`;
}

sql += `\n-- -------------------------------------------------------------------------\n-- Dumping data for: blogs\n-- -------------------------------------------------------------------------\n`;
for (const b of initialBlogs) {
  sql += `INSERT INTO blogs (id, title, slug, thumbnail_image, video_url, author_name, content, is_published) VALUES (${b.id}, ${escapeSql(b.title)}, ${escapeSql(b.slug)}, ${escapeSql(b.thumbnail_image || '')}, ${escapeSql(b.video_url || null)}, ${escapeSql(b.author_name || 'Shaw Enterprise Design Cell')}, ${escapeSql(b.content || '')}, 1);\n`;
}

sql += `\n-- -------------------------------------------------------------------------\n-- Dumping data for: orders\n-- -------------------------------------------------------------------------\n`;
for (const ord of initialOrders) {
  sql += `INSERT INTO orders (id, customer_name, phone, email, delivery_address, city, items, total_amount, payment_method, payment_status, order_status) VALUES (${escapeSql(ord.id)}, ${escapeSql(ord.customer_name)}, ${escapeSql(ord.phone)}, ${escapeSql(ord.email || '')}, ${escapeSql(ord.delivery_address)}, ${escapeSql(ord.city || 'Kolkata')}, ${escapeSql(JSON.stringify(ord.items || []))}, ${ord.total_amount || 0}, ${escapeSql(ord.payment_method || 'COD')}, ${escapeSql(ord.payment_status || 'Paid')}, ${escapeSql(ord.order_status || 'Processing')});\n`;
}

sql += `\n-- -------------------------------------------------------------------------\n-- Dumping data for: bulk_inquiries\n-- -------------------------------------------------------------------------\n`;
for (const inq of initialInquiries) {
  sql += `INSERT INTO bulk_inquiries (id, client_name, organization_name, email, phone, product_title, variant_details, quantity, delivery_city, message, status) VALUES (${inq.id}, ${escapeSql(inq.client_name)}, ${escapeSql(inq.organization_name || '')}, ${escapeSql(inq.email)}, ${escapeSql(inq.phone)}, ${escapeSql(inq.product_title || '')}, ${escapeSql(inq.variant_details || '')}, ${inq.quantity || 1}, ${escapeSql(inq.delivery_city || 'Kolkata')}, ${escapeSql(inq.message || '')}, ${escapeSql(inq.status || 'Pending')});\n`;
}

sql += `\nSET FOREIGN_KEY_CHECKS = 1;\n`;

const outPath = path.join(__dirname, '..', 'database', 'shaw_enterprise_database.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`🎉 SQL dump generated successfully at: ${outPath} (${(Buffer.byteLength(sql) / 1024).toFixed(1)} KB)`);

