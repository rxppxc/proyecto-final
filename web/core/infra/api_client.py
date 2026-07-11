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

    # ── PRODUCTOS ──
    def get_productos(self) -> list[dict]:
        try:
            r = requests.get(f'{self.base_url}/api/productos', timeout=5)
            r.raise_for_status()
            return r.json().get('data', [])
        except Exception as e:
            print(f"[ERROR] get_productos: {e}")
            return []

    def get_producto(self, producto_id) -> dict | None:
        try:
            r = requests.get(f'{self.base_url}/api/productos/{producto_id}', timeout=5)
            r.raise_for_status()
            return r.json().get('data', None)
        except Exception as e:
            print(f"[ERROR] get_producto({producto_id}): {e}")
            return None

    def get_low_stock(self) -> list[dict]:
        try:
            r = requests.get(f'{self.base_url}/api/productos/low-stock', timeout=5)
            r.raise_for_status()
            return r.json().get('data', [])
        except Exception as e:
            print(f"[ERROR] get_low_stock: {e}")
            return []

    # ── CATEGORÍAS ──
    def get_categorias(self) -> list[dict]:
        try:
            r = requests.get(f'{self.base_url}/api/categorias', timeout=5)
            r.raise_for_status()
            return r.json().get('data', [])
        except Exception as e:
            print(f"[ERROR] get_categorias: {e}")
            return []

    def get_categoria(self, categoria_id) -> dict | None:
        try:
            r = requests.get(f'{self.base_url}/api/categorias/{categoria_id}', timeout=5)
            r.raise_for_status()
            return r.json().get('data', None)
        except Exception as e:
            print(f"[ERROR] get_categoria({categoria_id}): {e}")
            return None

    # ── PEDIDOS ──
    def get_pedidos(self) -> list[dict]:
        try:
            r = requests.get(f'{self.base_url}/api/pedidos', timeout=5)
            r.raise_for_status()
            return r.json().get('data', [])
        except Exception as e:
            print(f"[ERROR] get_pedidos: {e}")
            return []

    def get_pedido(self, pedido_id) -> dict | None:
        try:
            r = requests.get(f'{self.base_url}/api/pedidos/{pedido_id}', timeout=5)
            r.raise_for_status()
            return r.json().get('data', None)
        except Exception as e:
            print(f"[ERROR] get_pedido({pedido_id}): {e}")
            return None

    def crear_pedido(self, data: dict) -> dict | None:
        try:
            r = requests.post(f'{self.base_url}/api/pedidos', json=data, timeout=5)
            r.raise_for_status()
            return r.json().get('data', None)
        except Exception as e:
            print(f"[ERROR] crear_pedido: {e}")
            return None

    def get_ventas_categoria(self) -> list[dict]:
        try:
            r = requests.get(f'{self.base_url}/api/pedidos/ventas-categoria', timeout=5)
            r.raise_for_status()
            return r.json().get('data', [])
        except Exception as e:
            print(f"[ERROR] get_ventas_categoria: {e}")
            return []
