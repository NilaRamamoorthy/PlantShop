from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Category, Plant, Banner
from .serializers import (
    CategorySerializer,
    PlantListSerializer,
    PlantDetailSerializer,
    BannerSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {"request": self.request}


class PlantListView(generics.ListAPIView):
    serializer_class = PlantListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Plant.objects.filter(is_active=True, stock__gt=0).select_related("category").prefetch_related("images")

        search = self.request.query_params.get("search")
        category = self.request.query_params.get("category")
        featured = self.request.query_params.get("featured")
        sort = self.request.query_params.get("sort")

        if search:
            queryset = queryset.filter(name__icontains=search)

        if category and category.lower() != "all":
            queryset = queryset.filter(category__slug=category)

        if featured == "true":
            queryset = queryset.filter(is_featured=True)

        if sort == "price_asc":
            queryset = queryset.order_by("price")
        elif sort == "price_desc":
            queryset = queryset.order_by("-price")
        elif sort == "popular":
            queryset = queryset.order_by("-rating_avg", "-rating_count")
        elif sort == "newest":
            queryset = queryset.order_by("-created_at")

        return queryset

    def get_serializer_context(self):
        return {"request": self.request}


class PlantDetailView(generics.RetrieveAPIView):
    queryset = Plant.objects.filter(is_active=True).select_related("category").prefetch_related("images")
    serializer_class = PlantDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_serializer_context(self):
        return {"request": self.request}


class BannerListView(generics.ListAPIView):
    queryset = Banner.objects.filter(is_active=True)
    serializer_class = BannerSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {"request": self.request}