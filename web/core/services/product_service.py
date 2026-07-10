# web/core/services/product_service.py
from core.infra.client_instance import api_client


def get_productos_disponibles():
    try:
        productos = api_client.get_productos()
        return [p for p in productos if p.get('stock', 0) > 0]
    except Exception as e:
        print(f"[ERROR] get_productos_disponibles: {e}")
        return []


def get_productos_por_categoria(categoria_id):
    try:
        productos = api_client.get_productos()
        return [p for p in productos if str(p.get('categoria_id')) == str(categoria_id)]
    except Exception as e:
        print(f"[ERROR] get_productos_por_categoria({categoria_id}): {e}")
        return []


def get_producto_detalle(producto_id):
    try:
        producto = api_client.get_producto(producto_id)
        if not producto:
            return None
        categoria = api_client.get_categoria(producto.get('categoria_id'))
        producto['categoria'] = categoria
        return producto
    except Exception as e:
        print(f"[ERROR] get_producto_detalle({producto_id}): {e}")
        return None