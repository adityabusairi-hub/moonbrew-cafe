// DATA BASE & STATE MANAGEMENT
let cart = [];

// 1. LOADING ANIMATION CONTROLLER
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 800); // Durasi Loading Simulasi Efek Premium
});

// 2. BACK TO TOP BUTTON VISIBILITY
window.onscroll = function() {
    const btn = document.getElementById("backToTop");
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        btn.style.display = "flex";
    } else {
        btn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 3. DARK MODE TOGGLE LOGIC
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// 4. FILTER CATEGORY FUNCTION
function filterCategory(category) {
    // Ubah status active tombol filter
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter Item Menu
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// 5. SEARCH MENU FUNCTION
function searchMenu() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.menu-card');
    
    cards.forEach(card => {
        const name = card.getAttribute('data-name');
        if (name.includes(query)) {
            card.style.style.display = 'flex'; // Tetap mengikuti filter basic sementara
            card.style.setProperty("display", "flex", "important");
        } else {
            card.style.setProperty("display", "none", "important");
        }
    });
}

// 6. SHOPPING CART LOGIC
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartUI();
    
    // Auto open cart sidebar untuk UX yang responsif & interaktif
    document.getElementById('cart-sidebar').classList.add('active');
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    cartItemsContainer.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Keranjang Anda masih kosong.</p>';
    } else {
        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
            
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <small>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</small>
                </div>
                <div style="display: flex; align-items: center;">
                    <strong>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</strong>
                    <button class="remove-item-btn" onclick="removeFromCart('${item.name}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
    }
    
    cartCount.innerText = totalItems;
    cartTotal.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

// 7. PREMIUM PAYMENT MODAL CONTROLLER
function openPaymentModal() {
    if (cart.length === 0) {
        alert("Keranjang belanja kosong! Silakan pilih menu terlebih dahulu.");
        return;
    }
    
    let totalPrice = 0;
    cart.forEach(item => totalPrice += (item.price * item.quantity));
    
    document.getElementById('modal-total-val').innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    document.getElementById('payment-modal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

function switchPayment(method) {
    const tabs = document.querySelectorAll('.pay-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    if (method === 'qris') {
        document.getElementById('qris-area').style.display = 'block';
        document.getElementById('dana-area').style.display = 'none';
    } else {
        document.getElementById('qris-area').style.display = 'none';
        document.getElementById('dana-area').style.display = 'block';
    }
}

function processPaymentDone() {
    alert("Terima kasih! Pembayaran Anda sedang diproses oleh sistem MoonBrew Cafe.\nSilakan konfirmasi pesanan via WhatsApp jika diperlukan.");
    cart = [];
    updateCartUI();
    closePaymentModal();
    toggleCart();
}