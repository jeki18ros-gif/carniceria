// ===================================================
// 1. DATOS UNIFICADOS DE PRODUCTOS
// (Incluye variantes para la navegación dentro del modal)
// ===================================================

const productsData = [
    {
        name: "Carne de Res",
        variants: [
            {
                image: "img/otros1.jpg",
                description: "Nuestra carne de res premium incluye cortes como el **lomo fino, T-bone y entraña**. Proviene de ganado alimentado en pastos seleccionados, asegurando máxima terneza y sabor. Ideal para exportación o alta cocina.",
            },
            {
                // NOTA: Asegúrate de tener estas imágenes de variante en tu carpeta 'img'
                image: "img/relleno1.jpg", 
                description: "Carne de res madurada. Ideal para restaurantes gourmet. Pregunte por nuestra disponibilidad en chuletón. **Garantizamos la cadena de frío** desde el origen hasta su destino.",
            },
            {
                image: "img/relleno2.jpg", 
                description: "Cortes para moler y procesar. Suministro mayorista constante. Perfecto para embutidos. **Calidad certificada**.",
            },
        ],
    },
    {
        name: "Carne de Cerdo",
        variants: [
            {
                image: "img/otros2.jpg",
                description: "Ofrecemos costillas de cerdo St. Louis, lomos sin hueso y panceta fresca. **Calidad controlada** para garantizar un equilibrio perfecto de grasa y carne. Perfecto para parrilladas y charcutería.",
            },
            {
                image: "img/relleno3.jpg",
                description: "Carne de cerdo en porciones para charcutería. Frescura y consistencia en cada pedido. Trabajamos con **certificaciones de higiene rigurosas**.",
            },
            
            {
              image:"img/relleno4.jpg",
              description:"descripcion",
},
        ],
    },
    {
        name: "Pollo Fresco",
        variants: [
            {
                image: "img/otros6.jpg",
                description: "Pollos enteros y en cortes (pechuga, muslo, ala) con **certificación de bioseguridad**. Producto fresco, nunca congelado, ideal para grandes volúmenes de consumo diario en restaurantes y comedores.",
            },
            {
                image: "img/relleno5.jpg", // NOTA: Asegúrate de tener esta imagen
                description: "Cortes de pollo: pechugas, muslos y alas. Empacados al vacío para mayor durabilidad. **Disponibilidad garantizada** todo el año.",
            },
             {
              image:"img/relleno6.jpg",
              description:"descripcion",
},
        ],
    },
    {
        name: "Carne de Cordero",
        variants: [
            {
                image: "img/otros3.jpg",
                description: "El cordero más fino, con especialidad en paletillas y chuletas. **Sabor suave y textura tierna**, criado bajo estándares de calidad gourmet.",
            },
             {
              image:"img/relleno7.jpg",
              description:"descripcion",
},
 {
              image:"img/relleno8.jpg",
              description:"descripcion",
},
        ],
    },
    {
        name: "Otros Productos",
        variants: [
            {
                image: "img/otros4.jpg",
                description: "Ofrecemos una línea de productos especiales como **vísceras, embutidos a granel y cortes exóticos** (ej. carne de pavo, conejo).",
            },
             {
              image:"img/relleno9.jpg",
              description:"descripcion",
},
 {
              image:"img/relleno10.jpg",
              description:"descripcion",
},
        ],
    }
];


// ===================================================
// 2. LÓGICA DEL CARRUSEL 3D
// ===================================================

const carousel = document.querySelector(".carousel3d");
const dots = document.querySelectorAll(".dot");

let angle = 0;
let currentIndex = 0;
const totalSlides = dots.length;
let autoRotateInterval; 

/** Muestra el slide y actualiza el dot activo. */
function showSlide(index) {
    angle = (360 / totalSlides) * index * -1;
    carousel.style.transform = `translateZ(-500px) rotateY(${angle}deg)`;
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
    currentIndex = index;
}

/** Reinicia el intervalo de rotación automática. */
function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }, 4000); 
}

