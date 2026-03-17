from decimal import Decimal
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from accounts.models import Address, PaymentMethod
from cart.models import Cart
from .models import Order, OrderItem
from .serializers import OrderSerializer


def build_order_number():
    return timezone.now().strftime("ORD%Y%m%d%H%M%S")


def get_cart_or_none(user):
    try:
        return Cart.objects.prefetch_related("items__plant__images").get(user=user)
    except Cart.DoesNotExist:
        return None


def calculate_shipping(subtotal):
    return Decimal("0.00") if subtotal >= Decimal("999.00") else Decimal("99.00")


class CheckoutPreviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        address_id = request.data.get("address_id")
        payment_method_id = request.data.get("payment_method_id")

        cart = get_cart_or_none(request.user)
        if not cart or not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            address = Address.objects.get(id=address_id, user=request.user)
        except Address.DoesNotExist:
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            payment_method = PaymentMethod.objects.get(id=payment_method_id, user=request.user)
        except PaymentMethod.DoesNotExist:
            return Response({"error": "Payment method not found"}, status=status.HTTP_404_NOT_FOUND)

        subtotal = sum(item.line_total for item in cart.items.all())
        shipping_fee = calculate_shipping(subtotal)
        total = subtotal + shipping_fee

        items = []
        for item in cart.items.all():
            primary = item.plant.images.filter(is_primary=True).first() or item.plant.images.first()
            image_url = request.build_absolute_uri(primary.image.url) if primary and primary.image else ""

            items.append({
                "id": item.id,
                "plant_name": item.plant.name,
                "plant_image": image_url,
                "unit_price": str(item.unit_price),
                "quantity": item.quantity,
                "line_total": str(item.line_total),
            })

        return Response({
            "address": {
                "id": address.id,
                "label": address.label,
                "full_name": address.full_name,
                "phone_number": address.phone_number,
                "address_line_1": address.address_line_1,
                "address_line_2": address.address_line_2,
                "city": address.city,
                "state": address.state,
                "postal_code": address.postal_code,
                "country": address.country,
            },
            "payment_method": {
                "id": payment_method.id,
                "method_type": payment_method.method_type,
                "card_brand": payment_method.card_brand,
                "card_last4": payment_method.card_last4,
            },
            "items": items,
            "subtotal": str(subtotal),
            "shipping_fee": str(shipping_fee),
            "total": str(total),
        })


class OrderCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        address_id = request.data.get("address_id")
        payment_method_id = request.data.get("payment_method_id")

        cart = get_cart_or_none(request.user)
        if not cart or not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            address = Address.objects.get(id=address_id, user=request.user)
        except Address.DoesNotExist:
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            payment_method = PaymentMethod.objects.get(id=payment_method_id, user=request.user)
        except PaymentMethod.DoesNotExist:
            return Response({"error": "Payment method not found"}, status=status.HTTP_404_NOT_FOUND)

        subtotal = Decimal("0.00")
        for item in cart.items.select_related("plant").all():
            if item.quantity > item.plant.stock:
                return Response(
                    {"error": f"Not enough stock for {item.plant.name}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            subtotal += item.line_total

        shipping_fee = calculate_shipping(subtotal)
        total_amount = subtotal + shipping_fee

        order = Order.objects.create(
            user=request.user,
            order_number=build_order_number(),
            address=address,
            payment_method=payment_method,
            status="placed",
            payment_status="paid",
            subtotal=subtotal,
            shipping_fee=shipping_fee,
            discount_amount=Decimal("0.00"),
            total_amount=total_amount,
            shipping_label=address.label,
            shipping_full_name=address.full_name,
            shipping_phone_number=address.phone_number,
            shipping_address_line_1=address.address_line_1,
            shipping_address_line_2=address.address_line_2,
            shipping_city=address.city,
            shipping_state=address.state,
            shipping_postal_code=address.postal_code,
            shipping_country=address.country,
        )

        for item in cart.items.select_related("plant").all():
            primary = item.plant.images.filter(is_primary=True).first() or item.plant.images.first()
            image_url = request.build_absolute_uri(primary.image.url) if primary and primary.image else ""

            OrderItem.objects.create(
                order=order,
                plant=item.plant,
                plant_name=item.plant.name,
                plant_image=image_url,
                unit_price=item.unit_price,
                quantity=item.quantity,
                line_total=item.line_total,
            )

            item.plant.stock -= item.quantity
            item.plant.save()

        cart.items.all().delete()

        serializer = OrderSerializer(order)
        return Response(
            {
                "message": "Order placed successfully",
                "order": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class OrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related("items")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.prefetch_related("items").get(id=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order)
        return Response(serializer.data)