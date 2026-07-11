# web/core/context_processors.py


def carrito_context(request):
    """Expone la cantidad de items del carrito a todas las plantillas."""
    carrito = request.session.get('carrito', {})
    total_items = sum(item.get('cantidad', 0) for item in carrito.values())
    return {'carrito_count': total_items}
