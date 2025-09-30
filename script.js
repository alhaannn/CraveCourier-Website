// Scroll to top functionality
window.onscroll = () =>{
    if (window.scrollY > 60) {
        document.querySelector('#scroll-top').classList.add('active');
        
    } else {
        document.querySelector('#scroll-top').classList.remove('active');
    }
}

// Page loader functionality
function loader(){
    document.querySelector('.loader-container').classList.add('fade-out');
}

function fadeOut(){
    setInterval(loader, 3000);
}

// Authentication System
let currentUser = null;

// Check if user is logged in on page load
window.addEventListener('load', () => {
    checkAuthStatus();
});

// Check authentication status from localStorage
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateUserStatus();
    }
}

// Update user status in header
function updateUserStatus() {
    const userStatus = document.getElementById('user-status');
    if (currentUser) {
        userStatus.textContent = currentUser.name;
    } else {
        userStatus.textContent = 'Login';
    }
}

// Toggle login modal
function toggleLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.toggle('active');
}

// Switch to register form
function switchToRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('modal-title').textContent = 'Register';
}

// Switch to login form
function switchToLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('modal-title').textContent = 'Login';
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserStatus();
        toggleLoginModal();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid email or password!', 'error');
    }
});

// Handle register form submission
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showNotification('User already exists!', 'error');
        return;
    }
    
    // Add new user
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    updateUserStatus();
    toggleLoginModal();
    showNotification('Registration successful!', 'success');
});

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Shopping Cart System
let cart = [];
let cartTotal = 0;

// Add item to cart function (requires authentication)
function addToCart(itemName, price, image) {
    // Check if user is logged in
    if (!currentUser) {
        showNotification('Please login to add items to cart!', 'error');
        toggleLoginModal();
        return;
    }
    
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showCartNotification(itemName);
}

// Update cart display in UI
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items list
    cartItems.innerHTML = '';
    cartTotal = 0;
    
    cart.forEach((item, index) => {
        cartTotal += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity}</p>
                <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotalElement.textContent = `₹${cartTotal}`;
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Show cart notification
function showCartNotification(itemName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${itemName} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Toggle cart visibility
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Clear cart after checkout
    cart = [];
    updateCartDisplay();
    toggleCart();
    
    // Show order confirmation
    alert('Order confirmed! Thank you for choosing CraveCourie. Your order will be delivered soon.');
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartIcon = document.getElementById('cart-icon');
    
    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
        cartSidebar.classList.remove('active');
    }
});

window.onload = fadeOut();

// Mobile menu toggle
function toggleMobileMenu(){
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}