# web/core/infra/api_client.py
import requests
from requests import Response


class CatalogApiClient:
    def __init__(self, base_url: str) -> None:
        self.base_url = base_url.rstrip('/')

    def fetch_catalog(self) -> list[dict]:
        response: Response = requests.get(f'{self.base_url}/api/catalogo', timeout=5)
        response.raise_for_status()
        return response.json()

    # ──────────────────────────────────────────────
    # MÉTODOS NUEVOS — PRODUCTOS
    # ──────────────────────────────────────────────

    def get_productos(self) -> list[dict]:
        """Retorna lista de todos los productos disponibles"""
        try:
            response = requests.get(f'{self.base_url}/api/productos', timeout=5)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[ERROR] get_productos: {e}")
            return []

    def get_producto(self, producto_id) -> dict | None:
        """Retorna el detalle de un producto por su ID"""
        try:
            response = requests.get(f'{self.base_url}/api/productos/{producto_id}', timeout=5)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[ERROR] get_producto({producto_id}): {e}")
            return None

    def get_low_stock(self) -> list[dict]:
        """Retorna productos con stock bajo el mínimo"""
        try:
            response = requests.get(f'{self.base_url}/api/productos/low-stock', timeout=5)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[ERROR] get_low_stock: {e}")
            return []

    # ──────────────────────────────────────────────
    # MÉTODOS NUEVOS — CATEGORÍAS
    # ──────────────────────────────────────────────

    def get_categorias(self) -> list[dict]:
        """Retorna lista de todas las categorías"""
        try:
            response = requests.get(f'{self.base_url}/api/categorias', timeout=5)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[ERROR] get_categorias: {e}")
            return []

    def get_categoria(self, categoria_id) -> dict | None:
        """Retorna el detalle de una categoría por su ID"""
        try:
            response = requests.get(f'{self.base_url}/api/categorias/{categoria_id}', timeout=5)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[ERROR] get_categoria({categoria_id}): {e}")
            return None

    # ──────────────────────────────────────────────
    # MÉTODOS NUEVOS — PEDIDOS
    # ──────────────────────────────────────────────

    def get_pedidos(self) -> list[dict]:
        """Retorna lista de todos los pedidos"""
        try:
            response = requests.get(f'{self.base_url}/api/pedidos', timeout=5)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[ERROR] get_pedidos: {e}")
            return []

    def get_pedido(self, pedido_id) -> dict | None:
        """Retorna un pedido con sus items por ID"""
        try:
            response = requests.get(f'{self.base_url}/api/pedidos/{pedido_id}', timeout=5)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[ERROR] get_pedido({pedido_id}): {e}")
            return None

    def crear_pedido(self, data: dict) -> dict | None:
        """
        Crea un nuevo pedido en la API.
        data = { "items": [{"producto_id": 1, "cantidad": 2}] }
        """
        try:
            response = requests.post(f'{self.base_url}/api/pedidos', json=data, timeout=5)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[ERROR] crear_pedido: {e}")
            return None

    def get_ventas_categoria(self) -> list[dict]:
        """Retorna el resumen de ventas agrupadas por categoría"""
        try:
            response = requests.get(f'{self.base_url}/api/pedidos/ventas-categoria', timeout=5)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"[ERROR] get_ventas_categoria: {e}")
            return []