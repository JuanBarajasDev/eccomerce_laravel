<?php

use App\Http\Controllers\admin\adminController;
use App\Http\Controllers\admin\adminProductAttributeController;
use App\Http\Controllers\admin\adminProductController;
use App\Http\Controllers\DireccionController;
use App\Http\Controllers\admin\HistorialCompraController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeContoller;
use App\Http\Controllers\StripeController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/seller', function () {
    return view('seller');
})->middleware(['auth', 'verified', 'rolemanager:seller'])->name('dashboard');

//admin routs
Route::middleware(['auth', 'verified','rolemanager:admin'])->group(function () {

    Route::prefix('admin')->group(function () {
        Route::controller(adminController::class)->group(function () {
            Route::get('/dashboard', 'index')->name('admin');


        });
        Route::controller(adminProductController::class)->group(function () {
            Route::get('/product/manage', 'index')->name('product.manage');
            Route::get('/product/review', 'review')->name('product.review');
            Route::post('/product/store', 'storeProduct')->name('product.store');
            Route::post('/eliminar/producto', 'eliminarProducto')->name('product.delete');
            Route::post('/editar/producto', 'pageEdit')->name('product.pageEdit');
            Route::post('/product/edit', 'editProduct')->name('product.edit');
        });
        Route::controller(adminProductAttributeController::class)->group(function () {
            Route::get('/productAttribute/create', 'index')->name('productAttribute.create');
            Route::get('/productAttribute/manage', 'manage')->name('productAttribute.manage');
            
        });
            Route::controller(HistorialCompraController::class)->group(function () {
            Route::get('/pedidos/historial', 'index')->name('order.history');
            
        });
    
    });
    
});

Route::controller(NotificacionController::class)->group(function() {
    Route::post('/nueva/compra', 'store');
     Route::get('/obtener/compras', 'index');
    // Route::update('/marcar/leido', 'update')->name('update.read');
});

Route::get('/proceso/compra', function() {
    return view('proceso_compra');
});
Route::get('/direccion', [DireccionController::class, 'obtenerId' ]);
Route::post('direccion/post', [DireccionController::class, 'store']);
Route::put('direccion/update', [DireccionController::class, 'update']);
Route::get('/productos', [ProductoController::class, 'index']);

Route::post('/pedido', [PedidosController::class, 'store']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/stripe/payment', [StripeController::class, 'CreatePaymentIntent']);

require __DIR__.'/auth.php';
