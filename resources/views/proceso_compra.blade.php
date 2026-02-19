
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GogoShop - Checkout</title>
    <link rel="icon" type="image/x-icon" href="../images/iconGOGO.png">
    <link rel="stylesheet" href="{{asset('css/style.css')}}">
    <link rel="stylesheet" href="{{asset('css/payment.css')}}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    
<div class="product-content">
   
    <div class="order">
        
        <div class="order-address-container">
            
            <img src="../images/logo.png" id="logo-orden" alt="Logo">
               
            <h2>Proceso de Compra</h2>
            
            <div class="order-address">
                <h1>Detalles de Envío</h1>
            
                <input id="id" type="hidden">
                <input id="id_usuario" type="hidden">
                           
                        <div class="form-group">
                    <label for="country">País:</label>
                            <select id="country" name="country" required>
                                <option value="">Selecciona un país</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="name">Nombre completo:</label>
                    <input type="text" name="name" id="name" required placeholder="Tu nombre y apellido">
                        </div>

                        <div class="form-group">
                    <label for="email">Correo Electrónico:</label>
                    <input type="email" name="email" id="email" required placeholder="ejemplo@correo.com">
                        </div>

                        <div class="form-group">
                    <label for="numberPhone">Número de teléfono:</label>
                    <input type="number" name="numberPhone" id="numberPhone" required placeholder="Ej: 300 123 4567">
                        </div>
                
                        <div class="form-group">
                    <label for="addressLine">Dirección (Calle y Número):</label>
                    <input type="text" name="addressLine" id="addressLine" required placeholder="Avenida Siempre Viva 742">
                        </div>

                        <div class="form-group">
                            <label for="Apto">Apto, suite, unidad, etc. (opcional):</label >
                    <input type="text" name="apto" id="apto" placeholder="Bloque 5, Apto 201">
                        </div>
                        
                        <div class="form-group">
                    <label for="department">Departamento/Estado:</label>
                            <select id="department" name="department" required>
                                <option value="">Selecciona un departamento</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="city">Ciudad:</label>
                            <select id="city" name="city" required>
                        <option value="">Selecciona una ciudad</option>
                            </select>
                        </div>

                        <div class="form-group">
                    <label for="postalCode">Código postal:</label>
                    <input type="number" name="postalCode" id="postalCode" placeholder="050010">
                       </div>
                    
                <div id="control_direccion">
                    </div>

                    <div class="order-actions">
                    <p onclick="window.location.href = '/seller'"><< Devolver al carrito</p>
                    <p onclick="continuar_compra()" id="pagoHecho">Continuar al Pago >></p>
                </div>
                
            </div>
        </div>
        
        <div class="order-details-container">
            <h3>Tu Orden</h3>
            <table class="order-table" id="order-table">
                <thead>
                    <tr>
                        <th style="width: 70%">Producto</th>
                        <th style="width: 30%; text-align: right;">Cant./Precio</th>
                    </tr>
                </thead>
                <tbody>
                    </tbody>
            </table>
            
            <h1 id="order-total"></h1> </div>
        
    </div>
    
    <dialog id="paymentModal">
        <form id="paymentForm">
            <div id="payment-element" style="text-align: center; width: 100%; padding: 0;"></div>
        <div id="partPay">
                <button id="payButton" type="submit" disabled>Pagar</button>
            <button type="button" id="closeModal">Cerrar</button>
            <p id="paymentMessage"></p>
        </div>
    </form>
</dialog>

</div>


<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://js.stripe.com/v3/"></script>
<script type="module" src="{{asset('js/proceso_compra.js')}}"></script>
<script type="module" src="{{asset('js/scriptPago.js')}}"></script>
</body>
</html>