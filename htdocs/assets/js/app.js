(() => {
  'use strict';

  const root = document.querySelector('#app-content');
  if (!root) return;

  const API = '/api';
  const state = {
    settings: {},
    categories: [],
    products: [],
    blogs: [],
    clients: [],
    testimonials: [],
    selectedProduct: null,
    selectedVariant: null,
    adminTab: 'overview',
    adminLoadSequence: 0,
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
  }

  function isChecked(value) {
    return value === true || value === 1 || value === '1';
  }

  function safeRichText(value) {
    const parsed = new DOMParser().parseFromString(String(value || ''), 'text/html');
    const allowed = new Set(['P', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'STRONG', 'EM', 'B', 'I', 'BR', 'BLOCKQUOTE', 'A']);
    parsed.body.querySelectorAll('*').forEach((element) => {
      if (!allowed.has(element.tagName)) {
        element.replaceWith(...element.childNodes);
        return;
      }
      const href = element.tagName === 'A' ? element.getAttribute('href') : null;
      [...element.attributes].forEach((attribute) => element.removeAttribute(attribute.name));
      if (href && /^(https?:|mailto:)/i.test(href)) {
        element.setAttribute('href', href);
        element.setAttribute('rel', 'noreferrer');
      }
    });
    return parsed.body.innerHTML;
  }

  function imageUrl(url, fallback = '') {
    if (!url) return fallback || '/uploads/categories/writing-boards.jpg';
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url;
    return url.startsWith('/') ? url : `/uploads/${url.replace(/^uploads\//, '')}`;
  }

  function toast(message, error = false) {
    const region = document.querySelector('[data-toast-region]');
    const item = document.createElement('div');
    item.className = `toast${error ? ' error' : ''}`;
    item.textContent = message;
    region.append(item);
    window.setTimeout(() => item.remove(), 4200);
  }

  function money(value) {
    return `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  }

  function productPricingMarkup(product, variant = null, selected = false) {
    const showPrice = isChecked(product.show_price);
    const showMrp = isChecked(product.show_mrp);
    if (!showPrice && !showMrp) return '';
    const price = variant?.price ?? product.base_price;
    const mrp = variant?.mrp ?? product.mrp;
    const hasPrice = showPrice && price != null;
    return `<div class="product-pricing">${hasPrice ? `<span class="price"${selected ? ' data-selected-price' : ''}>${money(price)}</span>` : ''}${showMrp && mrp != null ? `<span class="${hasPrice ? 'old-price' : 'mrp-price'}"${selected ? ' data-selected-mrp' : ''}>MRP ${money(mrp)}</span>` : ''}</div>`;
  }

  async function request(endpoint, options = {}) {
    const headers = { Accept: 'application/json', ...(options.headers || {}) };
    const init = { ...options, headers };
    if (init.body && !(init.body instanceof FormData) && typeof init.body !== 'string') {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(init.body);
    }
    const response = await fetch(`${API}${endpoint}`, init);
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.success === false) {
      throw new Error(data?.message || `Request failed (${response.status})`);
    }
    return data;
  }

  function productCard(product) {
    const productImage = product.main_image || product.images?.[0];
    const imageMarkup = productImage
      ? `<img loading="lazy" src="${escapeHtml(imageUrl(productImage))}" alt="${escapeHtml(product.title)}">`
      : '<span class="product-image-empty">Image coming soon</span>';
    return `<article class="card product-card">
      <a class="card-image product-card-image" href="/products/${encodeURIComponent(product.slug || product.id)}">${imageMarkup}<span class="card-image-badge">Explore range <span aria-hidden="true">↗</span></span></a>
      <div class="card-body product-card-body"><span class="card-kicker">${escapeHtml(product.category_name || 'Shaw Enterprise')}</span><a class="card-title" href="/products/${encodeURIComponent(product.slug || product.id)}">${escapeHtml(product.title)}</a>
        <p>${escapeHtml(product.short_description || '')}</p>
        ${productPricingMarkup(product, product.variants?.[0] || null)}
        <div class="card-actions"><a class="button button-outline" href="/products/${encodeURIComponent(product.slug || product.id)}">View details <span aria-hidden="true">→</span></a></div>
      </div>
    </article>`;
  }

  function blogCard(blog) {
    return `<article class="card"><a class="card-image" href="/blogs/${encodeURIComponent(blog.slug || blog.id)}"><img loading="lazy" src="${escapeHtml(imageUrl(blog.thumbnail_image))}" alt="${escapeHtml(blog.title)}"></a><div class="card-body"><p>${escapeHtml(blog.author_name || 'Shaw Enterprise')} · ${escapeHtml(blog.created_at || '')}</p><a class="card-title" href="/blogs/${encodeURIComponent(blog.slug || blog.id)}">${escapeHtml(blog.title)}</a><p>${escapeHtml((blog.meta_description || blog.content || '').replace(/<[^>]*>/g, '').slice(0, 130))}</p><a class="button button-outline" href="/blogs/${encodeURIComponent(blog.slug || blog.id)}">Read article</a></div></article>`;
  }

  function pageBanner(title, copy = '') {
    return `<section class="page-banner"><div class="container"><div class="breadcrumbs"><a href="/">Home</a> / ${escapeHtml(title)}</div><h1>${escapeHtml(title)}</h1>${copy ? `<p class="lead">${escapeHtml(copy)}</p>` : ''}</div></section>`;
  }

  function setContent(html) {
    root.innerHTML = html;
  }

  function renderProductsMenuProducts(category) {
    const preview = document.querySelector('[data-products-menu-preview]');
    if (!preview) return;
    const products = state.products
      .filter((product) => String(product.category_id) === String(category.id) || product.category_slug === category.slug)
      .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || Number(a.id) - Number(b.id));
    preview.innerHTML = `<div class="products-menu-preview-heading"><div><span class="eyebrow">Category products</span><h3>${escapeHtml(category.name)}</h3></div><a href="/products?category=${encodeURIComponent(category.slug)}">View category <span aria-hidden="true">→</span></a></div>
      ${products.length ? `<ol class="products-menu-product-list">${products.map((product, index) => `<li><a href="/products/${encodeURIComponent(product.slug || product.id)}"><span class="products-menu-serial">${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(product.title)}</span><span aria-hidden="true">↗</span></a></li>`).join('')}</ol>` : '<p class="products-menu-empty">No products in this category yet.</p>'}`;
  }

  function renderProductsMenu() {
    const menu = document.querySelector('[data-products-mega-menu]');
    const navProducts = document.querySelector('[data-nav-products]');
    if (!menu || !navProducts || !state.categories.length) return;
    const categories = [...state.categories].sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0) || Number(a.id) - Number(b.id));
    menu.innerHTML = `<div class="products-menu-categories" aria-label="Product categories">${categories.map((category, index) => `<a class="products-menu-category${index === 0 ? ' active' : ''}" href="/products?category=${encodeURIComponent(category.slug)}" data-menu-category="${escapeHtml(category.id)}" ${index === 0 ? 'aria-current="true"' : ''}><span class="products-menu-serial">${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(category.name)}</span><span aria-hidden="true">›</span></a>`).join('')}</div><div class="products-menu-preview" data-products-menu-preview></div>`;
    renderProductsMenuProducts(categories[0]);
    const selectCategory = (event) => {
      const link = event.target.closest('[data-menu-category]');
      if (!link || !menu.contains(link)) return;
      if (event.type === 'pointerover' && link.contains(event.relatedTarget)) return;
      const category = categories.find((item) => String(item.id) === link.dataset.menuCategory);
      if (!category) return;
      menu.querySelectorAll('[data-menu-category]').forEach((item) => {
        const active = item === link;
        item.classList.toggle('active', active);
        if (active) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
      renderProductsMenuProducts(category);
    };
    menu.addEventListener('pointerover', selectCategory);
    menu.addEventListener('focusin', selectCategory);
  }

  async function loadSharedData() {
    const results = await Promise.allSettled([
      request('/settings'), request('/categories'), request('/products?limit=100'),
      request('/blogs'), request('/clients'), request('/testimonials'),
    ]);
    const read = (index, key) => {
      const result = results[index];
      if (result.status !== 'fulfilled') {
        console.warn(`Could not load ${key}:`, result.reason);
        return key === 'settings' ? {} : [];
      }
      const payload = result.value;
      return payload?.data ?? payload;
    };
    state.settings = read(0, 'settings') || {};
    state.categories = read(1, 'categories') || [];
    state.products = read(2, 'products') || [];
    state.blogs = read(3, 'blogs') || [];
    state.clients = read(4, 'clients') || [];
    state.testimonials = read(5, 'testimonials') || [];
    applySettings();
  }

  function applySettings() {
    const settings = state.settings;
    const whatsappLink = document.querySelector('[data-floating-whatsapp]');
    if (whatsappLink) {
      const whatsappNumber = String(settings.whatsapp || settings.phone || '').replace(/\D/g, '');
      whatsappLink.hidden = whatsappNumber.length < 8;
      if (whatsappNumber.length >= 8) whatsappLink.href = `https://wa.me/${whatsappNumber}`;
    }
    document.querySelectorAll('[data-site-name]').forEach((el) => { el.textContent = settings.site_name || 'Shaw Enterprise'; });
    document.querySelectorAll('.brand-mark').forEach((el) => {
      const logoUrl = settings.logo_url || settings.site_logo;
      el.classList.toggle('has-logo', Boolean(logoUrl));
      el.innerHTML = logoUrl
        ? `<img src="${escapeHtml(imageUrl(logoUrl))}" alt="" style="width:100%;height:100%;object-fit:contain">`
        : 'SE';
    });
    document.querySelectorAll('[data-announcement]').forEach((el) => {
      const tagline = el.querySelector('[data-announcement-tagline]');
      const announcement = settings.announcement_text || tagline?.textContent || '';
      if (tagline) {
        tagline.textContent = /free delivery|orders above|free shipping|direct factory pricing|gst invoices|pan-india dispatch/i.test(announcement)
          ? 'Low Price | Best Quality | Premium Product'
          : announcement;
      }
      const phone = String(settings.phone || '+91 9933944007').trim();
      const secondaryPhone = String(settings.phone_secondary || '+91 7003779114').trim();
      const email = String(settings.email || 'shaw.entt.edu@gmail.com').trim();
      const phoneLink = el.querySelector('[data-announcement-phone]');
      const secondaryPhoneLink = el.querySelector('[data-announcement-phone-secondary]');
      const emailLink = el.querySelector('[data-announcement-email]');
      if (phoneLink) {
        phoneLink.textContent = phone;
        phoneLink.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
      }
      if (secondaryPhoneLink) {
        secondaryPhoneLink.textContent = secondaryPhone;
        secondaryPhoneLink.href = `tel:${secondaryPhone.replace(/[^\d+]/g, '')}`;
        secondaryPhoneLink.hidden = !secondaryPhone;
      }
      if (emailLink) {
        emailLink.textContent = email;
        emailLink.href = `mailto:${email}`;
      }
    });
    const favicon = document.querySelector('[data-favicon]');
    if (favicon) {
      const faviconUrl = settings.favicon_url;
      if (faviconUrl) {
        const path = String(faviconUrl).split(/[?#]/, 1)[0].toLowerCase();
        favicon.type = path.endsWith('.ico') ? 'image/x-icon'
          : path.endsWith('.svg') ? 'image/svg+xml'
          : path.endsWith('.jpg') || path.endsWith('.jpeg') ? 'image/jpeg'
          : 'image/png';
        favicon.href = imageUrl(faviconUrl);
      } else {
        favicon.removeAttribute('href');
        favicon.removeAttribute('type');
      }
    }
    renderFooterSocials(settings.social_links || {});
  }

  function renderFooterSocials(socialLinks) {
    const icons = {
      facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z"/></svg>',
      instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="social-icon-dot" cx="17.6" cy="6.8" r="1"/></svg>',
      twitter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 5.9a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.7 1 4.1 4.1 0 0 0-7 3.8 11.7 11.7 0 0 1-8.5-4.3 4.1 4.1 0 0 0 1.3 5.5 4 4 0 0 1-1.9-.5v.1a4.1 4.1 0 0 0 3.3 4 4 4 0 0 1-1.8.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.6a11.7 11.7 0 0 0 17.9-9.9v-.5A8.4 8.4 0 0 0 22 5.9Z"/></svg>',
    };
    const socials = document.querySelector('[data-footer-social-links]');
    if (!socials) return;
    socials.innerHTML = Object.entries(icons).map(([name, icon]) => {
      const url = String(socialLinks[name] || '').trim();
      let safeUrl = '';
      try {
        const parsed = new URL(url);
        if (['http:', 'https:'].includes(parsed.protocol)) safeUrl = parsed.href;
      } catch {
        safeUrl = '';
      }
      const contents = `${icon}<span class="visually-hidden">${name}</span>`;
      return safeUrl
        ? `<a class="footer-social-link" href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${name}">${contents}</a>`
        : `<span class="footer-social-link unavailable" aria-label="${name} profile not configured" title="${name} profile not configured">${contents}</span>`;
    }).join('');
  }

  function renderHome() {
    const settings = state.settings;
    const categories = state.categories.slice(0, 8);
    const featured = state.products.filter((item) => item.is_featured).slice(0, 8);
    const configuredHeroProducts = Array.isArray(settings.sections?.hero_products)
      ? settings.sections.hero_products.map((id) => state.products.find((product) => String(product.id) === String(id))).filter(Boolean)
      : [];
    const heroSlides = (configuredHeroProducts.length ? configuredHeroProducts : featured.length ? featured : state.products).slice(0, 5);
    const heroSlidesMarkup = heroSlides.map((slide, index) => {
      const image = slide.main_image || slide.images?.[0] || settings.hero_banner_url;
      const media = image
        ? `<img class="hero-product-image" src="${escapeHtml(imageUrl(image))}" alt="${escapeHtml(slide.title)}">`
        : '<div class="hero-product-image-empty">Image coming soon</div>';
      return `<article class="hero-slide${index === 0 ? ' active' : ''}" data-hero-slide-panel="${index}" aria-hidden="${index === 0 ? 'false' : 'true'}">
        <div class="container hero-slide-layout">
          <div class="hero-copy"><h1>${escapeHtml(slide.title)}</h1><a class="button button-primary" href="/products/${encodeURIComponent(slide.slug || slide.id)}">Explore product <span aria-hidden="true">→</span></a></div>
          <div class="hero-media">${media}</div>
        </div>
      </article>`;
    }).join('');
    setContent(`<section class="hero"><div class="hero-carousel" data-hero-carousel aria-label="Featured products" aria-roledescription="carousel">
      <div class="hero-slides">${heroSlidesMarkup}</div>
      <div class="container hero-carousel-controls"><button class="hero-arrow" type="button" data-hero-previous aria-label="Previous product">‹</button><div class="hero-dots">${heroSlides.map((slide, index) => `<button type="button" class="hero-dot${index === 0 ? ' active' : ''}" data-hero-slide="${index}" aria-label="Show product ${index + 1}: ${escapeHtml(slide.title)}" aria-current="${index === 0 ? 'true' : 'false'}"></button>`).join('')}</div><button class="hero-arrow" type="button" data-hero-next aria-label="Next product">›</button></div>
    </div></section>
    <section class="section home-categories"><div class="container"><div class="section-heading"><div><span class="eyebrow">Browse our range</span><h2>Browse by category</h2></div><a href="/products" class="button button-outline">View all products</a></div>
      <div class="grid">${categories.map((category) => `<a class="category-card" href="/products?category=${encodeURIComponent(category.slug)}"><img loading="lazy" src="${escapeHtml(imageUrl(category.image))}" alt=""><span>${escapeHtml(category.name)}</span></a>`).join('') || '<p class="empty-state">Product categories will appear here.</p>'}</div></div></section>
    ${featured.length ? `<section class="section section-tight home-featured"><div class="container"><div class="section-heading"><div><span class="eyebrow">Made for work & learning</span><h2>Featured products</h2></div><a href="/products" class="button button-outline">Explore catalogue</a></div><div class="grid">${featured.map(productCard).join('')}</div></div></section>` : ''}
    <section class="section quality-section"><div class="container quality-panel"><div class="quality-copy"><span class="eyebrow">Our commitment</span><h2>Quality Assurance</h2><p>Quality is a prime factor for our company, and we always provide qualitative products to our precious clients. Our manufactured, exported, wholesale-supplied, and retail products give full satisfaction to our clients. Our quality team checks final products at various stages for performance and reliability. Before dispatch, every product is quality-assured by our team.</p></div><div class="quality-checks" aria-label="Our quality assurance process"><div class="quality-check"><span aria-hidden="true">01</span><div><strong>Multi-stage checks</strong><p>Products are checked at various stages of production.</p></div></div><div class="quality-check"><span aria-hidden="true">02</span><div><strong>Performance &amp; reliability</strong><p>Our quality team checks the finished product.</p></div></div><div class="quality-check"><span aria-hidden="true">03</span><div><strong>Pre-dispatch assurance</strong><p>Every product is checked before it is dispatched.</p></div></div></div></div></section>
    <section class="section why-us-section"><div class="container"><div class="section-heading"><div><span class="eyebrow">The Shaw Enterprise difference</span><h2>Why to Choose Us?</h2><p class="lead">Our company follows quality standards and industrial norms for manufacturing, exporting, wholesale supplying, and retailing. Some of the factors which set us apart are:</p></div></div><div class="why-us-grid">
      <article class="why-us-card"><span class="why-us-number">01</span><span class="why-us-icon" aria-hidden="true">◇</span><h3>Transparency in business</h3><p>Clear communication and straightforward dealings at every step.</p></article>
      <article class="why-us-card"><span class="why-us-number">02</span><span class="why-us-icon" aria-hidden="true">✓</span><h3>Ethical business practices</h3><p>We work with integrity and respect for our clients and partners.</p></article>
      <article class="why-us-card"><span class="why-us-number">03</span><span class="why-us-icon" aria-hidden="true">✳</span><h3>Customized solutions</h3><p>Product options tailored to your requirements and specifications.</p></article>
      <article class="why-us-card"><span class="why-us-number">04</span><span class="why-us-icon" aria-hidden="true">⌖</span><h3>Wide distribution network</h3><p>Serving customers and institutions across a broad delivery network.</p></article>
      <article class="why-us-card"><span class="why-us-number">05</span><span class="why-us-icon" aria-hidden="true">➜</span><h3>Product delivery</h3><p>Careful coordination to deliver products to our customers.</p></article>
    </div></div></section>
    <section class="section section-tight home-journal"><div class="container"><div class="section-heading"><div><span class="eyebrow">From our journal</span><h2>Latest guides</h2></div><a href="/blogs" class="button button-outline">All articles</a></div><div class="grid grid-3">${state.blogs.slice(0, 3).map(blogCard).join('') || '<p class="empty-state">New articles coming soon.</p>'}</div></div></section>
    ${state.testimonials.length ? `<section class="section home-testimonials"><div class="container"><span class="eyebrow">Trusted by institutions</span><h2>What our clients say</h2>    <div class="grid grid-3">${state.testimonials.slice(0, 3).map((item) => `<article class="panel"><p>“${escapeHtml(item.review_text || item.message || item.content || '')}”</p><strong>${escapeHtml(item.client_name || item.name || '')}</strong><p class="muted">${escapeHtml(item.organization_name || item.client_designation || item.designation || '')}</p></article>`).join('')}</div></div></section>` : ''}`);
    const carousel = root.querySelector('[data-hero-carousel]');
    const panels = [...carousel.querySelectorAll('[data-hero-slide-panel]')];
    const dots = [...carousel.querySelectorAll('[data-hero-slide]')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeSlide = 0;
    let timer = null;
    let paused = false;
    const showSlide = (index) => {
      activeSlide = (index + panels.length) % panels.length;
      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeSlide;
        panel.classList.toggle('active', active);
        panel.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === activeSlide;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', String(active));
      });
    };
    const stopAutoplay = () => {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
    };
    const startAutoplay = () => {
      stopAutoplay();
      if (!paused && !reducedMotion.matches && !document.hidden && panels.length > 1) {
        timer = window.setInterval(() => showSlide(activeSlide + 1), 6000);
      }
    };
    carousel.addEventListener('click', (event) => {
      if (event.target.closest('[data-hero-previous]')) showSlide(activeSlide - 1);
      else if (event.target.closest('[data-hero-next]')) showSlide(activeSlide + 1);
      else {
        const dot = event.target.closest('[data-hero-slide]');
        if (dot) showSlide(Number(dot.dataset.heroSlide));
        else return;
      }
      startAutoplay();
    });
    carousel.addEventListener('focusin', () => { paused = true; stopAutoplay(); });
    carousel.addEventListener('focusout', (event) => {
      if (!carousel.contains(event.relatedTarget)) {
        paused = false;
        startAutoplay();
      }
    });
    document.addEventListener('visibilitychange', startAutoplay);
    reducedMotion.addEventListener('change', startAutoplay);
    startAutoplay();
  }

  function renderProducts() {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category') || '';
    const selectedCategory = state.categories.find((item) => item.slug === categoryParam || String(item.id) === categoryParam);
    const category = selectedCategory?.slug || categoryParam;
    setContent(`${pageBanner('Our Products', 'Browse writing boards, classroom furniture, display systems and accessories.')}
      <section class="section products-section"><div class="container products-layout">
        <aside class="product-filter-panel" aria-label="Product filters"><div class="filter-panel-heading"><span class="eyebrow">Explore</span><h2>Categories</h2></div>
          <nav class="product-category-list" aria-label="Filter products by category">
            ${state.categories.map((item) => {
              const count = state.products.filter((product) => product.category_slug === item.slug || String(product.category_id) === String(item.id)).length;
              return `<button type="button" class="product-category-filter${item.slug === category || String(item.id) === category ? ' active' : ''}" data-product-category-filter="${escapeHtml(item.slug)}"><span>${escapeHtml(item.name)}</span><span class="category-count">${count}</span></button>`;
            }).join('')}
          </nav>
          <div class="filter-help"><strong>Need a custom size?</strong><span>Ask our team about tailored options.</span><a class="button button-outline" href="/contact">Request a quote <span aria-hidden="true">→</span></a></div>
        </aside>
        <div class="products-results"><div data-selected-category-banner></div>
          <div class="products-results-heading"><p data-product-result-count aria-live="polite"></p><span>Quality products, ready to explore</span></div>
          <div class="grid product-results-grid" data-product-grid></div>
        </div>
      </div></section>`);
    filterProducts();
  }

  function filterProducts() {
    const grid = root.querySelector('[data-product-grid]');
    if (!grid) return;
    const categoryParam = new URLSearchParams(location.search).get('category') || '';
    const selectedCategory = state.categories.find((item) => item.slug === categoryParam || String(item.id) === categoryParam);
    const category = selectedCategory?.slug || categoryParam;
    const categoryBanner = root.querySelector('[data-selected-category-banner]');
    if (categoryBanner) {
      categoryBanner.innerHTML = selectedCategory
        ? `<section class="selected-category-banner"><img src="${escapeHtml(imageUrl(selectedCategory.image))}" alt="${escapeHtml(selectedCategory.name)}" loading="eager"><div class="selected-category-copy"><span class="eyebrow">Product category</span><h2>${escapeHtml(selectedCategory.name)}</h2>${selectedCategory.description ? `<p>${escapeHtml(selectedCategory.description)}</p>` : ''}</div></section>`
        : '';
    }
    const rows = state.products.filter((product) => !category || product.category_slug === category || String(product.category_id) === category);
    grid.innerHTML = rows.map(productCard).join('') || '<p class="empty-state">No products in this category yet.</p>';
    const resultCount = root.querySelector('[data-product-result-count]');
    if (resultCount) resultCount.textContent = `Showing ${rows.length} ${rows.length === 1 ? 'product' : 'products'}`;
    root.querySelectorAll('[data-product-category-filter]').forEach((button) => {
      button.classList.toggle('active', button.dataset.productCategoryFilter === category);
    });
  }

  async function renderProduct() {
    const product = await request(`/products/${encodeURIComponent(root.dataset.slug)}`);
    const item = product.data || product;
    state.selectedProduct = item;
    state.selectedVariant = item.variants?.[0] || null;
    const images = (item.images?.length ? item.images : [item.main_image]).filter(Boolean);
    setContent(`${pageBanner(item.title)}<section class="section"><div class="container product-detail">
      <div>${images.length ? `<button class="product-image-viewer" type="button" data-open-product-image aria-label="View larger image: ${escapeHtml(item.title)}"><img class="product-main-image" data-main-image src="${escapeHtml(imageUrl(images[0]))}" alt="${escapeHtml(item.title)}"></button><div class="gallery-thumbs">${images.map((src, index) => `<img class="${index === 0 ? 'active' : ''}" data-gallery-image src="${escapeHtml(imageUrl(src))}" alt="${escapeHtml(item.title)} image ${index + 1}">`).join('')}</div>` : '<div class="product-image-empty product-detail-image-empty" role="img" aria-label="No product image available">Image coming soon</div>'}</div>
      <div><span class="eyebrow">${escapeHtml(item.category_name || 'Shaw Enterprise')}</span><h2>${escapeHtml(item.title)}</h2><p class="muted">${escapeHtml(item.sku || '')}</p>
      ${item.short_description ? `<p class="product-short-description">${escapeHtml(item.short_description)}</p>` : ''}
      ${productPricingMarkup(item, state.selectedVariant, true)}
      ${item.variants?.length ? `<h3>Choose size</h3><div class="variant-list">${item.variants.map((variant, index) => `<button type="button" class="variant-option ${index === 0 ? 'active' : ''}" data-variant="${index}">${escapeHtml(variant.size_label || variant.label || 'Standard')}</button>`).join('')}</div>` : ''}
      <div class="hero-actions"><button class="button button-dark" type="button" data-product-quote>Product Inquiry</button></div>
      ${item.full_description ? `<div class="product-description">${safeRichText(item.full_description)}</div>` : ''}
      ${item.specifications?.length ? `<div class="panel"><h3>Specifications</h3>${item.specifications.map((spec) => `<p><strong>${escapeHtml(spec.specification_key || spec.key || '')}:</strong> ${escapeHtml(spec.specification_value || spec.value || '')}</p>`).join('')}</div>` : ''}
      </div></div></section><section class="section section-tight"><div class="container"><h2>You may also like</h2><div class="grid">${(item.relatedProducts || state.products.filter((p) => p.id !== item.id).slice(0, 4)).map(productCard).join('')}</div></div></section>`);
  }

  function renderAbout() {
    const settings = state.settings;
    const about = settings.sections?.about_home || {};
    const markets = ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam', 'Tripura', 'Sikkim', 'Manipur'];
    const profile = [
      ['Business type', 'Manufacturer, exporter, wholesaler & retailer'],
      ['Established', '2014'],
      ['Ownership', 'Sole proprietorship'],
      ['Team size', 'Fewer than 10 people'],
      ['Annual turnover', 'Below ₹1 crore'],
      ['GST number', '19DOWPS0212F1ZO'],
    ];
    setContent(`${pageBanner('About Shaw Enterprise', 'A Kolkata-based manufacturer and supplier of writing boards and educational products.')}
      <section class="section about-intro"><div class="container about-intro-grid">
        <div class="about-story"><span class="eyebrow">Our company</span><h2>Products made with care. Service built around you.</h2>
          <p>Established in 2014, Shaw Enterprise manufactures and supplies writing boards and related products to customers across eastern and northeastern India. We serve clients through manufacturing, export, wholesale and retail.</p>
          <p>Our team works to understand each customer’s requirements, offers customization and packaging options, and coordinates delivery within an agreed timeframe.</p>
          <a class="button button-primary" href="/contact">Talk to our team <span aria-hidden="true">→</span></a>
        </div>
        <div class="about-visual"><img src="${escapeHtml(imageUrl(about.image || settings.hero_banner_url))}" alt="Writing boards and educational products from Shaw Enterprise"><div class="about-established"><strong>2014</strong><span>Serving customers for over a decade</span></div></div>
      </div></section>
      <section class="section about-approach"><div class="container"><div class="section-heading"><div><span class="eyebrow">From requirement to dispatch</span><h2>A considered approach at every stage</h2></div></div>
        <div class="about-approach-grid"><article class="about-approach-card"><span>01</span><h3>Understand your needs</h3><p>Our team works with clients to understand product specifications and discuss suitable options.</p></article><article class="about-approach-card"><span>02</span><h3>Customize with care</h3><p>Customization and packaging options can be arranged to suit the order and customer requirements.</p></article><article class="about-approach-card"><span>03</span><h3>Check before dispatch</h3><p>Products are checked at multiple stages for performance and reliability before they leave our facility.</p></article><article class="about-approach-card"><span>04</span><h3>Coordinate delivery</h3><p>We coordinate dispatch to serve customers throughout our regional distribution markets.</p></article></div>
      </div></section>
      <section class="section about-profile-section"><div class="container about-profile-layout"><div><span class="eyebrow">Company at a glance</span><h2>Shaw Enterprise profile</h2><p class="lead">Business information published by Shaw Enterprise.</p><div class="about-markets"><h3>Major markets</h3><div>${markets.map((market) => `<span>${escapeHtml(market)}</span>`).join('')}</div></div></div>
        <dl class="about-profile-grid">${profile.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>
      </div></section>
      <section class="section section-tight about-contact-cta"><div class="container about-contact-panel"><div><span class="eyebrow">Let’s work together</span><h2>Have a product or bulk requirement?</h2><p>Tell us what you need and our team will help you explore the right options.</p></div><a class="button button-primary" href="/contact">Contact Shaw Enterprise <span aria-hidden="true">→</span></a></div></section>`);
  }

  function renderClients() {
    const categories = [
      ['all', 'All Clients'], ['university_colleges', 'Universities & Colleges'], ['schools', 'Schools'],
      ['corporate_banks', 'Corporate / Bank'], ['others', 'Others'],
    ];
    state.clientCategory = 'all';
    setContent(`${pageBanner('Our Clients', 'Institutions and organizations that trust Shaw Enterprise.')}<section class="section"><div class="container">
      <div class="toolbar"><input class="search-field" type="search" placeholder="Search institution or location…" data-client-search>${categories.map(([id, label]) => `<button class="button button-outline" type="button" data-client-category="${id}">${label}</button>`).join('')}</div>
      <div class="grid grid-3" data-clients-grid></div></div></section>`);
    filterClients('all');
  }

  function filterClients(category) {
    state.clientCategory = category;
    const search = (root.querySelector('[data-client-search]')?.value || '').toLowerCase();
    const rows = state.clients.filter((client) => (category === 'all' || client.category === category) && `${client.name} ${client.location || ''}`.toLowerCase().includes(search));
    const grid = root.querySelector('[data-clients-grid]');
    if (grid) grid.innerHTML = rows.map((client) => `<article class="panel"><span class="eyebrow">${escapeHtml(client.category_label || client.category || '')}</span><h3>${escapeHtml(client.name)}</h3><p class="muted">${escapeHtml(client.location || '')}</p></article>`).join('') || '<p class="empty-state">No client institutions found.</p>';
  }

  function renderBlogs() {
    const search = new URLSearchParams(location.search).get('search') || '';
    const rows = state.blogs.filter((blog) => `${blog.title} ${blog.content || ''}`.toLowerCase().includes(search.toLowerCase()));
    setContent(`${pageBanner('Insights & Guides', 'Product advice, classroom ideas and tips from our team.')}<section class="section"><div class="container"><div class="toolbar"><input class="search-field" type="search" value="${escapeHtml(search)}" placeholder="Search articles…" data-blog-search></div><div class="grid grid-3" data-blog-grid>${rows.map(blogCard).join('') || '<p class="empty-state">No articles found.</p>'}</div></div></section>`);
  }

  async function renderBlog() {
    const result = await request(`/blogs/${encodeURIComponent(root.dataset.slug)}`);
    const blog = result.data || result;
    setContent(`${pageBanner('Insights & Guides')}<article class="section"><div class="container" style="max-width:850px"><img class="product-main-image" style="height:360px" src="${escapeHtml(imageUrl(blog.thumbnail_image))}" alt="${escapeHtml(blog.title)}"><p class="eyebrow">${escapeHtml(blog.author_name || 'Shaw Enterprise')}</p><h1 style="font-size:38px">${escapeHtml(blog.title)}</h1><div class="article-content">${safeRichText(blog.content || '').replace(/\n/g, '<br>')}</div>${blog.video_url ? `<p><a class="button button-dark" href="${escapeHtml(blog.video_url)}" target="_blank" rel="noreferrer">Watch video</a></p>` : ''}<a href="/blogs" class="button button-outline">← All articles</a></div></article>`);
  }

  function renderImages() {
    const gallery = [
      ['High-Gloss White Writing Board', 'writing-board', 'Writing Boards', 'products/main/whiteboard.jpg', 'Anodized aluminum alloy frame with a high-gloss dry-erase surface.', 'Available in custom sizes · Wall-mount clips'],
      ['Ceramic Green Chalk Writing Board', 'writing-board', 'Writing Boards', 'products/main/green-chalkboard.jpg', 'Durable matte green chalkboard surface for classrooms.', 'Heavy-duty backing · 25-year surface durability'],
      ['Magnetic Toughened Glass Whiteboard', 'writing-board', 'Writing Boards', 'products/main/magnetic-glass-board.jpg', 'Contemporary glass writing surface for offices and meeting rooms.', 'Magnetic receptive · Frameless look'],
      ['Fabric Pin-Up Display Notice Board', 'display-notice-board', 'Display Boards', 'products/main/notice-board.jpg', 'Fabric-covered display boards for school and office corridors.', 'Pin-up surface · Concealed fixing'],
      ['Covered Lockable Notice Board', 'display-notice-board', 'Display Boards', 'products/main/cover-notice-board.jpg', 'Covered display board for notices and institutional information.', 'Protects documents · Lockable'],
      ['Heavy-Duty Mobile Whiteboard Stand', 'metal-stand', 'Metal Stands', 'products/main/4leg-stand.jpg', 'Mobile stand with sturdy metal frame for classrooms and seminars.', 'Castor wheels · Board clamps'],
      ['Revolving Display Stand', 'metal-stand', 'Metal Stands', 'products/main/revolving-stand.jpg', 'Reversible display system for training and lecture spaces.', 'Double-sided · Locking castors'],
      ['Wooden Artist Studio Easel', 'wooden-product', 'Wooden Products', 'products/main/wooden-easel.jpg', 'Wooden easel for studios, learning spaces, and product displays.', 'Folds for transport · Adjustable mast'],
      ['Acrylic Desk Elevator', 'acrylic-product', 'Acrylic Products', 'products/main/desk-elevator.jpg', 'Clear acrylic ergonomic document stand for desks and offices.', 'Anti-slip base · Polished edges'],
      ['Acrylic Table Menu Holder', 'acrylic-product', 'Acrylic Products', 'products/main/menu-holder.jpg', 'Double-sided acrylic holder for cafes, offices, and counters.', 'Multiple sizes · Clear display'],
      ['Balagarh Industrial Workshop', 'workshop', 'Workshop & Factory', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80', 'Our manufacturing and production operations in Kolkata.', state.settings.workshop_address || 'Balagarh Industrial, Kolkata'],
      ['College Street Showroom & Dispatch Hub', 'workshop', 'Workshop & Factory', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80', 'Our showroom and dispatch point serving customers and institutions.', state.settings.registered_office_address || state.settings.address || 'College Street, Kolkata'],
    ].map(([title, category, categoryName, image, description, specs], id) => ({ id, title, category, categoryName, image, description, specs }));
    const categories = [
      ['all', 'All Photos'], ['writing-board', 'Writing Boards'], ['display-notice-board', 'Display Boards'],
      ['metal-stand', 'Metal Stands'], ['wooden-product', 'Wooden Products'], ['acrylic-product', 'Acrylic Products'],
      ['workshop', 'Factory & Showroom'],
    ];
    setContent(`${pageBanner('Our Manufacturing & Product Images', 'Take a visual tour of our writing boards, stands, acrylic fixtures, and Kolkata workshop.')}<section class="section"><div class="container">
      <div class="toolbar gallery-filters">${categories.map(([id, label]) => `<button class="button button-outline" type="button" data-gallery-filter="${id}">${label}</button>`).join('')}</div>
      <div class="grid grid-3" data-image-grid></div></div></section>`);
    const grid = root.querySelector('[data-image-grid]');
    const display = (category = 'all') => {
      state.activeGalleryCategory = category;
      const rows = category === 'all' ? gallery : gallery.filter((item) => item.category === category);
      grid.innerHTML = rows.map((item) => `<button type="button" class="card gallery-card" data-gallery-id="${item.id}"><span class="card-image"><img loading="lazy" src="${escapeHtml(imageUrl(item.image))}" alt="${escapeHtml(item.title)}"></span><span class="card-body"><span class="eyebrow">${escapeHtml(item.categoryName)}</span><strong class="card-title">${escapeHtml(item.title)}</strong><span class="muted">${escapeHtml(item.description)}</span><span class="gallery-specs">${escapeHtml(item.specs)}</span></span></button>`).join('');
    };
    display();
    root.dataset.galleryItems = JSON.stringify(gallery);
  }

  function renderContact() {
    const settings = state.settings;
    const address = settings.registered_office_address || settings.address || 'Shaw Enterprise, Kolkata';
    const configuredMapUrl = String(settings.maps_embed_url || '').trim();
    let mapEmbedUrl = '';
    try {
      const parsedMapUrl = new URL(configuredMapUrl);
      if (parsedMapUrl.protocol === 'https:' && ['maps.google.com', 'google.com', 'www.google.com'].includes(parsedMapUrl.hostname) && parsedMapUrl.pathname.startsWith('/maps')) {
        mapEmbedUrl = parsedMapUrl.href;
      }
    } catch {
      mapEmbedUrl = '';
    }
    if (!mapEmbedUrl) mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    setContent(`${pageBanner('Contact Us', 'Tell us about your product, size or bulk order requirements.')}<section class="section"><div class="container">
      <div class="product-detail">
      <div class="panel"><span class="eyebrow">Contact</span><h2>${escapeHtml(settings.site_name || 'Shaw Enterprise')}</h2><p>${escapeHtml(settings.tagline || '')}</p><h3>Registered office</h3><p>${escapeHtml(settings.registered_office_address || settings.address || '')}</p><p><strong>Phone:</strong> ${escapeHtml(settings.phone || '')}</p><p><strong>Email:</strong> ${escapeHtml(settings.email || '')}</p></div>
      <form class="panel form-stack" data-contact-form><h2>Send us a message</h2><label>Your name *<input name="client_name" required></label><div class="form-row"><label>Phone *<input name="phone" required></label><label>Email<input name="email" type="email"></label></div><label>Message *<textarea name="message" rows="5" required></textarea></label><input type="hidden" name="product_title" value="General enquiry"><button class="button button-primary" type="submit">Send message</button><div data-form-message></div></form>
      </div>
      <div class="contact-map"><div class="contact-map-heading"><div><span class="eyebrow">Find us</span><h2>Visit Shaw Enterprise</h2><p>${escapeHtml(address)}</p></div><a class="button button-outline" href="${escapeHtml(mapLink)}" target="_blank" rel="noopener noreferrer">Open in Google Maps <span aria-hidden="true">↗</span></a></div><iframe title="Map showing Shaw Enterprise registered office" src="${escapeHtml(mapEmbedUrl)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
      </div></section>`);
  }

  function renderLegal() {
    const content = {
      'privacy-policy': ['Privacy Policy', 'We use the details you provide to respond to enquiries and provide customer support. We do not sell personal information. Contact us to request access or correction of your information.'],
      'payment-policy': ['Payment Policy', 'This website does not accept online orders or payments. Product availability, quotations, payment terms, and delivery arrangements are confirmed directly by our sales team.'],
      'disclaimer': ['Disclaimer', 'Product details, availability and pricing may be updated from time to time. Please confirm specifications and delivery timelines with our team before placing a bulk order.'],
      'terms': ['Terms & Conditions', 'By using this website, you agree to provide accurate contact and order information. Product availability, delivery and payment terms are confirmed at order acceptance.'],
      'terms-conditions': ['Terms & Conditions', 'By using this website, you agree to provide accurate contact and order information. Product availability, delivery and payment terms are confirmed at order acceptance.'],
      'terms-and-conditions': ['Terms & Conditions', 'By using this website, you agree to provide accurate contact and order information. Product availability, delivery and payment terms are confirmed at order acceptance.'],
    };
    const [title, body] = content[location.pathname.split('/')[1]] || content['privacy-policy'];
    setContent(`${pageBanner(title)}<section class="section"><article class="container panel"><p>${escapeHtml(body)}</p><p>For questions, please contact <a href="/contact">Shaw Enterprise</a>.</p></article></section>`);
  }

  function renderTestimonials() {
    setContent(`${pageBanner('Customer Testimonials', 'Feedback from customers and partner institutions.')}<section class="section"><div class="container grid grid-3">${state.testimonials.map((item) => `<article class="panel"><p>“${escapeHtml(item.review_text || item.message || item.content || '')}”</p><strong>${escapeHtml(item.client_name || item.name || '')}</strong><p class="muted">${escapeHtml(item.organization_name || item.client_designation || item.designation || '')}</p></article>`).join('') || '<p class="empty-state">Testimonials will appear here soon.</p>'}</div></section>`);
  }

  function bindGlobalEvents() {
    document.querySelector('[data-menu-toggle]')?.addEventListener('click', (event) => {
      const nav = document.querySelector('[data-main-nav]');
      const open = nav.classList.toggle('open');
      event.currentTarget.setAttribute('aria-expanded', String(open));
      if (window.matchMedia('(max-width: 680px)').matches) {
        const productsTrigger = document.querySelector('[data-nav-products] .nav-products-trigger');
        const productsMenu = document.querySelector('[data-products-mega-menu]');
        productsTrigger?.setAttribute('aria-expanded', String(open));
        if (productsMenu) productsMenu.hidden = !open;
      }
    });
    const productsNav = document.querySelector('[data-nav-products]');
    const productsTrigger = productsNav?.querySelector('.nav-products-trigger');
    const productsMenu = productsNav?.querySelector('[data-products-mega-menu]');
    if (productsNav && productsTrigger) {
      productsNav.addEventListener('pointerenter', () => {
        if (window.matchMedia('(min-width: 681px)').matches) {
          if (productsMenu) productsMenu.hidden = false;
          productsTrigger.setAttribute('aria-expanded', 'true');
        }
      });
      productsNav.addEventListener('pointerleave', () => {
        if (!productsNav.contains(document.activeElement)) {
          if (productsMenu && window.matchMedia('(min-width: 681px)').matches) productsMenu.hidden = true;
          productsTrigger.setAttribute('aria-expanded', 'false');
        }
      });
      productsNav.addEventListener('focusin', () => {
        if (productsMenu) productsMenu.hidden = false;
        productsTrigger.setAttribute('aria-expanded', 'true');
      });
      productsNav.addEventListener('focusout', () => window.setTimeout(() => {
        if (!productsNav.contains(document.activeElement) && !productsNav.matches(':hover')) {
          if (productsMenu) productsMenu.hidden = true;
          productsTrigger.setAttribute('aria-expanded', 'false');
        }
      }));
    }
    document.querySelectorAll('[data-open-quote]').forEach((button) => button.addEventListener('click', () => document.querySelector('[data-dialog="quote"]').showModal()));
    document.querySelectorAll('[data-open-custom]').forEach((button) => button.addEventListener('click', () => document.querySelector('[data-dialog="custom"]').showModal()));
    document.querySelectorAll('[data-open-brochure]').forEach((button) => button.addEventListener('click', () => {
      const content = document.querySelector('[data-brochure-content]');
      content.innerHTML = `<p>${escapeHtml(state.settings.catalog_pdf_filename || 'Shaw Enterprise product catalogue')}</p>${state.settings.catalog_pdf_url ? `<a class="button button-primary" href="${escapeHtml(imageUrl(state.settings.catalog_pdf_url))}" target="_blank" rel="noreferrer">Open catalogue PDF</a>` : '<p class="muted">Contact us to request our latest catalogue.</p>'}`;
      document.querySelector('[data-dialog="brochure"]').showModal();
    }));
    document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
    document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
    document.querySelectorAll('[data-inquiry-form]').forEach((form) => form.addEventListener('submit', submitInquiry));
    document.querySelectorAll('[data-custom-dimension], [data-custom-board]').forEach((input) => input.addEventListener('input', updateCustomArea));
    document.querySelectorAll('[data-custom-board]').forEach((input) => input.addEventListener('change', updateCustomArea));
    const year = document.querySelector('[data-year]');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function sendInquiryToWhatsApp(form, extra = {}) {
    const data = { ...Object.fromEntries(new FormData(form).entries()), ...extra };
    const area = Number(data.width || 0) * Number(data.height || 0);
    if (data.board_type) data.product_title = `Custom ${data.board_type}`;
    if (data.width && data.height) {
      data.variant_details = `${data.width} ft × ${data.height} ft (${area.toFixed(1)} sq. ft)`;
    }

    const phone = String(state.settings.whatsapp || state.settings.phone || '').replace(/\D/g, '');
    if (phone.length < 8) {
      toast('WhatsApp contact number is not configured. Please contact us by phone or email.', true);
      return false;
    }

    const fields = [
      ['Name', data.client_name],
      ['School / company', data.organization_name],
      ['Phone', data.phone],
      ['Email', data.email],
      ['Product / requirement', data.product_title],
      ['Size / details', data.variant_details],
      ['Quantity', data.quantity],
      ['Delivery city', data.delivery_city],
      ['Message', data.message],
    ].filter(([, value]) => String(value || '').trim());
    const message = `Hello Shaw Enterprise, I have an enquiry:\n${fields.map(([label, value]) => `${label}: ${String(value).trim()}`).join('\n')}`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, '_blank');
    if (!whatsappWindow) {
      toast('Please allow pop-ups to continue your enquiry on WhatsApp.', true);
      return false;
    }
    whatsappWindow.opener = null;
    form.reset();
    form.closest('dialog')?.close();
    const confirmation = form.querySelector('[data-form-message]');
    if (confirmation) confirmation.textContent = 'Your enquiry is ready to send in WhatsApp.';
    toast('WhatsApp opened with your enquiry. Send the message there to complete your request.');
    return true;
  }

  function submitInquiry(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.elements.quantity) form.elements.quantity.value = String(Math.max(1, Number(form.elements.quantity.value) || 1));
    if (form.elements.delivery_city && !form.elements.delivery_city.value) form.elements.delivery_city.value = 'Kolkata';
    sendInquiryToWhatsApp(form);
  }

  function updateCustomArea() {
    const form = document.querySelector('[data-dialog="custom"] form');
    if (!form) return;
    const width = Number(form.elements.width.value) || 0;
    const height = Number(form.elements.height.value) || 0;
    const area = Math.round(width * height * 10) / 10;
    form.querySelector('[data-custom-area]').textContent = area.toFixed(1);
    form.elements.product_title.value = `Custom ${form.elements.board_type.value}`;
  }

  function submitContact(event) {
    event.preventDefault();
    sendInquiryToWhatsApp(event.target, {
      product_title: 'General enquiry',
      variant_details: 'Storefront contact form',
      quantity: 1,
      delivery_city: 'Kolkata',
    });
  }

  async function postForm(form, endpoint, extra = {}, successMessage = 'Your message has been sent.') {
    const message = form.querySelector('[data-form-message]');
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    if (message) message.textContent = '';
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const result = await request(endpoint, { method: 'POST', body: { ...data, ...extra } });
      form.reset();
      if (message) message.innerHTML = `<div class="notice notice-success">${escapeHtml(successMessage)}</div>`;
      else toast(successMessage);
    } catch (error) {
      if (message) message.innerHTML = `<div class="notice notice-error">${escapeHtml(error.message)}</div>`;
      else toast(error.message, true);
    } finally {
      button.disabled = false;
    }
  }

  const adminResources = {
    products: {
      path: '/products',
      title: 'Products',
      fields: ['title', 'slug', 'sku', 'category_id', 'short_description', 'full_description', 'base_price', 'mrp', 'meta_title', 'meta_description'],
      columns: ['id', 'title', 'sku', 'category_name', 'base_price', 'mrp', 'show_pricing', 'is_featured', 'is_active'],
      booleans: ['is_featured', 'is_active'],
      images: ['main_image'],
    },
    categories: {
      path: '/categories',
      title: 'Categories',
      fields: ['name', 'slug', 'description', 'image', 'display_order'],
      columns: ['id', 'name', 'slug', 'display_order', 'is_active'],
      booleans: ['is_active'],
      images: ['image'],
    },
    clients: {
      path: '/clients',
      title: 'Clients',
      fields: ['name', 'category', 'location', 'project_details', 'established', 'display_order'],
      columns: ['id', 'name', 'category_label', 'location', 'is_featured', 'display_order'],
      booleans: ['is_featured'],
    },
    blogs: {
      path: '/blogs',
      title: 'Blogs',
      fields: ['title', 'slug', 'thumbnail_image', 'video_url', 'author_name', 'content', 'meta_title', 'meta_description'],
      columns: ['id', 'title', 'slug', 'author_name', 'is_published', 'published_at'],
      booleans: ['is_published'],
      images: ['thumbnail_image'],
    },
    testimonials: {
      path: '/testimonials',
      title: 'Testimonials',
      fields: ['client_name', 'client_designation', 'organization_name', 'review_text', 'rating', 'display_order'],
      columns: ['id', 'client_name', 'organization_name', 'rating', 'is_featured', 'display_order'],
      booleans: ['is_featured'],
    },
  };

  function adminRecordPath(resource, id) {
    return `${resource.path}/${encodeURIComponent(id)}?admin=1`;
  }

  function renderAdminLogin() {
    setContent(`${pageBanner('Administrator Login')}<section class="section"><form class="panel form-stack" style="max-width:460px;margin:auto" data-admin-login><h2>Sign in to the dashboard</h2><label>Email<input name="email" type="email" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button class="button button-primary" type="submit">Sign in</button><div data-form-message></div></form></section>`);
  }

  async function renderAdmin() {
    let authenticated = false;
    if (root.dataset.page !== 'admin-login') {
      try {
        const session = await request('/admin/session');
        authenticated = Boolean(session.authenticated);
      } catch (error) {
        console.error('Unable to verify administrator session:', error);
      }
    }
    if (!authenticated) {
      renderAdminLogin();
      return;
    }
    try {
      const categories = await request('/categories?admin=1');
      state.categories = categories.data || [];
    } catch (error) {
      setContent(`<section class="section"><div class="container notice notice-error">Unable to load admin categories: ${escapeHtml(error.message)}</div></section>`);
      return;
    }
    const tabs = ['overview', ...Object.keys(adminResources), 'site-settings', 'page-settings'];
    const tabLabels = { 'site-settings': 'Site settings', 'page-settings': 'Page settings' };
    const tabIcons = { overview: '⌂', products: '▦', categories: '◫', clients: '♧', blogs: '▤', testimonials: '☆', 'site-settings': '⚙', 'page-settings': '▧' };
    setContent(`<div class="admin-shell"><aside class="admin-nav"><a class="admin-nav-brand" href="/admin"><span>SE</span><strong>Shaw Enterprise</strong><small>Content management</small></a><div class="admin-nav-label">Workspace</div>${tabs.map((tab) => `<button type="button" data-admin-tab="${tab}" class="${state.adminTab === tab ? 'active' : ''}"><span class="admin-nav-icon" aria-hidden="true">${tabIcons[tab] || '•'}</span>${tabLabels[tab] || `${tab[0].toUpperCase()}${tab.slice(1)}`}</button>`).join('')}<div class="admin-nav-spacer"></div><button type="button" data-admin-logout><span class="admin-nav-icon" aria-hidden="true">↪</span>Sign out</button></aside><section class="admin-main"><header class="admin-topbar"><span><span class="admin-status-dot"></span>Management console</span><button type="button" class="admin-menu-toggle" data-admin-menu-toggle aria-label="Open admin menu" aria-expanded="false"><span aria-hidden="true">⋮</span></button><a href="/" target="_blank" rel="noreferrer">View website <span aria-hidden="true">↗</span></a></header><div class="admin-content" data-admin-view></div></section></div>`);
    loadAdminTab();
  }

  async function loadAdminTab() {
    const view = root.querySelector('[data-admin-view]');
    if (!view) return;
    const activeTab = state.adminTab;
    const loadSequence = ++state.adminLoadSequence;
    if (activeTab === 'overview') {
      view.innerHTML = '<div class="loading-state"><span class="spinner"></span>Loading dashboard…</div>';
      try {
        const [products, categories, clients, blogs] = await Promise.all([
          request('/products?limit=100&admin=1'),
          request('/categories?admin=1'),
          request('/clients'),
          request('/blogs?admin=1'),
        ]);
        if (loadSequence !== state.adminLoadSequence) return;
        const stats = [
          ['products', 'Products', products.count ?? (products.data || []).length, '▦'],
          ['categories', 'Categories', categories.count ?? (categories.data || []).length, '◫'],
          ['clients', 'Clients', clients.count ?? (clients.data || []).length, '♧'],
          ['blogs', 'Blogs', blogs.count ?? (blogs.data || []).length, '▤'],
        ];
        view.innerHTML = `<section class="admin-dashboard"><div class="admin-dashboard-heading"><span class="eyebrow">Workspace summary</span><h1>Dashboard overview</h1><p>Manage your catalogue and keep your storefront content up to date.</p></div><div class="stats-row">${stats.map(([tab, label, count, icon]) => `<button type="button" class="stat admin-stat" data-admin-shortcut="${tab}"><span class="admin-stat-icon" aria-hidden="true">${icon}</span><span class="admin-stat-copy"><strong>${escapeHtml(count)}</strong><span>${label}</span></span><span class="admin-stat-arrow" aria-hidden="true">↗</span></button>`).join('')}</div><section class="admin-quick-actions"><div class="admin-section-heading"><div><span class="eyebrow">Shortcuts</span><h2>Quick actions</h2><p>Jump directly to the content you want to manage.</p></div></div><div class="admin-shortcut-grid"><button type="button" data-admin-shortcut-create="products"><span class="admin-shortcut-icon">＋</span><span><strong>Add a product</strong><small>Create a new catalogue listing</small></span><span class="admin-stat-arrow">→</span></button><button type="button" data-admin-shortcut="categories"><span class="admin-shortcut-icon">◫</span><span><strong>Manage categories</strong><small>Organize your product range</small></span><span class="admin-stat-arrow">→</span></button><button type="button" data-admin-shortcut-create="blogs"><span class="admin-shortcut-icon">＋</span><span><strong>Write a blog</strong><small>Publish a new article</small></span><span class="admin-stat-arrow">→</span></button><button type="button" data-admin-shortcut="clients"><span class="admin-shortcut-icon">♧</span><span><strong>Manage clients</strong><small>Update your client showcase</small></span><span class="admin-stat-arrow">→</span></button></div></section></section>`;
      } catch (error) {
        if (loadSequence === state.adminLoadSequence) view.innerHTML = `<div class="notice notice-error">${escapeHtml(error.message)}</div>`;
      }
      return;
    }
    if (activeTab === 'site-settings') {
      const settingSections = [
        {
          title: 'Business details',
          description: 'Basic information about your business and storefront.',
          fields: [
            ['site_name', 'Business name'],
            ['proprietor', 'Proprietor'],
            ['tagline', 'Tagline'],
            ['gst_number', 'GST number'],
            ['established_year', 'Established year'],
            ['working_hours', 'Working hours'],
            ['announcement_text', 'Announcement bar text'],
          ],
        },
        {
          title: 'Branding & assets',
          description: 'Manage your site logo, favicon, and downloadable catalogue.',
          fields: [
            ['logo_url', 'Logo image'],
            ['favicon_url', 'Favicon image'],
            ['catalog_pdf_url', 'Catalogue PDF'],
            ['catalog_pdf_filename', 'Catalogue filename'],
          ],
        },
        {
          title: 'Contact & location',
          description: 'Business contact details and location information shown on the site.',
          fields: [
            ['phone', 'Primary phone'],
            ['phone_secondary', 'Secondary phone'],
            ['whatsapp', 'WhatsApp number'],
            ['email', 'Email address'],
            ['address', 'Business address'],
            ['registered_office_address', 'Registered office address'],
            ['workshop_address', 'Workshop address'],
            ['maps_embed_url', 'Map embed URL'],
          ],
        },
      ];
      const renderSettingField = ([key, label]) => `<label>${label}<input name="${key}" value="${escapeHtml(state.settings[key] || '')}">${['logo_url', 'favicon_url', 'catalog_pdf_url'].includes(key) ? `<input type="file" data-setting-upload="${key}" accept="${key === 'catalog_pdf_url' ? 'application/pdf' : key === 'favicon_url' ? '.ico,image/x-icon,image/png,image/svg+xml,image/jpeg' : 'image/*'}">` : ''}</label>`;
      const currentSocialLinks = state.settings.social_links && typeof state.settings.social_links === 'object' && !Array.isArray(state.settings.social_links) ? state.settings.social_links : {};
      const socialLinkKeys = [...new Set(['facebook', 'instagram', 'twitter', 'youtube', 'linkedin', 'whatsapp', ...Object.keys(currentSocialLinks)])];
      const socialLinkLabels = { facebook: 'Facebook', instagram: 'Instagram', twitter: 'Twitter / X', youtube: 'YouTube', linkedin: 'LinkedIn', whatsapp: 'WhatsApp' };
      view.innerHTML = `<div class="admin-toolbar"><div><span class="eyebrow">Store configuration</span><h1>Site settings</h1></div><button class="button button-primary" data-save-settings>Save changes</button></div><p class="admin-settings-intro">Manage your business details, branding, contact information, and site-wide preferences.</p><form class="admin-settings-form" data-settings-form data-settings-section="site">${settingSections.map((section) => `<section class="admin-settings-group"><div class="admin-settings-group-heading"><h2>${section.title}</h2><p>${section.description}</p></div><div class="admin-settings-fields">${section.fields.map(renderSettingField).join('')}</div></section>`).join('')}<section class="admin-settings-group"><div class="admin-settings-group-heading"><h2>Social links</h2><p>Add the profile URLs used by your business and storefront.</p></div><div class="admin-settings-fields">${socialLinkKeys.map((key) => `<label>${escapeHtml(socialLinkLabels[key] || key.replaceAll('_', ' ').replace(/\\b\\w/g, (letter) => letter.toUpperCase()))}<input type="url" name="social_link_${escapeHtml(key)}" data-social-link="${escapeHtml(key)}" value="${escapeHtml(currentSocialLinks[key] || '')}" placeholder="https://..." autocomplete="url"></label>`).join('')}</div></section></form>`;
      return;
    }
    if (activeTab === 'page-settings') {
      const sections = state.settings.sections && typeof state.settings.sections === 'object' && !Array.isArray(state.settings.sections) ? state.settings.sections : {};
      let heroProducts = [];
      try {
        const productsResult = await request('/products?limit=100&admin=1');
        if (loadSequence !== state.adminLoadSequence) return;
        heroProducts = (productsResult.data || []).filter((product) => isChecked(product.is_active));
      } catch (error) {
        if (loadSequence === state.adminLoadSequence) {
          view.innerHTML = `<div class="notice notice-error">Unable to load products for homepage banners: ${escapeHtml(error.message)}</div>`;
        }
        return;
      }
      const selectedHeroProducts = Array.isArray(sections.hero_products) ? sections.hero_products : [];
      const editablePageSections = Object.entries(sections)
        .filter(([sectionKey]) => !['hero', 'hero_products'].includes(sectionKey))
        .map(([sectionKey, sectionValue]) => sectionKey === 'about_home'
          ? [sectionKey, { image: sectionValue?.image || '' }]
          : [sectionKey, sectionValue]);
      const heroProductFields = Array.from({ length: 5 }, (_, index) => {
        const selectedId = selectedHeroProducts[index] ?? '';
        const options = heroProducts.map((product) => `<option value="${escapeHtml(product.id)}" ${String(product.id) === String(selectedId) ? 'selected' : ''}>${escapeHtml(product.title)}${product.sku ? ` (${escapeHtml(product.sku)})` : ''}</option>`).join('');
        return `<label>Banner ${index + 1} product<select data-hero-product-slot="${index}"><option value="">Select a product</option>${options}</select></label>`;
      }).join('');
      const formatPageFieldLabel = (key) => /^p\d+$/.test(key)
        ? `Paragraph ${key.slice(1)}`
        : key.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
      const renderPageFields = (value, path) => {
        if (Array.isArray(value)) {
          return value.map((item, index) => {
            const itemPath = [...path, index];
            if (item && typeof item === 'object') {
              return `<section class="admin-settings-subgroup"><h3>${formatPageFieldLabel(path.at(-1) || 'Item')} ${index + 1}</h3><div class="admin-settings-fields">${renderPageFields(item, itemPath)}</div></section>`;
            }
            return `<label>${formatPageFieldLabel(path.at(-1) || 'Item')} ${index + 1}<input data-page-setting-path="${escapeHtml(JSON.stringify(itemPath))}" value="${escapeHtml(item ?? '')}"></label>`;
          }).join('');
        }
        if (value && typeof value === 'object') {
          return Object.entries(value).filter(([key]) => key !== 'id').map(([key, item]) => {
            const itemPath = [...path, key];
            if (item && typeof item === 'object') return renderPageFields(item, itemPath);
            const label = formatPageFieldLabel(key);
            const isLongText = typeof item === 'string' && (item.length > 120 || /description|content|paragraph/i.test(key));
            const isAboutPageImage = path.length === 1 && path[0] === 'about_home' && key === 'image';
            const control = isLongText
              ? `<textarea rows="4" data-page-setting-path="${escapeHtml(JSON.stringify(itemPath))}">${escapeHtml(item ?? '')}</textarea>`
              : `<input${typeof item === 'number' ? ' type="number" step="any"' : ''} data-page-setting-path="${escapeHtml(JSON.stringify(itemPath))}" value="${escapeHtml(item ?? '')}">${isAboutPageImage ? '<input type="file" data-setting-upload="about_home_image" accept="image/*">' : ''}`;
            return `<label${isLongText ? ' class="admin-settings-wide"' : ''}>${label}${control}</label>`;
          }).join('');
        }
        const label = formatPageFieldLabel(path.at(-1) || 'Content');
        return `<label>${label}<input data-page-setting-path="${escapeHtml(JSON.stringify(path))}" value="${escapeHtml(value ?? '')}"></label>`;
      };
      view.innerHTML = `<div class="admin-toolbar"><div><span class="eyebrow">Storefront content</span><h1>Page settings</h1></div><button class="button button-primary" data-save-settings>Save changes</button></div><p class="admin-settings-intro">Edit homepage imagery and content by section.</p><form class="admin-settings-form" data-settings-form data-settings-section="page"><section class="admin-settings-group"><div class="admin-settings-group-heading"><h2>Homepage hero banners</h2><p>Select up to five products. Each banner uses the selected product image and title and links to its product page.</p></div><div class="admin-settings-fields">${heroProductFields}</div></section><section class="admin-settings-group"><div class="admin-settings-group-heading"><h2>Homepage hero fallback image</h2><p>Used when a selected product does not have an image.</p></div><div class="admin-settings-fields"><label class="admin-settings-wide">Fallback hero image<input name="hero_banner_url" value="${escapeHtml(state.settings.hero_banner_url || '')}"><input type="file" data-setting-upload="hero_banner_url" accept="image/*"></label></div></section>${editablePageSections.map(([sectionKey, sectionValue]) => `<section class="admin-settings-group"><div class="admin-settings-group-heading"><h2>${sectionKey === 'about_home' ? 'About page image' : formatPageFieldLabel(sectionKey)}</h2><p>${sectionKey === 'about_home' ? 'Manage the image shown on the About page.' : 'Edit the content and items for this page section.'}</p></div><div class="admin-settings-fields">${renderPageFields(sectionValue, [sectionKey])}</div></section>`).join('')}</form>`;
      return;
    }
    const resource = adminResources[activeTab];
    if (!resource) return;
    view.innerHTML = `<div class="admin-toolbar"><h1>${resource.title}</h1>${resource.fields.length ? '<button class="button button-primary" data-admin-create>Add new</button>' : ''}</div><div data-admin-table class="loading-state"><span class="spinner"></span>Loading records…</div>`;
    try {
      const result = await request(`${resource.path}?admin=1`);
      if (loadSequence !== state.adminLoadSequence) return;
      const rows = result.data || [];
      if (activeTab === 'categories') {
        rows.sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0) || Number(a.id) - Number(b.id));
      }
      if (activeTab === 'products') {
        const categoryOrder = new Map(state.categories.map((category, index) => [String(category.id), index]));
        rows.sort((a, b) => {
          const aOrder = categoryOrder.get(String(a.category_id)) ?? Number.MAX_SAFE_INTEGER;
          const bOrder = categoryOrder.get(String(b.category_id)) ?? Number.MAX_SAFE_INTEGER;
          return aOrder - bOrder;
        });
      }
      const columns = resource.columns;
      const showSerial = ['categories', 'products'].includes(activeTab);
      const productSerials = [];
      const productCategoryStarts = new Set();
      if (activeTab === 'products') {
        const categoryCounts = new Map();
        let previousCategory = null;
        rows.forEach((row, index) => {
          const category = row.category_id == null ? 'uncategorized' : String(row.category_id);
          if (category !== previousCategory) {
            productCategoryStarts.add(index);
            previousCategory = category;
          }
          const serial = (categoryCounts.get(category) || 0) + 1;
          categoryCounts.set(category, serial);
          productSerials[index] = serial;
        });
      }
      view.querySelector('[data-admin-table]').innerHTML = rows.length ? `<div class="admin-table-panel"><div class="admin-table-heading"><div><strong>${escapeHtml(resource.title)}</strong><span>${rows.length} ${rows.length === 1 ? 'record' : 'records'}</span></div></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr>${showSerial ? '<th class="serial-column">S.No.</th>' : ''}${columns.map((key) => `<th>${escapeHtml(key.replaceAll('_', ' '))}</th>`).join('')}<th>Actions</th></tr></thead><tbody>${rows.map((row, index) => {
        const rowClass = productCategoryStarts.has(index) ? ' class="category-start"' : '';
        const cells = columns.map((key) => {
          const value = row[key];
          const display = key === 'show_pricing'
            ? (isChecked(row.show_price) && isChecked(row.show_mrp) ? 'Yes' : 'No')
            : resource.booleans?.includes(key) || typeof value === 'boolean'
            ? (isChecked(value) ? 'Yes' : 'No')
            : (value ?? '');
          return `<td>${escapeHtml(typeof display === 'object' ? JSON.stringify(display) : display)}</td>`;
        }).join('');
        const actions = `${resource.fields.length ? `<button type="button" data-admin-edit="${escapeHtml(row.id)}">Edit</button>` : ''}<button type="button" class="danger" data-admin-delete="${escapeHtml(row.id)}">Delete</button>`;
        const serial = activeTab === 'products' ? productSerials[index] : index + 1;
        return `<tr${rowClass} data-row-id="${escapeHtml(row.id)}">${showSerial ? `<td class="serial-column">${serial}</td>` : ''}${cells}<td class="admin-actions">${actions}</td></tr>`;
      }).join('')}</tbody></table></div>` : '<div class="empty-state">No records found.</div>';
    } catch (error) {
      if (loadSequence === state.adminLoadSequence) {
        view.querySelector('[data-admin-table]').innerHTML = `<div class="notice notice-error">${escapeHtml(error.message)}</div>`;
      }
    }
  }

  function bindContentEvents() {
    root.addEventListener('click', async (event) => {
      const adminMenuToggle = event.target.closest('[data-admin-menu-toggle]');
      if (adminMenuToggle) {
        const shell = adminMenuToggle.closest('.admin-shell');
        const isOpen = shell.classList.toggle('admin-nav-open');
        adminMenuToggle.setAttribute('aria-expanded', String(isOpen));
        adminMenuToggle.setAttribute('aria-label', isOpen ? 'Close admin menu' : 'Open admin menu');
      }
      const variant = event.target.closest('[data-variant]');
      if (variant && state.selectedProduct) {
        state.selectedVariant = state.selectedProduct.variants[Number(variant.dataset.variant)];
        root.querySelectorAll('[data-variant]').forEach((button) => button.classList.toggle('active', button === variant));
        const selectedPrice = root.querySelector('[data-selected-price]');
          if (selectedPrice) selectedPrice.textContent = money(state.selectedVariant.price ?? state.selectedProduct.base_price);
        const selectedMrp = root.querySelector('[data-selected-mrp]');
          if (selectedMrp) selectedMrp.textContent = `MRP ${money(state.selectedVariant.mrp ?? state.selectedProduct.mrp)}`;
      }
      const thumb = event.target.closest('[data-gallery-image]');
      if (thumb) {
        root.querySelector('[data-main-image]').src = thumb.src;
        root.querySelectorAll('[data-gallery-image]').forEach((image) => image.classList.toggle('active', image === thumb));
      }
      const productImageButton = event.target.closest('[data-open-product-image]');
      if (productImageButton) {
        const mainImage = productImageButton.querySelector('[data-main-image]');
        const preview = document.querySelector('[data-product-image-preview]');
        preview.src = mainImage.currentSrc || mainImage.src;
        preview.alt = mainImage.alt;
        document.querySelector('[data-dialog="product-image"]').showModal();
      }
      const clientCategory = event.target.closest('[data-client-category]');
      if (clientCategory) filterClients(clientCategory.dataset.clientCategory);
      const productCategoryFilter = event.target.closest('[data-product-category-filter]');
      if (productCategoryFilter) {
        const params = new URLSearchParams(location.search);
        const category = productCategoryFilter.dataset.productCategoryFilter;
        if (category) params.set('category', category);
        else params.delete('category');
        const query = params.toString();
        history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}`);
        filterProducts();
      }
      const galleryFilter = event.target.closest('[data-gallery-filter]');
      if (galleryFilter) {
        state.activeGalleryCategory = galleryFilter.dataset.galleryFilter;
        const grid = root.querySelector('[data-image-grid]');
        const items = JSON.parse(root.dataset.galleryItems || '[]');
        const rows = state.activeGalleryCategory === 'all' ? items : items.filter((item) => item.category === state.activeGalleryCategory);
        grid.innerHTML = rows.map((item) => `<button type="button" class="card gallery-card" data-gallery-id="${item.id}"><span class="card-image"><img loading="lazy" src="${escapeHtml(imageUrl(item.image))}" alt="${escapeHtml(item.title)}"></span><span class="card-body"><span class="eyebrow">${escapeHtml(item.categoryName)}</span><strong class="card-title">${escapeHtml(item.title)}</strong><span class="muted">${escapeHtml(item.description)}</span><span class="gallery-specs">${escapeHtml(item.specs)}</span></span></button>`).join('');
      }
      const galleryTrigger = event.target.closest('[data-gallery-id]');
      if (galleryTrigger) {
        const item = JSON.parse(root.dataset.galleryItems || '[]').find((entry) => entry.id === Number(galleryTrigger.dataset.galleryId));
        if (item) openGalleryItem(item);
      }
      if (event.target.closest('[data-gallery-quote]')) {
        document.querySelector('[data-dialog="gallery"]').close();
        document.querySelector('[data-dialog="quote"]').showModal();
      }
      if (event.target.closest('[data-product-quote]')) {
        const quoteForm = document.querySelector('[data-dialog="quote"] form');
        quoteForm.elements.product_title.value = state.selectedProduct?.title || 'Bulk quote request';
        quoteForm.elements.variant_details.value = state.selectedVariant?.size_label || 'Standard';
        document.querySelector('[data-dialog="quote"]').showModal();
      }
      const adminTab = event.target.closest('[data-admin-tab]');
      if (adminTab) {
        state.adminTab = adminTab.dataset.adminTab;
        root.querySelectorAll('[data-admin-tab]').forEach((tab) => tab.classList.toggle('active', tab === adminTab));
        const shell = adminTab.closest('.admin-shell');
        shell.classList.remove('admin-nav-open');
        const menuToggle = shell.querySelector('[data-admin-menu-toggle]');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open admin menu');
        loadAdminTab();
      }
      const adminShortcut = event.target.closest('[data-admin-shortcut], [data-admin-shortcut-create]');
      if (adminShortcut) {
        const createTab = adminShortcut.dataset.adminShortcutCreate;
        state.adminTab = createTab || adminShortcut.dataset.adminShortcut;
        root.querySelectorAll('[data-admin-tab]').forEach((tab) => tab.classList.toggle('active', tab.dataset.adminTab === state.adminTab));
        if (createTab) {
          await loadAdminTab();
          await openAdminEditor();
        } else {
          loadAdminTab();
        }
      }
      if (event.target.closest('[data-admin-logout]')) {
        try { await request('/admin/logout', { method: 'POST', body: {} }); }
        catch (error) { toast(error.message, true); return; }
        location.href = '/admin/login';
      }
      if (event.target.closest('[data-admin-create]')) openAdminEditor();
      const edit = event.target.closest('[data-admin-edit]');
      if (edit) openAdminEditor(edit.dataset.adminEdit);
      const del = event.target.closest('[data-admin-delete]');
      if (del) deleteAdminRecord(del.dataset.adminDelete);
      if (event.target.closest('[data-save-settings]')) saveSettings();
    });
    root.addEventListener('input', (event) => {
      if (event.target.matches('[data-client-search]')) filterClients(state.clientCategory || 'all');
      if (event.target.matches('[data-blog-search]')) {
        const term = event.target.value.toLowerCase();
        const rows = state.blogs.filter((blog) => `${blog.title} ${blog.content || ''}`.toLowerCase().includes(term));
        root.querySelector('[data-blog-grid]').innerHTML = rows.map(blogCard).join('') || '<p class="empty-state">No articles found.</p>';
      }
    });
    root.addEventListener('submit', async (event) => {
      if (event.target.matches('[data-contact-form]')) await submitContact(event);
      if (event.target.matches('[data-admin-login]')) {
        event.preventDefault();
        const form = event.target;
        const button = form.querySelector('[type="submit"]');
        button.disabled = true;
        try {
          await request('/admin/login', { method: 'POST', body: Object.fromEntries(new FormData(form).entries()) });
          state.adminTab = 'overview';
          root.dataset.page = 'admin';
          renderAdmin();
        } catch (error) {
          form.querySelector('[data-form-message]').innerHTML = `<div class="notice notice-error">${escapeHtml(error.message)}</div>`;
        } finally {
          button.disabled = false;
        }
      }
      if (event.target.matches('[data-admin-editor]')) saveAdminRecord(event);
    });
    document.addEventListener('change', async (event) => {
      if (event.target.matches('[data-admin-image], [data-admin-gallery], [data-setting-upload]')) {
        await uploadSelectedFiles(event.target);
      }
    });
    document.querySelector('[data-admin-editor]').addEventListener('submit', saveAdminRecord);
  }

  function openGalleryItem(item) {
    const dialog = document.querySelector('[data-dialog="gallery"]');
    dialog.querySelector('[data-gallery-preview]').src = imageUrl(item.image);
    dialog.querySelector('[data-gallery-preview]').alt = item.title;
    dialog.querySelector('[data-gallery-category]').textContent = item.categoryName;
    dialog.querySelector('[data-gallery-title]').textContent = item.title;
    dialog.querySelector('[data-gallery-description]').textContent = item.description;
    dialog.querySelector('[data-gallery-specs]').textContent = item.specs;
    const whatsappNumber = String(state.settings.whatsapp || state.settings.phone || '919933944007').replace(/\D/g, '');
    dialog.querySelector('[data-gallery-whatsapp]').href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Shaw Enterprise, I am interested in ${item.title}.`)}`;
    dialog.showModal();
  }

  async function openAdminEditor(id = null) {
    const resource = adminResources[state.adminTab];
    if (!resource) return;
    let record = {};
    if (id !== null) {
      try {
        const result = await request(adminRecordPath(resource, id));
        record = result.data || result;
      } catch (error) {
        toast(`Unable to load this ${resource.title.toLowerCase()} record: ${error.message}`, true);
        return;
      }
    }
    const form = document.querySelector('[data-admin-editor]');
    form.dataset.recordId = id || '';
    form.dataset.resource = state.adminTab;
    const controls = resource.fields.map((field) => {
      const label = field.replaceAll('_', ' ');
      if (field === 'category_id') {
        return `<label>${label}<select name="${field}" required>${state.categories.map((category) => `<option value="${category.id}" ${String(category.id) === String(record[field] || '') ? 'selected' : ''}>${escapeHtml(category.name)}</option>`).join('')}</select></label>`;
      }
      if (field === 'category') {
        const choices = [
          ['university_colleges', 'University & Colleges'],
          ['schools', 'Schools'],
          ['corporate_banks', 'Corporate Office / Bank'],
          ['others', 'Others'],
        ];
        return `<label>${label}<select name="${field}">${choices.map(([value, name]) => `<option value="${value}" ${value === (record[field] || 'others') ? 'selected' : ''}>${name}</option>`).join('')}</select></label>`;
      }
      if (['short_description', 'full_description', 'content', 'review_text', 'message', 'description'].includes(field)) {
        const rows = field === 'short_description' ? 3 : 5;
        const fieldLabel = field === 'short_description' ? 'Short description' : label;
        return `<label>${fieldLabel}<textarea name="${field}" rows="${rows}">${escapeHtml(record[field] || '')}</textarea></label>`;
      }
      const type = ['base_price', 'mrp', 'display_order', 'rating'].includes(field) ? 'number' : field === 'email' ? 'email' : field === 'video_url' ? 'url' : 'text';
      const required = ['title', 'name', 'client_name'].includes(field) ? 'required' : '';
      const imageInput = resource.images?.includes(field)
        ? `<input type="file" data-admin-image="${field}" accept="image/*">`
        : '';
      return `<label>${label}<input name="${field}" type="${type}" ${required} ${type === 'number' ? `step="${field === 'rating' ? '1' : 'any'}"` : ''} value="${escapeHtml(record[field] ?? '')}">${imageInput}</label>`;
    }).join('');
    const productExtras = state.adminTab === 'products' ? `
      <label class="admin-checkbox">Featured product<input type="checkbox" name="is_featured" value="1" ${isChecked(record.is_featured) ? 'checked' : ''}></label>
      <label class="admin-checkbox"><input type="checkbox" name="show_pricing" value="1" ${isChecked(record.show_price) && isChecked(record.show_mrp) ? 'checked' : ''}>Show price &amp; MRP on product cards and details</label>
      <label>Gallery image URLs (JSON array)<textarea name="images" rows="3">${escapeHtml(JSON.stringify(record.images || [], null, 2))}</textarea><input type="file" data-admin-gallery accept="image/*" multiple></label>
      <label>Size / price variants (JSON array)<textarea name="variants" rows="6">${escapeHtml(JSON.stringify(record.variants || [], null, 2))}</textarea></label>
      <label>Specifications (JSON array)<textarea name="specifications" rows="6">${escapeHtml(JSON.stringify(record.specifications || [], null, 2))}</textarea></label>` : '';
    const visibilityControls = resource.booleans
      .filter((field) => !(state.adminTab === 'products' && field === 'is_featured'))
      .map((field) => {
        const checked = record[field] === undefined
          ? id === null && ['is_active', 'is_published', 'is_featured'].includes(field)
          : isChecked(record[field]);
      return `<label class="admin-checkbox"><input type="checkbox" name="${field}" value="1" ${checked ? 'checked' : ''}>${escapeHtml(field.replaceAll('_', ' '))}</label>`;
    })
      .join('');
    const extraFields = state.adminTab === 'products' ? productExtras : '';
    document.querySelector('[data-admin-editor-title]').textContent = `${id === null ? 'Add' : 'Edit'} ${resource.title.toLowerCase().replace(/s$/, '')}`;
    form.innerHTML = `<div class="form-grid">${controls}${visibilityControls}${extraFields}</div><div class="admin-actions"><button class="button button-primary" type="submit">Save record</button><button class="button button-outline" type="button" data-close-dialog>Cancel</button></div>`;
    form.querySelector('[data-close-dialog]').addEventListener('click', () => document.querySelector('[data-dialog="admin-edit"]').close());
    document.querySelector('[data-dialog="admin-edit"]').showModal();
  }

  async function saveAdminRecord(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const resource = adminResources[form.dataset.resource];
    if (!resource) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const button = form.querySelector('[type="submit"]');
    for (const key of ['images', 'variants', 'specifications']) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue;
      try { values[key] = JSON.parse(values[key] || '[]'); }
      catch { toast(`${key} must be valid JSON.`, true); return; }
    }
    for (const key of resource.booleans || []) {
      values[key] = form.elements[key]?.checked ? 1 : 0;
    }
    if (form.dataset.resource === 'products') {
      const showPricing = form.elements.show_pricing.checked ? 1 : 0;
      values.show_price = showPricing;
      values.show_mrp = showPricing;
      delete values.show_pricing;
    }
    for (const key of ['base_price', 'mrp', 'category_id', 'display_order', 'rating']) {
      if (values[key] !== undefined && values[key] !== '') values[key] = Number(values[key]);
    }
    try {
      button.disabled = true;
      const id = form.dataset.recordId;
      await request(id ? `${resource.path}/${encodeURIComponent(id)}` : resource.path, { method: id ? 'PUT' : 'POST', body: values });
      document.querySelector('[data-dialog="admin-edit"]').close();
      toast(`Record ${id ? 'updated' : 'created'}.`);
      loadAdminTab();
    } catch (error) { toast(error.message, true); }
    finally { button.disabled = false; }
  }

  async function uploadSelectedFiles(input) {
    const files = [...(input.files || [])];
    if (!files.length) return;
    const button = input.closest('label')?.querySelector('button') || input;
    button.disabled = true;
    try {
      const uploads = await Promise.all(files.map(async (file) => {
        const body = new FormData();
        body.append(input.matches('[data-setting-upload="catalog_pdf_url"]') ? 'file' : 'image', file);
        const endpoint = input.matches('[data-setting-upload="catalog_pdf_url"]') ? '/upload/catalog' : '/upload';
        const result = await request(endpoint, { method: 'POST', body });
        return result.url;
      }));
      if (input.matches('[data-setting-upload]')) {
        const target = input.dataset.settingUpload === 'about_home_image'
          ? [...root.querySelectorAll('[data-page-setting-path]')].find((field) => {
            const path = JSON.parse(field.dataset.pageSettingPath);
            return path.length === 2 && path[0] === 'about_home' && path[1] === 'image';
          })
          : root.querySelector(`[name="${input.dataset.settingUpload}"]`);
        if (!target) throw new Error('Unable to find the image setting for this upload.');
        target.value = uploads[0];
        if (input.dataset.settingUpload === 'catalog_pdf_url') {
          const filename = root.querySelector('[name="catalog_pdf_filename"]');
          if (filename) filename.value = files[0].name;
        }
      } else if (input.matches('[data-admin-image]')) {
        document.querySelector(`[data-admin-editor] [name="${input.dataset.adminImage}"]`).value = uploads[0];
      } else {
        const gallery = document.querySelector('[data-admin-editor] [name="images"]');
        if (!gallery) throw new Error('Unable to find the product gallery field.');
        const existing = JSON.parse(gallery.value || '[]');
        gallery.value = JSON.stringify([...existing, ...uploads], null, 2);
      }
      toast('Upload complete.');
    } catch (error) { toast(error.message, true); }
    finally { button.disabled = false; input.value = ''; }
  }

  async function deleteAdminRecord(id) {
    const resource = adminResources[state.adminTab];
    if (!resource || !window.confirm('Delete this record? This cannot be undone.')) return;
    try {
      await request(`${resource.path}/${encodeURIComponent(id)}`, { method: 'DELETE' });
      toast('Record deleted.');
      loadAdminTab();
    } catch (error) { toast(error.message, true); }
  }

  async function saveSettings() {
    const form = root.querySelector('[data-settings-form]');
    if (!form) return;
    const updated = Object.fromEntries(new FormData(form).entries());
    const socialInputs = [...form.querySelectorAll('[data-social-link]')];
    if (socialInputs.length) {
      const currentSocialLinks = state.settings.social_links && typeof state.settings.social_links === 'object' && !Array.isArray(state.settings.social_links) ? state.settings.social_links : {};
      updated.social_links = { ...currentSocialLinks };
      socialInputs.forEach((input) => {
        updated.social_links[input.dataset.socialLink] = input.value.trim();
        delete updated[input.name];
      });
    }
    const pageSettingInputs = [...form.querySelectorAll('[data-page-setting-path]')];
    const heroProductInputs = [...form.querySelectorAll('[data-hero-product-slot]')];
    if (pageSettingInputs.length || heroProductInputs.length) {
      const currentSections = state.settings.sections && typeof state.settings.sections === 'object' && !Array.isArray(state.settings.sections) ? state.settings.sections : {};
      updated.sections = JSON.parse(JSON.stringify(currentSections));
      if (heroProductInputs.length) {
        updated.sections.hero_products = Array.from({ length: 5 }, (_, index) => {
          const value = form.querySelector(`[data-hero-product-slot="${index}"]`)?.value || '';
          return value && /^\d+$/.test(value) ? Number(value) : value;
        }).filter((value) => value !== '');
      }
      pageSettingInputs.forEach((input) => {
        const path = JSON.parse(input.dataset.pageSettingPath);
        let parent = updated.sections;
        let currentValue = currentSections;
        path.slice(0, -1).forEach((key) => {
          parent = parent[key];
          currentValue = currentValue[key];
        });
        const key = path.at(-1);
        const originalValue = currentValue[key];
        const value = input.value;
        parent[key] = typeof originalValue === 'number' && value !== '' ? Number(value) : value;
      });
    }
    const settingsKeys = ['sections'].filter((key) => Object.prototype.hasOwnProperty.call(updated, key) && !pageSettingInputs.length && !heroProductInputs.length);
    for (const key of settingsKeys) {
      try { updated[key] = JSON.parse(updated[key]); }
      catch { toast(`${key.replaceAll('_', ' ')} must be valid JSON.`, true); return; }
    }
    if (Object.prototype.hasOwnProperty.call(updated, 'logo_url')) {
      updated.logo_url = updated.logo_url || state.settings.logo_url || '';
      updated.site_logo = updated.logo_url;
      updated.logo = updated.logo_url;
    }
    if (Object.prototype.hasOwnProperty.call(updated, 'favicon_url')) {
      updated.favicon_url = updated.favicon_url || state.settings.favicon_url || '';
    }
    try {
      const result = await request('/settings', { method: 'PUT', body: { ...state.settings, ...updated } });
      state.settings = result.data || { ...state.settings, ...updated };
      applySettings();
      toast('Settings saved.');
    } catch (error) { toast(error.message, true); }
  }

  async function renderPage() {
    const page = root.dataset.page;
    if (page === 'product') { await renderProduct(); return; }
    if (page === 'blog') { await renderBlog(); return; }
    if (page === 'admin' || page === 'admin-login') { await renderAdmin(); return; }
    if (page === 'home') { renderHome(); return; }
    if (page === 'products') { renderProducts(); return; }
    if (page === 'about') { renderAbout(); return; }
    if (page === 'clients') { renderClients(); return; }
    if (page === 'blogs') { renderBlogs(); return; }
    if (page === 'images') { renderImages(); return; }
    if (page === 'contact') { renderContact(); return; }
    if (page === 'legal') { renderLegal(); return; }
    if (page === 'testimonials') { renderTestimonials(); return; }
    setContent(`${pageBanner('Page not found')}<section class="section"><div class="container panel"><p>Sorry, this page could not be found.</p><a class="button button-primary" href="/">Return home</a></div></section>`);
  }

  async function init() {
    bindGlobalEvents();
    bindContentEvents();
    try {
      await loadSharedData();
      renderProductsMenu();
      await renderPage();
    } catch (error) {
      console.error('Failed to initialize Shaw Enterprise:', error);
      root.innerHTML = `<section class="section"><div class="container notice notice-error"><strong>Unable to load the store.</strong><br>${escapeHtml(error.message)}<p>Check that the PHP API and database are running, then refresh.</p></div></section>`;
    }
  }

  init();
})();
