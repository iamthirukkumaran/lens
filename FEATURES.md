# Hub of Frames - Complete Feature Documentation

## 🎯 Project Overview
A full-stack Next.js 14 eyewear e-commerce platform with TypeScript, MongoDB, Tailwind CSS, and comprehensive role-based access control.

## ✨ Core Features Implemented

### 1. **Authentication & Authorization**
- User registration with role selection (Admin/Customer)
- Login with password hashing (bcryptjs)
- Role-based redirects (Admin → Dashboard, Customer → Collections)
- Session persistence with localStorage
- Secure logout functionality

**Files:**
- `/api/auth/login` - Login endpoint
- `/api/auth/register` - Registration endpoint
- `/app/login/page.tsx` - Login form
- `/app/register/page.tsx` - Registration form

**Demo Credentials:**
```
Admin: admin@demo.com / admin123
Customer: customer@demo.com / customer123
```

---

### 2. **Product Management**

#### Admin Features:
- Add new products with multiple fields (name, price, discount, brand, material, colors, sizes, images)
- Edit existing products
- Delete products
- View all products in dashboard table
- Product gallery with image management

#### Customer Features:
- Browse products by category (Men, Women, Kids)
- Filter by brand, material, size
- View product details with images and specifications
- Add to cart with quantity selection
- Buy Now direct checkout

**Files:**
- `/api/products` - GET/POST products with filters
- `/api/products/[id]` - GET/PUT/DELETE individual products
- `/app/admin/dashboard` - Admin product management
- `/app/admin/products/add` - Add new products
- `/app/admin/products/[id]/edit` - Edit products
- `/app/collections/[gender]` - Browse collections with filters
- `/app/product/[productId]` - Product details page

---

### 3. **Shopping & Cart**

- **Add to Cart** - Store items in localStorage
- **Cart Persistence** - Cart data survives page refreshes
- **Remove from Cart** - Delete items
- **Quantity Management** - Adjust quantities for each item
- **Shopping Cart Display** - Slide-out cart panel in header

**Files:**
- `/api/cart` - Cart CRUD operations
- Cart state stored in localStorage

---

### 4. **Checkout & Orders**

#### 3-Step Checkout Process:
1. **Cart Review** - Review items, quantities, and prices
2. **Shipping Details** - Enter delivery address
3. **Payment** - Complete purchase with order confirmation

#### Order Features:
- Unique order ID generation
- Order timestamp
- Customer address storage
- Order status tracking
- Complete order history

**Files:**
- `/app/checkout` - 3-step checkout flow
- `/app/order-confirmation/[orderId]` - Order confirmation
- `/app/orders` - Order history page
- `/api/orders` - Create and retrieve orders

---

### 5. **Favorites/Wishlist**

- **Add to Favorites** - Heart icon for quick access
- **View Wishlist** - Dedicated favorites page
- **Share Wishlist** - Generate shareable links with encoded product data
- **Public Wishlist Viewing** - View shared wishlists
- **Add from Wishlist** - Add favorited items to cart

**Files:**
- `/app/favorites` - Favorites page
- `/app/wishlist/[encoded]` - Shared wishlist viewer
- `/api/favorites` - Favorites CRUD

---

### 6. **Search & Discovery**

- **Full-Text Search** - Search by product name and brand
- **Search Suggestions** - Real-time search results
- **Advanced Filters** - Brand, material, size filters
- **Search History** - Recent searches

**Files:**
- `/app/search` - Search page
- `/api/products/search` - Search endpoint

---

### 7. **Product Comparison**

- **Compare up to 4 products** - Side-by-side comparison
- **Detailed Specifications** - Price, brand, materials, colors, sizes
- **Quick Actions** - Add to cart from comparison
- **Remove Products** - Manage comparison list

**Files:**
- `/app/compare` - Product comparison page

---

### 8. **Customer Profile & Preferences**

- **User Profile** - View and edit user information
- **Shipping Address** - Save delivery addresses
- **My Orders** - Order history with status tracking
- **My Favorites** - Saved items
- **Account Management** - Change password (future)

**Files:**
- `/app/profile` - User profile and address management
- `/app/orders` - Order history

---

### 9. **Admin Dashboard**

