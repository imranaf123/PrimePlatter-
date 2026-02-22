/**
 * PRIMEPLATTER - COMPLETE APPLICATION
 * Developed by Imran Af
 */

// ============================================
// GLOBAL STATE
// ============================================
let settings = {};
let menuItems = [];
let deals = [];
let categories = [];
let cart = [];
let activeCategory = 'all';
let searchQuery = '';
let currentPizzaItem = null;
let selectedSize = null;
let deferredPrompt = null;

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatPrice(price) {
  const symbol = settings.currencySymbol || 'Rs.';
  return `${symbol} ${price.toLocaleString()}`;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let starsHTML = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHTML += '<span class="star">★</span>';
    } else if (i === fullStars && hasHalfStar) {
      starsHTML += '<span class="star">★</span>';
    } else {
      starsHTML += '<span class="star empty">★</span>';
    }
  }
  
  return starsHTML;
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// ============================================
// DATA LOADING
// ============================================
async function loadSettings() {
  try {
    const response = await fetch('./data/settings.json');
    settings = await response.json();
  } catch (error) {
    console.error('Failed to load settings:', error);
    showToast('Failed to load settings', 'error');
  }
}

async function loadCategories() {
  try {
    const response = await fetch('./data/categories.json');
    categories = await response.json();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

async function loadMenu() {
  try {
    const response = await fetch('./data/menu.json');
    menuItems = await response.json();
  } catch (error) {
    console.error('Failed to load menu:', error);
    showToast('Failed to load menu', 'error');
  }
}

async function loadDeals() {
  try {
    const response = await fetch('./data/deals.json');
    deals = await response.json();
  } catch (error) {
    console.error('Failed to load deals:', error);
  }
}

// ============================================
// THEME MANAGEMENT
// ============================================
function restoreTheme() {
  const savedTheme = localStorage.getItem('primeplatter_theme');
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

function toggleTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('primeplatter_theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('primeplatter_theme', 'light');
  }
}

// ============================================
// CART MANAGEMENT
// ============================================
function restoreCart() {
  const savedCart = localStorage.getItem('primeplatter_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem('primeplatter_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(item, size = null) {
  const existingItem = cart.find(cartItem => 
    cartItem.id === item.id && cartItem.size === size
  );
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      size: size,
      price: size ? item.sizes.find(s => s.label === size).price : item.price,
      quantity: 1,
      image: item.image
    });
  }
  
  saveCart();
  showToast('Item added to cart!', 'success');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function updateQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    saveCart();
  }
}

function clearCart() {
  cart = [];
  saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const count = getCartItemCount();
  
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
  
  renderCartItems();
}

// ============================================
// CART DRAWER
// ============================================
function openCart() {
  document.getElementById('cart-overlay').classList.add('active');
  document.getElementById('cart-drawer').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('active');
  document.getElementById('cart-drawer').classList.remove('active');
  document.body.style.overflow = '';
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const footer = document.getElementById('cart-footer');
  const countLabel = document.getElementById('cart-count');
  
  countLabel.textContent = `(${getCartItemCount()} item${getCartItemCount() !== 1 ? 's' : ''})`;
  
  if (cart.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'flex';
    footer.style.display = 'none';
    return;
  }
  
  emptyState.style.display = 'none';
  footer.style.display = 'block';
  
  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" width="60" height="60">
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name}</p>
        ${item.size ? `<p class="cart-item-size">${item.size}</p>` : ''}
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
      <button class="cart-item-remove" onclick="removeFromCart(${index})" aria-label="Remove item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `).join('');
  
  const subtotal = getCartTotal();
  const deliveryFee = settings.deliveryFee || 100;
  const total = subtotal + deliveryFee;
  
  document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('cart-delivery').textContent = formatPrice(deliveryFee);
  document.getElementById('cart-total').textContent = formatPrice(total);
}

