let comprados = JSON.parse(localStorage.getItem("productos_carrito")) || [];
let acumulador = 0;
let divInfo = document.getElementById("control_direccion");

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

// mostrar los productos a comprar (Versión Final Estática)
function mostrar_orden() {
    acumulador = 0; // Resetear el acumulador

    // Encabezado de la tabla
    let productos_proceso_de_compra = `
    <thead>
        <tr>
            <th style="width: 25%">Corte</th>
            <th style="width: 20%">Peso/Uni.</th>
            <th style="width: 15%">Marmoleo</th>
            <th style="width: 15%">Maduración</th>
            <th style="width: 25%; text-align: right;">Subtotal</th>
        </tr>
    </thead>
    <tbody>`;

    comprados.forEach(producto => {
        // **MOSTRAR LAS OPCIONES ELEGIDAS COMO TEXTO ESTÁTICO**
        const pesoElegido = `${(parseFloat(producto.peso) || 1.0).toFixed(1)} ${producto.unidadPeso}`;
        const marmoleoElegido = producto.marmoleo || 'N/A';
        const maduracionElegida = producto.maduracion || 'N/A';

        // CÁLCULO DEL SUBTOTAL
        const pesoEnKg = convertirAPesoBase(producto.peso, producto.unidadPeso);
        // Subtotal = Precio_por_KG * Peso_del_corte_en_KG * Cantidad_de_cortes(contador)
        const subtotal = producto.price * pesoEnKg * producto.contador;
        
        productos_proceso_de_compra += `
        <tr>
            <td style="text-align: left;">
                ${producto.name} x ${producto.contador}
                <br><span style="font-size: 12px; color: #888;">($${producto.price.toLocaleString('es-CO', { minimumFractionDigits: 2 })}/kg)</span>
            </td>
            <td><strong>${pesoElegido}</strong></td>
            <td>${marmoleoElegido}</td>
            <td>${maduracionElegida}</td>
            <td style="text-align: right;">$${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
        </tr>
        `;
        acumulador += subtotal;
    });
    
    productos_proceso_de_compra += `</tbody>`;
    
    document.getElementById('order-table').innerHTML = productos_proceso_de_compra;
    document.getElementById("order-total").innerHTML = `Total $${acumulador.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`
}

mostrar_orden();


// ************************************************
// EL RESTO DE TU CÓDIGO (GEONAMES, DIRECCIÓN, PAGO)
// ************************************************

async function obtenerPaises(codepais) {
     let url = `https://secure.geonames.org/countryInfoJSON?username=sena_2025`;
     let cont = document.getElementById("country");
     try {
         let respuesta = await fetch(url);
         let datos = await respuesta.json();
         
         let paisesSA = datos.geonames.filter(pais => pais.continent ==="SA");
        paisesSA.forEach(element => {
         let country = element.geonameId
         let name = element.countryName
         let option = document.createElement("option");
         option.value = country
         option.textContent = name;
         if(element.geonameId === codepais){
             option.selected = true
            
         }
 
         cont.appendChild(option)
         
        })
        console.log(paisesSA)
 
     } catch (error) {
         console.error("Error al obtener las paises:", error);
     }
 }
 
 let boton = document.getElementById("country").addEventListener("change", () => {
 
     let select = document.getElementById("country")
     console.log(select.options[select.selectedIndex].text)
     ObtenerDepartamentos(select.value)
     console.log(select.value)
 })
 
 
 async function ObtenerDepartamentos(code, codeDep) {
 
 let url = `https://secure.geonames.org/childrenJSON?username=sena_2025&geonameId=${code}`
 
 try{
     let select = document.getElementById("department")
     select.innerHTML = `<option value="">selecciona tu departamento</option>`
     let datos = await(await fetch(url)).json();
     
     datos.geonames.forEach(departamento => {
        let name = departamento.adminName1.replace(/Department/i, "").trim()
         let option = document.createElement("option");
         option.textContent = name
         option.value = departamento.geonameId
         if(departamento.geonameId === codeDep) {
             option.selected = true
         }
         select.appendChild(option)
     })
     
     console.log(datos)
     
 
 }catch(error) {
     console.error("hay un error", error)
 }
 
 
 }
 let lookCity = document.getElementById("department").addEventListener("change", () => {
 
     let select = document.getElementById("department")
     console.log(select.options[select.selectedIndex].text)
     let departamento = select.value;
     console.log(departamento)
     
     obtenerCiudades(departamento)
 })
 async function obtenerCiudades(code, codeCi) {
 
     let url = `https://secure.geonames.org/childrenJSON?username=sena_2025&geonameId=${code}`;
     try {
         let datos = await (await fetch(url)).json();
         let select = document.getElementById("city")
         select.innerHTML = `<option value="">selecciona tu ciudad</option>`
         datos.geonames.forEach(ciudad => {
             let option = document.createElement("option");
             option.textContent = ciudad.name
             option.value = ciudad.geonameId
             if(ciudad.geonameId === codeCi) {
                 option.selected = true
             }
             select.appendChild(option)
         })
         console.log(datos)
             
         
     }catch(error) {
         console.log("algo salio mal" + error)
     }
 
 }
 let showCity = document.getElementById("city").addEventListener("change", () => {
 
     let select = document.getElementById("city")
     console.log(select.options[select.selectedIndex].text)
     let ciudad = select.value;
     console.log(ciudad)
     
 })

