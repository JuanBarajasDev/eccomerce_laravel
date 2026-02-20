// llamado de productos al back-end y ordenarlos en el front

let productos = []; // Lista de todos los productos disponibles (con stock)
let productosAñadidos = JSON.parse(localStorage.getItem("productos_carrito")) || []; // Productos en el carrito

// Elementos del DOM
const lista = document.querySelector("#lista-carrito tbody");
const mostrar_total = document.getElementById("pag");
const carritoDiv = document.getElementById("carrito"); // Referencia al contenedor del carrito

// **CORRECCIÓN CLAVE: CONEXIÓN DEL BOTÓN DE PAGO**
// Aseguramos que al hacer click en el botón de "Pagar" se ejecute la validación.
if (mostrar_total) {
    mostrar_total.addEventListener('click', function(e) {
        // Prevenir la acción por defecto del enlace (si está habilitado)
        if (!this.classList.contains('a-deshabilitado')) {
            e.preventDefault();
            validar_productos();
        }
    });
}


/**
 * Muestra u oculta el carrito (necesario para el onclick en el icono de la bolsa)
 */
function toggleCarrito() {
    if (carritoDiv) {
        // Alternar una clase visible (asegúrate de definir 'visible' en tu CSS para mostrar/ocultar #carrito)
        carritoDiv.classList.toggle('visible'); 
    }
}

/**
 * Convierte un valor de peso a Kilogramos (kg)
 * Se asume que el precio base (p.price) es por KG.
 * @param {number} peso - El valor del peso.
 * @param {string} unidad - La unidad de peso ('kg', 'lb', 'gr').
 * @returns {number} El peso equivalente en Kilogramos.
 */
function convertirAPesoBase(peso, unidad) {
    peso = parseFloat(peso);
    if (isNaN(peso) || peso <= 0) return 0; // Manejar valores inválidos

    switch (unidad) {
        case 'kg':
            return peso; 
        case 'lb':
            return peso * 0.453592; // 1 lb ≈ 0.45 kg
        case 'gr':
            return peso / 1000; // 1 gr = 0.001 kg
        default:
            return peso;
    }
}

//-------------------------------------------------------------------

/**
 * Llama a los productos desde el backend, inicializa el control de stock
 * y organiza la visualización en el frontend.
 */
async function llamarProductos() {
    try {
        // Simulación: Asume que el backend ahora devuelve productos con las propiedades necesarias
        // **Asegúrate de que esta ruta sea correcta para tu backend**
        const response = await fetch('/productos');
        if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        productos = data.map(p => ({
            ...p,
            // Añade propiedades por defecto y asegura que sean números
            peso: parseFloat(p.peso) || 1.0, 
            unidadPeso: p.unidadPeso || 'kg',
            marmoleo: p.marmoleo || 'medio',
            maduracion: p.maduracion || 'medio',
            valido: p.valido !== undefined ? p.valido : true,
            contador: parseInt(p.contador) || 1 // contador para la cantidad/unidades
        }));

        await control_stock(); // Asegura que el carrito refleje el stock actual
        organizar_categoria(); // Muestra los productos en las categorías del frontend

    } catch (error) {
        console.error("Error al llamar productos:", error);
    }
}

llamarProductos();

//-------------------------------------------------------------------
function organizar_categoria() {
    let clasico = productos.filter(p => p.category === "carne-res");
    productosFrontEnd(clasico, "product-cards-clasico")
    let tecnologia = productos.filter(p => p.category === "carne-cerdo"); // Asumo que corregiste la variable de la categoría
    productosFrontEnd(tecnologia, "product-cards-tecnologia")
    let deportivo = productos.filter(p => p.category === "carne-pollo");
    productosFrontEnd(deportivo, "product-cards-deportivo")
}

/**
 * Genera el HTML para mostrar los productos en el frontend.
 * @param {Array} productosByType - Productos a mostrar.
 * @param {string} tag - ID del contenedor en el DOM.
 */
