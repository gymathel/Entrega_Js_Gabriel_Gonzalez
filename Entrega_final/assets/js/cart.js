// Clase para manejar todo lo relacionado al carrito de compras
class ShoppingCart {
    constructor() {
        // Uso del operador OR para recuperar lo que hay en localStorage o arrancar con un array vacío
        this.items = JSON.parse(localStorage.getItem('cart_items')) || [];
    }

    // Inicializo los eventos de los botones del carrito y actualizo la vista
    init() {
        this.updateCartUI();
        this.bindEvents();
    }

    // Asigno los eventos a los botones principales del modal del carrito
    bindEvents() {
        const btnClear = document.getElementById('btn-clear-cart');
        const btnCheckout = document.getElementById('btn-checkout');

        btnClear?.addEventListener('click', () => this.clearCartWithConfirmation());
        btnCheckout?.addEventListener('click', () => this.processCheckout());
    }

    // Guardo el array del carrito actualizado en localStorage convertiéndolo a JSON
    saveToStorage() {
        localStorage.setItem('cart_items', JSON.stringify(this.items));
    }

    // Agregar un producto al carrito
    addItem(product) {
        // Uso destructuring para extraer los datos del objeto
        const { id, titulo, precio, imagen } = product; 
        
        // Uso de función de orden superior .find() para ver si el producto ya está cargado
        const existingItem = this.items.find(item => item.id === id);

        if (existingItem) {
            existingItem.cantidad += 1;
        } else {
            this.items.push({ id, titulo, precio, imagen, cantidad: 1 });
        }

        this.saveToStorage();
        this.updateCartUI();
        ToastifyNotification(`Se agregó "${titulo}" al carrito.`);
    }

    // Modificar cantidades (+1 o -1)
    changeQuantity(id, delta) {
        const item = this.items.find(item => item.id === id);
        if (!item) return;

        item.cantidad += delta;

        // Si la cantidad llega a 0, lo borro del carrito
        if (item.cantidad <= 0) {
            this.removeItem(id);
            return;
        }

        this.saveToStorage();
        this.updateCartUI();
    }

    // Eliminar un producto usando la función de orden superior .filter()
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToStorage();
        this.updateCartUI();
    }

    // Calcular el total a pagar usando la función de orden superior .reduce()
    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    // Vaciar todo el carrito y limpiar localStorage
    clearCart() {
        this.items = [];
        localStorage.removeItem('cart_items');
        this.updateCartUI();
    }

    // Cartel de alerta con SweetAlert2 para pedir confirmación antes de vaciar
    clearCartWithConfirmation() {
        if (this.items.length === 0) return;

        Swal.fire({
            title: '¿Vaciar carrito?',
            text: 'Se eliminarán todos los servicios y productos seleccionados.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff725e',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, vaciar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.clearCart();
                Swal.fire('¡Carrito vaciado!', '', 'success');
            }
        });
    }

    // Proceso final de checkout con SweetAlert2
    processCheckout() {
        if (this.items.length === 0) {
            Swal.fire({
                title: 'El carrito está vacío',
                text: 'Agrega un servicio o producto antes de confirmar.',
                icon: 'info',
                confirmButtonColor: '#111111'
            });
            return;
        }

        const totalFormateado = this.formatCurrency(this.calculateTotal());

        Swal.fire({
            title: 'Confirmar Reserva / Compra',
            html: `<p>El monto total a abonar es <strong>${totalFormateado}</strong>.</p>
                   <input type="text" id="swal-input-name" class="swal2-input" placeholder="Nombre Completo">
                   <input type="email" id="swal-input-email" class="swal2-input" placeholder="Correo Electrónico">`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Finalizar Pedido',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#28a745',
            preConfirm: () => {
                const name = document.getElementById('swal-input-name').value;
                const email = document.getElementById('swal-input-email').value;

                if (!name || !email) {
                    Swal.showValidationMessage('Por favor completa todos los campos');
                    return false;
                }
                return { name, email };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { name } = result.value;
                this.clearCart();

                Swal.fire({
                    title: '¡Reserva Confirmada!',
                    text: `Gracias ${name}. Te hemos enviado los detalles a tu correo.`,
                    icon: 'success',
                    confirmButtonColor: '#111111'
                });
            }
        });
    }

    // Renderizar los elementos en la vista del DOM
    updateCartUI() {
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCounter = document.getElementById('cart-counter');

        if (!cartContainer || !cartTotal || !cartCounter) return;

        // Calculo la cantidad total de unidades con .reduce()
        const totalCount = this.items.reduce((acc, item) => acc + item.cantidad, 0);
        cartCounter.textContent = totalCount;
        cartTotal.textContent = this.formatCurrency(this.calculateTotal());

        // Operador ternario para mostrar mensaje cuando no hay ítems
        cartContainer.innerHTML = this.items.length === 0 
            ? '<p class="text-center text-muted py-4">Tu carrito está vacío.</p>' 
            : '';

        // Recorro los elementos con .forEach() usando destructuring
        this.items.forEach(({ id, titulo, precio, cantidad, imagen }) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'd-flex align-items-center gap-3 mb-3 pb-3 border-bottom';
            itemElement.innerHTML = `
                <img src="${imagen}" alt="${titulo}" class="cart-item-img">
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-semibold text-truncate" style="max-width: 140px;">${titulo}</h6>
                    <small class="text-muted">${this.formatCurrency(precio)} c/u</small>
                    <div class="d-flex align-items-center gap-2 mt-1">
                        <button class="btn btn-sm btn-outline-secondary py-0 px-2 btn-decrease" data-id="${id}">-</button>
                        <span class="fw-bold">${cantidad}</span>
                        <button class="btn btn-sm btn-outline-secondary py-0 px-2 btn-increase" data-id="${id}">+</button>
                    </div>
                </div>
                <button class="btn btn-sm text-danger border-0 btn-remove" data-id="${id}">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            cartContainer.appendChild(itemElement);
        });

        this.attachCartItemEvents();
    }

    // Asigno los listeners a los botones generados dentro del carrito
    attachCartItemEvents() {
        document.querySelectorAll('.btn-increase').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeQuantity(Number(e.currentTarget.dataset.id), 1));
        });

        document.querySelectorAll('.btn-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeQuantity(Number(e.currentTarget.dataset.id), -1));
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => this.removeItem(Number(e.currentTarget.dataset.id)));
        });
    }

    // Función auxiliar para formatear a pesos argentinos
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
    }
}

// Notificación de tipo toast que aparece abajo a la derecha con SweetAlert2
function ToastifyNotification(mensaje) {
    Swal.fire({
        text: mensaje,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        icon: 'success'
    });
}

// Creo la instancia global del carrito
const cart = new ShoppingCart();