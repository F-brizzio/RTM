// Funciones de utilidad para localStorage (no cambian)
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.cantidad += product.cantidad;
    } else {
        cart.push(product);
    }
    saveCart(cart);
    alert(`${product.nombre} ha sido agregado al carrito.`);
}

// Nueva función para eliminar un producto del carrito
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart(); // Vuelve a renderizar el carrito después de eliminar
}

// Nueva función para actualizar la cantidad de un producto
function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const product = cart.find(item => item.id === productId);

    if (product) {
        if (newQuantity > 0) {
            product.cantidad = newQuantity;
        } else {
            // Si la cantidad es 0 o menos, lo eliminamos
            removeFromCart(productId);
            return; // Salimos de la función para evitar el renderizado doble
        }
    }
    saveCart(cart);
    renderCart(); // Vuelve a renderizar el carrito después de actualizar
}

// Función principal para renderizar el carrito
function renderCart() {
    const cartItemsContainer = document.getElementById('carrito-items');
    const totalText = document.getElementById('total-text');

    if (!cartItemsContainer) {
        return;
    }

    const cart = getCart();
    let total = 0;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío.</p>';
    } else {
        cart.forEach(product => {
            const productTotal = product.precio * product.cantidad;
            total += productTotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrito-item');
            // Usamos product.id para identificar de manera única cada producto
            itemDiv.setAttribute('data-id', product.id); 
            itemDiv.innerHTML = `
                <img src="${product.imagen}" alt="${product.nombre}">
                <div class="item-details">
                    <h3>${product.nombre}</h3>
                    <p>Precio por unidad: $${product.precio.toLocaleString('es-CL')}</p>
                    <div class="cantidad-control">
                        <label for="cantidad-${product.id}">Cantidad:</label>
                        <input type="number" id="cantidad-${product.id}" class="cantidad-input-carrito" value="${product.cantidad}" min="1">
                    </div>
                    <p class="item-total">Precio Total: $${productTotal.toLocaleString('es-CL')}</p>
                </div>
                <button class="remove-btn" data-id="${product.id}">&times;</button>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        // Agregamos los event listeners después de crear los elementos
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                removeFromCart(productId);
            });
        });

        document.querySelectorAll('.cantidad-input-carrito').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.closest('.carrito-item').getAttribute('data-id');
                const newQuantity = parseInt(e.target.value);
                updateQuantity(productId, newQuantity);
            });
        });
    }
    
    totalText.textContent = `Total: $${total.toLocaleString('es-CL')}`;
}

// Event Listeners para la página de productos (index.html)
document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productElement = e.target.closest('.conten');
            const productId = productElement.getAttribute('data-id');
            const cantidad = parseInt(productElement.querySelector('.cantidad-input').value);
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseInt(e.target.getAttribute('data-precio'));
            const imagen = e.target.getAttribute('data-imagen');

            const product = {
                id: productId,
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: cantidad
            };
            addToCart(product);
        });
    });
});