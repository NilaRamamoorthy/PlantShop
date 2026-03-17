from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from plants.models import Plant
from .models import Cart, CartItem
from .serializers import CartSerializer


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_or_create_cart(request.user)
        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plant_id = request.data.get("plant_id")
        quantity = int(request.data.get("quantity", 1))

        if not plant_id:
            return Response({"error": "plant_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        if quantity < 1:
            return Response({"error": "quantity must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plant = Plant.objects.get(id=plant_id, is_active=True)
        except Plant.DoesNotExist:
            return Response({"error": "Plant not found"}, status=status.HTTP_404_NOT_FOUND)

        if plant.stock < quantity:
            return Response({"error": "Not enough stock available"}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            plant=plant,
            defaults={
                "quantity": quantity,
                "unit_price": plant.final_price,
            },
        )

        if not created:
            new_quantity = item.quantity + quantity
            if new_quantity > plant.stock:
                return Response({"error": "Quantity exceeds available stock"}, status=status.HTTP_400_BAD_REQUEST)

            item.quantity = new_quantity
            item.unit_price = plant.final_price
            item.save()

        serializer = CartSerializer(cart, context={"request": request})
        return Response(
            {
                "message": "Added to cart",
                "cart": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        quantity = request.data.get("quantity")

        if quantity is None:
            return Response({"error": "quantity is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
        except ValueError:
            return Response({"error": "quantity must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = CartItem.objects.select_related("cart", "plant").get(
                id=item_id,
                cart__user=request.user,
            )
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

        if quantity < 1:
            item.delete()
            cart = get_or_create_cart(request.user)
            serializer = CartSerializer(cart, context={"request": request})
            return Response(
                {
                    "message": "Item removed from cart",
                    "cart": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        if quantity > item.plant.stock:
            return Response({"error": "Quantity exceeds available stock"}, status=status.HTTP_400_BAD_REQUEST)

        item.quantity = quantity
        item.unit_price = item.plant.final_price
        item.save()

        serializer = CartSerializer(item.cart, context={"request": request})
        return Response(
            {
                "message": "Cart updated",
                "cart": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class RemoveCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        try:
            item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        cart = get_or_create_cart(request.user)
        serializer = CartSerializer(cart, context={"request": request})
        return Response(
            {
                "message": "Item removed",
                "cart": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class ClearCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart = get_or_create_cart(request.user)
        cart.items.all().delete()
        serializer = CartSerializer(cart, context={"request": request})
        return Response(
            {
                "message": "Cart cleared",
                "cart": serializer.data,
            },
            status=status.HTTP_200_OK,
        )