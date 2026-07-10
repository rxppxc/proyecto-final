from django.urls import path
from .views import (
    categories_view,
    home,
    home_view,
    order_summary_view,
    product_detail_view,
)

urlpatterns = [
    path('', home_view, name='home'),
    path('productos/', home_view, name='catalog'),
    path('productos/<int:producto_id>/', product_detail_view, name='product_detail'),
    path('categorias/', categories_view, name='categories'),
    path('pedidos/<int:pedido_id>/', order_summary_view, name='order_summary'),
    path('legacy/', home, name='legacy_home'),
]