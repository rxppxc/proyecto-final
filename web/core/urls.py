# web/core/urls.py
from django.urls import path
from .views import (
    add_to_cart_view,
    cart_view,
    categories_view,
    checkout_view,
    clear_cart_view,
    home_view,
    order_summary_view,
    product_detail_view,
    remove_from_cart_view,
    update_cart_view,
)

urlpatterns = [
    path('', home_view, name='home'),
    path('productos/', home_view, name='catalog'),
    path('productos/<int:producto_id>/', product_detail_view, name='product_detail'),
    path('categorias/', categories_view, name='categories'),

    # Carrito
    path('carrito/', cart_view, name='cart'),
    path('carrito/agregar/', add_to_cart_view, name='add_to_cart'),
    path('carrito/eliminar/', remove_from_cart_view, name='remove_from_cart'),
    path('carrito/actualizar/', update_cart_view, name='update_cart'),
    path('carrito/vaciar/', clear_cart_view, name='clear_cart'),

    # Checkout y pedidos
    path('checkout/', checkout_view, name='checkout'),
    path('pedidos/<int:pedido_id>/', order_summary_view, name='order_summary'),
]
