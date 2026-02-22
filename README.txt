================================================================================
                    PRIMEPLATTER RESTAURANT PWA
                    Developed by Imran Af
================================================================================

Welcome to PrimePlatter! This is a complete, production-ready restaurant 
website and Progressive Web App (PWA) that allows customers to order food 
directly through WhatsApp.

================================================================================
SECTION 1 — HOW TO CHANGE MENU ITEMS
================================================================================

1. Open the file: data/menu.json
2. Find the item you want to change (look for the "name" field)
3. Edit the following fields:
   - "name": The display name of the item
   - "description": Short description of the item
   - "price": Price in numbers (without currency symbol)
   - "available": Set to true or false
   - "badge": Add a badge like "Bestseller" or leave empty ""

4. Save the file and refresh your website

EXAMPLE - Changing a burger name:
Before: "name": "Prime Smash Burger"
After:  "name": "Double Smash Burger"

================================================================================
SECTION 2 — HOW TO CHANGE PRICES
================================================================================

FOR REGULAR ITEMS (Burgers, Wraps, Sides, Drinks):
1. Open data/menu.json
2. Find the item and change the "price" field
3. Save the file

EXAMPLE:
Before: "price": 750
After:  "price": 850

FOR PIZZA ITEMS:
1. Open data/menu.json
2. Find the pizza item (items with "isPizza": true)
3. Change prices inside the "sizes" array

EXAMPLE:
"sizes": [
  { "label": "Small", "price": 600 },
  { "label": "Medium", "price": 900 },
  { "label": "Large", "price": 1200 }
]

================================================================================
SECTION 3 — HOW TO CHANGE WHATSAPP NUMBER
================================================================================

1. Open the file: data/settings.json
2. Find the field: "whatsappNumber"
3. Replace with your new number

IMPORTANT: Use this format exactly:
- Start with country code (92 for Pakistan)
- NO plus sign (+)
- NO spaces or dashes

EXAMPLE:
Before: "whatsappNumber": "923133801788"
After:  "whatsappNumber": "923001234567"

The phone number in the contact section will update automatically.

================================================================================
SECTION 4 — HOW TO ADD/REPLACE IMAGES
================================================================================

1. Place your new image file in the /images/ folder
2. Update the image reference in the appropriate JSON file

FOR MENU ITEMS:
- Open data/menu.json
- Find the item and change the "image" field
- Use format: "images/your-image.jpg"

EXAMPLE:
Before: "image": "images/item1.jpg"
After:  "image": "images/my-burger.jpg"

FOR DEALS:
- Open data/deals.json
- Change the "image" field

FOR LOGO AND ICONS:
- Open data/settings.json
- Change "logo", "favicon", or icon paths

IMAGE REQUIREMENTS:
- Menu item images: 400x300 pixels recommended
- Logo: 200x200 pixels, PNG with transparent background recommended
- Icons: 192x192 and 512x512 pixels for PWA
- Hero image: 1920x1080 pixels recommended

================================================================================
SECTION 5 — HOW TO ADD A NEW MENU ITEM
================================================================================

1. Open data/menu.json
2. Go to the end of the file (before the last ] bracket)
3. Add a comma after the last item's closing }
4. Copy and paste this template:

{
  "id": 11,
  "name": "Your New Item",
  "category": "burgers",
  "description": "Description of your item.",
  "price": 500,
  "image": "images/item11.jpg",
  "rating": 4.5,
  "available": true,
  "isPizza": false,
  "badge": ""
}

5. Change all the values as needed
6. Make sure the "id" is unique (not used by other items)
7. Save the file

FOR PIZZA ITEMS, use this template instead:
{
  "id": 11,
  "name": "Your Pizza",
  "category": "pizza",
  "description": "Description.",
  "image": "images/item11.jpg",
  "rating": 4.5,
  "available": true,
  "isPizza": true,
  "badge": "",
  "sizes": [
    { "label": "Small", "price": 500 },
    { "label": "Medium", "price": 750 },
    { "label": "Large", "price": 1000 }
  ]
}

AVAILABLE CATEGORIES:
- burgers
- pizza
- wraps
- sides
- drinks

================================================================================
SECTION 6 — HOW TO DEPLOY ON GITHUB PAGES
================================================================================

STEP 1: CREATE A GITHUB ACCOUNT
1. Go to https://github.com
2. Click "Sign up" and create your free account

