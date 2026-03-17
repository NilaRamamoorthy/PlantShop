from rest_framework import serializers
from .models import Category, Plant, PlantImage, Banner


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "image"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class PlantImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PlantImage
        fields = ["id", "image", "is_primary", "sort_order"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class PlantListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)

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
            "stock",
            "size",
            "height",
            "humidity",
            "rating_avg",
            "rating_count",
            "is_featured",
            "category",
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


class PlantDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = PlantImageSerializer(many=True, read_only=True)
    final_price = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Plant
        fields = [
            "id",
            "name",
            "slug",
            "short_description",
            "description",
            "price",
            "discount_price",
            "final_price",
            "stock",
            "sku",
            "plant_type",
            "size",
            "height",
            "humidity",
            "light_requirement",
            "water_requirement",
            "pet_friendly",
            "is_featured",
            "rating_avg",
            "rating_count",
            "category",
            "primary_image",
            "images",
        ]

    def get_final_price(self, obj):
        return str(obj.final_price)

    def get_primary_image(self, obj):
        request = self.context.get("request")
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        if primary and primary.image and request:
            return request.build_absolute_uri(primary.image.url)
        return None


class BannerSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = ["id", "title", "subtitle", "image"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None