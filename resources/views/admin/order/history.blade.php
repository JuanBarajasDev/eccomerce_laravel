@extends('admin.layouts.layout')

@section('admin_title_page', 'Historial de pedidos')

@section('admim_layout')
<h3>Historial de pedidos</h3>

@foreach($pedidos as $id_pedido => $items)
    @php $pedido = $items->first(); @endphp
    <div class="pedido">
        <h3>Pedido #{{ $id_pedido }}</h3>
        <p><strong>Usuario:</strong> {{ $pedido->usuario }}</p>
        <p><strong>País:</strong> {{ $pedido->pais }}</p>
        <p><strong>Ciudad:</strong> {{ $pedido->ciudad }}</p>
        <p><strong>Calle:</strong> {{ $pedido->nombre_calle }}</p>
        <p><strong>Fecha:</strong> {{ $pedido->fecha }}</p>

        <table border="1" cellpadding="5" cellspacing="0">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $item)
                    <tr>
                        <td>{{ $item->producto }}</td>
                        <td>{{ $item->cantidad }}</td>
                        <td>${{ $item->precio_unitario }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <hr>
    </div>
@endforeach

@endsection
