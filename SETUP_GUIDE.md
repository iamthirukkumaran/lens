# Hub of Frames - E-Commerce Setup & Usage Guide

## Quick Start (5 minutes)

### Step 1: Ensure MongoDB is Running

**Windows:**
```bash
# If MongoDB is installed, start it:
mongod
```

**or use MongoDB Atlas (cloud):**
Edit `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eyewear
```

### Step 2: Development Server is Already Running

The server should be running on: **http://localhost:3001**

### Step 3: Seed the Database with Sample Products

Open your browser and visit:
```
http://localhost:3001/api/seed
```

You should see:
```json
{
  "success": true,
  "message": "Database seeded successfully!",
  "count": 10
}
```

If already seeded, it will show:
```json
{
  "success": true,
  "message": "Database already has 10 products"
}
```

### Step 4: Test the Application

1. **Homepage** (http://localhost:3001)
   - See the hero section with collection buttons
   - Click **Men**, **Women**, or **Kids** buttons

2. **Collections Page** (e.g., http://localhost:3001/collections/men)
   - View filtered products by gender
   - Try the filters:
     - Brand (Arcadio, Titan, Fastrack, etc.)
     - Frame Size (XS, S, M, L, XL, XXL)
     - Frame Material (Titanium, Flex Titanium, etc.)
   - Products update live as you filter
   - Click heart icon to add/remove favorites
   - Click product card to view details

3. **Product Details** (e.g., http://localhost:3001/product/[id])
   - View full product gallery
   - Select frame color (clickable swatches)
   - Choose frame size
   - Select lens type (Zero Power, Prescription, Sunglasses)
   - Adjust quantity
   - Toggle favorite status
   - Add to cart / Buy now buttons

## Project Architecture

### Frontend Components

**ProductCard.tsx**
- Displays product in a card format
- Shows discount badge, price, savings
- Heart icon for favorites
- Add to cart button

**FiltersSidebar.tsx**
- Filter by brand, size, material
- Live filter updates
- Expandable/collapsible sections
- Reset filters button

**ProductGallery.tsx**
- Multiple image gallery
- Thumbnail selector
- Smooth image transitions

### API Endpoints

**Get all products (with filters):**
```bash
GET /api/products?gender=men&brand=Arcadio&limit=12&page=1
```

**Get single product:**
```bash
GET /api/products/[productId]
```

**Add to cart (requires user ID header):**
```bash
POST /api/cart
Header: x-user-id: [userId]
Body: {
  "productId": "[id]",
  "quantity": 1,
  "selectedSize": "M",
  "selectedColor": "Black",
  "selectedLens": "Zero Power"
}
```

**Get favorites:**
```bash
GET /api/favorites
Header: x-user-id: [userId]
```

## Key Features

✅ **Homepage Navigation**
- Three large colored buttons (Men, Women, Kids)
- Click to navigate to respective collections
- Smooth animations and hover effects

✅ **Dynamic Collections**
- Auto-filtered by gender from URL
- Live filter updates
- Products grid with pagination
- Responsive design (1-2-3 columns)

✅ **Product Details**
- Full image gallery with thumbnails
- Color selection with visual swatches
- Size selection (XS to XXL)
- Lens type selection
- Quantity adjuster
- Favorites toggle
- Cart & Buy Now buttons

✅ **Responsive Design**
- Mobile: 1 column, stack filters
- Tablet: 2 columns
- Desktop: 3 columns + sidebar filters
- Touch-friendly buttons

✅ **Modern Styling**
- Fira Sans typography
- Luxury card design with shadows
- Smooth transitions and animations
- Color-coded collection buttons
- Gradient accents

## Available Products

**Men's Collection (4 products)**
- Arcadio FF371 - Classic Metal Frame (39% off)
- Arcadio FF378 - Titanium Pro (25% off)
- Arcadio FF381 - Sports Edge (25% off)
- Titan TT201 - Urban Style (41% off)

**Women's Collection (4 products)**
- Titan WW401 - Elegant Cat Eye (43% off)
- Fastrack WW501 - Minimalist Round (48% off)
- Tommy WW601 - Designer Oversized (40% off)
- Police WW701 - Retro Vibes (45% off)

**Kids' Collection (3 products)**
- Kids KK101 - Fun & Colorful (47% off)
- Kids KK201 - Sporty Kids (50% off)
- Kids KK301 - Adventure Ready (50% off)

## Testing Checklist

- [ ] Homepage loads with collection buttons
- [ ] Clicking Men/Women/Kids navigates to correct collections
- [ ] Collections page loads with products
- [ ] Filters work and update products live
- [ ] Reset filters clears all selections
- [ ] Clicking product card opens details page
- [ ] Product gallery shows thumbnails
- [ ] Can select color, size, lens, quantity
- [ ] Favorite button toggles heart icon
- [ ] Pagination works on collection page
- [ ] Mobile layout is responsive

## Troubleshooting

**Problem: "No products found"**
- Solution: Visit http://localhost:3001/api/seed to seed database

**Problem: "Cannot connect to MongoDB"**
- Solution: Start MongoDB: `mongod`
- Or check `.env.local` connection string

**Problem: Port 3000 already in use**
- Solution: App automatically uses port 3001
- Check browser at http://localhost:3001

**Problem: Styles not loading**
- Solution: 
  1. Clear `.next`: `rm -rf .next`
  2. Restart server: `npm run dev`

## Environment Variables

**.env.local** should contain:
```
MONGODB_URI=mongodb://localhost:27017/eyewear
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production, add authentication tokens and API keys.

## Performance Tips

- Products are paginated (12 per page)
- Filters are client-side filtered before API call
- Images use Next.js Image component for optimization
- Lazy loading on collections page
- CSS is minimized with TailwindCSS

## Next Steps (Future Development)

1. **User Authentication**
   - JWT tokens
   - Login/Register pages
   - Protected routes

2. **Payment Integration**
   - Stripe/PayPal integration
   - Order management
   - Invoice generation

3. **Admin Dashboard**
   - Add/edit/delete products
   - View orders
   - User management

4. **Advanced Features**
   - Product reviews and ratings
   - Wishlist sharing
   - Size recommendations
   - AR try-on feature

## Support & Documentation

- API Route examples in `/app/api/`
- Component documentation in component files
- Database schema in `/models/`
- Full setup guide in `ECOMMERCE_README.md`

---

**Happy coding!** 🎉 Your eyewear e-commerce platform is ready to go!
