from rest_framework import serializers
from .models import Cart, CartItem


class CartPlantSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem.plant.field.related_model
        fields = ["id", "name", "slug", "primary_image", "price", "discount_price", "final_price"]

    def get_primary_image(self, obj):
        request = self.context.get("request")
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        if primary and primary.image and request:
            return request.build_absolute_uri(primary.image.url)
        return None

    def get_final_price(self, obj):
        return str(obj.final_price)


class CartItemSerializer(serializers.ModelSerializer):
    plant = CartPlantSerializer(read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "plant", "quantity", "unit_price", "line_total"]

    def get_line_total(self, obj):
        return str(obj.line_total)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()
    shipping_fee = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "subtotal", "shipping_fee", "total"]

    def get_subtotal(self, obj):
        return str(obj.subtotal)

    def get_shipping_fee(self, obj):
        subtotal = obj.subtotal
        return "0.00" if subtotal >= 999 else "99.00"

    def get_total(self, obj):
        subtotal = obj.subtotal
        shipping = 0 if subtotal >= 999 else 99
        return str(subtotal + shipping)