// ============================================
// SIZE MODAL (For Pizza)
// ============================================
function openSizeModal(item) {
  currentPizzaItem = item;
  selectedSize = null;
  
  document.getElementById('size-modal-title').textContent = item.name;
  document.getElementById('size-modal-image').src = item.image;
  document.getElementById('size-modal-image').alt = item.name;
  
  const optionsContainer = document.getElementById('size-options');
  optionsContainer.innerHTML = item.sizes.map(size => `
    <button class="size-option" data-size="${size.label}" data-price="${size.price}" onclick="selectSize('${size.label}', ${size.price})">
      <span class="size-option-label">${size.label}</span>
      <span class="size-option-price">${formatPrice(size.price)}</span>
    </button>
  `).join('');
  
  document.getElementById('size-selected-price').textContent = 'Selected Price: Rs. 0';
  document.getElementById('size-add').disabled = true;
  
  document.getElementById('size-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeSizeModal() {
  document.getElementById('size-modal').style.display = 'none';
  document.body.style.overflow = '';
  currentPizzaItem = null;
  selectedSize = null;
}

function selectSize(size, price) {
  selectedSize = size;
  
  document.querySelectorAll('.size-option').forEach(btn => {
    btn.classList.remove('selected');
  });
  document.querySelector(`[data-size="${size}"]`).classList.add('selected');
  
  document.getElementById('size-selected-price').textContent = `Selected Price: ${formatPrice(price)}`;
  document.getElementById('size-add').disabled = false;
}

function confirmSizeAddToCart() {
  if (currentPizzaItem && selectedSize) {
    addToCart(currentPizzaItem, selectedSize);
    closeSizeModal();
  }
}

// ============================================
// CHECKOUT MODAL
// ============================================
function openCheckout() {
  closeCart();
  
  const container = document.getElementById('checkout-items');
  container.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <span>${item.name}${item.size ? ` (${item.size})` : ''} × ${item.quantity}</span>
      <span>${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('');
  
  const subtotal = getCartTotal();
  const deliveryFee = settings.deliveryFee || 100;
  const total = subtotal + deliveryFee;
  
  document.getElementById('checkout-delivery').textContent = formatPrice(deliveryFee);
  document.getElementById('checkout-total').textContent = formatPrice(total);
  
  document.getElementById('checkout-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').style.display = 'none';
  document.body.style.overflow = '';
  clearValidationErrors();
}

function clearValidationErrors() {
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.classList.remove('error');
  });
  document.querySelectorAll('.error-message').forEach(msg => {
    msg.textContent = '';
  });
}

function validateCheckoutForm() {
  clearValidationErrors();
  
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  
  let isValid = true;
  
  if (name.length < 2) {
    document.getElementById('customer-name').classList.add('error');
    document.getElementById('name-error').textContent = 'Name must be at least 2 characters';
    isValid = false;
  }
  
  const phoneRegex = /^(\+?92|0)?[0-9]{10,11}$/;
  if (!phoneRegex.test(phone.replace(/[-\s]/g, ''))) {
    document.getElementById('customer-phone').classList.add('error');
    document.getElementById('phone-error').textContent = 'Please enter a valid Pakistani phone number';
    isValid = false;
  }
  
  if (address.length < 10) {
    document.getElementById('customer-address').classList.add('error');
    document.getElementById('address-error').textContent = 'Address must be at least 10 characters';
    isValid = false;
  }
  
  return isValid;
}

function generateWhatsAppMessage() {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const notes = document.getElementById('order-notes').value.trim();
  
  const subtotal = getCartTotal();
  const deliveryFee = settings.deliveryFee || 100;
  const total = subtotal + deliveryFee;
  
  let itemsText = cart.map(item => {
    const sizeText = item.size ? ` (${item.size})` : '';
    return `• ${item.name}${sizeText} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`;
  }).join('\n');
  
  const message = `🍽️ *NEW ORDER — PrimePlatter*
━━━━━━━━━━━━━━━━━━━━━━

👤 *CUSTOMER DETAILS*
• Name: ${name}
• Phone: ${phone}
• Address: ${address}
• Notes: ${notes || 'None'}

━━━━━━━━━━━━━━━━━━━━━━
🛒 *ORDER DETAILS*

${itemsText}

━━━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT SUMMARY*
• Subtotal: ${formatPrice(subtotal)}
• Delivery: ${formatPrice(deliveryFee)}
• *TOTAL: ${formatPrice(total)}*

━━━━━━━━━━━━━━━━━━━━━━
📱 Ordered via PrimePlatter App`;
  
  return message;
}