let direccion = [];
// subir direccion (ya sea actualizarla o insertarla como nueva)
async function subir_direccion_php(boton) {

   

if (   document.getElementById('country').value === "" ||
 document.getElementById('name').value=== "" ||
  document.getElementById('email').value=== "" ||
 document.getElementById('numberPhone').value=== "" ||
 document.getElementById('addressLine').value=== "" ||
 document.getElementById('city').value=== "" ||
 document.getElementById('department').value=== "" ||
 document.getElementById('postalCode').value === "") {

    return alert("completa todos los campos")
 }
    let selectP = document.getElementById('country')
    let selectD = document.getElementById('department')
    let selectC = document.getElementById('city')
    let address = {
        id: document.getElementById('id').value,
        id_usuario: document.getElementById('id_usuario').value,
        country :  document.getElementById('country').value,
        country_name: (selectP.options[selectP.selectedIndex].text),
        name :  document.getElementById('name').value,
        email :  document.getElementById('email').value,
        numberPhone :  document.getElementById('numberPhone').value,
        addressLine :  document.getElementById('addressLine').value,
        apto :  document.getElementById('apto').value,
        department: document.getElementById('department').value,
        department_name: (selectD.options[selectD.selectedIndex].text),
        city :  document.getElementById('city').value,
        city_name: (selectC.options[selectC.selectedIndex].text),
        postalCode :  document.getElementById('postalCode').value
    }

    if(address.id === "") {

        let insertar_direccion = await fetch("/direccion/post", {
            method : "POST",
            headers : {"Content-Type" : "application/json",
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({address: [address]})  
        })
        let mostrar = await insertar_direccion.json();
        console.log(mostrar)
        obtener_direccion()
    }else {
        let actualizar_direccion = await fetch("/direccion/update", {
            method : "PUT",
            headers : {"Content-Type" : "application/json",
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({address: [address]})
        })
        let mostrar = await actualizar_direccion.json();
        console.log(mostrar.respuesta || mostrar.error)
        boton_actualizar_direccion()
    }
    // order.productos = comprados
   
    document.getElementById('country').disabled = true;
    document.getElementById('name').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('numberPhone').disabled = true;
    document.getElementById('addressLine').disabled = true;
    document.getElementById('apto').disabled = true;
    document.getElementById('department').disabled = true;
   document.getElementById('city').disabled = true;
    document.getElementById('postalCode').disabled = true;
    divInfo.removeChild(boton)

    
}
// obtener del backend respuesta si tiene direccion (autocompletar) si no es el caso para insertarla
async function obtener_direccion() {
    
    
    direccion = await (await fetch("/direccion", {
        method: "GET",
        credentials: "include"
    })).json();
    

    if(direccion.nuevo) {

        console.log("el usuario no tiene direccion")
        document.getElementById('id_usuario').value = direccion.nuevo || "";
        //fetch_paises();
        obtenerPaises()
        boton_confirmar_direccion()
    }else {
        //fetch_paises(direccion.pais);
        console.log(direccion.pais)
        obtenerPaises(direccion.pais)
        ObtenerDepartamentos(direccion.pais, direccion.provincia)
        obtenerCiudades(direccion.provincia, direccion.ciudad)
        document.getElementById('id').value = direccion.id_direccion || "";
        document.getElementById('id_usuario').value = direccion.id_usuario || "";
        document.getElementById('name').value =  direccion.nombre || "";
        document.getElementById('email').value =  direccion.email || "";
        document.getElementById('numberPhone').value =  direccion.numero || "";
        document.getElementById('addressLine').value =  direccion.calle || "";
        document.getElementById('apto').value =  direccion.complement || "";
      
        document.getElementById('postalCode').value =  direccion.postal || "";
        boton_actualizar_direccion()

        
        document.getElementById('country').disabled = true;
        document.getElementById('name').disabled = true;
        document.getElementById('email').disabled = true;
        document.getElementById('numberPhone').disabled = true;
        document.getElementById('addressLine').disabled = true;
        document.getElementById('apto').disabled = true;
        document.getElementById('department').disabled = true;
       document.getElementById('city').disabled = true;
        document.getElementById('postalCode').disabled = true;
    }
    console.log(direccion)
}
obtener_direccion()


//funcion para habilitar el cambio de informacion
function actualizar_informacion(boton) {
    document.getElementById('country').disabled = false;
    document.getElementById('name').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('numberPhone').disabled = false;
    document.getElementById('addressLine').disabled = false;
    document.getElementById('apto').disabled = false;
    document.getElementById('department').disabled = false;
   document.getElementById('city').disabled = false;
    document.getElementById('postalCode').disabled = false;
    divInfo.removeChild(boton)
    boton_confirmar_direccion()
}
// boton para habilitar el cambio de informacion  y juego para hacer llamados
function boton_actualizar_direccion() {

    let boton = document.createElement("button")
    boton.textContent = "actualizazr informacion";
    boton.onclick = () =>  actualizar_informacion(boton)
    divInfo.appendChild(boton)
    
}
// boton para insertar o actualizar dependiendo del caso
function boton_confirmar_direccion() {
    let boton = document.createElement("button")
    boton.textContent = "confirmar direccion";
    boton.onclick = () => subir_direccion_php(boton)
    divInfo.appendChild(boton)
}

import {pasarela} from "/js/scriptPago.js";
// funcion para continuar el proceso de compra (metodo de pago)

function continuar_compra() {

    if(document.getElementById('country').disabled === true ){
        pasarela()
    } else {
        return alert("primero confirma la direccion de envio");
    }
}
window.continuar_compra = continuar_compra

// funccion para enviar informacion a la base de datos del pedido realizado
export async function recoger_info() {

    let id_usuario = document.getElementById("id_usuario").value
    let id_direccion = document.getElementById("id").value
   let pedido = {usuarioId : id_usuario, direccionId : id_direccion, compras: comprados}
    try{
        let datos = await fetch("/pedido", {
            method: "POST",
            headers : {"Content-Type" : "application/json",
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({pedido: [pedido]})
        })
       
        let ProductosVaciar = []
        localStorage.setItem("productos_carrito", JSON.stringify(ProductosVaciar)
        )
    }catch(error){
        console.error("habo un error al inciar el envio", error)
    }
    try{
        let noti = await fetch("/nueva/compra", {
            method : "POST",
            headers : {"Content-Type" : "application/json",
                 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({tipo: 'compra', mensaje: 'nueva compra en tu tienda'})
        })
    }catch(error) {
        console.error("error al inicializar la notificacion de compra", error)
    }
}