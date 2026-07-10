# web/core/urls.py
from django.urls import path
from .views import (
    about_view,
    categories_view,
    contact_submit_view,
    contact_view,
    home_view,
    order_summary_view,
    product_detail_view,
)

urlpatterns = [
    # ── existentes (mantener) ──

    # ── nuevas ──
    path('', home_view, name='home'),
    ## Rutas para las vistas de productos, categorías y pedidos
    path('productos/', home_view, name='catalog'),
    # Rutas para las vistas de detalle de producto, categorías y resumen de pedido
    path('productos/<int:producto_id>/', product_detail_view, name='product_detail'),
    # Rutas para las vistas de categorías y resumen de pedido
    path('categorias/', categories_view, name='categories'),
    # Rutas para las vistas de detalle de producto, categorías y resumen de pedido
    path('pedidos/<int:pedido_id>/', order_summary_view, name='order_summary'),
    # Rutas para las vistas de información de la empresa y contacto
    path('quienes-somos/', about_view, name='about'),
    # Rutas para las vistas de contacto y envío de formulario de contacto
    path('contacto/', contact_view, name='contact'),
    # Rutas para las vistas de contacto y envío de formulario de contacto
    path('contacto/submit/', contact_submit_view, name='contact_submit'),
    # Rutas para las vistas de contacto y envío de formulario de contacto
]
    