class ShoppingCart {
    constructor() {
        this.products = [];
        this.cart = [];
        this.categories = [];
        this.init();
    }

    init() {
        this.loadCartFromStorage();
        this.setupEventListeners();
        this.fetchProducts();
    }

    setupEventListeners() {
        // Cart toggle
        document.getElementById('cartToggle').addEventListener('click', () => this.toggleCart());
        document.getElementById('closeCart').addEventListener('click', () => this.toggleCart());

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterProducts());
        document.getElementById('categoryFilter').addEventListener('change', (e) => this.filterProducts());

        // Cart actions
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());
        document.getElementById('clearCartBtn').addEventListener('click', () => this.clearCart());
    }

    async fetchProducts() {
        try {
            document.getElementById('loading').style.display = 'block';
            
            // Using FakeStoreAPI for demo purposes
            const response = await fetch('https://fakestoreapi.com/products');
            const products = await response.json();
            
            // Convert prices to PKR (1 USD = 280 PKR approximately)
            this.products = products.map(product => ({
                ...product,
                price: Math.round(product.price * 280)
            }));
            
            // Extract categories
            this.categories = [...new Set(this.products.map(product => product.category))];
            this.populateCategoryFilter();
            
            this.renderProducts();
            document.getElementById('loading').style.display = 'none';
        } catch (error) {
            console.error('Error fetching products:', error);
            this.showNotification('Failed to load products. Please try again.', 'error');
            document.getElementById('loading').style.display = 'none';
        }
    }

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    }

    renderProducts(productsToRender = this.products) {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        productsToRender.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">Rs ${product.price.toLocaleString()}</p>
                <button class="add-to-cart-btn" onclick="cart.addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        return card;
    }

    filterProducts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const selectedCategory = document.getElementById('categoryFilter').value;

        const filteredProducts = this.products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                                 product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        this.renderProducts(filteredProducts);
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.updateCart();
        this.saveCartToStorage();
        this.showNotification(`${product.title} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCart();
        this.saveCartToStorage();
        this.showNotification('Item removed from cart');
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.updateCart();
            this.saveCartToStorage();
        }
    }

    updateCart() {
        this.renderCart();
        this.updateCartCount();
        this.updateCartTotal();
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = '';
        this.cart.forEach(item => {
            const cartItem = this.createCartItem(item);
            cartItems.appendChild(cartItem);
        });
    }

    createCartItem(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">Rs ${item.price.toLocaleString()}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="remove-item" onclick="cart.removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        return cartItem;
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    updateCartTotal() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').textContent = total.toLocaleString();
    }

    toggleCart() {
        const cartSection = document.getElementById('cartSection');
        cartSection.classList.toggle('active');
    }

    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.updateCart();
            this.saveCartToStorage();
            this.showNotification('Cart cleared');
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        if (confirm(`Checkout Summary:\nItems: ${itemCount}\nTotal: Rs ${total.toLocaleString()}\n\nProceed to checkout?`)) {
            this.cart = [];
            this.updateCart();
            this.saveCartToStorage();
            this.toggleCart();
            this.showNotification('Order placed successfully! Thank you for your purchase.');
        }
    }

    saveCartToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
                this.updateCart();
            } catch (error) {
                console.error('Error loading cart from storage:', error);
                this.cart = [];
            }
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the shopping cart when the page loads
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});
