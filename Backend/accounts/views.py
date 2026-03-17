from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .models import WishlistItem
from plants.models import Plant
from .serializers import WishlistItemSerializer
from .models import WishlistItem, Address, PaymentMethod
from .serializers import WishlistItemSerializer, AddressSerializer, PaymentMethodSerializer
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "User registered successfully",
                    "user": UserSerializer(user).data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful",
                    "user": UserSerializer(user).data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Profile updated", "user": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class WishlistListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user).select_related("plant").prefetch_related("plant__images")
        serializer = WishlistItemSerializer(items, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request):
        plant_id = request.data.get("plant_id")

        if not plant_id:
            return Response({"error": "plant_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plant = Plant.objects.get(id=plant_id, is_active=True)
        except Plant.DoesNotExist:
            return Response({"error": "Plant not found"}, status=status.HTTP_404_NOT_FOUND)

        item, created = WishlistItem.objects.get_or_create(user=request.user, plant=plant)

        return Response(
            {
                "message": "Added to wishlist" if created else "Already in wishlist",
                "is_in_wishlist": True,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class WishlistDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, plant_id):
        deleted, _ = WishlistItem.objects.filter(user=request.user, plant_id=plant_id).delete()
        return Response(
            {
                "message": "Removed from wishlist" if deleted else "Item not found",
                "is_in_wishlist": False,
            },
            status=status.HTTP_200_OK,
        )


class WishlistToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plant_id = request.data.get("plant_id")

        if not plant_id:
            return Response({"error": "plant_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plant = Plant.objects.get(id=plant_id, is_active=True)
        except Plant.DoesNotExist:
            return Response({"error": "Plant not found"}, status=status.HTTP_404_NOT_FOUND)

        item = WishlistItem.objects.filter(user=request.user, plant=plant).first()

        if item:
            item.delete()
            return Response(
                {"message": "Removed from wishlist", "is_in_wishlist": False},
                status=status.HTTP_200_OK,
            )

        WishlistItem.objects.create(user=request.user, plant=plant)
        return Response(
            {"message": "Added to wishlist", "is_in_wishlist": True},
            status=status.HTTP_201_CREATED,
        )
    
class AddressListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        addresses = Address.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            address = serializer.save(user=request.user)
            if address.is_default:
                Address.objects.filter(user=request.user).exclude(id=address.id).update(is_default=False)
            return Response(AddressSerializer(address).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            address = Address.objects.get(id=pk, user=request.user)
        except Address.DoesNotExist:
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            address = serializer.save()
            if address.is_default:
                Address.objects.filter(user=request.user).exclude(id=address.id).update(is_default=False)
            return Response(AddressSerializer(address).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        deleted, _ = Address.objects.filter(id=pk, user=request.user).delete()
        return Response({"deleted": bool(deleted)})


class PaymentMethodListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        methods = PaymentMethod.objects.filter(user=request.user)
        serializer = PaymentMethodSerializer(methods, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        card_number = data.pop("card_number", "")

        if data.get("method_type") == "card" and card_number:
            data["card_last4"] = str(card_number)[-4:]

        serializer = PaymentMethodSerializer(data=data)
        if serializer.is_valid():
            method = serializer.save(user=request.user)
            if method.is_default:
                PaymentMethod.objects.filter(user=request.user).exclude(id=method.id).update(is_default=False)
            return Response(PaymentMethodSerializer(method).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentMethodDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            method = PaymentMethod.objects.get(id=pk, user=request.user)
        except PaymentMethod.DoesNotExist:
            return Response({"error": "Payment method not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        card_number = data.pop("card_number", "")

        if data.get("method_type", method.method_type) == "card" and card_number:
            data["card_last4"] = str(card_number)[-4:]

        serializer = PaymentMethodSerializer(method, data=data, partial=True)
        if serializer.is_valid():
            method = serializer.save()
            if method.is_default:
                PaymentMethod.objects.filter(user=request.user).exclude(id=method.id).update(is_default=False)
            return Response(PaymentMethodSerializer(method).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        deleted, _ = PaymentMethod.objects.filter(id=pk, user=request.user).delete()
        return Response({"deleted": bool(deleted)})