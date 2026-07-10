# web/core/views.py
from django.conf import settings
from django.http import Http404
from django.shortcuts import render

from .infra.api_client import CatalogApiClient

# ──────────────────────────────────────────────────────────────
# Instancia única del cliente API (evita crear una nueva
# conexión en cada vista — se reutiliza en todo el módulo)
# ──────────────────────────────────────────────────────────────
api_client = CatalogApiClient(settings.API_BASE_URL)


def home_view(request):
    """
    Vista principal del marketplace.
    Muestra productos y categorías, y permite filtrar por búsqueda de texto.
    """
    # Trae TODOS los productos desde la API de Víctor
    productos = api_client.get_productos()

    # Trae todas las categorías desde la API
    categorias = api_client.get_categorias()

    # Obtiene el texto de búsqueda desde la URL (?q=laptop)
    # .strip() quita espacios en blanco al inicio/final por si el usuario
    # escribe " laptop " con espacios de más
    query = request.GET.get('q', '').strip()

    # Si el usuario escribió algo en el buscador...
    if query:
        # Filtra la lista de productos en memoria (no vuelve a llamar la API)
        # .lower() en ambos lados hace la búsqueda insensible a mayúsculas
        # (así "Laptop" y "laptop" dan el mismo resultado)
        productos = [
            p for p in productos
            if query.lower() in p.get('nombre', '').lower()      # busca en el nombre
            or query.lower() in p.get('descripcion', '').lower() # o en la descripción
        ]

    # Envía productos (ya filtrados o completos), categorías, y el texto
    # buscado (para mostrarlo de vuelta en el input y en el mensaje de resultados)
    return render(request, 'home.html', {
        'productos': productos,
        'categorias': categorias,
        'query': query,
    })


def product_detail_view(request, producto_id):
    """Vista de detalle de un producto con productos relacionados."""
    producto = api_client.get_producto(producto_id)
    if not producto:
        raise Http404('Producto no encontrado')

    categoria = api_client.get_categoria(producto.get('categoria_id'))
    relacionados = api_client.get_productos()
    relacionados = [
        p for p in relacionados
        if str(p.get('categoria_id')) == str(producto.get('categoria_id'))
        and p.get('id') != producto.get('id')
    ][:4]

    return render(request, 'product_detail.html', {
        'producto': producto,
        'categoria': categoria,
        'relacionados': relacionados,
    })


def categories_view(request):
    """Vista de categorías con filtrado de productos por categoría."""
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
    pedido = api_client.get_pedido(pedido_id)
    if not pedido:
        raise Http404('Pedido no encontrado')

    return render(request, 'order_summary.html', {'pedido': pedido})