function placeOrder() {
  if (!validateCheckoutForm()) {
    showToast('Please fix the errors in the form', 'error');
    return;
  }
  
  const message = generateWhatsAppMessage();
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');
  
  clearCart();
  closeCheckoutModal();
  showToast('Order sent! We\'ll confirm shortly. ✅', 'success');
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderNav() {
  document.getElementById('nav-logo').src = settings.logo;
  document.getElementById('nav-logo').alt = settings.restaurantName;
  document.getElementById('nav-title').textContent = settings.restaurantName;
}

function renderHero() {
  document.getElementById('hero-title').textContent = settings.restaurantName;
}

function renderCategories() {
  const container = document.getElementById('category-pills');
  container.innerHTML = categories.map(cat => `
    <button class="category-pill ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}" onclick="setCategory('${cat.id}')">
      <span>${cat.icon}</span>
      <span>${cat.label}</span>
    </button>
  `).join('');
}

function setCategory(categoryId) {
  activeCategory = categoryId;
  
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.category === categoryId);
  });
  
  renderMenu();
}

function filterMenu() {
  let filtered = menuItems;
  
  if (activeCategory !== 'all') {
    filtered = filtered.filter(item => item.category === activeCategory);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }
  
  return filtered;
}

function renderMenu() {
  const container = document.getElementById('menu-grid');
  const noResults = document.getElementById('no-results');
  const filtered = filterMenu();
  
  if (filtered.length === 0) {
    container.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  
  noResults.style.display = 'none';
  
  container.innerHTML = filtered.map(item => {
    const priceDisplay = item.isPizza 
      ? `From ${formatPrice(item.sizes[0].price)}`
      : formatPrice(item.price);
    
    return `
      <div class="menu-card">
        <div class="menu-card-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy" width="280" height="180">
          ${item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : ''}
          <span class="menu-card-availability ${item.available ? 'available' : 'unavailable'}">
            ${item.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <div class="menu-card-body">
          <h3 class="menu-card-title">${item.name}</h3>
          <p class="menu-card-desc">${item.description}</p>
          <div class="menu-card-rating">
            <span class="stars">${generateStars(item.rating)}</span>
            <span class="rating-value">${item.rating}</span>
          </div>
          <div class="menu-card-footer">
            <span class="menu-card-price">${priceDisplay}</span>
            <button class="add-to-cart-btn" 
              onclick="${item.isPizza ? `openSizeModal(menuItems.find(i => i.id === ${item.id}))` : `addToCart(menuItems.find(i => i.id === ${item.id}))`}"
              ${!item.available ? 'disabled' : ''}>
              ${item.available ? 'Add to Cart' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderDeals() {
  const container = document.getElementById('deals-grid');
  
  container.innerHTML = deals.map(deal => {
    const savings = deal.originalPrice - deal.dealPrice;
    
    return `
      <div class="deal-card ${!deal.available ? 'unavailable' : ''}">
        <div class="deal-card-image">
          <img src="${deal.image}" alt="${deal.name}" loading="lazy" width="300" height="180">
          <span class="deal-save-badge">Save ${formatPrice(savings)}</span>
        </div>
        <div class="deal-card-body">
          <h3 class="deal-card-title">${deal.name}</h3>
          <div class="deal-items">
            ${deal.items.map(item => `<p class="deal-item">${item}</p>`).join('')}
          </div>
          <div class="deal-price-row">
            <span class="deal-original-price">${formatPrice(deal.originalPrice)}</span>
            <span class="deal-price">${formatPrice(deal.dealPrice)}</span>
          </div>
          <button class="order-deal-btn" onclick="orderDeal(${deal.id})" ${!deal.available ? 'disabled' : ''}>
            ${deal.available ? 'Order Now' : 'Unavailable'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function orderDeal(dealId) {
  const deal = deals.find(d => d.id === dealId);
  if (!deal || !deal.available) return;
  
  const dealItem = {
    id: `deal-${deal.id}`,
    name: deal.name,
    size: null,
    price: deal.dealPrice,
    quantity: 1,
    image: deal.image
  };
  
  const existingItem = cart.find(item => item.id === dealItem.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push(dealItem);
  }
  
  saveCart();
  showToast('Deal added to cart!', 'success');
  openCart();
}

function renderAbout() {
  document.getElementById('about-heading').textContent = settings.about.heading;
  document.getElementById('about-description').textContent = settings.about.description;
  document.getElementById('about-established').textContent = `Established: ${settings.about.established}`;
  document.getElementById('about-tagline').textContent = settings.about.tagline;
}

function renderContact() {
  document.getElementById('contact-address').textContent = settings.contact.address;
  
  const phoneEl = document.getElementById('contact-phone');
  phoneEl.textContent = settings.contact.phone;
  phoneEl.href = `tel:${settings.contact.phone.replace(/[^0-9+]/g, '')}`;
  
  const whatsappEl = document.getElementById('contact-whatsapp');
  whatsappEl.textContent = settings.contact.whatsapp;
  whatsappEl.href = `https://wa.me/${settings.whatsappNumber}`;
  
  const emailEl = document.getElementById('contact-email');
  emailEl.textContent = settings.contact.email;
  emailEl.href = `mailto:${settings.contact.email}`;
  
  document.getElementById('contact-hours').innerHTML = `
    Weekdays: ${settings.contact.openingHours.weekdays}<br>
    Weekends: ${settings.contact.openingHours.weekends}
  `;
  
  document.getElementById('directions-btn').href = settings.contact.mapLink;
  document.getElementById('quick-whatsapp').href = `https://wa.me/${settings.whatsappNumber}`;
}

function renderFooter() {
  document.getElementById('footer-name').textContent = settings.restaurantName;
  document.getElementById('footer-tagline').textContent = settings.about.tagline;
  document.getElementById('copyright-year').textContent = new Date().getFullYear();
  
  const instagramEl = document.getElementById('social-instagram');
  if (settings.social.instagram) {
    instagramEl.href = settings.social.instagram;
    instagramEl.style.display = 'flex';
  }
  
  const facebookEl = document.getElementById('social-facebook');
  if (settings.social.facebook) {
    facebookEl.href = settings.social.facebook;
    facebookEl.style.display = 'flex';
  }
  
  const tiktokEl = document.getElementById('social-tiktok');
  if (settings.social.tiktok) {
    tiktokEl.href = settings.social.tiktok;
    tiktokEl.style.display = 'flex';
  }
}

// ============================================
// TYPING ANIMATION SYSTEM
// ============================================

// Type text into an element with a typing effect
function typeText(element, text, speed = 80, callback = null) {
  let charIndex = 0;
  element.textContent = '';
  element.style.opacity = '1';
  
  function type() {
    if (charIndex < text.length) {
      element.textContent += text.charAt(charIndex);
      charIndex++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  
  type();
}

// Initialize all typing animations on page load
function initTypingAnimations() {
  // Hero label - "Welcome to"
  const heroLabel = document.querySelector('.hero-label');
  if (heroLabel) {
    heroLabel.style.opacity = '0';
    setTimeout(() => {
      heroLabel.style.opacity = '1';
      typeText(heroLabel, 'Welcome to', 60);
    }, 600);
  }
  
  // Hero title - "PrimePlatter"
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    setTimeout(() => {
      typeText(heroTitle, originalText, 100);
    }, 1000);
  }
  
  // Hero taglines (rotating)
  setTimeout(() => {
    initHeroTaglines();
  }, 1800);
}

// Hero tagline rotation with typing effect
function initHeroTaglines() {
  const taglines = settings.heroTaglines || ['Order Now'];
  const element = document.getElementById('typing-text');
  let taglineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;
  
  function type() {
    const currentTagline = taglines[taglineIndex];
    
    if (isDeleting) {
      element.textContent = currentTagline.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      element.textContent = currentTagline.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }
    
    if (!isDeleting && charIndex === currentTagline.length) {
      isDeleting = true;
      typingSpeed = 2500;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      taglineIndex = (taglineIndex + 1) % taglines.length;
      typingSpeed = 300;
    }
    
    setTimeout(type, typingSpeed);
  }
  
  type();
}

// Section title typing animation on scroll
function initSectionTitleAnimations() {
  const sectionTitles = document.querySelectorAll('.section-title');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
        entry.target.classList.add('typed');
        const originalText = entry.target.textContent;
        entry.target.textContent = '';
        
        let charIndex = 0;
        function typeTitle() {
          if (charIndex < originalText.length) {
            entry.target.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeTitle, 50);
          }
        }
        typeTitle();
      }
    });
  }, { threshold: 0.5 });
  
  sectionTitles.forEach(title => observer.observe(title));
}

