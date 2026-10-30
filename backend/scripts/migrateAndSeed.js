import { pool } from '../config/db.js';
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

// Initial Storefront & Business Settings matching real shawenterprise.in
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
      title: '12+ Years of Manufacturing Excellence at College Street & Balagarh Works',
      p1: 'Founded in 2014 by proprietor Mr. Indrajit Shaw, Shaw Enterprise has established itself as one of West Bengal\'s leading manufacturers, wholesalers, and retailers of writing boards, display bulletin systems, mobile stands, and school accessories.',
      p2: 'Operating our registered office at 44/1B, Beniatola Lane, College Street, and manufacturing workshop at Balagarh Industrial (Suryapur, Navarand, Kolkata – 700121), we supply both individual students and renowned institutions including Presidency University, Calcutta University, St. Xavier\'s, and South Point with precision-engineered products.',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { id: 1, value: '2014', label: 'Year Established', sub: 'College Street, Kolkata' },
        { id: 2, value: '25-Yr', label: 'Surface Warranty', sub: 'On Ceramic Green Boards' },
        { id: 3, value: '50,000+', label: 'Boards Manufactured', sub: 'Delivered Pan-India' },
        { id: 4, value: '100%', label: 'Genuine Virgin Alloy', sub: 'Alloy 6063-T6 Frames' },
      ],
    },
    custom_size_banner: {
      badge: 'Need a Custom Non-Standard Size?',
      title: 'We Custom-Cut & Fabricate Any Board Dimension within 24 Hours',
      description: 'From compact 1.5x1 ft study pads to 12x4 ft continuous auditorium ceramic boards, our College Street facility fabricates to your exact specifications.',
      btn_text: 'Open Custom Size Calculator →',
    },
  },
};

