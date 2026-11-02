import {
  MENU_ITEMS,
  TOPPINGS,
  SWEETNESS_LEVELS,
  calculateItemPrice,
  calculateCartTotal
} from './src/shopLogic.js';

// Application State
const state = {
  currentCategory: 'all',
  selectedProduct: null,
  selectedSweetness: '100',
  selectedToppings: [],
  quantity: 1,
  cart: []
};

// DOM References
const productsGrid = document.getElementById('productsGrid');
const categoryTabs = document.getElementById('categoryTabs');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalThumb = document.getElementById('modalThumb');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalBasePrice = document.getElementById('modalBasePrice');
const sweetnessOptions = document.getElementById('sweetnessOptions');
const toppingsList = document.getElementById('toppingsList');
const qtyMinusBtn = document.getElementById('qtyMinusBtn');
const qtyPlusBtn = document.getElementById('qtyPlusBtn');
const qtyDisplay = document.getElementById('qtyDisplay');
const itemTotalAmount = document.getElementById('itemTotalAmount');
const addToCartConfirmBtn = document.getElementById('addToCartConfirmBtn');

const openCartBtn = document.getElementById('openCartBtn');
const cartBadge = document.getElementById('cartCount');
const cartBackdrop = document.getElementById('cartBackdrop');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartItemsList = document.getElementById('cartItemsList');
const summaryTotalCups = document.getElementById('summaryTotalCups');
const summaryGrandTotal = document.getElementById('summaryGrandTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

const receiptBackdrop = document.getElementById('receiptBackdrop');
const receiptDetails = document.getElementById('receiptDetails');
const receiptDoneBtn = document.getElementById('receiptDoneBtn');

// Icons map for visually appealing cards
const ITEM_ICONS = {
  'sm-1': '🍓',
  'sm-2': '🥭',
  'sm-3': '🥑',
  'sm-4': '🫐',
  'sm-5': '🍌',
  'sm-6': '🍉'
};

// Render Products
function renderProducts() {
  const filtered = state.currentCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === state.currentCategory);

  productsGrid.innerHTML = filtered.map(item => `
    <div class="product-card" data-id="${item.id}">
      <span class="product-tag">${item.tag}</span>
      <div class="product-visual">${ITEM_ICONS[item.id] || '🥤'}</div>
      <h3 class="product-name">${item.name}</h3>
      <p class="product-desc">${item.desc}</p>
      <div class="product-footer">
        <span class="product-price">฿${item.price}</span>
        <button class="btn-select" data-id="${item.id}">สั่งแก้วนี้</button>
      </div>
    </div>
  `).join('');

  // Attach click listeners to cards
  productsGrid.querySelectorAll('.btn-select').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const product = MENU_ITEMS.find(m => m.id === id);
      if (product) openCustomizeModal(product);
    });
  });
}

// Category tabs handler
categoryTabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('tab-btn')) {
    categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    state.currentCategory = e.target.getAttribute('data-category');
    renderProducts();
  }
});

// Open Customize Modal
function openCustomizeModal(product) {
  state.selectedProduct = product;
  state.selectedSweetness = '100';
  state.selectedToppings = [];
  state.quantity = 1;

  modalThumb.textContent = ITEM_ICONS[product.id] || '🥤';
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.desc;
  modalBasePrice.textContent = `เริ่มต้น ฿${product.price}`;

  // Render Sweetness options
  sweetnessOptions.innerHTML = SWEETNESS_LEVELS.map(s => `
    <button type="button" class="sweetness-btn ${s.id === '100' ? 'active' : ''}" data-id="${s.id}">
      ${s.label}
    </button>
  `).join('');

  sweetnessOptions.querySelectorAll('.sweetness-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sweetnessOptions.querySelectorAll('.sweetness-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedSweetness = btn.getAttribute('data-id');
    });
  });

  // Render Toppings
  toppingsList.innerHTML = TOPPINGS.map(t => `
    <label class="topping-item">
      <span class="topping-label">
        <input type="checkbox" value="${t.id}" data-name="${t.name}" data-price="${t.price}">
        ${t.name}
      </span>
      <span class="topping-cost">+฿${t.price}</span>
    </label>
  `).join('');

  toppingsList.querySelectorAll('input').forEach(chk => {
    chk.addEventListener('change', () => {
      const checkedToppings = [];
      toppingsList.querySelectorAll('input:checked').forEach(input => {
        checkedToppings.push({
          id: input.value,
          name: input.getAttribute('data-name'),
          price: Number(input.getAttribute('data-price'))
        });
      });
      state.selectedToppings = checkedToppings;
      updateModalTotal();
    });
  });

  qtyDisplay.textContent = '1';
  updateModalTotal();
  modalBackdrop.classList.add('active');
}

function updateModalTotal() {
  if (!state.selectedProduct) return;
  const singlePrice = calculateItemPrice(state.selectedProduct.price, state.selectedToppings);
  const total = singlePrice * state.quantity;
  itemTotalAmount.textContent = `฿${total}`;
}

