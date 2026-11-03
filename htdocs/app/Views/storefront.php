<?php $isAdminPage = in_array($pageType, ['admin', 'admin-login'], true); ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#0f172a">
    <meta name="description" content="Shaw Enterprise — manufacturer and wholesaler of writing boards, display systems, educational accessories and office furniture in Kolkata.">
    <title><?= $title ?> | Shaw Enterprise</title>
    <link rel="icon" data-favicon>
    <link rel="stylesheet" href="<?= $cssPath ?>">
    <script defer src="<?= $jsPath ?>?v=<?= filemtime(__DIR__ . '/../../assets/js/app.js') ?>"></script>
</head>
<body>
    <?php if (!$isAdminPage): ?>
        <div class="announcement" data-announcement>
            <div class="announcement-inner">
                <span data-announcement-tagline>Low Price | Best Quality | Premium Product</span>
                <div class="announcement-contact">
                    <a data-announcement-phone href="tel:+919933944007">09933944007</a>
                    <a data-announcement-phone-secondary href="tel:+917003779114">07003779114</a>
                    <a data-announcement-email href="mailto:shaw.entt.edu@gmail.com">shaw.entt.edu@gmail.com</a>
                </div>
            </div>
        </div>
        <header class="site-header">
            <a class="brand" href="/" aria-label="Shaw Enterprise home">
                <span class="brand-mark">SE</span>
            </a>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-label="Toggle navigation" data-menu-toggle>☰</button>
            <nav class="main-nav" data-main-nav>
                <a href="/">Home</a>
                <div class="nav-products" data-nav-products>
                    <a class="nav-products-trigger" href="/products" aria-haspopup="true" aria-expanded="false" aria-controls="products-mega-menu">Products <span aria-hidden="true">⌄</span></a>
                    <div class="products-mega-menu" id="products-mega-menu" data-products-mega-menu hidden></div>
                </div>
                <a href="/about">About</a>
                <a href="/clients">Our Clients</a><a href="/blogs">Blog</a><a href="/contact">Contact</a>
            </nav>
            <div class="header-actions">
                <button type="button" class="button button-small button-primary" data-open-quote>Get a Quote</button>
            </div>
        </header>
    <?php endif; ?>

    <main id="app-content" class="page-content" data-page="<?= htmlspecialchars($pageType, ENT_QUOTES, 'UTF-8') ?>" data-slug="<?= $encodedSlug ?>">
        <div class="loading-state"><span class="spinner"></span><span>Loading Shaw Enterprise…</span></div>
    </main>

    <?php if (!$isAdminPage): ?>
        <footer class="site-footer">
            <div class="footer-grid">
                <div><a class="brand brand-footer" href="/" aria-label="Shaw Enterprise home"><span class="brand-mark">SE</span></a><p>Quality writing boards, display systems and educational equipment, made in Kolkata.</p><div class="footer-social-links" data-footer-social-links aria-label="Social media"></div></div>
                <div><h3>Explore</h3><a href="/products">Products</a><a href="/about">About us</a><a href="/clients">Our clients</a><a href="/blogs">Blog & guides</a><a href="/contact">Contact</a><button type="button" class="footer-action" data-open-custom>Custom size request</button><button type="button" class="footer-action" data-open-brochure>Download catalogue</button></div>
                <div class="footer-contact"><h3>Contact us</h3><strong data-site-name>Shaw Enterprise</strong><p>30, Beniatola Lane (College Street), Kolkata – 700009, West Bengal, India</p><p><strong>Mr Indrajit Shaw</strong><br><span>Proprietor</span></p><p><strong>Phone:</strong><br><a href="tel:+919933944007">09933944007</a><br><a href="tel:+917003779114">07003779114</a></p><p><strong>Email:</strong><br><a href="mailto:shaw.entt.edu@gmail.com">shaw.entt.edu@gmail.com</a></p></div>
            </div>
            <div class="footer-bottom"><span>© <span data-year></span> Shaw Enterprise. All rights reserved. | Developed by <a href="https://preconetindia.com/" target="_blank" rel="noopener noreferrer">Preconet Global Solutions Pvt Ltd</a></span><a href="/admin/login">Admin</a></div>
        </footer>
        <a class="floating-whatsapp" data-floating-whatsapp href="https://wa.me/919933944007" target="_blank" rel="noopener noreferrer" aria-label="Need help? Chat with Shaw Enterprise on WhatsApp" title="Chat with us on WhatsApp">
            <span class="floating-whatsapp-label">Need Help? Chat with us</span>
            <span class="floating-whatsapp-icon"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3C8.87 3 3.04 8.82 3.04 15.98c0 2.29.6 4.52 1.74 6.5L3 29l6.7-1.75a13 13 0 0 0 6.33 1.62h.01c7.16 0 12.99-5.82 13-12.98A12.91 12.91 0 0 0 25.24 6.7 12.9 12.9 0 0 0 16.04 3Zm0 23.67h-.01a10.76 10.76 0 0 1-5.48-1.5l-.39-.23-3.98 1.04 1.06-3.88-.25-.4a10.75 10.75 0 0 1-1.65-5.72c0-5.92 4.82-10.74 10.76-10.74 2.87 0 5.57 1.12 7.6 3.15a10.67 10.67 0 0 1 3.14 7.6c0 5.92-4.82 10.74-10.8 10.74Zm5.9-8.04c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.51-.16-.73.16-.21.32-.84 1.05-1.03 1.27-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.58-.95-.84-1.59-1.88-1.78-2.2-.19-.31-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.87.4-.3.32-1.14 1.1-1.14 2.68s1.17 3.1 1.33 3.31c.16.21 2.3 3.52 5.58 4.93.78.34 1.39.55 1.86.7.78.25 1.49.22 2.05.13.63-.1 1.9-.78 2.17-1.54.27-.75.27-1.4.19-1.53-.08-.13-.3-.21-.62-.37Z"/></svg></span>
        </a>
    <?php endif; ?>

    <div class="toast-region" aria-live="polite" data-toast-region></div>

    <dialog class="site-dialog" data-dialog="quote">
        <button class="dialog-close" type="button" data-close-dialog aria-label="Close">×</button>
        <h2>Request a bulk quote</h2><p>Tell us what you need and our team will get back to you.</p>
        <form data-inquiry-form>
            <label>Your name *<input name="client_name" required autocomplete="name"></label>
            <label>School / company<input name="organization_name" autocomplete="organization"></label>
            <div class="form-row"><label>Phone *<input name="phone" required autocomplete="tel"></label><label>Email<input name="email" type="email" autocomplete="email"></label></div>
            <label>Estimated quantity<input name="quantity" type="number" min="1" value="25"></label>
            <label>Products / requirements *<textarea name="message" rows="4" required></textarea></label>
            <input type="hidden" name="product_title" value="Bulk quote request">
            <input type="hidden" name="variant_details" value="Standard">
            <button class="button button-primary" type="submit">Send enquiry</button>
        </form>
    </dialog>
    <dialog class="site-dialog" data-dialog="custom">
        <button class="dialog-close" type="button" data-close-dialog aria-label="Close">×</button>
        <h2>Custom size request</h2><p>Share your board dimensions and our team will prepare a quote.</p>
        <form data-inquiry-form>
            <label>Your name *<input name="client_name" required></label>
            <div class="form-row"><label>Phone *<input name="phone" required></label><label>Email<input name="email" type="email"></label></div>
            <label>Board surface<select name="board_type" data-custom-board><option value="Magnetic Whiteboard">Magnetic Whiteboard</option><option value="Non-Magnetic Whiteboard">Non-Magnetic Whiteboard</option><option value="Black Chalk Writing Board">Black Chalk Writing Board</option><option value="Ceramic Green Chalkboard">Ceramic Green Chalkboard</option><option value="Glass White Writing Board">Glass White Writing Board</option><option value="White / Green Graph Board">White / Green Graph Board</option><option value="Felt Pin-Up Notice Board">Felt Pin-Up Notice Board</option><option value="Cork Notice Board">Cork Notice Board</option><option value="Grooved Board with Letters">Grooved Board with Letters</option><option value="Acrylic Sliding Glass Notice Board">Acrylic Sliding Glass Notice Board</option></select></label>
            <div class="form-row"><label>Width (ft)<input name="width" type="number" min="1" max="20" step="0.5" value="5" data-custom-dimension required></label><label>Height (ft)<input name="height" type="number" min="1" max="6" step="0.5" value="3.5" data-custom-dimension required></label></div>
            <div class="notice">Area: <strong data-custom-area>17.5</strong> sq. ft</div>
            <label>Delivery city<input name="delivery_city" value="Kolkata"></label>
            <label>Notes<textarea name="message" rows="3"></textarea></label>
            <input type="hidden" name="product_title" value="Custom Magnetic Whiteboard">
            <button class="button button-primary" type="submit">Request a quote</button>
        </form>
    </dialog>
    <dialog class="site-dialog" data-dialog="brochure">
        <button class="dialog-close" type="button" data-close-dialog aria-label="Close">×</button>
        <h2>Product catalogue</h2><p>Browse our current product range and contact us for pricing.</p>
        <div data-brochure-content><p>Loading catalogue…</p></div>
    </dialog>
    <dialog class="site-dialog product-image-dialog" data-dialog="product-image" aria-label="Product image preview">
        <button class="dialog-close" type="button" data-close-dialog aria-label="Close image preview">×</button>
        <img data-product-image-preview alt="">
    </dialog>
    <dialog class="site-dialog" data-dialog="admin-edit">
        <button class="dialog-close" type="button" data-close-dialog aria-label="Close">×</button>
        <h2 data-admin-editor-title>Add record</h2>
        <form class="form-stack" data-admin-editor></form>
    </dialog>
    <dialog class="site-dialog gallery-dialog" data-dialog="gallery">
        <button class="dialog-close" type="button" data-close-dialog aria-label="Close">×</button>
        <img data-gallery-preview alt="">
        <p class="eyebrow" data-gallery-category></p>
        <h2 data-gallery-title></h2>
        <p data-gallery-description></p>
        <p class="notice" data-gallery-specs></p>
        <div class="hero-actions"><a class="button button-dark" data-gallery-whatsapp href="#" target="_blank" rel="noreferrer">Enquire on WhatsApp</a><button type="button" class="button button-primary" data-gallery-quote>Get a Quote</button></div>
    </dialog>
</body>
</html>
