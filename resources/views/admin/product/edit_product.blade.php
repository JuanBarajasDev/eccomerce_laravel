@extends('admin.layouts.layout')

@section('admim_layout')
@section('admin_title_page')
Dashboard product-manageEdit
@endsection
<div class="row">
<div class="col-12">

    <div class="card">
        <div class="card-header">
            <h5 class="card-title mb-0">Edita informacion de tu producto</h5>
        </div>
        <div class="card-body">
        @if ($errors->any())
    <div class="alert alert-warning alert-disimissible fade show">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

@if(session('success'))
<div class="alert alert-success">
    {{session('success')}}
</div>
@endif

<form action="{{route('product.edit')}}" method="POST">
        @csrf
        <input type="hidden" name="id" value="{{$editProduct->id}}">
        <label for="name" class="fw-bold mb-2">Nombre del producto</label>
        <input type="text" class="form-control mb-2" name="name" value="{{$editProduct->name}}">
        <label for="description" class="fw-bold mb-2">Descripcion del producto</label>
        <input type="text" class="form-control mb-2" name="description" value="{{$editProduct->description}}">
        <label for="price" class="fw-bold mb-2">Precio del producto</label>
        <input type="number" class="form-control mb-2" name="price"  value="{{$editProduct->price}}">
        <label for="image" class="fw-bold mb-2">imagen del producto</label>
        <input type="text" class="form-control mb-2" name="image" value="{{$editProduct->image}}">
        <label for="stock" class="fw-bold mb-2">cantidad disponible del producto</label>
        <input type="number" class="form-control mb-2" name="stock" value="{{$editProduct->stock}}">
        <label for="category" class="fw-bold mb-2">selecciona tu categoria</label>
        <select name="category" class="form-control">
            <option value="">selecciona una categoria</option>
            <option value="carne-res" {{$editProduct->category == 'carne-res' ? 'selected' : ''}} >carne-res</option>
            <option value="carne-cerdo" {{$editProduct->category == 'carne-cerdo' ? 'selected' : ''}}>carne-cerdo</option>
            <option value="carne-pollo" {{$editProduct->category == 'carne-pollo' ? 'selected' : ''}}>carne-pollo</option>
        </select>
        <button type="submit" class="btn btn-primary w-100 mt-4">Confirmar informacion</button>
    </form>
            
        </div>
    </div>
</div> 
</div>
@endsection