# web/core/infra/client_instance.py
# Instancia única (singleton) del cliente — todos importan `api_client` desde aquí
from django.conf import settings
from core.infra.api_client import CatalogApiClient

api_client = CatalogApiClient(base_url=settings.API_BASE_URL)