# web/core/services/order_service.py
from core.infra.client_instance import api_client


def crear_pedido(items):
    try:
        if not items:
            print("[WARN] crear_pedido: lista de items vacía")
            return None
        return api_client.crear_pedido({"items": items})
    except Exception as e:
        print(f"[ERROR] crear_pedido: {e}")
        return None


def get_resumen_pedido(pedido_id):
    try:
        pedido = api_client.get_pedido(pedido_id)
        if not pedido:
            return None
        for item in pedido.get('items', []):
            item['subtotal'] = round(
                float(item.get('cantidad', 0)) * float(item.get('precio_unitario', 0)), 2
            )
            producto = api_client.get_producto(item.get('producto_id'))
            item['nombre'] = producto.get('nombre', f"Producto #{item.get('producto_id')}") if producto else f"Producto #{item.get('producto_id')}"
        return pedido
    except Exception as e:
        print(f"[ERROR] get_resumen_pedido({pedido_id}): {e}")
        return None
