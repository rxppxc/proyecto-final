from ..infra.client_instance import api_client


class ProductService:
    """Servicio para consultar productos desde la API externa."""
    def get_productos_disponibles(self):
        try:
            productos = api_client.get_productos()
            return [p for p in productos if p.get('stock', 0) > 0]
        except Exception:
            return []

    def get_productos_por_categoria(self, categoria_id):
        try:
            productos = api_client.get_productos()
            return [p for p in productos if str(p.get('categoria_id')) == str(categoria_id)]
        except Exception:
            return []

    def get_producto_detalle(self, producto_id):
        try:
            return api_client.get_producto(producto_id)
        except Exception:
            return None
