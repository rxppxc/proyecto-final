from ..infra.client_instance import api_client


class OrderService:
    """Servicio para crear y consultar pedidos desde la API externa."""
    def crear_pedido(self, items):
        try:
            return api_client.crear_pedido({'items': items})
        except Exception:
            return None

    def get_resumen_pedido(self, pedido_id):
        try:
            return api_client.get_pedido(pedido_id)
        except Exception:
            return None