const initialOrders = [
  {
    id: 'ORD-7001',
    customer_name: 'Priya Mukherjee',
    phone: '+91 98302 11223',
    email: 'priya.m@gmail.com',
    delivery_address: 'Flat 4B, 142 Rashbehari Avenue, Gariahat, Kolkata - 700029',
    city: 'Kolkata',
    items: [
      { product_id: 1, title: 'Shaw Premium Magnetic Whiteboard (High-Gloss Dry-Erase)', size_label: '3x2 Feet (Office / Study)', price: 1099, quantity: 2 },
      { product_id: 6, title: 'Shaw Magnetic Whiteboard Duster (Pack of 3)', size_label: 'Pack of 3 Dusters', price: 249, quantity: 1 },
    ],
    total_amount: 2447,
    payment_method: 'UPI Scan & Pay',
    payment_status: 'Paid',
    order_status: 'Processing',
  },
  {
    id: 'ORD-7002',
    customer_name: 'Debasish Banerjee (Principal)',
    phone: '+91 98310 99887',
    email: 'principal@academiacollege.org',
    delivery_address: 'College Campus Building, Sector 3, Salt Lake, Kolkata - 700098',
    city: 'Kolkata',
    items: [
      { product_id: 2, title: 'Shaw Ceramic Magnetic Green Chalkboard', size_label: '4x3 Feet (Standard Classroom)', price: 2799, quantity: 4 },
      { product_id: 4, title: 'Shaw Heavy-Duty Mobile Reversible Revolving Stand', size_label: 'Stand Only', price: 3299, quantity: 2 },
    ],
    total_amount: 17794,
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

async function migrateAndSeed() {
  console.log('🚀 [Migration] Beginning database migration & schema setup...');

  const connection = await pool.getConnection();

  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // 1. Categories
    console.log('📦 Creating table: categories');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
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
    `);

    // 2. Products
    console.log('📦 Creating table: products');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
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
    `);

    // 3. Product Variants
    console.log('📦 Creating table: product_variants');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
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
    `);

    // 4. Product Specifications
    console.log('📦 Creating table: product_specifications');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_specifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        spec_key VARCHAR(255) NOT NULL,
        spec_value TEXT NOT NULL,
        INDEX idx_product_specs (product_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Product Images
    console.log('📦 Creating table: product_images');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        display_order INT DEFAULT 0,
        INDEX idx_product_imgs (product_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Clients
    console.log('📦 Creating table: clients');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS clients (
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
    `);

    // 7. Bulk Inquiries / RFQ
    console.log('📦 Creating table: bulk_inquiries');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bulk_inquiries (
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
    `);

    // 8. Orders
    console.log('📦 Creating table: orders');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
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
    `);

    // 9. Settings
    console.log('📦 Creating table: settings');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 10. Testimonials
    console.log('📦 Creating table: testimonials');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
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
    `);

    // 11. Blogs
    console.log('📦 Creating table: blogs');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blogs (
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
    `);

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('🌱 [Seeding] Populating initial dataset into MySQL...');

    // Seed Categories
    for (const cat of initialCategories) {
      await connection.query(
        `INSERT INTO categories (id, name, slug, description, image, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), image=VALUES(image)`,
        [cat.id, cat.name, cat.slug, cat.description || '', cat.image || '', cat.display_order || 0, cat.is_active !== false]
      );
    }
    console.log(`✅ Seeded ${initialCategories.length} categories.`);

    // Seed Products, Variants, Specs
    for (const prod of initialProducts) {
      await connection.query(
        `INSERT INTO products (id, category_id, title, slug, sku, short_description, full_description, main_image, base_price, mrp, is_featured, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), base_price=VALUES(base_price), main_image=VALUES(main_image)`,
        [
          prod.id,
          prod.category_id,
          prod.title,
          prod.slug,
          prod.sku || `SE-PRD-${prod.id}`,
          prod.short_description || '',
          prod.full_description || '',
          prod.main_image || '',
          prod.base_price || 0,
          prod.mrp || null,
          prod.is_featured ? 1 : 0,
          prod.is_active !== false ? 1 : 0,
        ]
      );

      const [[imageCount]] = await connection.query(
        'SELECT COUNT(*) AS count FROM product_images WHERE product_id = ?',
        [prod.id]
      );
      if (Number(imageCount.count) === 0 && Array.isArray(prod.images)) {
        for (const [displayOrder, imageUrl] of [...new Set([prod.main_image, ...prod.images].filter(Boolean))].entries()) {
          await connection.query(
            'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
            [prod.id, imageUrl, displayOrder]
          );
        }
      }

      // Variants
      if (prod.variants && prod.variants.length > 0) {
        for (const v of prod.variants) {
          await connection.query(
            `INSERT INTO product_variants (id, product_id, size_label, surface_type, price, mrp, stock_quantity, is_default, sku_extension)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE price=VALUES(price), size_label=VALUES(size_label)`,
            [
              v.id || null,
              prod.id,
              v.size_label || 'Standard',
              v.surface_type || '',
              v.price || prod.base_price,
              v.mrp || null,
              v.stock_quantity || 50,
              v.is_default ? 1 : 0,
              v.sku_extension || '',
            ]
          );
        }
      }

      // Specs
      if (prod.specifications && prod.specifications.length > 0) {
        for (const s of prod.specifications) {
          await connection.query(
            `INSERT INTO product_specifications (product_id, spec_key, spec_value)
             VALUES (?, ?, ?)`,
            [prod.id, s.spec_key, s.spec_value]
          );
        }
      }
    }
    console.log(`✅ Seeded ${initialProducts.length} products with variants and specifications.`);

    // Seed Clients
    for (const client of initialClients) {
      await connection.query(
        `INSERT INTO clients (id, name, category, category_label, location, project_details, established, is_featured, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), project_details=VALUES(project_details)`,
        [
          client.id,
          client.name,
          client.category,
          client.category_label || '',
          client.location || '',
          client.project_details || '',
          client.established || '',
          client.is_featured ? 1 : 0,
          client.id,
        ]
      );
    }
    console.log(`✅ Seeded ${initialClients.length} clients.`);

    // Seed Settings
    await connection.query(
      `INSERT INTO settings (setting_key, setting_value)
       VALUES ('general', ?)
       ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)`,
      [JSON.stringify(defaultSettings)]
    );
    console.log('✅ Seeded general settings.');

    // Seed Testimonials
    if (initialTestimonials) {
      for (const t of initialTestimonials) {
        await connection.query(
          `INSERT INTO testimonials (id, client_name, client_designation, organization_name, review_text, rating, is_featured, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE review_text=VALUES(review_text)`,
          [
            t.id,
            t.client_name,
            t.role || t.client_designation || '',
            t.organization_name || '',
            t.content || t.review_text || '',
            t.rating || 5,
            t.is_featured ? 1 : 0,
            t.display_order || 0,
          ]
        );
      }
      console.log(`✅ Seeded ${initialTestimonials.length} testimonials.`);
    }

    // Seed Blogs
    if (initialBlogs) {
      for (const b of initialBlogs) {
        await connection.query(
          `INSERT INTO blogs (id, title, slug, thumbnail_image, video_url, author_name, content, is_published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title)`,
          [
            b.id,
            b.title,
            b.slug,
            b.thumbnail_image || '',
            b.video_url || null,
            b.author_name || 'Shaw Enterprise Design Cell',
            b.content || '',
            1,
          ]
        );
      }
      console.log(`✅ Seeded ${initialBlogs.length} blogs.`);
    }

    // Seed Orders
    if (initialOrders) {
      for (const ord of initialOrders) {
        await connection.query(
          `INSERT INTO orders (id, customer_name, phone, email, delivery_address, city, items, total_amount, payment_method, payment_status, order_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE customer_name=VALUES(customer_name)`,
          [
            ord.id,
            ord.customer_name,
            ord.phone,
            ord.email || '',
            ord.delivery_address,
            ord.city || 'Kolkata',
            JSON.stringify(ord.items || []),
            ord.total_amount || 0,
            ord.payment_method || 'COD',
            ord.payment_status || 'Paid',
            ord.order_status || 'Processing',
          ]
        );
      }
      console.log(`✅ Seeded ${initialOrders.length} initial sample orders.`);
    }

    // Seed Inquiries
    if (initialInquiries) {
      for (const inq of initialInquiries) {
        await connection.query(
          `INSERT INTO bulk_inquiries (id, client_name, organization_name, email, phone, product_title, variant_details, quantity, delivery_city, message, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE client_name=VALUES(client_name)`,
          [
            inq.id,
            inq.client_name,
            inq.organization_name || '',
            inq.email,
            inq.phone,
            inq.product_title || '',
            inq.variant_details || '',
            inq.quantity || 1,
            inq.delivery_city || 'Kolkata',
            inq.message || '',
            inq.status || 'Pending',
          ]
        );
      }
      console.log(`✅ Seeded ${initialInquiries.length} initial inquiries.`);
    }

    console.log('✨ [Migration & Seeding] Completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    connection.release();
  }
}

migrateAndSeed()
  .then(() => {
    console.log('🎉 Database is ready for production & local development.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database migration script failed:', err);
    process.exit(1);
  });
