# Smart Shopping Cart

A modern, responsive web application with smart shopping cart functionality built with vanilla HTML, CSS, and JavaScript.

## Features

### Core Functionality
- **Product Listing**: Displays products from e-commerce API with images, titles, categories, and prices
- **Add/Remove Items**: Add products to cart with single click, remove items with confirmation
- **Quantity Updates**: Increase/decrease item quantities with intuitive controls
- **Cart Persistence**: Cart data saved to localStorage and restored on page reload

### Additional Features
- **Search Functionality**: Real-time product search by title and description
- **Category Filtering**: Filter products by category
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Notifications**: User-friendly toast notifications for all actions
- **Cart Summary**: Real-time total calculation and item count
- **Checkout Simulation**: Complete checkout flow with order summary

## Technical Implementation

### API Integration
- Uses **FakeStoreAPI** for realistic product data
- Handles API errors gracefully with user notifications
- Loads 20+ products with categories like electronics, clothing, jewelry

### Cart Persistence
- **localStorage** for client-side persistence
- Automatic save on every cart action
- Cart restoration on page load
- Error handling for corrupted data

### Responsive Design
- CSS Grid for product layout
- Flexbox for component layouts
- Mobile-first approach with breakpoints at 768px and 480px
- Touch-friendly buttons and controls

## File Structure
```
task4/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling with responsive design
├── script.js       # All JavaScript functionality
└── README.md       # This documentation
```

## How to Use

1. **Open the Application**: Open `index.html` in any modern web browser
2. **Browse Products**: Products load automatically from the API
3. **Search Products**: Use the search bar to find specific items
4. **Filter by Category**: Select categories from the dropdown
5. **Add to Cart**: Click "Add to Cart" on any product
6. **View Cart**: Click the cart icon in the header
7. **Manage Cart**: 
   - Update quantities with +/- buttons
   - Remove items with trash button
   - Clear entire cart
8. **Checkout**: Click checkout to complete your order

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Key Classes and Methods

### ShoppingCart Class
- `fetchProducts()`: Loads products from API
- `addToCart(productId)`: Adds item to cart
- `removeFromCart(productId)`: Removes item from cart
- `updateQuantity(productId, change)`: Updates item quantity
- `filterProducts()`: Filters products based on search/category
- `saveCartToStorage()`: Persists cart to localStorage
- `loadCartFromStorage()`: Restores cart from localStorage

## Performance Features
- Efficient DOM manipulation
- Event delegation for better performance
- Lazy loading considerations
- Optimized animations with CSS transforms

## Security Considerations
- XSS prevention through proper DOM manipulation
- Input validation for search functionality
- Safe JSON parsing with error handling

The application provides a complete e-commerce shopping experience with all requested features implemented using modern web development best practices.
