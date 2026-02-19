
/*
<div class="product">
<img src="${p.image}" alt="">
<div class="product-txt">
    <h3>${p.name}</h3>
    <p>${p.description}</p>
    <p class="precio">$${p.price}</p>
    ${buttonHTML}
</div>
</div>
`*/



// llamado de productos al back-end y ordenarlos en el front

let productos = [];


async function llamarProductos () {

    try {

        productos = await (await fetch ('/productos')).json();
        control_stock()
        
        organizar_categoria();
    }catch(error) {
        console.log("hay un error", error)
    }
}

llamarProductos()

//pasar productos al front end

function organizar_categoria () {

    let clasico = productos.filter(p => p.category === "carne-res");
    productosFrontEnd(clasico, "product-cards-clasico")
    let teconologia = productos.filter(p => p.category === "carne-cerdo");
    productosFrontEnd(teconologia, "product-cards-tecnologia")
    let deportivo = productos.filter(p => p.category === "carne-pollo");
    productosFrontEnd(deportivo, "product-cards-deportivo")
}


 function productosFrontEnd (productosByType, tag) {
    let productosHTML = '';
    
    productosByType.forEach(p => {
    
       let botonAgregar = `<button class='agregar-carrito'  onclick = "agregar_carrito(${p.id})">agregar al Carrito</button>`;
    
       if(p.stock === 0) {
        botonAgregar = `<button disabled  class="agregar-carrito disabled"  >Sin stock</button>`
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
    </div>`
   
    
    });
    
    
    document.getElementById(tag).innerHTML = productosHTML;


}

let productosAñadidos = JSON.parse(localStorage.getItem("productos_carrito")) || [];

let lista = document.querySelector("#lista-carrito tbody");
let mostrar_total = document.getElementById("pag")
       
 function mostrar_carrito () {
           
           let precio = 0

           lista.innerHTML = ""
    mostrar_total.innerHTML = ""
    
    productosAñadidos.forEach( (producto, index) => {

        let producto_carrito = document.createElement("tr");

        let botonBorrar = `<button class="borrar" onclick = "eliminarDelCarrito(${index}, ${producto.id}, ${producto.contador})""> X </button>`;
    
        if(producto.valido === false) {
         botonBorrar = `<button class="sin-stock" title='sin stock disponible' onclick = "eliminarDelCarrito(${index}, ${producto.id}, ${producto.contador})""> X </button>`
        }

         producto_carrito.innerHTML = `  <td>
            <img src="${producto.image}" width="100"/>
        </td>
        <td class = 'remover-nombre'>
            ${producto.name}
        </td>
        <td>
           $ ${producto.price}
        </td>
        <td class = "cantidad" style="width: 120px"; ">
        <i class="bi bi-caret-left" onclick = "decrementar_cantidad(${producto.id})"></i>${producto.contador}<i class="bi bi-caret-right-fill" onclick = "aumentar_cantidad(${producto.id})"></i>
        </td>
        <td>
            ${botonBorrar}
        </td>`
        let total = producto.price * producto.contador
        precio += total;
        lista.appendChild(producto_carrito)
    });
    
    if(precio === 0) {
        mostrar_total.className = "a-deshabilitado"
        return mostrar_total.innerHTML = `Pagar`;
    }
    mostrar_total.className = "btn-2"
    mostrar_total.innerHTML = `Pagar $${precio}`
   

    
  

}
mostrar_carrito()

 async function control_stock() {

     productosAñadidos.forEach( element => {
         
         let producto_descontar =  productos.find(p => p.id === element.id);
        if(element.contador > producto_descontar.stock && producto_descontar.stock !== 0) {

            element.contador = producto_descontar.stock;
            producto_descontar.stock -= element.contador ; 
            element.stock = producto_descontar.stock   
        }else if (producto_descontar.stock === 0){
            
            element.valido = false;
            return Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Algunos productos en tu carrito de compras ya no estan disponibles o no tienen stock",
                
            });
        } else {
            
            producto_descontar.stock -= element.contador ;
            element.stock = producto_descontar.stock
        }
        
        
    })
    
    console.log(productos)
    console.log(productosAñadidos)
    mostrar_carrito()
    

}
function agregar_carrito (ident) {

    let seek = productos.find(product => product.id === ident);
    let repetido = productosAñadidos.find(look => look.id === ident);
    if (repetido) {
        return notificacionAgregarAlCarrito();
    }
    notificacionAgregarAlCarrito()
    seek.contador = 1
    productosAñadidos.push(seek)
    let producto_decrementar = productos.find(p => p.id === ident)
    producto_decrementar.stock--;
    console.log(producto_decrementar)
  
    localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos));
    mostrar_carrito();

    console.log(productosAñadidos)
    organizar_categoria()

}

 function eliminarDelCarrito (index, ident, contador) {

    let producto_aumentar = productos.find(p => p.id === ident)
    let producto_invalido = productosAñadidos.find(p => p.valido === false);
    if(!producto_invalido) {

        producto_aumentar.stock += contador;
    }
    productosAñadidos.splice(index, 1);
    localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos));

    mostrar_carrito()
    organizar_categoria()

}


function aumentar_cantidad (id) {
   let encontrar = productosAñadidos.find(p => p.id === id);
   let producto_decrementar = productos.find(p => p.id === id)
   if(producto_decrementar.stock <= 0) {
    return alert ("no hay mas stock para el producto");
   }
   encontrar.contador++;
   producto_decrementar.stock--;
   encontrar.stock = producto_decrementar.stock
   console.log(producto_decrementar)

   localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos))
   mostrar_carrito()
organizar_categoria()
   
}
function decrementar_cantidad (id) {

    let encontrar = productosAñadidos.find(p => p.id === id);
    if(encontrar.contador <= 1) {
        
        return encontrar.contador = 1;
    }
    encontrar.contador--;
    let producto_aumentar = productos.find(p => p.id === id)
    producto_aumentar.stock++;
    encontrar.stock = producto_aumentar.stock
    console.log(producto_aumentar)
 
    localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos))
    mostrar_carrito()
    organizar_categoria()
}

function notificacionAgregarAlCarrito() {


    let noti = document.getElementById("notificacion");

    noti.style.display = "block";
    noti.style.opacity = "1";
    setTimeout(() => {
        noti.style.display = "none";
        noti.style.opacity = "0";
    }, 2000);
}

function vaciar_carrito() {

    productosAñadidos = [];
    localStorage.setItem("productos_carrito", JSON.stringify(productosAñadidos));
    mostrar_carrito()
    llamarProductos()

}

function validar_productos () {
    // permitir o negar pasar a pagina de proceso de compra (revisar que producto esta invalido)
    let producto_invalido = productosAñadidos.find(p => p.valido === false);
    if(producto_invalido) {

        return alert("hay productos sin stock en el carrito de compras")
    }else {
        window.location.href = "/proceso/compra"
    }
}



/*

function add (dataId, dataPrice) {

    parseInt(dataId, dataPrice);

    let productoAgregar = productos.find(encontrar => encontrar.id === dataId)

        let proudcto_carrito = document.createElement("tr");

        prouducto_carrito.innerHTML = `  <td>
            <img src="${productoAgregar.image}" width="100"/>
        </td>
        <td>
            ${productoAgregar.name}
        </td>
        <td>
            ${productoAgregar.price}
        </td>
        <td>
            <button  class="borrar" data-id="${productoAgregar.id}"> X </button>
        </td>`

        lista.appendChild(proudcto_carrito)

}
        */