// Legacy function name for compatibility
function initTypingAnimation() {
  initTypingAnimations();
  initSectionTitleAnimations();
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        document.getElementById('mobile-nav').classList.remove('active');
      }
    });
  });
}

// ============================================
// MOBILE NAV
// ============================================
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const closeNav = document.getElementById('close-nav');
  const mobileNav = document.getElementById('mobile-nav');
  
  menuToggle.addEventListener('click', () => {
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  closeNav.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ============================================
// SEARCH
// ============================================
function initSearch() {
  const searchInput = document.getElementById('menu-search');
  
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderMenu();
  });
}

// ============================================
// PWA INSTALL BANNER
// ============================================
function initPWA() {
  const installBanner = document.getElementById('install-banner');
  const installBtn = document.getElementById('install-btn');
  const dismissBtn = document.getElementById('dismiss-install-btn');
  
  // Check if already dismissed
  if (localStorage.getItem('primeplatter_install_dismissed')) {
    return;
  }
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show banner after 5 seconds
    setTimeout(() => {
      installBanner.style.display = 'flex';
    }, 5000);
  });
  
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBanner.style.display = 'none';
      }
      deferredPrompt = null;
    }
  });
  
  dismissBtn.addEventListener('click', () => {
    installBanner.style.display = 'none';
    localStorage.setItem('primeplatter_install_dismissed', 'true');
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    });
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // Cart
  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('close-cart').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);
  document.getElementById('checkout-btn').addEventListener('click', openCheckout);
  
  // Size modal
  document.getElementById('size-cancel').addEventListener('click', closeSizeModal);
  document.getElementById('size-add').addEventListener('click', confirmSizeAddToCart);
  document.getElementById('size-modal').addEventListener('click', (e) => {
    if (e.target.id === 'size-modal') closeSizeModal();
  });
  
  // Checkout modal
  document.getElementById('checkout-back').addEventListener('click', () => {
    closeCheckoutModal();
    openCart();
  });
  document.getElementById('checkout-place').addEventListener('click', placeOrder);
  document.getElementById('checkout-modal').addEventListener('click', (e) => {
    if (e.target.id === 'checkout-modal') closeCheckoutModal();
  });
  
  // Clear errors on input
  document.querySelectorAll('#checkout-form input, #checkout-form textarea').forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('error');
      const errorEl = document.getElementById(`${this.id.replace('customer-', '')}-error`);
      if (errorEl) errorEl.textContent = '';
    });
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeSizeModal();
      closeCheckoutModal();
      document.getElementById('mobile-nav').classList.remove('active');
    }
  });
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
  await loadSettings();
  await loadCategories();
  await loadMenu();
  await loadDeals();
  
  restoreTheme();
  restoreCart();
  
  renderNav();
  renderHero();
  renderCategories();
  renderMenu();
  renderDeals();
  renderAbout();
  renderContact();
  renderFooter();
  
  initTypingAnimation();
  initScrollEffects();
  initMobileNav();
  initSearch();
  initPWA();
  initEventListeners();
  registerServiceWorker();
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
