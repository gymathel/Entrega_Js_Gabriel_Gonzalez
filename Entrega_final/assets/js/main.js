let productosGlobales = [];

// Armo toda la estructura HTML de la página desde JS manipulando el DOM
function renderLayout() {
    // Barra de navegación
    document.getElementById('navbar-container').innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light custom-nav py-3 sticky-top">
            <div class="container">
                <a class="navbar-brand fw-semibold text-dark fs-4" href="index.html">Gabriel Gonzalez</a>
                <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mx-auto gap-3 text-center">
                        <li class="nav-item"><a class="nav-link active fw-medium" href="#">Portafolio</a></li>
                        <li class="nav-item"><a class="nav-link fw-medium" href="#catalogo">Servicios & Tienda</a></li>
                    </ul>
                    <div class="d-flex justify-content-center align-items-center gap-3 mt-3 mt-lg-0">
                        <a href="https://instagram.com/gabrielglopez87" target="_blank" class="nav-instagram-icon" title="Instagram">
                            <i class="bi bi-instagram"></i>
                        </a>
                        <button class="btn btn-dark position-relative rounded-pill px-3 ms-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart">
                            <i class="bi bi-bag"></i>
                            <span id="cart-counter" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `;

    // Encabezado y carrusel de imágenes
    document.getElementById('hero-container').innerHTML = `
        <header class="hero-studio text-center py-4">
            <div class="container">
                <span class="badge-top mb-2 d-inline-block">Gabriel Gonzalez | Fotógrafo Profesional</span>
                <h1 class="display-4 fw-bold text-dark mb-2">Servicios & Impresiones de Arte</h1>
                <p class="text-secondary mx-auto mb-4" style="max-width: 600px;">
                    Reserva sesiones fotográficas, talleres o adquiere impresiones Fine Art directamente con nuestro simulador interactivo.
                </p>
            </div>
            
            <div class="portfolio-strip-container">
                <div class="portfolio-strip">
                    <div class="strip-item item-tilt-L2"><img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Paisaje"></div>
                    <div class="strip-item item-tilt-L1"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb" alt="Retrato"></div>
                    <div class="strip-item item-center"><img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c" alt="Documental"></div>
                    <div class="strip-item item-tilt-R1"><img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e" alt="Naturaleza"></div>
                    <div class="strip-item item-tilt-R2"><img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Editorial"></div>
                </div>
            </div>
        </header>
    `;

    // Botones de filtrado por categoría
    document.getElementById('filters-container').innerHTML = `
        <div id="catalogo" class="d-flex justify-content-center gap-2 mb-4 flex-wrap">
            <button class="btn btn-outline-dark active rounded-pill px-4 filter-btn" data-category="todos">Todos</button>
            <button class="btn btn-outline-dark rounded-pill px-4 filter-btn" data-category="servicios">Servicios</button>
            <button class="btn btn-outline-dark rounded-pill px-4 filter-btn" data-category="prints">Prints Enmarcados</button>
            <button class="btn btn-outline-dark rounded-pill px-4 filter-btn" data-category="talleres">Talleres</button>
        </div>
    `;

    // Modal deslizable del carrito
    document.getElementById('cart-drawer-container').innerHTML = `
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCart" aria-labelledby="offcanvasCartLabel">
            <div class="offcanvas-header border-bottom">
                <h5 class="offcanvas-title fw-bold" id="offcanvasCartLabel">Tu Reserva / Carrito</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-flex flex-column">
                <div id="cart-items" class="flex-grow-1 overflow-auto pe-1"></div>
                <div class="border-top pt-3 mt-auto">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="fs-5 fw-semibold">Total:</span>
                        <span id="cart-total" class="fs-4 fw-bold text-success">$0</span>
                    </div>
                    <div class="d-grid gap-2">
                        <button id="btn-checkout" class="btn btn-orange-pill py-2 fw-medium">Confirmar y Checkout</button>
                        <button id="btn-clear-cart" class="btn btn-outline-danger btn-sm border-0">Vaciar Carrito</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Pie de página
    document.getElementById('footer-container').innerHTML = `
        <footer class="bg-dark text-white text-center py-4 mt-5">
            <p class="mb-0">&copy; 2026 Gabriel Gonzalez - Todos los derechos reservados</p>
        </footer>
    `;
}

// Carga asíncrona de datos del archivo productos.json usando fetch y try/catch/finally
async function cargarProductos() {
    const container = document.getElementById('products-container');

    try {
        const response = await fetch('assets/data/productos.json');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        productosGlobales = await response.json();
        renderizarProductos(productosGlobales);

    } catch (error) {
        // Muestro el mensaje de error directamente en el DOM
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger d-inline-block" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    No se pudo cargar el catálogo. Intente nuevamente más tarde.
                </div>
            </div>`;
    } finally {
        // Bloque finally para indicar que finalizó la petición
    }
}

// Dibujo las tarjetas de productos en la pantalla
function renderizarProductos(productos) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    // Uso de operador ternario por si la lista está vacía
    if (productos.length === 0) {
        container.innerHTML = '<p class="text-center text-muted col-12">No hay elementos disponibles en esta categoría.</p>';
        return;
    }

    // Recorro el array con .forEach() usando destructuring
    productos.forEach(({ id, titulo, categoria, precio, imagen, descripcion }) => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="card product-card h-100 shadow-sm">
                <img src="${imagen}" class="card-img-top" alt="${titulo}">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-light text-dark align-self-start mb-2 border">${categoria.toUpperCase()}</span>
                    <h5 class="card-title fw-bold mb-2">${titulo}</h5>
                    <p class="card-text text-secondary small flex-grow-1">${descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="fs-5 fw-bold text-dark">${cart.formatCurrency(precio)}</span>
                        <button class="btn btn-orange-pill px-3 py-2 btn-add" data-id="${id}">
                            <i class="bi bi-bag-plus me-1"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Agrego eventos a los botones de "Agregar" usando .find() para ubicar el producto
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.currentTarget.dataset.id);
            const productoSeleccionado = productosGlobales.find(p => p.id === id);
            if (productoSeleccionado) {
                cart.addItem(productoSeleccionado);
            }
        });
    });
}

// Configuración de los botones de filtrado por categoría usando .filter()
function inicializarFiltros() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const categoria = e.currentTarget.dataset.category;

            // Uso operador ternario y la función de orden superior .filter()
            const productosFiltrados = categoria === 'todos' 
                ? productosGlobales 
                : productosGlobales.filter(p => p.categoria === categoria);

            renderizarProductos(productosFiltrados);
        });
    });
}

// Inicializo todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    renderLayout();          // Creo la estructura HTML dinámica
    cargarProductos();       // Cargo el JSON con fetch
    inicializarFiltros();     // Activo los filtros por categoría
    cart.init();             // Vinculo el carrito a la interfaz
});