# Hub of Frames - Eyewear E-Commerce Application

A full-stack Next.js 14 eyewear e-commerce application built with App Router, TypeScript, TailwindCSS, and MongoDB.

## Features

- **Homepage with Collection Navigation**: Quick access to Men, Women, and Kids collections
- **Dynamic Collections Page**: Filter products by brand, material, and frame size
- **Product Details Page**: Full gallery, color/size selection, and purchase options
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI**: Luxury design with Fira Sans typography and smooth animations
- **API Routes**: RESTful backend for products, cart, and favorites management
- **MongoDB Integration**: Persistent data storage with Mongoose

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS 3, Fira Sans font
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcryptjs for password hashing
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally or connection string ready
- npm or yarn package manager

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/eyewear
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eyewear
```

### 3. Seed the Database

Run the seed endpoint to populate sample products:

```bash
npm run dev
# Visit http://localhost:3000/api/seed in your browser
```

Or use curl:
```bash
curl http://localhost:3000/api/seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
hubofframes/
├── app/
│   ├── api/
│   │   ├── cart/route.ts           # Cart management
│   │   ├── favorites/route.ts       # Favorites management
│   │   ├── products/
│   │   │   ├── route.ts            # Product list & create
│   │   │   └── [id]/route.ts       # Single product
│   │   └── seed/route.ts           # Database seeding
│   ├── collections/
│   │   └── [gender]/page.tsx       # Collections page
│   ├── product/
│   │   └── [productId]/page.tsx    # Product details
│   ├── page.tsx                     # Homepage
│   └── layout.tsx                   # Root layout
├── components/
│   ├── FiltersSidebar.tsx           # Filter controls
│   ├── ProductCard.tsx              # Product card component
│   └── ProductGallery.tsx           # Image gallery
├── models/
│   ├── Product.ts                   # Product schema
│   ├── User.ts                      # User schema
│   └── Order.ts                     # Order schema
├── lib/
│   ├── mongodb.ts                   # DB connection
│   └── seed.ts                      # Seed data
└── public/
    └── (images)
```

## API Endpoints

### Products
- `GET /api/products` - List products with filters
  - Query params: `gender`, `brand`, `material`, `size`, `page`, `limit`
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart` - Remove from cart

### Favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Remove from favorites

## Database Models

### Product
```typescript
{
  name: string
  modelNumber: string (unique)
  price: number
  mrp: number
  discount: number
  gender: 'men' | 'women' | 'kids'
  brand: string
  material: string
  sizes: string[]
  colors: [{ name: string, hex: string }]
  images: string[]
  description: string
  stock: number
}
```

### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  favorites: ObjectId[]
  cart: [{ productId, quantity, selectedSize, selectedColor, selectedLens }]
}
```

### Order
```typescript
{
  userId: ObjectId
  items: [{ productId, quantity, price, ... }]
  total: number
  paymentStatus: 'pending' | 'completed' | 'failed'
  shippingAddress: { street, city, state, zipCode, country }
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}
```

## Features Documentation

### Collections Navigation
- **Homepage**: Three large buttons navigate to Men, Women, Kids collections
- **Auto-filtering**: Collections page automatically filters by gender from URL
- **Dynamic Title**: Collection page displays appropriate gender label

### Filters
- **Brand**: Multiple selection
- **Frame Size**: XS, S, M, L, XL, XXL
- **Frame Material**: Titanium, Flex Titanium, Stainless Steel, Metal, Acetate
- **Live Updates**: Products update instantly when filters change
- **Reset Option**: Clear all filters with one click

### Product Card
- Product image with hover zoom
- Discount badge
- Price with MRP and savings
- Favorite button (toggles heart icon)
- Quick add to cart button
- Click to view full details

### Product Details
- Full image gallery with thumbnail selector
- Frame color selection with visual swatches
- Frame size selection
- Lens type selection (Zero Power, Prescription, Sunglasses)
- Quantity selector
- Add to favorites button
- Add to cart button
- Buy now button
- Product specifications section

### Responsive Design
- Mobile-first approach
- Desktop: 3-column product grid
- Tablet: 2-column grid
- Mobile: 1-column grid
- Touch-friendly buttons and controls
- Optimized navigation for all screen sizes

## Sample Products

The database is seeded with 10 sample products:
- **Men**: 4 products (Arcadio, Titan)
- **Women**: 4 products (Titan, Fastrack, Tommy Hilfiger, Police)
- **Kids**: 3 products (Fastrack, Aeropostale)

All products include:
- High-quality image URLs
- Multiple color options
- Various size options
- Realistic pricing and discounts
- Detailed descriptions

## Styling & Typography

- **Font**: Fira Sans (300-700 weights)
- **Color Scheme**: Elegant grays with accent colors (blue for men, pink for women, green for kids)
- **Components**: Rounded cards, smooth transitions, shadow effects
- **Buttons**: Gradient backgrounds with hover effects
- **Icons**: Lucide React for consistent iconography

## Building for Production

```bash
npm run build
npm run start
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env.local`
- For local MongoDB: `mongodb://localhost:27017/eyewear`

### Products Not Appearing
- Visit http://localhost:3000/api/seed to seed data
- Check browser console for API errors
- Verify MongoDB connection in terminal

### Styling Issues
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`
- Restart dev server: `npm run dev`

## Future Enhancements

- User authentication and registration
- Shopping cart persistence
- Payment integration (Stripe/PayPal)
- Order history and tracking
- Product reviews and ratings
- Admin dashboard
- Wishlist sharing
- Size recommendation algorithm
- AR try-on feature

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
