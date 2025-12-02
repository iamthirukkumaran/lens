# Hub of Frames - API Documentation

## Base URL

```
http://localhost:3001
```

For production, update `NEXT_PUBLIC_API_URL` in `.env.local`

## Authentication

User-specific endpoints require the `x-user-id` header:

```
x-user-id: [userId]
```

In a production app, this would be a JWT token or session ID.

---

## Products Endpoints

### Get All Products

**Endpoint:**
```
GET /api/products
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `gender` | string | Filter by gender: `men`, `women`, `kids` |
| `brand` | string[] | Filter by brand (can be multiple) |
| `material` | string[] | Filter by material (can be multiple) |
| `size` | string[] | Filter by size (can be multiple) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12) |

**Example Request:**
```bash
curl "http://localhost:3001/api/products?gender=men&brand=Arcadio&limit=12&page=1"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Classic Metal Frame",
      "modelNumber": "Arcadio FF371",
      "price": 2470,
      "mrp": 4050,
      "discount": 39,
      "gender": "men",
      "brand": "Arcadio",
      "material": "Stainless Steel",
      "sizes": ["M", "L", "XL"],
      "colors": [
        { "name": "Gun Metal", "hex": "#2C3E50" },
        { "name": "Silver", "hex": "#C0C0C0" }
      ],
      "images": ["/top1.jpeg", "/top2.jpeg"],
      "description": "Premium stainless steel frame...",
      "stock": 50
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 12,
    "pages": 4
  }
}
```

---

### Get Single Product

**Endpoint:**
```
GET /api/products/[id]
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product MongoDB ID |

**Example Request:**
```bash
curl "http://localhost:3001/api/products/507f1f77bcf86cd799439011"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Classic Metal Frame",
    "modelNumber": "Arcadio FF371",
    "price": 2470,
    "mrp": 4050,
    "discount": 39,
    "gender": "men",
    "brand": "Arcadio",
    "material": "Stainless Steel",
    "sizes": ["M", "L", "XL"],
    "colors": [
      { "name": "Gun Metal", "hex": "#2C3E50" },
      { "name": "Silver", "hex": "#C0C0C0" }
    ],
    "images": ["/top1.jpeg", "/top2.jpeg"],
    "description": "Premium stainless steel frame with anti-glare lenses.",
    "stock": 50,
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-01T10:00:00.000Z"
  }
}
```

---

### Create Product (Admin)

**Endpoint:**
```
POST /api/products
```

**Request Body:**
```json
{
  "name": "New Frame",
  "modelNumber": "NEW001",
  "price": 2000,
  "mrp": 4000,
  "discount": 50,
  "gender": "men",
  "brand": "NewBrand",
  "material": "Titanium",
  "sizes": ["M", "L"],
  "colors": [
    { "name": "Black", "hex": "#000000" }
  ],
  "images": ["/image1.jpg"],
  "description": "New premium frame"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    ...
  }
}
```

---

### Update Product (Admin)

**Endpoint:**
```
PUT /api/products/[id]
```

**Request Body:** (partial update)
```json
{
  "price": 2200,
  "stock": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    ...
  }
}
```

---

### Delete Product (Admin)

**Endpoint:**
```
DELETE /api/products/[id]
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Cart Endpoints

All cart endpoints require `x-user-id` header.

### Get Cart

**Endpoint:**
```
GET /api/cart
```

**Headers:**
```
x-user-id: user_id_123
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "selectedSize": "M",
      "selectedColor": "Black",
      "selectedLens": "Zero Power",
      "product": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Classic Metal Frame",
        "price": 2470,
        ...
      }
    }
  ]
}
```

---

### Add to Cart

**Endpoint:**
```
POST /api/cart
```

**Headers:**
```
x-user-id: user_id_123
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 1,
  "selectedSize": "M",
  "selectedColor": "Black",
  "selectedLens": "Zero Power"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Added to cart"
}
```

---

### Update Cart Item

**Endpoint:**
```
PUT /api/cart
```

**Headers:**
```
x-user-id: user_id_123
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated"
}
```

---

### Remove from Cart

**Endpoint:**
```
DELETE /api/cart
```

**Headers:**
```
x-user-id: user_id_123
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Removed from cart"
}
```

---

## Favorites Endpoints

All favorites endpoints require `x-user-id` header.

### Get Favorites

**Endpoint:**
```
GET /api/favorites
```

**Headers:**
```
x-user-id: user_id_123
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Classic Metal Frame",
      "modelNumber": "Arcadio FF371",
      ...
    }
  ]
}
```

---

### Add to Favorites

**Endpoint:**
```
POST /api/favorites
```

**Headers:**
```
x-user-id: user_id_123
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Added to favorites"
}
```

---

### Remove from Favorites

**Endpoint:**
```
DELETE /api/favorites
```

**Headers:**
```
x-user-id: user_id_123
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

---

## Seed Database

### Seed Sample Products

**Endpoint:**
```
GET /api/seed
```

**Response:**
```json
{
  "success": true,
  "message": "Database seeded successfully!",
  "count": 10
}
```

---

## Error Handling

All endpoints return error responses in this format:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request parameters"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Product not found"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "User not authenticated"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to process request"
}
```

---

## Using the API Helper Functions

The `lib/api.ts` provides TypeScript-safe API functions:

```typescript
import { productAPI, cartAPI, favoritesAPI } from '@/lib/api';

// Get products with filters
const { data: products } = await productAPI.getAll({
  gender: 'men',
  brand: ['Arcadio'],
  page: 1,
  limit: 12
});

// Get single product
const { data: product } = await productAPI.getById('507f1f77bcf86cd799439011');

// Add to cart
await cartAPI.addToCart(userToken, {
  productId: '507f1f77bcf86cd799439011',
  quantity: 1,
  selectedSize: 'M',
  selectedColor: 'Black'
});

// Get favorites
const { data: favorites } = await favoritesAPI.getFavorites(userToken);

// Add to favorites
await favoritesAPI.addToFavorites(userToken, '507f1f77bcf86cd799439011');
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, add rate limiting middleware.

---

## CORS

CORS is enabled for all origins during development. Restrict in production via:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Add CORS headers
}
```

---

## Testing with cURL

```bash
# Get all men's products
curl -X GET "http://localhost:3001/api/products?gender=men" \
  -H "Content-Type: application/json"

# Get single product
curl -X GET "http://localhost:3001/api/products/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json"

# Add to cart
curl -X POST "http://localhost:3001/api/cart" \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -d '{"productId":"507f1f77bcf86cd799439011","quantity":1}'

# Get favorites
curl -X GET "http://localhost:3001/api/favorites" \
  -H "x-user-id: user_123"
```

---

## Version

API Version: 1.0.0  
Last Updated: December 2024
