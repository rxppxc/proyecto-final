from django.conf import settings
from django.http import Http404
from django.shortcuts import render
from requests.exceptions import RequestException

from .infra.api_client import CatalogApiClient
from .services.catalog_service import CatalogService


def home_view(request):
    """Vista principal del marketplace con productos y categorías."""
    api_client = CatalogApiClient(settings.API_BASE_URL)
    productos = api_client.get_productos()
    categorias = api_client.get_categorias()
    return render(request, 'home.html', {'productos': productos, 'categorias': categorias})


def product_detail_view(request, producto_id):
    """Vista de detalle de un producto con productos relacionados."""
    api_client = CatalogApiClient(settings.API_BASE_URL)
    producto = api_client.get_producto(producto_id)
    if not producto:
        raise Http404('Producto no encontrado')

    categoria = api_client.get_categoria(producto.get('categoria_id'))
    relacionados = api_client.get_productos()
    relacionados = [
        p for p in relacionados
        if str(p.get('categoria_id')) == str(producto.get('categoria_id')) and p.get('id') != producto.get('id')
    ][:4]

    return render(request, 'product_detail.html', {
        'producto': producto,
        'categoria': categoria,
        'relacionados': relacionados,
    })


def categories_view(request):
    """Vista de categorías con filtrado de productos por categoría."""
    api_client = CatalogApiClient(settings.API_BASE_URL)
    categorias = api_client.get_categorias()
    categoria_id = request.GET.get('categoria_id')
    productos = []
    categoria_sel = None

    if categoria_id:
        productos = api_client.get_productos()
        productos = [
            p for p in productos
            if str(p.get('categoria_id')) == str(categoria_id)
        ]
        categoria_sel = api_client.get_categoria(categoria_id)

    return render(request, 'categories.html', {
        'categorias': categorias,
        'productos': productos,
        'categoria_sel': categoria_sel,
    })


def order_summary_view(request, pedido_id):
    """Vista del resumen de un pedido ya creado."""
    api_client = CatalogApiClient(settings.API_BASE_URL)
    pedido = api_client.get_pedido(pedido_id)
    if not pedido:
        raise Http404('Pedido no encontrado')

    return render(request, 'order_summary.html', {'pedido': pedido})


def home(request):
    return home_view(request)