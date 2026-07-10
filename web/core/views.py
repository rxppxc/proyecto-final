# web/core/views.py
from django.conf import settings
from django.core.mail import send_mail
from django.http import Http404
from django.shortcuts import render, redirect

from .infra.api_client import CatalogApiClient
from .services.order_service import get_resumen_pedido, crear_pedido as service_crear_pedido

api_client = CatalogApiClient(settings.API_BASE_URL)

METODOS_PAGO = {
    'tarjeta': 'Tarjeta de crédito / débito',
    'paypal': 'PayPal',
    'contra_entrega': 'Contra entrega',
}


def home_view(request):
    productos = api_client.get_productos()
    categorias = api_client.get_categorias()
    return render(request, 'home.html', {'productos': productos, 'categorias': categorias})


def product_detail_view(request, producto_id):
    producto = api_client.get_producto(producto_id)
    if not producto:
        raise Http404('Producto no encontrado')

    categoria = api_client.get_categoria(producto.get('categoria_id'))

    if categoria:
        producto['categoria'] = categoria

    relacionados = api_client.get_productos()
    relacionados = [
        p for p in relacionados
        if str(p.get('categoria_id')) == str(producto.get('categoria_id'))
        and p.get('id') != producto.get('id')
    ][:4]

    for p in relacionados:
        p['categoria'] = categoria

    return render(request, 'product_detail.html', {
        'producto': producto,
        'categoria': categoria,
        'relacionados': relacionados,
    })


def categories_view(request):
    categorias = api_client.get_categorias()
    categoria_id = request.GET.get('categoria_id')
    productos = []
    categoria_sel = None

    if categoria_id:
        productos = api_client.get_productos()
        productos = [p for p in productos if str(p.get('categoria_id')) == str(categoria_id)]
        categoria_sel = api_client.get_categoria(categoria_id)
        for p in productos:
            p['categoria'] = categoria_sel

    return render(request, 'categories.html', {
        'categorias': categorias,
        'productos': productos,
        'categoria_sel': categoria_sel,
    })


# ─── Carrito (almacenado en sesión) ──────────────────────────────────────────

def add_to_cart_view(request):
    if request.method != 'POST':
        return redirect('home')

    producto_id = request.POST.get('producto_id')
    cantidad = max(1, int(request.POST.get('cantidad', 1)))

    producto = api_client.get_producto(producto_id)
    if not producto:
        return redirect('home')

    carrito = request.session.get('carrito', {})
    clave = str(producto_id)

    if clave in carrito:
        carrito[clave]['cantidad'] += cantidad
    else:
        carrito[clave] = {
            'producto_id': int(producto_id),
            'nombre': producto.get('nombre', f'Producto #{producto_id}'),
            'precio': float(producto.get('precio', 0)),
            'cantidad': cantidad,
        }

    request.session['carrito'] = carrito
    request.session.modified = True
    return redirect('cart')


def cart_view(request):
    carrito = request.session.get('carrito', {})
    items = []
    total = 0.0

    for clave, item in carrito.items():
        subtotal = round(float(item['precio']) * int(item['cantidad']), 2)
        items.append({**item, 'subtotal': subtotal, 'clave': clave})
        total += subtotal

    return render(request, 'cart.html', {
        'items': items,
        'total': round(total, 2),
    })


def remove_from_cart_view(request):
    if request.method != 'POST':
        return redirect('cart')

    clave = request.POST.get('clave')
    carrito = request.session.get('carrito', {})

    if clave in carrito:
        del carrito[clave]
        request.session['carrito'] = carrito
        request.session.modified = True

    return redirect('cart')


def clear_cart_view(request):
    if request.method != 'POST':
        return redirect('cart')
    request.session['carrito'] = {}
    request.session.modified = True
    return redirect('cart')


def update_cart_view(request):
    if request.method != 'POST':
        return redirect('cart')

    clave = request.POST.get('clave')
    cantidad = int(request.POST.get('cantidad', 1))
    carrito = request.session.get('carrito', {})

    if clave in carrito and cantidad > 0:
        carrito[clave]['cantidad'] = cantidad
        request.session['carrito'] = carrito
        request.session.modified = True

    return redirect('cart')


# ─── Checkout ────────────────────────────────────────────────────────────────

def checkout_view(request):
    carrito = request.session.get('carrito', {})
    if not carrito:
        return redirect('home')

    items = []
    total = 0.0
    for clave, item in carrito.items():
        subtotal = round(float(item['precio']) * int(item['cantidad']), 2)
        items.append({**item, 'subtotal': subtotal})
        total += subtotal
    total = round(total, 2)

    if request.method == 'POST':
        email_cliente = request.POST.get('email', '').strip()
        metodo_pago = request.POST.get('metodo_pago', 'contra_entrega')

        items_api = [
            {
                'producto_id': item['producto_id'],
                'cantidad': item['cantidad'],
                'precio_unitario': item['precio'],
            }
            for item in items
        ]

        pedido = service_crear_pedido(items_api)
        if not pedido:
            return render(request, 'checkout.html', {
                'items': items,
                'total': total,
                'metodos_pago': METODOS_PAGO,
                'error': 'No se pudo procesar el pedido. Por favor intenta de nuevo.',
            })

        request.session['carrito'] = {}
        request.session['pago_metodo'] = metodo_pago
        request.session['pago_email'] = email_cliente
        request.session.modified = True

        if email_cliente:
            _enviar_email_confirmacion(pedido, email_cliente, metodo_pago, items)

        return redirect('order_summary', pedido_id=pedido['id'])

    return render(request, 'checkout.html', {
        'items': items,
        'total': total,
        'metodos_pago': METODOS_PAGO,
    })


def _enviar_email_confirmacion(pedido, email_cliente, metodo_pago, items):
    metodo_nombre = METODOS_PAGO.get(metodo_pago, metodo_pago)
    lineas = '\n'.join(
        f"  · {item['nombre']}  x{item['cantidad']}  —  ${item['subtotal']}"
        for item in items
    )
    cuerpo = f"""\
Hola,

¡Gracias por tu compra en TechMarket!

Tu pedido #{pedido['id']} ha sido confirmado.

Detalle del pedido:
{lineas}

Total: ${pedido.get('total', '—')}
Método de pago: {metodo_nombre}
Estado: Pendiente de procesamiento

En breve nos pondremos en contacto contigo para coordinar la entrega.

— Equipo TechMarket
   Marketplace de Tecnología · Universidad de Panamá
"""
    try:
        send_mail(
            subject=f'TechMarket — Pedido #{pedido["id"]} confirmado',
            message=cuerpo,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email_cliente],
            fail_silently=True,
        )
        print(f'[EMAIL] Correo enviado a: {email_cliente}')
    except Exception as e:
        print(f'[EMAIL ERROR] {e}')


# ─── Resumen del pedido ───────────────────────────────────────────────────────

def order_summary_view(request, pedido_id):
    pedido = get_resumen_pedido(pedido_id)
    if not pedido:
        raise Http404('Pedido no encontrado')

    metodo_clave = request.session.pop('pago_metodo', None)
    email_cliente = request.session.pop('pago_email', None)
    request.session.modified = True

    return render(request, 'order_summary.html', {
        'pedido': pedido,
        'metodo_pago': METODOS_PAGO.get(metodo_clave, metodo_clave),
        'email_cliente': email_cliente,
    })