function productosFrontEnd(productosByType, tag) {
    let productosHTML = '';

    productosByType.forEach(p => {
        let botonAgregar = `<button class='agregar-carrito' onclick="agregar_carrito(${p.id})">Agregar al Carrito</button>`;

        if (p.stock === 0) {
            botonAgregar = `<button disabled class="agregar-carrito disabled">Sin stock</button>`;
        }

        productosHTML += `
            <div class="product">
                <img src="${p.image}" alt="">
                <div class="product-txt">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <p class="precio">$${p.price.toLocaleString('es-CO')}</p>
                    ${botonAgregar}
                </div>
            </div>`;
    });

    const container = document.getElementById(tag);
    if (container) {
        container.innerHTML = productosHTML;
    }
}

//-------------------------------------------------------------------

/**
 * Genera el HTML del carrito de compras basándose en `productosAñadidos`.
 */
function mostrar_carrito() {
    let precioTotal = 0;
    lista.innerHTML = ""; // Limpia la tabla (AQUÍ ES DONDE SE BORRABA LA FILA DE EJEMPLO)
    
    // Configuración inicial del botón de pagar
    if (productosAñadidos.length === 0) {
        mostrar_total.className = "a-deshabilitado"; 
        mostrar_total.innerHTML = `Pagar $0.00`;
    } 

    productosAñadidos.forEach((producto, index) => {
        // Opciones para los select
        const unidades = ['kg', 'lb', 'gr'];
        const niveles = ['bajo', 'medio', 'alto'];
        
        const pesoActual = parseFloat(producto.peso) || 1.0; 

        // Genera el HTML para los selects de peso, marmoleo y maduración
        const selectPesoHTML = `
            <input type="number" min="0.1" step="0.1" value="${pesoActual}" 
                    style="width: 50px;" 
                    onchange="actualizar_propiedad_carrito(${producto.id}, 'peso', this.value)">
            <select onchange="actualizar_propiedad_carrito(${producto.id}, 'unidadPeso', this.value)">
                ${unidades.map(u => `<option value="${u}" ${producto.unidadPeso === u ? 'selected' : ''}>${u}</option>`).join('')}
            </select>`;

        const selectMarmoleoHTML = `
            <select onchange="actualizar_propiedad_carrito(${producto.id}, 'marmoleo', this.value)">
                ${niveles.map(n => `<option value="${n}" ${producto.marmoleo === n ? 'selected' : ''}>${n}</option>`).join('')}
            </select>`;

        const selectMaduracionHTML = `
            <select onchange="actualizar_propiedad_carrito(${producto.id}, 'maduracion', this.value)">
                ${niveles.map(n => `<option value="${n}" ${producto.maduracion === n ? 'selected' : ''}>${n}</option>`).join('')}
            </select>`;

        // Botón de borrar con su funcionalidad
        const botonBorrarHTML = `<a href="#" class="borrar" data-id="${producto.id}" onclick="event.preventDefault(); eliminarDelCarrito(${index}, ${producto.id}, ${producto.contador})">X</a>`;
        
        const rowClass = producto.valido === false ? 'producto-sin-stock' : '';

        const producto_carrito = document.createElement("tr");
        producto_carrito.className = rowClass;

        // **CÁLCULO DEL SUBTOTAL**
        // Calculamos el peso total para este item, convertido a la unidad base (kg)
        const pesoEnKg = convertirAPesoBase(producto.peso, producto.unidadPeso);
        // Subtotal = Precio_por_KG * Peso_del_corte_en_KG * Cantidad_de_cortes(contador)
        const subtotal = producto.price * pesoEnKg * producto.contador;
        precioTotal += subtotal;

        // Estructura de la fila
        producto_carrito.innerHTML = `
            <td><img src="${producto.image}" width="50"></td>
            <td class="remover-nombre">${producto.name}</td>
            <td>${selectPesoHTML}</td>
            <td>${selectMarmoleoHTML}</td>
            <td>${selectMaduracionHTML}</td>
            <td>$${producto.price.toFixed(2)} / kg</td>
            <td>
                <div class="cantidad">
                    <i class="fa fa-minus" onclick="decrementar_cantidad(${producto.id})"></i>
                    <p>${producto.contador}</p>
                    <i class="fa fa-plus" onclick="aumentar_cantidad(${producto.id})"></i>
                </div>
            </td>
            <td>${botonBorrarHTML}</td>`;

        lista.appendChild(producto_carrito);
    });

    // Actualiza el botón de pagar
    if (precioTotal <= 0) { 
        mostrar_total.className = "a-deshabilitado";
        mostrar_total.innerHTML = `Pagar $0.00`;
    } else {
        mostrar_total.className = "btn-2";
        mostrar_total.innerHTML = `Pagar $${precioTotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
    }
}

// Llama a mostrar_carrito al inicio para cargar la data del localStorage
mostrar_carrito();

//-------------------------------------------------------------------

/**
 * Función para actualizar las propiedades de un producto en el carrito (Peso, Marmoleo, Maduración).
 * @param {number} id - ID del producto.
 * @param {string} propiedad - Nombre de la propiedad a actualizar ('peso', 'unidadPeso', 'marmoleo', 'maduracion').
 * @param {any} valor - Nuevo valor.
 */
function actualizar_propiedad_carrito(id, propiedad, valor) {
    const productoEnCarrito = productosAñadidos.find(p => p.id === id);
    if (productoEnCarrito) {
        // Asegura que el peso sea un número positivo
        if (propiedad === 'peso') {
            let nuevoPeso = parseFloat(valor);
            productoEnCarrito[propiedad] = (nuevoPeso > 0) ? nuevoPeso : 0.1; 
        } else {
            productoEnCarrito[propiedad] = valor;
        }

        // Vuelve a guardar y mostrar para actualizar el carrito visualmente y el total
        localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos));
        mostrar_carrito();
    }
}

/**
 * Sincroniza el stock de los productos en el carrito con el stock global.
 */
async function control_stock() {
    if (productos.length === 0) return;

    productosAñadidos.forEach(element => {
        let producto_descontar = productos.find(p => p.id === element.id);

        if (!producto_descontar) {
            element.valido = false;
            return;
        }

        if (producto_descontar.stock === 0) {
            element.valido = false;
            // Solo alerta si el estado cambia (para evitar spam)
            if (element.valido !== false) {
                 Swal.fire({
                     icon: "error",
                     title: "Oops...",
                     text: `El producto ${element.name} ya no tiene stock disponible.`,
                 });
            }
        } else if (element.contador > producto_descontar.stock) {
            const stockAnterior = producto_descontar.stock;
            // Ajusta la cantidad del carrito al stock disponible
            element.contador = producto_descontar.stock;
            producto_descontar.stock = 0; 
            element.stock = producto_descontar.stock;
            element.valido = true; 
            Swal.fire({
                icon: "warning",
                title: "Stock limitado",
                text: `La cantidad de ${element.name} se ajustó a ${stockAnterior} debido a la disponibilidad.`,
            });
        } else {
            // Descuenta el stock normalmente
            producto_descontar.stock -= element.contador;
            element.stock = producto_descontar.stock;
            element.valido = true;
        }
    });

    localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos));
    mostrar_carrito();
}

/**
 * Agrega un producto al carrito.
 * @param {number} ident - ID del producto a agregar.
 */
function agregar_carrito(ident) {
    let seek = productos.find(product => product.id === ident);
    let repetido = productosAñadidos.find(look => look.id === ident);

    if (repetido) {
        return notificacionAgregarAlCarrito("Producto ya en el carrito.");
    }

    if (seek.stock <= 0) {
        return alert("Sin stock disponible para este producto.");
    }

    // Clonar el producto para no modificar el objeto original del catálogo
    let productoParaCarrito = {
        ...seek,
        contador: 1, // Inicializa la cantidad en 1 unidad/pieza
        valido: true
    };
    productosAñadidos.push(productoParaCarrito);

    // Decrementar el stock global
    seek.stock--;
    productoParaCarrito.stock = seek.stock;

    localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos));
    mostrar_carrito();
    organizar_categoria();
    notificacionAgregarAlCarrito(`Agregado ${seek.name} al carrito.`);
}

/**
 * Elimina un producto del carrito.
 * @param {number} index - Índice del producto en `productosAñadidos`.
 * @param {number} ident - ID del producto.
 * @param {number} contador - Cantidad (unidades) que se elimina.
 */
function eliminarDelCarrito(index, ident, contador) {
    let producto_aumentar = productos.find(p => p.id === ident);

    // Solo aumenta el stock si el producto todavía existe en el catálogo global
    if (producto_aumentar) {
        producto_aumentar.stock += contador;
    }

    // Elimina del array y actualiza localStorage
    productosAñadidos.splice(index, 1);
    localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos));

    mostrar_carrito();
    organizar_categoria();
}

/**
 * Aumenta la cantidad (contador) de un producto en el carrito.
 * @param {number} id - ID del producto.
 */
function aumentar_cantidad(id) {
    let encontrar = productosAñadidos.find(p => p.id === id);
    let producto_decrementar = productos.find(p => p.id === id);

    if (producto_decrementar && producto_decrementar.stock <= 0) {
        return alert("No hay más stock disponible para este producto.");
    }

    if (encontrar) {
        encontrar.contador++;
        if (producto_decrementar) {
            producto_decrementar.stock--;
            encontrar.stock = producto_decrementar.stock;
        }
        localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos));
        mostrar_carrito();
        organizar_categoria();
    }
}

/**
 * Decrementa la cantidad (contador) de un producto en el carrito.
 * @param {number} id - ID del producto.
 */
function decrementar_cantidad(id) {
    let encontrar = productosAñadidos.find(p => p.id === id);
    let producto_aumentar = productos.find(p => p.id === id);

    if (encontrar && encontrar.contador > 1) {
        encontrar.contador--;
        if (producto_aumentar) {
            producto_aumentar.stock++;
            encontrar.stock = producto_aumentar.stock;
        }
        localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos));
        mostrar_carrito();
        organizar_categoria();
    } else if (encontrar && encontrar.contador === 1) {
        // En lugar de dejarlo en 1, puedes eliminarlo para ser más intuitivo en un carrito de compras.
        // Pero mantendremos el comportamiento de tu código original (no hacer nada en 1).
        return;
    }
}

/**
 * Muestra una notificación temporal al agregar al carrito.
 * @param {string} mensaje - Mensaje a mostrar.
 */
function notificacionAgregarAlCarrito(mensaje = "Producto agregado correctamente") {
    let noti = document.getElementById("notificacion");
    if (!noti) {
        console.log("Notificación:", mensaje);
        return;
    }

    noti.textContent = mensaje;
    noti.style.display = "block";
    noti.style.opacity = "1";

    clearTimeout(noti.timer); 

    noti.timer = setTimeout(() => {
        noti.style.opacity = "0";
        setTimeout(() => {
            noti.style.display = "none";
        }, 300); // Ajustar al tiempo de la transición CSS
    }, 2000);
}

/**
 * Vacía completamente el carrito y devuelve el stock al catálogo.
 */
function vaciar_carrito() {
    if (confirm("¿Estás seguro de que quieres vaciar la cesta de compra?")) {
        // Devolver el stock
        productosAñadidos.forEach(item => {
            const productoOriginal = productos.find(p => p.id === item.id);
            if (productoOriginal && item.valido !== false) {
                productoOriginal.stock += item.contador;
            }
        });

        productosAñadidos = [];
        localStorage.removeItem("productos_carrito"); 

        mostrar_carrito(); 
        organizar_categoria(); 
    }
}

/**
 * Valida que no haya productos sin stock antes de pasar al proceso de pago.
 */
function validar_productos() {
    let producto_invalido = productosAñadidos.find(p => p.valido === false);

    if (productosAñadidos.length === 0) {
        return alert("El carrito está vacío. Agrega productos para continuar.");
    }

    if (producto_invalido) {
        return alert("Hay productos sin stock disponible en el carrito de compras. Por favor, elimínalos para continuar.");
    } else {
        // **CORRECCIÓN RESTAURADA:** Redirección a la vista de pago
        // Asegúrate de que esta ruta sea la correcta para tu vista de pago
        window.location.href = "/proceso/compra"; // <-- ¡Redirección restaurada!
        
        // (La línea alert("¡Proceso de pago iniciado!...") que mandaba la alerta ha sido eliminada)
    }
}