STEP 2: CREATE A NEW REPOSITORY
1. Click the + icon in the top right
2. Select "New repository"
3. Name it: primeplatter (or any name you prefer)
4. Make it "Public"
5. Click "Create repository"

STEP 3: UPLOAD YOUR FILES
1. In your new repository, click "uploading an existing file"
2. Drag and drop ALL files from this folder
3. Make sure the folder structure is preserved:
   - index.html (in root)
   - style.css (in root)
   - app.js (in root)
   - manifest.json (in root)
   - service-worker.js (in root)
   - data/ folder with all JSON files
   - images/ folder with all images
4. Click "Commit changes"

STEP 4: ENABLE GITHUB PAGES
1. Go to Settings (tab at the top)
2. Scroll down to "Pages" section (left sidebar)
3. Under "Source", select "Deploy from a branch"
4. Under "Branch", select "main" and "/ (root)"
5. Click "Save"

STEP 5: WAIT AND ACCESS
1. Wait 2-5 minutes for deployment
2. Your site will be live at:
   https://yourusername.github.io/primeplatter

================================================================================
SECTION 7 — HOW TO INSTALL AS MOBILE APP
================================================================================

ON ANDROID (Chrome):
1. Open your PrimePlatter website in Chrome
2. Tap the three-dot menu (⋮) in the top right
3. Tap "Add to Home Screen"
4. Tap "Add"
5. The app icon will appear on your home screen

ON IPHONE (Safari):
1. Open your PrimePlatter website in Safari
2. Tap the Share icon (square with arrow up)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. The app icon will appear on your home screen

AUTOMATIC INSTALL BANNER:
- The website will show an install banner after 5 seconds on first visit
- Tap "Install" to add to home screen
- Or tap ✕ to dismiss (won't show again)

================================================================================
SECTION 8 — HOW TO CHANGE COLORS
================================================================================

1. Open data/settings.json
2. Find the "theme" section
3. Change the color values:

"theme": {
  "accentColor": "#FF4500",      <- Main button/badge color
  "accentGradient": "linear-gradient(135deg, #FF4500, #FF8C00)",
  "darkBg": "#0f0f0f",           <- Dark mode background
  "darkSurface": "#1a1a1a",      <- Dark mode cards
  "darkCard": "#222222",         <- Dark mode card background
  "lightBg": "#f5f5f5",          <- Light mode background
  "lightSurface": "#ffffff",     <- Light mode cards
  "lightCard": "#f0f0f0",        <- Light mode card background
  "textDark": "#ffffff",         <- Text color in dark mode
  "textLight": "#111111"         <- Text color in light mode
}

COLOR FORMAT:
- Use HEX colors: #FF4500 (orange-red)
- Find colors at: https://colorpicker.me

================================================================================
SECTION 9 — HOW TO CHANGE DELIVERY FEE
================================================================================

1. Open data/settings.json
2. Find the field: "deliveryFee"
3. Change the number to your desired fee

EXAMPLE:
Before: "deliveryFee": 100
After:  "deliveryFee": 150

The delivery fee will automatically update in the cart and checkout.

================================================================================
SECTION 10 — HOW TO CHANGE OPENING HOURS
================================================================================

1. Open data/settings.json
2. Find the "contact" section
3. Look for "openingHours"
4. Edit the weekdays and weekends fields:

EXAMPLE:
"openingHours": {
  "weekdays": "12:00 PM – 12:00 AM",
  "weekends": "11:00 AM – 1:00 AM"
}

Change to:
"openingHours": {
  "weekdays": "10:00 AM – 11:00 PM",
  "weekends": "9:00 AM – 12:00 AM"
}

================================================================================
                           ADDITIONAL NOTES
================================================================================

FILE STRUCTURE:
- All website files must stay in their current locations
- Don't move files between folders
- Don't rename the main files (index.html, style.css, app.js)

BACKUP:
- Always keep a backup copy of your data files
- Before making changes, copy the original file

TESTING:
- Test all changes in your browser before deploying
- Open index.html directly in Chrome/Firefox to preview
- Check both dark and light modes
- Test on mobile devices

SUPPORT:
- This app uses vanilla HTML, CSS, and JavaScript
- No frameworks or build tools required
- Works on any static web hosting (GitHub Pages, Netlify, etc.)

================================================================================
                         CRAFTED BY IMRAN AF
================================================================================

Thank you for using PrimePlatter!
For customizations or support, contact the developer.

================================================================================
