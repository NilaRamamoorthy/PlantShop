from django.urls import path
from .views import CategoryListView, PlantListView, PlantDetailView, BannerListView

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("plants/", PlantListView.as_view(), name="plant-list"),
    path("plants/<slug:slug>/", PlantDetailView.as_view(), name="plant-detail"),
    path("banners/", BannerListView.as_view(), name="banner-list"),
]