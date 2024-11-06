// tienda.js

//Vistas WEB

document.addEventListener('DOMContentLoaded', function() {
    // Obtener las secciones de la página
    const sections = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');

    function showPage(pageId) {
        sections.forEach(section => {
            section.style.display = (section.id === pageId) ? 'block' : 'none';
        });
    }

    // Inicializa mostrando la página de inicio
    showPage('home');

    // Agregar eventos de clic en los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').substring(1); // Eliminar el '#' del href
            showPage(pageId);
        });
    });
});


//lista de productos
document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('product-list');
    let currentFilter = 'all';
    let currentSort = 'relevance';

    // Cargar productos desde JSON
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const products = data.productos;
            renderProducts(products);

            // Filtrado
            document.querySelectorAll('.filter-option').forEach(option => {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentFilter = this.dataset.category;
                    filterAndSortProducts(products);
                });
            });

            // Ordenamiento
            document.querySelectorAll('.sort-option').forEach(option => {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentSort = this.dataset.sort;
                    filterAndSortProducts(products);
                });
            });

            // Función para renderizar los productos
            function renderProducts(productos) {
                productList.innerHTML = ''; // Limpiar lista de productos
                productos.forEach(product => {
                    const productCard = `
                        <div class="col" data-category="${product.categoria}" data-price="${product.precio}" data-rating="${product.rating}">
                            <div class="card h-100">
                                <img src="${product.imagen}" class="card-img-top" alt="${product.nombre}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.nombre}</h5>
                                    <p class="text-muted">$${product.precio}</p>
                                    <button class="btn btn-primary comprar-btn shadow-lg rounded-pill px-4 py-2 d-inline-flex align-items-center" 
                                    data-product-name="${product.nombre}" 
                                    data-product-price="${product.precio}">
                                    <i class="fas fa-shopping-cart me-2"></i> Comprar
                                    </button>                            
                                </div>
                            </div>
                        </div>`;
                    productList.innerHTML += productCard;
                });
                // Volver a asignar los eventos de compra a los nuevos productos
                setupBuyButtons();
            }

            // Función de filtrado y ordenamiento
            function filterAndSortProducts(productos) {
                let filteredProducts = productos.filter(product => {
                    return currentFilter === 'all' || product.categoria === currentFilter;
                });

                filteredProducts.sort((a, b) => {
                    switch (currentSort) {
                        case 'price-asc':
                            return a.precio - b.precio;
                        case 'price-desc':
                            return b.precio - a.precio;
                        case 'rating':
                            return b.rating - a.rating;
                        default: // 'relevance'
                            return 0;
                    }
                });

                renderProducts(filteredProducts);
            }
        });

    // Función para configurar los botones de compra
    function setupBuyButtons() {
        const tiendaTelefono = "3012180930"; // Número de teléfono de la tienda

        document.querySelectorAll('.comprar-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productName = this.getAttribute('data-product-name');
                const productPrice = this.getAttribute('data-product-price');

                const mensaje = `Hola, estoy interesado en comprar el producto "${productName}" por $${productPrice}. ¿Podrías brindarme más información?`;
                const whatsappURL = `https://api.whatsapp.com/send?phone=${tiendaTelefono}&text=${encodeURIComponent(mensaje)}`;

                window.open(whatsappURL, '_blank');
            });
        });
    }
});
