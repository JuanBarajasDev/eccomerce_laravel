<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CarniClick - Carnes Premium</title>
    <link rel="icon" type="image/x-icon" href="../images/icon-carniceria.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5qL8uX9Gk+w0+Q2V+p2I2J10p/3pQO4K9ZlW2/g1yL5fB0gN0b7zD8mJ3j+sD7mG2zQ9v1/A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

    <header class="header">
        <div class="menu container">
            <a href="#" class="logo">CarniClick</a>
            <input type="checkbox" id="menu"/>
            <label for="menu">
                <i class="bi bi-list"></i>
            </label>
            <nav class="navbar">
                <ul>
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#remove-5">Nosotros</a></li>
                    <li><a href="#lista-1">Nuestros Cortes</a></li>
                    <li><a href="#remove-5">Contacto</a></li>
                    <li><a href="{{ route('profile.edit') }}">{{ Auth::user()->name }}</a></li>
                </ul>
            </nav>

            <div>
                <ul>
                    <li class="submenu">
                        <i class="bi bi-bag-check" onclick="toggleCarrito()"></i> 
                        
                        <div id="carrito">
    <table id="lista-carrito">
        <thead>
            <tr>
                <th>Imagen</th>
                <th class="remover-nombre">Corte</th>
                <th>Peso</th>
                <th>Marmoleo</th>
                <th>Maduración</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            </tbody>
    </table>
    <div class="botonera">
        <button type="button" id="vaciar-carrito" onclick="vaciar_carrito()" class="btn-2">Vaciar Cesta</button>
        <button type="button" onclick="validar_productos()" id="pag" class="btn-2">Pagar</button>
    </div>
</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="header-content container">
            <div class="header-img">
                <img src="../images/portada.png" alt="Corte de carne premium">
            </div>
            <div class="header-txt">
                <h1>Cortes de Primera Calidad</h1>
                <p>La mejor selección de carnes para tu parrilla</p>
                <a href="#lista-1" class="btn-1">Ver Cortes</a>
            </div>
        </div>
    </header>

    <section class="ofert container" id="remove-2">
        <div class="ofert-1">
            <div class="ofert-img">
                <img src="https://i.pinimg.com/736x/27/40/68/274068ef36a6015fcc9a53b884e66eaf.jpg" alt="Lomo Fino">
            </div>
            <div class="ofert-txt">
                <h3>Lomo Fino</h3>
                <a href="#" class="btn-2">Ver Detalles</a>
            </div>
        </div>
        <div class="ofert-1">
            <div class="ofert-img">
                <img src="https://i.pinimg.com/736x/50/1a/e3/501ae391089cdd694bea8bfb62a595cf.jpg" alt="Costillas BBQ">
            </div>
            <div class="ofert-txt">
                <h3>Costillas BBQ</h3>
                <a href="#" class="btn-2">Ver Detalles</a>
            </div>
        </div>
        <div class="ofert-1">
            <div class="ofert-img">
                <img src="https://i.pinimg.com/1200x/8d/7d/7f/8d7d7f1c4ce9294370ffab6f5ef90e80.jpg" alt="Punta de Anca">
            </div>
            <div class="ofert-txt">
                <h3>Punta de Anca</h3>
                <a href="#" class="btn-2">Ver Detalles</a>
            </div>
        </div>
    </section>

    <div id="notificacion">Corte agregado a la cesta</div>

    <main class="productos container" id="lista-1">
        <h2 id="remove-3">Nuestros Cortes</h2>

        <div class="product-cards" id="productoss">
            </div>

        <div class="all-products" id="all-products">
            <h1 class="titleC">Cortes de Res</h1>
            <div class="product-cards" id="product-cards-clasico"></div>
            
            <h1 class="titleC">Cortes de Cerdo</h1>
            <div class="product-cards" id="product-cards-tecnologia"></div>
            
            <h1 class="titleC">Presas de pollo</h1>
            <div class="product-cards" id="product-cards-deportivo"></div>
        </div>
    </main>

    <section class="icons container" id="remove-4">
        <div class="icon-1">
            <div class="icon-img">
                <img src="https://i.pinimg.com/1200x/74/c1/00/74c1002e7f3cb511ee650b73d2f35cd1.jpg" alt="Icono de calidad">
            </div>
            <div class="icon-text">
                <h3>Calidad Garantizada</h3>
                <p>Selección de las mejores fincas ganaderas.</p>
            </div>
        </div>

        <div class="icon-1">
            <div class="icon-img">
                <img src="https://i.pinimg.com/736x/84/e0/f1/84e0f11911b3f8d9a0a0c57eb379c64f.jpg" alt="Icono de domicilio">
            </div>
            <div class="icon-text">
                <h3>Entregas a Domicilio</h3>
                <p>Recibe tus cortes frescos y en tiempo record.</p>
            </div>
        </div>

        <div class="icon-1">
            <div class="icon-img">
                <img src="https://i.pinimg.com/736x/d9/d0/38/d9d0388112f4446469546951b38d4ec5.jpg" alt="Icono de corte experto">
            </div>
            <div class="icon-text">
                <h3>Cortes Personalizados</h3>
                <p>Preparamos la carne justo como la necesitas.</p>
            </div>
        </div>
    </section>

    <section class="blog container" id="remove-5">
        <div class="blog-1">
            <img src="https://placehold.co/380x250/3D2B1F/FFFFFF?text=Receta" alt="Plato de carne">
            <h3>Receta: Lomo al Trapo</h3>
            <p>
                Descubre cómo preparar este clásico colombiano en tu próximo asado. Sorprende a todos con una explosión de sabor y una carne increíblemente jugosa.
            </p>
        </div>

        <div class="blog-1">
            <img src="https://placehold.co/380x250/3D2B1F/FFFFFF?text=Tips+de+Cocción" alt="Parrilla con carbón">
            <h3>Tips para la Parrilla Perfecta</h3>
            <p>
                Aprende los secretos de los maestros parrilleros: desde cómo encender el fuego correctamente hasta conocer los puntos de cocción ideales para cada corte.
            </p>
        </div>
        
        <div class="blog-1">
            <img src="https://placehold.co/380x250/3D2B1F/FFFFFF?text=Nuestro+Origen" alt="Vaca en un campo">
            <h3>Conoce Nuestros Proveedores</h3>
            <p>
                Trabajamos con fincas locales que practican la ganadería sostenible, garantizando no solo el mejor sabor, sino también el bienestar animal y el cuidado del medio ambiente.
            </p>
        </div>
    </section>

    <footer class="footer">
        <div class="footer-content container">
            <div class="link">
                <h3>Navegación</h3>
                <ul>
                    <li><a href="#">Nosotros</a></li>
                    <li><a href="#">Tipos de Corte</a></li>
                    <li><a href="#">Preguntas Frecuentes</a></li>
                    <li><a href="#">Contacto</a></li>
                </ul>
            </div>
            <div id="contacto">
                <h3>Contáctanos</h3>
                <ul>
                    <li><strong>Nombre:</strong> Soporte tecnico</li>
                    <li><strong>Correo:</strong> <a>#########</a></li>
                    <li><strong>Teléfono:</strong> +57 ######</li>
                    <li><strong>Ubicación:</strong> Bogota Colombia</li>
                </ul>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('js/script.js') }}"></script> 
</body>
</html>
