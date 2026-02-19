<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HistorialCompraController extends Controller
{
    public function index()
    {
$pedidos = DB::table('pedidos')
    ->join('users', 'pedidos.id_usuario', '=', 'users.id')
    ->join('direccion_envio', 'pedidos.id_direccion', '=', 'direccion_envio.id_direccion')
    ->join('detalle_pedido', 'pedidos.id_pedido', '=', 'detalle_pedido.id_pedido')
    ->join('productos', 'detalle_pedido.id_producto', '=', 'productos.id')
    ->select(
        'pedidos.id_pedido',
        'users.name as usuario',
        'direccion_envio.pais',
        'direccion_envio.ciudad',
        'direccion_envio.nombre_calle', 
        'productos.name as producto',
        'detalle_pedido.cantidad',
        'detalle_pedido.precio_unitario',
        'pedidos.fecha'
    )
    ->orderBy('pedidos.id_pedido', 'desc')
    ->get()
    ->groupBy('id_pedido'); // 👈 agrupa todos los productos por pedido

  return view('admin.order.history', ['pedidos' => $pedidos]);

    }
}