// Modal Quantity
qtyMinusBtn.addEventListener('click', () => {
  if (state.quantity > 1) {
    state.quantity--;
    qtyDisplay.textContent = state.quantity;
    updateModalTotal();
  }
});

qtyPlusBtn.addEventListener('click', () => {
  state.quantity++;
  qtyDisplay.textContent = state.quantity;
  updateModalTotal();
});

modalCloseBtn.addEventListener('click', () => {
  modalBackdrop.classList.remove('active');
});

modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) {
    modalBackdrop.classList.remove('active');
  }
});

// Add to Cart
addToCartConfirmBtn.addEventListener('click', () => {
  if (!state.selectedProduct) return;

  const unitPrice = calculateItemPrice(state.selectedProduct.price, state.selectedToppings);
  const sweetnessObj = SWEETNESS_LEVELS.find(s => s.id === state.selectedSweetness);

  const cartEntry = {
    cartId: Date.now() + Math.random().toString(),
    productId: state.selectedProduct.id,
    name: state.selectedProduct.name,
    icon: ITEM_ICONS[state.selectedProduct.id] || '🥤',
    sweetnessLabel: sweetnessObj ? sweetnessObj.label : 'หวาน 100%',
    toppings: [...state.selectedToppings],
    totalPriceEach: unitPrice,
    quantity: state.quantity
  };

  state.cart.push(cartEntry);
  updateCartBadge();
  modalBackdrop.classList.remove('active');
  renderCart();
  cartBackdrop.classList.add('active');
});

// Cart Drawer Handling
function updateCartBadge() {
  const summary = calculateCartTotal(state.cart);
  cartBadge.textContent = summary.itemCount;
}

function renderCart() {
  const summary = calculateCartTotal(state.cart);
  summaryTotalCups.textContent = `${summary.itemCount} แก้ว`;
  summaryGrandTotal.textContent = `฿${summary.total}`;

  if (state.cart.length === 0) {
    cartItemsList.innerHTML = `<p class="cart-empty-text">ยังไม่มีเครื่องดื่มในตะกร้า 🥤<br>เลือกเมนูสดชื่นที่ชอบได้เลยค่ะ</p>`;
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = '0.5';
    return;
  }

  checkoutBtn.disabled = false;
  checkoutBtn.style.opacity = '1';

  cartItemsList.innerHTML = state.cart.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <h4>${item.icon} ${item.name}</h4>
        <div class="cart-item-meta">
          หวาน: ${item.sweetnessLabel}
          ${item.toppings.length > 0 ? `<br>ท็อปปิ้ง: ${item.toppings.map(t => t.name).join(', ')}` : ''}
        </div>
        <div class="cart-item-actions">
          <span>จำนวน: <strong>${item.quantity}</strong> แก้ว</span>
          <button class="cart-item-del" data-cartid="${item.cartId}">ลบ</button>
        </div>
      </div>
      <div class="cart-item-price-side">
        ฿${item.totalPriceEach * item.quantity}
      </div>
    </div>
  `).join('');

  cartItemsList.querySelectorAll('.cart-item-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-cartid');
      state.cart = state.cart.filter(item => item.cartId !== id);
      updateCartBadge();
      renderCart();
    });
  });
}

openCartBtn.addEventListener('click', () => {
  renderCart();
  cartBackdrop.classList.add('active');
});

cartCloseBtn.addEventListener('click', () => {
  cartBackdrop.classList.remove('active');
});

cartBackdrop.addEventListener('click', (e) => {
  if (e.target === cartBackdrop) cartBackdrop.classList.remove('active');
});

// Checkout action
checkoutBtn.addEventListener('click', () => {
  if (state.cart.length === 0) return;
  const summary = calculateCartTotal(state.cart);

  receiptDetails.innerHTML = `
    <p><strong>รายการสั่งซื้อ (${summary.itemCount} แก้ว):</strong></p>
    <ul style="padding-left: 20px; margin: 8px 0;">
      ${state.cart.map(item => `
        <li>${item.name} x${item.quantity} (฿${item.totalPriceEach * item.quantity})</li>
      `).join('')}
    </ul>
    <div style="border-top: 1px dashed #ccc; padding-top: 8px; margin-top: 8px;">
      <strong>ยอดสุทธิ: ฿${summary.total}</strong>
    </div>
  `;

  state.cart = [];
  updateCartBadge();
  cartBackdrop.classList.remove('active');
  receiptBackdrop.classList.add('active');
});

receiptDoneBtn.addEventListener('click', () => {
  receiptBackdrop.classList.remove('active');
});

receiptBackdrop.addEventListener('click', (e) => {
  if (e.target === receiptBackdrop) receiptBackdrop.classList.remove('active');
});

// Initial boot
renderProducts();
updateCartBadge();