- **Product Management Table** - View all products with edit/delete
- **Quick Statistics** - Total products count
- **Add Product Form** - Dedicated add product page
- **Edit Products** - Update product details
- **Delete Products** - Remove products from inventory

**Files:**
- `/app/admin/dashboard` - Dashboard table
- `/app/admin/products/add` - Add products
- `/app/admin/products/[id]/edit` - Edit products

---

### 10. **Information Pages**

#### Size & Fit Guide:
- Frame size measurement guide (Eye Size, Bridge, Temple Length)
- Face shape recommendations
- Material descriptions
- Care instructions

#### FAQ:
- 10+ common questions answered
- Expandable Q&A interface
- Contact support CTA

#### Contact Page:
- Contact form
- Business information (email, phone, address)
- Social media links
- Form validation and submission

#### Returns & Exchanges:
- 30-day return policy
- Return eligibility requirements
- Step-by-step return process
- Exchange information
- Damaged item handling

**Files:**
- `/app/size-guide` - Size and fit guide
- `/app/faq` - FAQ page
- `/app/contact` - Contact form
- `/app/returns` - Returns policy

---

### 11. **Navigation & Menu**

#### Header Navigation:
- Logo and branding
- Search button (links to `/search`)
- Favorites button (links to `/favorites`)
- Shopping cart button
- Login button (unauthenticated users)
- Hamburger menu

#### Hamburger Menu:
- Logo and close button
- User information (if logged in)
- Collections (Men, Women, Kids)
- My Favorites
- My Address
- My Orders
- Admin Dashboard (admin only)
- Add Product (admin only)
- Logout button

**Files:**
- `/app/page.tsx` - Homepage with integrated navigation
- `/app/components/Footer.tsx` - Footer with links

---

### 12. **Footer**

Complete footer with:
- Brand information
- Shop links (Collections)
- Resources (Size Guide, FAQ, Search, Contact)
- Account links (Login, Favorites, Orders)
- Legal links (Privacy, Terms, Returns)
- Copyright information

---

### 13. **Database Models**

#### Product Model:
```typescript
{
  name: String,
  price: Number,
  mrp: Number,
  discount: Number,
  images: [String],
  brand: String,
  material: [String],
  colors: [String],
  sizes: [String],
  gender: String, // 'men', 'women', 'kids'
  createdAt: Date,
  updatedAt: Date
}
```

#### User Model:
```typescript
{
  name: String,
  email: String,
  password: String (hashed),
  role: String, // 'admin' or 'customer'
  createdAt: Date,
  updatedAt: Date
}
```