// Inicialización y Eventos
showSlide(0); // Muestra el primer slide al cargar
resetAutoRotate();

dots.forEach(dot => {
    dot.addEventListener("click", () => {
        let index = parseInt(dot.getAttribute("data-index"));
        showSlide(index);
        resetAutoRotate(); 
    });
});


// ===================================================
// 3. LÓGICA DEL MODAL DINÁMICO
// ===================================================

let currentProductIndex = 0; 
let currentVariantIndex = 0; 

// --- Elementos del DOM del Modal ---
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const verProductoBtns = document.querySelectorAll('.ver-producto');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');

// Botones de Navegación entre Productos (grandes)
const prevProductBtn = document.querySelector('.prev-product');
const nextProductBtn = document.querySelector('.next-product');

// Botones de Navegación entre Variantes (internas)
const prevImageBtn = document.querySelector('.prev-image');
const nextImageBtn = document.querySelector('.next-image');


/** Actualiza la modal con la información del producto y la variante actual. */
function updateModalContent() {
    const product = productsData[currentProductIndex];
    const variant = product.variants[currentVariantIndex];

    modalTitle.textContent = product.name;
    // Usamos innerHTML para permitir que el texto en negrita (<strong> o <b>) se muestre
    modalDescription.innerHTML = variant.description; 
    modalImage.src = variant.image;
    modalPrice.textContent = product.price;

    // Actualiza el texto del botón de pedido
    const orderBtn = modal.querySelector('.btn');
    orderBtn.textContent = `Hacer Pedido de ${product.name}`;

    // Lógica para desactivar flechas de productos en los extremos
    prevProductBtn.disabled = currentProductIndex === 0;
    nextProductBtn.disabled = currentProductIndex === productsData.length - 1;

    // Lógica para desactivar flechas de variantes en los extremos
    prevImageBtn.disabled = currentVariantIndex === 0;
    nextImageBtn.disabled = product.variants.length <= 1 || currentVariantIndex === product.variants.length - 1;
}

/** Muestra la modal e inicializa el contenido. */
function openModal(productId) {
    currentProductIndex = productId;
    currentVariantIndex = 0; // Siempre empezar por la primera imagen al abrir
    updateModalContent();
    modal.style.display = 'flex';
}

/** Navega entre las variantes (imágenes/descripciones) de un producto. */
function navigateVariant(direction) {
    const product = productsData[currentProductIndex];
    
    let newIndex = currentVariantIndex + direction;
    
    // Si la navegación está dentro de los límites
    if (newIndex >= 0 && newIndex < product.variants.length) {
        currentVariantIndex = newIndex;
        updateModalContent();
    }
}

/** Navega entre los productos principales. */
function navigateProduct(direction) {
    let newIndex = currentProductIndex + direction;

    // Si la navegación está dentro de los límites
    if (newIndex >= 0 && newIndex < productsData.length) {
        currentProductIndex = newIndex;
        currentVariantIndex = 0; // Resetear variante al cambiar de producto
        updateModalContent();
    }
}


// --- Event Listeners del Modal ---

// 1. Abre el modal al hacer clic en "Ver productos"
verProductoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Usamos data-product-id del HTML (0, 1, 2...)
        const productId = parseInt(btn.getAttribute('data-product-id'));
        openModal(productId);
    });
});

// 2. Cierra el modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 3. Cierra el modal si se hace clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// 4. Eventos para la navegación interna (variantes/imágenes)
prevImageBtn.addEventListener('click', () => navigateVariant(-1));
nextImageBtn.addEventListener('click', () => navigateVariant(1));

// 5. Eventos para la navegación principal (productos)
prevProductBtn.addEventListener('click', () => navigateProduct(-1));
nextProductBtn.addEventListener('click', () => navigateProduct(1));


// ===================================================
// 4. MANEJO DEL FORMULARIO DE CONTACTO
// ===================================================

document.getElementById("formContacto").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("✅ ¡Mensaje enviado! Gracias por contactarnos. Te responderemos pronto.");
    this.reset();
});