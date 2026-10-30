<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Category;
use App\Models\CompletedProject;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use App\Models\ProductVariant;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Categories
        $catBoards = Category::create([
            'name' => 'Ceramic Writing Boards',
            'slug' => 'ceramic-writing-boards',
            'description' => 'Ultra-durable, scratch-proof ceramic steel surfaces engineered for continuous university and school classroom usage.',
            'display_order' => 1,
            'is_active' => true,
        ]);

        $catNotice = Category::create([
            'name' => 'Notice & Pin-Up Boards',
            'slug' => 'notice-and-pin-up-boards',
            'description' => 'Acoustic felt, natural cork, and covered velvet display boards with heavy aluminium trims for administrative corridors.',
            'display_order' => 2,
            'is_active' => true,
        ]);

        $catFurniture = Category::create([
            'name' => 'Classroom Desks & Furniture',
            'slug' => 'classroom-desks-and-furniture',
            'description' => 'Ergonomic dual benches, teacher podiums, and laboratory benches crafted from heavy-gauge ERW steel pipe.',
            'display_order' => 3,
            'is_active' => true,
        ]);

        $catStands = Category::create([
            'name' => 'Mobile Display Stands & Easels',
            'slug' => 'mobile-display-stands-and-easels',
            'description' => 'Reversible revolving stands with lockable castors for training seminars, boardrooms, and lecture halls.',
            'display_order' => 4,
            'is_active' => true,
        ]);

        // 2. Product: Ceramic Magnetic Green Chalkboard
        $prodChalk = Product::create([
            'category_id' => $catBoards->id,
            'title' => 'Ceramic Magnetic Green Chalkboard (Heavy-Duty Frame)',
            'slug' => 'ceramic-magnetic-green-chalkboard-heavy-duty-frame',
            'sku' => 'SE-CGB-01',
            'short_description' => 'Zero-glare vitreous enameled ceramic steel surface with 25-year stain-proof guarantee. Built with rigid 6063-T6 virgin aluminium extrusion frame.',
            'full_description' => '<p>Engineered explicitly for academic high-stress environments. The vitreous ceramic steel chalk surface offers silky-smooth chalk adhesion with zero dust scattering and effortless erasure without ghosting.</p><h3>Key Advantages:</h3><ul><li>Magnetic receptive for charts, diagrams, and accessories</li><li>Extreme hardness: Scratch-proof against compasses, cutters, and daily abrasive chalk</li><li>Rigid 6063-T6 alloy frame with rounded ABS corners for student safety</li><li>Full-length heavy-gauge aluminum chalk tray included</li></ul>',
            'main_image' => 'products/main/green-chalkboard.jpg',
            'base_price' => 3200.00,
            'is_featured' => true,
            'is_active' => true,
            'meta_title' => 'Ceramic Magnetic Green Chalkboard Kolkata Manufacturer | Shaw Enterprise',
            'meta_description' => 'Direct factory pricing on ceramic magnetic green chalkboards in Kolkata. Custom sizes, anodized aluminium frames, and wholesale tenders.',
        ]);

        // Variants for Green Chalkboard
        ProductVariant::create([
            'product_id' => $prodChalk->id,
            'size_label' => '4x3 Feet',
            'surface_type' => 'Ceramic Steel Green',
            'sku_extension' => '-4X3',
            'price' => 3200.00,
            'stock_quantity' => 150,
            'is_default' => true,
        ]);
        ProductVariant::create([
            'product_id' => $prodChalk->id,
            'size_label' => '6x4 Feet',
            'surface_type' => 'Ceramic Steel Green',
            'sku_extension' => '-6X4',
            'price' => 5800.00,
            'stock_quantity' => 120,
            'is_default' => false,
        ]);
        ProductVariant::create([
            'product_id' => $prodChalk->id,
            'size_label' => '8x4 Feet (Standard Classroom)',
            'surface_type' => 'Ceramic Steel Green',
            'sku_extension' => '-8X4',
            'price' => 7600.00,
            'stock_quantity' => 85,
            'is_default' => false,
        ]);

        // Specifications
        ProductSpecification::create(['product_id' => $prodChalk->id, 'spec_key' => 'Surface Material', 'spec_value' => 'e3 Vitreous Ceramic Steel']);
        ProductSpecification::create(['product_id' => $prodChalk->id, 'spec_key' => 'Frame Material', 'spec_value' => 'Satin Finish Anodized 6063-T6 Aluminium']);
        ProductSpecification::create(['product_id' => $prodChalk->id, 'spec_key' => 'Core Substrate', 'spec_value' => '9mm High Density Water-Resistant Particle Board']);
        ProductSpecification::create(['product_id' => $prodChalk->id, 'spec_key' => 'Backing Sheet', 'spec_value' => '0.25mm Galvanized Weather-Seal Sheet (Anti-Warpage)']);
        ProductSpecification::create(['product_id' => $prodChalk->id, 'spec_key' => 'Warranty', 'spec_value' => '25-Year Surface Durability Warranty']);

        // 3. Product: Magnetic White Marker Board
        $prodWhite = Product::create([
            'category_id' => $catBoards->id,
            'title' => 'Institutional Magnetic Dry-Erase Whiteboard',
            'slug' => 'institutional-magnetic-dry-erase-whiteboard',
            'sku' => 'SE-MWB-02',
            'short_description' => 'High-contrast polymer-coated magnetic dry-erase surface. Completely ghost-free and dry wipes cleanly without marker residue.',
            'full_description' => '<p>Crafted for modern corporate conference rooms and university lecture halls. Built with heavy-duty extrusion profiles and concealed wall mount brackets.</p>',
            'main_image' => 'products/main/whiteboard.jpg',
            'base_price' => 2800.00,
            'is_featured' => true,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $prodWhite->id,
            'size_label' => '4x3 Feet',
            'surface_type' => 'Magnetic Polymer White',
            'sku_extension' => '-4X3',
            'price' => 2800.00,
            'stock_quantity' => 200,
            'is_default' => true,
        ]);
        ProductVariant::create([
            'product_id' => $prodWhite->id,
            'size_label' => '6x4 Feet',
            'surface_type' => 'Magnetic Polymer White',
            'sku_extension' => '-6X4',
            'price' => 5200.00,
            'stock_quantity' => 100,
            'is_default' => false,
        ]);

        ProductSpecification::create(['product_id' => $prodWhite->id, 'spec_key' => 'Erasability', 'spec_value' => '100% Dry Wipe Clean with Zero Ghosting']);
        ProductSpecification::create(['product_id' => $prodWhite->id, 'spec_key' => 'Corner Caps', 'spec_value' => 'Precision Molded Virgin ABS Safety Corners']);

        // 4. Testimonials (Dynamic Real Kolkata Feedback)
        Testimonial::create([
            'client_name' => 'Prof. Anirban Roy Chowdhury',
            'client_designation' => 'Dean of Academic Infrastructure',
            'organization_name' => 'St. Xavier\'s Collegiate School, Kolkata',
            'review_text' => 'We procured 65 units of Shaw Enterprise 8x4 feet ceramic green chalkboards for our senior school wing. The chalk glide is immaculate with zero glare from windows, and the aluminum frame rigidity is noticeably superior to off-the-shelf market brands.',
            'rating' => 5,
            'is_featured' => true,
            'display_order' => 1,
        ]);

        Testimonial::create([
            'client_name' => 'Debabrata Mukherjee',
            'client_designation' => 'General Manager - Procurement',
            'organization_name' => 'Techno India University Campus, Salt Lake',
            'review_text' => 'Shaw Enterprise supplied over 120 magnetic whiteboards and mobile reversible stands during our campus expansion. Flawless on-time dispatch and impeccable packaging in heavy wooden battens.',
            'rating' => 5,
            'is_featured' => true,
            'display_order' => 2,
        ]);

        Testimonial::create([
            'client_name' => 'Mrs. Swati Banerjee',
            'client_designation' => 'Principal',
            'organization_name' => 'Heritage Academy, Anandapur',
            'review_text' => 'Their dual desks and pinup notice boards have survived three academic sessions of heavy student use without a single loose bolt or corner crack. Genuine factory wholesale pricing for Kolkata schools.',
            'rating' => 5,
            'is_featured' => true,
            'display_order' => 3,
        ]);

        // 5. Completed Projects
        CompletedProject::create([
            'title' => '90 Ceramic Chalkboards & Smart Board Enclosures',
            'client_name' => 'Heritage Institute of Technology, Kolkata',
            'image_path' => 'completed-projects/heritage.jpg',
            'description' => 'Complete institutional fit-out across 3 new engineering departmental blocks within 12 working days.',
            'display_order' => 1,
        ]);

        CompletedProject::create([
            'title' => '300 Heavy-Duty Dual Benches & Teacher Podiums',
            'client_name' => 'South Point High School New Campus, Mukundapur',
            'image_path' => 'completed-projects/southpoint.jpg',
            'description' => 'Manufactured with 25mm round ERW steel pipes with 7-tank powder coating process.',
            'display_order' => 2,
        ]);

        CompletedProject::create([
            'title' => 'Corporate Boardroom Glassboards & Notice Systems',
            'client_name' => 'Wipro Technologies SEZ, Sector V, Salt Lake',
            'image_path' => 'completed-projects/wipro.jpg',
            'description' => 'Frameless magnetic tempered glass marker boards installed in 18 conference rooms.',
            'display_order' => 3,
        ]);

        // 6. Blogs & Vlogs
        Blog::create([
            'title' => 'Ceramic Steel vs Melamine Whiteboards: A 10-Year Cost & Durability Comparison for Schools',
            'slug' => 'ceramic-steel-vs-melamine-whiteboards-durability-comparison',
            'thumbnail_image' => 'blogs/ceramic-vs-melamine.jpg',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'author_name' => 'S. K. Shaw (Chief Works Engineer)',
            'published_at' => now()->subDays(5),
            'is_published' => true,
            'meta_title' => 'Ceramic vs Melamine Boards | Shaw Enterprise Engineering Guide',
            'meta_description' => 'Discover why institutions save 60% over 10 years by choosing vitreous ceramic steel boards instead of cheap painted melamine surfaces.',
            'content' => '<p>When educational institutions in Kolkata plan their annual procurement, the choice of classroom writing surfaces is often treated as an afterthought. However, selecting painted resin-coated melamine over vitreous ceramic steel frequently leads to marker staining, ghosting, and premature board replacement within 18 months.</p><h3>The Science of Vitreous Enamel Ceramic Steel</h3><p>Unlike painted boards that absorb marker solvents, ceramic steel surfaces are fired at temperatures exceeding 800°C. The porcelain glass fuses directly onto heavy-gauge steel, creating a non-porous, stain-impervious surface that resists scratches, graffiti, and daily chemical cleaning.</p><h3>Key Procurement Takeaways:</h3><ul><li>Ceramic steel boards have a service life exceeding 25 years in daily classroom conditions.</li><li>Aluminium extrusion gauge matters: insist on virgin 6063-T6 alloy frames to prevent warping during humid monsoon seasons.</li><li>Zero chemical ghosts: even permanent marker ink can be removed with standard rubbing alcohol without damaging the surface.</li></ul>',
        ]);

        Blog::create([
            'title' => 'Classroom Ergonomics: Selecting the Right Student Dual Desk Dimensions by Age Group',
            'slug' => 'classroom-ergonomics-selecting-student-dual-desk-dimensions',
            'thumbnail_image' => 'blogs/classroom-desks.jpg',
            'video_url' => null,
            'author_name' => 'Shaw Enterprise Design Cell',
            'published_at' => now()->subDays(12),
            'is_published' => true,
            'content' => '<p>Student posture directly impacts concentration and classroom discipline. At Shaw Enterprise, all classroom desks are engineered according to Bureau of Indian Standards (BIS) ergonomic height specifications, ensuring healthy spine alignment for primary, middle, and senior school students.</p>',
        ]);
    }
}

