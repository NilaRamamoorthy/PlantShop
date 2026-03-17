from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "phone_number", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "phone_number", "date_joined"]


from plants.models import Plant
from .models import WishlistItem


class WishlistPlantSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()

    class Meta:
        model = Plant
        fields = [
            "id",
            "name",
            "slug",
            "short_description",
            "price",
            "discount_price",
            "final_price",
            "primary_image",
        ]

    def get_primary_image(self, obj):
        request = self.context.get("request")
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        if primary and primary.image and request:
            return request.build_absolute_uri(primary.image.url)
        return None

    def get_final_price(self, obj):
        return str(obj.final_price)


class WishlistItemSerializer(serializers.ModelSerializer):
    plant = WishlistPlantSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ["id", "plant", "created_at"]


from .models import Address, PaymentMethod


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "label",
            "full_name",
            "phone_number",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "postal_code",
            "country",
            "is_default",
        ]


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = [
            "id",
            "method_type",
            "card_holder_name",
            "card_last4",
            "card_brand",
            "expiry_month",
            "expiry_year",
            "provider_token",
            "is_default",
        ]