#### Order Model:
```typescript
{
  userId: String,
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  subtotal: Number,
  tax: Number,
  total: Number,
  status: String, // 'pending', 'processing', 'shipped', 'delivered'
  orderId: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

#### Rating Model (implemented):
```typescript
{
  productId: String,
  userId: String,
  rating: Number (1-5),
  review: String,
  userName: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Notification Model (implemented):
```typescript
{
  userId: String,
  productId: String,
  productName: String,
  type: String, // 'stock', 'price_drop', 'new_arrival'
  notified: Boolean,
  email: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛠️ Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18+
- TypeScript
- Tailwind CSS 3.3
- Lucide Icons

**Backend:**
- Next.js API Routes
- MongoDB
- Mongoose
- bcryptjs (password hashing)

**Styling:**
- Fira Sans Font (globally applied)
- Gradient backgrounds
- Responsive design (mobile-first)
- Smooth transitions and animations

**State Management:**
- React hooks (useState, useEffect)
- localStorage (client-side persistence)

---

## 📁 Project Structure

```
app/
├── layout.tsx                 # Root layout with Fira Sans
├── page.tsx                   # Homepage with hamburger menu & footer
├── globals.css                # Tailwind CSS
│
├── api/                       # API Routes
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── register/route.ts
│   ├── products/
│   │   ├── route.ts
│   │   ├── [id]/route.ts
│   │   └── search/route.ts
│   ├── orders/route.ts
│   ├── cart/route.ts
│   ├── favorites/route.ts
│   ├── ratings/route.ts
│   ├── seed/route.ts
│   └── seed-users/route.ts
│
├── components/
│   ├── Footer.tsx            # Global footer component
│   └── ...
│
├── login/page.tsx             # Login form
├── register/page.tsx          # Registration form
│
├── collections/
│   └── [gender]/page.tsx      # Collections with filters
│
├── product/
│   └── [productId]/page.tsx   # Product details
│
├── checkout/page.tsx          # 3-step checkout
├── order-confirmation/[orderId]/page.tsx
├── orders/page.tsx            # Order history
├── profile/page.tsx           # User profile
│
├── favorites/page.tsx         # Wishlist page
├── wishlist/[encoded]/page.tsx # Shared wishlist
├── search/page.tsx            # Search page
├── compare/page.tsx           # Product comparison
│
├── admin/
│   ├── dashboard/page.tsx     # Admin dashboard
│   └── products/
│       ├── add/page.tsx
│       └── [id]/edit/page.tsx
│
├── size-guide/page.tsx        # Size & fit guide
├── faq/page.tsx               # FAQ page
├── contact/page.tsx           # Contact page
└── returns/page.tsx           # Returns policy

models/
├── Product.ts
├── User.ts
├── Order.ts
├── Rating.ts
└── Notification.ts

lib/
└── mongodb.ts                 # MongoDB connection
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env.local`:
```
MONGODB_URI=your_mongodb_connection_string
```

### 3. Seed Demo Data
```bash
# Create demo products
curl http://localhost:3000/api/seed

# Create demo users (admin & customer)
curl -X POST http://localhost:3000/api/seed-users
```

### 4. Start Dev Server
```bash
npm run dev
```

Navigate to `http://localhost:3000`

---

## 📊 Features by User Role

### Customer:
- ✅ Browse products by category
- ✅ Search products
- ✅ View product details
- ✅ Add to favorites
- ✅ Add to cart
- ✅ Checkout (3 steps)
- ✅ View orders
- ✅ Manage profile & address
- ✅ Compare products
- ✅ Access all information pages
- ✅ Share wishlists

### Admin:
- ✅ All customer features
- ✅ Add new products
- ✅ Edit products
- ✅ Delete products
- ✅ View admin dashboard
- ✅ Access admin panel

### Guest:
- ✅ Browse products
- ✅ Search products
- ✅ View product details
- ✅ Access information pages
- ✅ View shared wishlists
- ✅ Contact support

---

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Modern Gradient Backgrounds** - Subtle white-to-gray gradients
- **Fira Sans Typography** - Elegant, light font throughout
- **Smooth Animations** - Hover effects, transitions
- **Icon Integration** - Lucide icons throughout
- **Loading States** - Spinners and placeholders
- **Error Handling** - User-friendly error messages
- **Success Feedback** - Confirmation messages
- **Accessibility** - Semantic HTML, ARIA labels

---

## 📈 Future Enhancements

- [ ] Product reviews and ratings display
- [ ] Email notifications for stock availability
- [ ] Price drop alerts
- [ ] Virtual try-on feature
- [ ] AR glasses preview
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email order confirmations
- [ ] Advanced analytics for admin
- [ ] Inventory management
- [ ] Discount codes and coupons
- [ ] Customer reviews moderation
- [ ] Social sharing buttons
- [ ] Wishlist collaboration
- [ ] Mobile app version
- [ ] Multi-language support

---

## 📝 API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - List products with filters
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)
- `GET /api/products/search` - Search products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders

### Cart
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart items
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove from cart

### Favorites
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get favorites
- `DELETE /api/favorites/[id]` - Remove from favorites

### Ratings
- `GET /api/ratings` - Get product ratings
- `POST /api/ratings` - Add rating

### Seed Data
- `GET /api/seed` - Seed sample products
- `POST /api/seed-users` - Seed demo users

---

## ✅ Testing Checklist

- [x] User registration and login
- [x] Role-based redirects
- [x] Product browsing and filtering
- [x] Search functionality
- [x] Product details view
- [x] Add to cart
- [x] Cart management
- [x] Checkout flow
- [x] Order creation
- [x] Order confirmation
- [x] Order history
- [x] Favorites management
- [x] Shared wishlists
- [x] Product comparison
- [x] Admin dashboard
- [x] Add/edit products (admin)
- [x] Profile management
- [x] Navigation menu
- [x] Footer links
- [x] Information pages
- [x] Responsive design

---

## 📧 Support

For issues or questions:
- Email: support@hubofframes.com
- Contact page: `/contact`
- FAQ: `/faq`

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅
