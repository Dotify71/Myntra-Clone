# S&W Myntra Clone

A Myntra-inspired fashion e-commerce app built from scratch using plain HTML, CSS, and JavaScript. No frameworks, no build step — just open `index.html` and it works.

Built as part of the S&W Hackathon.

---

## What's inside

The app covers the full shopping flow — browse products, add to wishlist, add to cart, apply coupons, and place an order. Everything persists in localStorage so your cart and wishlist survive a page refresh.

**Shopping**
- 24+ products across Men, Women, Kids, Beauty, and Home
- Product detail page with image gallery, size selector, and product info
- Cart with quantity controls, price breakdown, and coupon support
- Coupon codes: `SAVE10` (10% off), `FLAT200` (₹200 off)
- Order confirmation screen after checkout

**Wishlist**
- Add/remove from any product card or detail page
- Dedicated wishlist page with option to move items to bag

**Search and filters**
- Real-time search as you type
- Filter by category, price range, brand, and rating
- Sort by price (low to high / high to low), popularity, and new arrivals

**Auth**
- Login/Signup modal with basic validation
- Login state persists across sessions
- Profile dropdown with logout

---

## Running locally

No install needed. Pick any of these:

```bash
# Python
python3 -m http.server 3000

# Node
npx serve . -p 3000
```

Or use the Live Server extension in VS Code — right-click `index.html` and open with Live Server.

Then go to `http://localhost:3000`.

---

## Project structure

```
├── index.html
├── style.css
├── app.js
├── router.js
├── store.js
├── products.js
├── cart.js
├── auth.js
├── wishlist.js
├── ui.js
└── views/
    ├── home.js
    ├── productsListing.js
    ├── productsGrid.js
    ├── productDetailView.js
    ├── cartView.js
    ├── wishlistView.js
    ├── ordersView.js
    ├── searchInit.js
    ├── homeCarousel.js
    ├── toast.js
    └── skeleton.js
```

Routing is hash-based (`#home`, `#products`, `#cart`, `#wishlist`, `#product/p1`). Each view is a JS module that renders into a single root div.

---

## localStorage keys

| Key | What it stores |
|-----|----------------|
| `myntra_cart` | Cart items and quantities |
| `myntra_wishlist` | Wishlisted product IDs |
| `myntra_auth` | Logged-in user info |

---

## Tech

Plain HTML, CSS, and vanilla JS (ES6 modules). No React, no Vite, no npm required to run it.

---

## Note

This is a front-end only clone built for learning purposes. Not affiliated with Myntra or Flipkart.